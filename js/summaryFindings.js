// Summary Findings Page
class SummaryPage {
    constructor(parentElement) {
        this.parentElement = parentElement;

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById("summaryFindings").getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById("summaryFindings").getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        //init drawing area
        vis.svg = d3.select("#summaryFindings").append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.title = vis.svg.append("text")
            .attr("x", vis.width/2)
            .attr("y", vis.height * 0.15)
            .attr("text-anchor", "middle")
            .attr('font-size', 30)
            .attr('font-family', 'monospace')
            .attr('fill', 'black')
            .text("Takeaways")

        vis.svg.append("rect")
            .attr("x", vis.width/2 - (vis.width/2)/2) // Subtract half of the rectangle's width
            .attr("y", vis.height * 0.3 - 35) // y position
            .attr("width", vis.width/2) // width
            .attr("height", 175) // height
            .attr("rx", 10) // horizontal corner radius
            .attr("ry", 10) // vertical corner radius
            .attr("stroke", "#F05E16") // border color
            .attr("stroke-width", 2) // border width
            .attr("fill", "white"); // fill color

        // Define the lines of text
        vis.lines = [
            "Fast food is remains incredibly popular in the US, regardless of health data",
            "The popularity continues as fast food is easy to obtain, cheap, and efficient",
            "32% percent of people stated that they ate fast food because it is cheap",
            "Americans spend over $50 Billion annually on fast food"
        ];

        // Append each line of text as a separate text element
        vis.lines.forEach((line, i) => {
            vis.svg.append("text")
                .attr("x", vis.width/2)
                .attr("y", vis.height*0.3 + i * 35)  // Increment the y attribute for each line
                .attr("text-anchor", "middle")     // Center the text
                .attr("font-size", 20)             // Font size
                .attr('font-family', 'Avenir, serif')
                .text(line);
        });

        vis.svg.append("text")
            .attr("x", vis.width/2)
            .attr("y", vis.height * 0.6)
            .attr("text-anchor", "middle")
            .attr('font-size', 20)
            .attr('font-family', 'monospace')
            .attr('fill', 'black')
            .append("tspan")
            .text("Despite common perception, there is not much of a correlation")
            .append("tspan")
            .attr("x", vis.width/2)
            .attr("dy", "2em") // Adjust this value as needed
            .text("between median household income and the number of fast food restaurants.")
            .append("tspan")
            .attr("x", vis.width/2)
            .attr("dy", "2em") // Adjust this value as needed
            .text("Instead, the number of fast food restaurants in a given state seems")
            .append("tspan")
            .attr("x", vis.width/2)
            .attr("dy", "2em") // Adjust this value as needed
            .text("more related to the size of that state than median income")
    }
}

// Text to include on the summary findings page
// why fast food is still so popular, regardless of health data,
// and also talking about how there’s not really too much of a correlation
// between income and fast food restaurants? The number of fast food restaurants
// in a state seems more related to the size of that state than income
// Also the obesity risk factor prevalence seems to be consistent over all age group
// but hypertension spikes after 40 years old
// So maybe like our future considerations/actions should be that older groups should be more concerned about their health/diet?
