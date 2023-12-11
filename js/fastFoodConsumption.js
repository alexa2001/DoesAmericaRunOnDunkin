// Fast Food Consumption Tranisition Page

let margin = {top: 20, right: 100, bottom: 20, left: 50};
let width = window.innerWidth;
let height = window.innerHeight;

let centerX = width / 2;

// init drawing area
let svg = d3.select("#fast-food-consumption").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append('g')

let title = svg.append("text")
    .attr("x", width/2)
    .attr("y", height * 0.1)
    .attr("text-anchor", "middle")
    .attr('font-size', 30)
    .attr('font-family', 'monospace')
    .attr("fill", "white")
    .text("Fast Food Consumption")

let timelineTitle = svg.append("text")
    .attr("x", width/2)
    .attr("y", height * 0.15)
    .attr("text-anchor", "middle")
    .attr('font-size', 20)
    .attr('font-family', 'monospace')
    .attr("fill", "white")
    .text("A brief history of the fast food industry")

const data = [
    { date: "1921-01-01",
        event: "White Castle begins the first fast food chain with their burger stand in Wichita, Kansas"},
    { date: "1937-01-01",
        event: "Krispy Kreme launches in North Carolina" },
    { date: "1948-01-01",
        event: "Richard and Maurice Mcdonald " +
            "create an assembly line system " +
            "for their McDonald's restaurants\n" },
    { date: "1950-01-01",
        event: "The first Dunkin' Donuts opens in Quincy, MA" },
    { date: "1953-01-01",
        event: "Danny's Donuts, later to be renamed Denny's, opens in California" },
    { date: "1954-01-01",
        event: "The first Burger King opens in Miami" },
    { date: "1965-01-01",
        event: "The first Subway opens in Connecticut" },
    { date: "1967-01-01",
        event: "The first Chik-fil-A opens in Atlanta" },
    { date: "1969-01-01",
        event: "The first Wendy's open in Ohio" },
    { date: "1975-01-01",
        event: "The first Chili's launches in Dallas" },
    { date: "2002-01-01",
        event: "McDonalds reduces the amount of trans fat in their fries by 48%" },
    { date: "2005-01-01",
        event: "American sales of fast food total $163.5 billion" },
    { date: "2015-01-01",
        event: "U.S. fast food industry generates $200 billion in revenue" },

];

const parseDate = d3.timeParse("%Y-%m-%d");
data.forEach(d => {
    d.date = parseDate(d.date);
});

const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width - margin.right - 50]);

let xAxis = d3.axisTop(xScale);

svg.append("g")
    .attr("class", "x-axis axis")
    .style("stroke", "white");


// xAxis
svg.select(".x-axis")
    .attr("transform", "translate(" + margin.left + "," + 200 + ")")
    .call(xAxis);

let myTooltip = d3.select("body").append('div')
    .attr('class', "tooltip")

const circs = svg.selectAll(".circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "circle")
    //.attr("cx", d => xScale(d.date))
    .attr("cx", d => xScale(d.date) + margin.left)
    .attr("cy", function(d, i){
        if( i % 2 === 0 ){
            return (height * 0.5 - 40)
        }
        else{
            return (height * 0.5 - 50)
        }
    })
    .attr("r", 10)
    .attr("fill", "#F4D9AE")
    .attr("cursor", "pointer")
    .on('mouseover', function (event, d){
        // Define the date format
        let formatDate = d3.timeFormat("%Y"); //"%A, %B %d, %Y"

        // Calculate the tooltip position
        let left = event.pageX + 20;
        let top = event.pageY;

        // Get the width of the tooltip
        let tooltipWidth = document.querySelector('.tooltip').offsetWidth;

        // Check if the tooltip would extend beyond the right edge of the window
        if (left + tooltipWidth > window.innerWidth) {
            // Adjust the left position to the left of the mouse pointer
            left = event.pageX - tooltipWidth - 20;
        }

        // update tooltip with data
        myTooltip
            .style("opacity", 1)
            .style("left", left + "px")
            .style("top", top + "px")
            .html(`
             <div style="border: thin solid grey; border-radius: 5px; background: white; padding: 10px">
                 <h4><b>${formatDate(d.date)}</b></h4>
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


let ticks = svg.selectAll('.line')
    .data(data)
    .enter()
    .append('line')
    .attr('class', 'timeline')
    .attr("stroke", "#F4D9AE")
    //.attr('x1', d => xScale(d.date))
    .attr('y1', d => 200)
    //.attr('x2', d => xScale(d.date))
    .attr('x1', d => xScale(d.date) + margin.left)
    .attr('x2', d => xScale(d.date) + margin.left)
    .attr("y2", function(d, i){
        if( i % 2 === 0 ){
            return (height * 0.5 - 40)
        }
        else{
            return (height * 0.5 - 50)
        }
    })

let CDC = svg.append("text")
    .attr("x", margin.left)
    .attr("y", height * 0.55) // Adjust this value as needed
    //.attr("text-anchor", "start")
    .attr('font-size', 20)
    .attr('font-family', 'monospace')
    .attr("fill", "white")
    .text("CDC Findings")

let popularity = svg.append("text")
    .attr("x", margin.left)
    .attr("y", height * 0.75)
    .attr('font-size', 20)
    .attr('font-family', 'monospace')
    .attr("fill", "white")
    .text("Why is it so popular?")

let findings = [
    "Over 1/3 of adults in the U.S. consumed fast food on any given day between 2013-2016",
    "Fast food consumption decreased with age",
    "There is a positive correlation between fast food consumption and increasing family income"
];

let facts = [
    "The fast food industry boomed with the highway system built in the 50's and 60's",
    "Convenience plays a huge role in its popularity, allowing for quick and easy access to food on the go",
    "There is a perception that fast food is cheaper than most restaurants and making food at home"
];

let listItems = svg.selectAll(".list")
    .data(findings)
    .enter()
    .append("text")
    .attr("class", "list")
    .attr("x", margin.left)
    .attr("y", (d, i) => height * 0.60 + i * 20)
    .text(d => "\u2022 " + d)
    .style("font-size", "14px")
    .attr('font-family', 'monospace')
    .style("fill", "white")

let factItems = svg.selectAll(".facts-list")
    .data(facts)
    .enter()
    .append("text")
    .attr("class", "facts-list")
    .attr("x", margin.left)
    .attr("y", (d, i) => height * 0.80 + i * 20)
    .text(d => "\u2022 " + d)
    .style("font-size", "14px")
    .attr('font-family', 'monospace')
    .style("fill", "white")
