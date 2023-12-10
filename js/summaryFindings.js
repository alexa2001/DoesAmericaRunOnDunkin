// Summary Findings Page

let margin = {top: 20, right: 20, bottom: 20, left: 20};
let width = window.innerWidth;
let height = document.getElementById(vis.parentElement).getBoundingClientRect().height + 200;

let centerX = width / 2;

// init drawing area
let svg = d3.select("#summaryFindings").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

let title = svg.append("text")
    .attr("x", width/2)
    .attr("y", height * 0.3) // Adjust this value as needed
    .attr("text-anchor", "middle")
    .attr('font-size', 30)
    .attr('font-family', 'monospace')
    .attr('color', 'black')
    .text("Takeaways")