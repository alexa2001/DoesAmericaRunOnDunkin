// Summary Findings Page

// let margin = {top: 20, right: 20, bottom: 20, left: 20};
// let width = document.getElementById("summaryFindings").getBoundingClientRect().width - margin.left - margin.right;
// let height = document.getElementById("summaryFindings").getBoundingClientRect().height - margin.top - margin.bottom;
//
// // init drawing area
// let svg = d3.select("#summaryFindings").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//
// let title = svg.append("text")
//     .attr("x", 200)
//     .attr("y", 200) // Adjust this value as needed
//     .attr("text-anchor", "middle")
//     .attr('font-size', 30)
//     .attr('font-family', 'monospace')
//     .attr('fill', 'black') // Use 'fill' instead of 'color'
//     .text("Takeaways")