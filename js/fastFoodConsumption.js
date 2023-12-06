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
    { date: "1960-01-01", event: "Event 1" },
    { date: "1970-03-15", event: "Event 2" },
    { date: "2023-06-30", event: "Event 3" },
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
    .range([margin.left, width - margin.right])

let xAxis = d3.axisTop(xScale);

svg.append("g")
    .attr("class", "x-axis axis");

svg.select(".x-axis")
    .attr("transform", "translate(0," + 200 + ")")
    // .transition()
    .call(xAxis);

let events = svg.selectAll(".events")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "events")
    .attr("x", d => xScale(d.date))
    .attr("y", height / 2 - 10) // Adjust text position
    .text(d => d.event)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("fill", "black");

// const linedata = []
//
// data.forEach(function(d){
//     linedata.push(
//         {x:xScale(d.date), y:0},
//         {x:xScale(d.date), y:100}
//     )
// })

// Create a line generator function

const lineGenerator = d3.line()
    .x(d => d.x) // Set the x-coordinate based on your data
    .y(d => d.y); // Set the y-coordinate based on your data

// Append a path representing the line to the SVG
let t = svg.selectAll(".tick")
    .data([data])
    .enter()
    .append("path")
    .attr("class", "tick")
    .attr("d", function(d){
        console.log("D: ", d)
        let lineData =
            [
                { x: xScale(d.date), y: 50 },
                { x:  xScale(d.date), y: 150 }
            ];

        return lineGenerator(lineData)
    })// Use the line generator with your data
    .attr("stroke", "black") // Set the stroke color
    .attr("stroke-width", 2) // Set the stroke width
    .attr("fill", "none");

// const lineGenerator = d3.line()
//     .x(d => d.x) // Set the x-coordinate based on your data
//     .y(d => d.y);

// let t = svg.selectAll(".tick")
//     .data(data)
//     .enter()
//     .append("path")
//     .attr("class", "tick")
//     .attr("d", function(d){
//         let  lineData =
//             [
//                 {x: xScale(d.date), y: 30 },
//                 { x: xScale(d.date), y: 150 }
//             ]
//         lineGenerator(lineData)
//
//     }) // Use the line generator with the data
//     .attr("stroke", "black") // Set the stroke color
//     .attr("stroke-width", 2) // Set the stroke width
//     .attr("fill", "none"); // Ensure the line is not filled


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
