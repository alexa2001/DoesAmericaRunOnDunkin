let margin = {top: 20, right: 20, bottom: 20, left: 40};
let width = window.screen.width;
let height = window.screen.height;

// init drawing area
let svg = d3.select("#fast-food-consumption").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate (${margin.left}, ${margin.top})`);

let title = svg.append("text")
    .attr("x", width/2)
    .attr("y", 50)
    .attr("text-anchor", "middle")
    .attr('font-size', 30) // Font size
    .attr('font-family', 'monospace')
    .text("Fast Food Consumption")

let timelineTitle = svg.append("text")
    .attr("x", 200)
    .attr("y", 150)
    .attr("text-anchor", "middle")
    .attr('font-size', 20) // Font size
    .attr('font-family', 'monospace')
    .text("A brief history of the fast food industry")

const data = [
    { date: "1921-01-01", abbr:"First fast food chain", event: "White Castle opens the first fast food chain"},
    { date: "1937-01-01", abbr:"Krispy Kreme", event: "Krispy Kreme launches" },
    { date: "1948-01-01", abbr:"McDonald's Assembly line", event: "Richard and Maurice Mcdonald " +
            "create an assembly line system to make ham" +
            "burgers and fries in their McDonal's restaurants\n" },
    { date: "1950-01-01", abbr:"", event: "The first Dunkin' Donuts opens in Quincy, MA" },
    { date: "1954-01-01", abbr:"", event: "The first Burger King opens in Miami" },
    { date: "1965-01-01", abbr:"", event: "First Subway opens in Connecticut" },
    { date: "1969-01-01", abbr:"", event: "First Wendy's launches" },
    { date: "2002-01-01", abbr:"", event: "McDonalds reduces the amount of trans fat in their fries by 48%" },
    { date: "2005-01-01", abbr:"", event: "American sales of fast food total $163.5 billion" },
    // Add more events as needed
];

const parseDate = d3.timeParse("%Y-%m-%d");
console.log("DATE");
// console.log(parseDate("2023-5-30"));
data.forEach(d => {
    d.date = parseDate(d.date);
});

const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width * 0.7])

let xAxis = d3.axisTop(xScale);

svg.append("g")
    .attr("class", "x-axis axis");

svg.select(".x-axis")
    .attr("transform", "translate(0," + 200 + ")")
    // .transition()
    .call(xAxis);

let myTooltip = d3.select("body").append('div')
    .attr('class', "tooltip")

const circs = svg.selectAll(".circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("cx", d => xScale(d.date))
    .attr("cy", function(d, i){
        if( i % 2 === 0 ){
            return (height * 0.5 - 40)
        }
        else{
            return (height * 0.5 - 50)
        }
    })
    .attr("r", 10)
    .attr("fill", "#FF671F")
    .attr("cursor", "pointer")
    .on('mouseover', function (event, d){
        myTooltip
            .style("opacity", 1)
            .style("left",  width*0.80 + "px")
            .style("top", height * 0.20 + "px")
            .html(
                `<div style="border: thin solid grey; border-radius: 5px; background: white; padding: 10px; margin-right: 50px">
                     <h4>${d.event}</h4>
                </div>`
            );
    })
    .on("mouseout", function(event, d){
        myTooltip
            .style("opacity", 0)
            .style("left", 0)
            .style("top", 0)
            .html(``);
    })


// let events = svg.selectAll(".events")
//     .data(data)
//     .enter()
//     .append("text")
//     .attr("class", "events")
//     .attr("x", d => xScale(d.date) + 10)
//     .attr("y", function(d, i){
//         if( i % 2 === 0 ){
//             return (height * 0.5 - 20)
//         }
//         else{
//             return (height * 0.5 - 30)
//         }
//     })
//     .text(d => d.abbr)
//     .attr("text-anchor", "right")
//     .style("font-size", "15px")
//     .style("fill", "black")
//     .attr('font-family', 'monospace')


let ticks = svg.selectAll('.line')
    .data(data)
    .enter()
    .append('line')
    .attr('class', 'line')
    .attr('x1', d => xScale(d.date))
    .attr('y1', d => 200)
    .attr('x2', d => xScale(d.date))
    .attr("y2", function(d, i){
        if( i % 2 === 0 ){
            return (height * 0.5 - 40)
        }
        else{
            return (height * 0.5 - 50)
        }
    })

let desc = svg.append("text")
    .attr("x", 50)
    .attr("y", 400)
    .attr("text-anchor", "middle")
    .attr('font-size', 20) // Font size
    .attr('font-family', 'monospace')
    .text("CDC Findings")

let findings = [
    "Over 1/3 of adults in the U.S. consumed food on any given day",
    "Fast food consumption decreased with age",
    "There is a positive correlation between fast food consumption and increasing family income"
];

let listItems = svg.selectAll(".list")
    .data(findings)
    .enter()
    .append("text")
    .attr("class", "list")
    .attr("x", 20) // Adjust x position
    .attr("y", (d, i) => 450 + i * 20) // Adjust y position based on item index
    .text(d => "\u2022 " + d) // Add a bullet point before each item
    .style("font-size", "14px")
    .attr('font-family', 'monospace')
    .style("fill", "black");
