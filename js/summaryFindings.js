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

        // init drawing area
        vis.svg = d3.select("#summaryFindings").append("svg")
            .attr("viewBox", `0 0 ${vis.width} ${vis.height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .append('g');

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        // Add title
        vis.title = vis.svg.append("text")
            .attr("x", "50%") // Use percentages for positioning
            .attr("y", "15%") // Use percentages for positioning
            .attr("text-anchor", "middle")
            .style('font-size', '2vw') // Use viewport units for font size
            .attr('font-family', 'monospace')
            .attr('weight', 'bold')
            .attr('fill', 'black')
            .text("Takeaways");

        // First rectangle with orange outline
        vis.svg.append("rect")
            .attr("x", vis.width/2 - (vis.width/1.75)/2) // Subtract half of the rectangle's width
            .attr("y", vis.height * 0.25 - 35) // y position
            .attr("width", vis.width/1.75) // width
            .attr("height", 175) // height
            .attr("rx", 10) // horizontal corner radius
            .attr("ry", 10) // vertical corner radius
            .attr("stroke", "#F05E16") // border color
            .attr("stroke-width", 2) // border width
            .attr("fill", "white"); // fill color

        // Add second nested rectangle with fill
        vis.svg.append("rect")
            .attr("x", vis.width/2 - (vis.width/1.75)/2) // Subtract half of the rectangle's width
            .attr("y", vis.height * 0.25 - 35) // y position
            .attr("width", vis.width/1.75) // width
            .attr("height", 175/2) // height
            .attr("rx", 10) // horizontal corner radius
            .attr("ry", 10) // vertical corner radius
            .attr("stroke", "#F05E16") // border color
            .attr("stroke-width", 2) // border width
            .attr("fill", "#F05E16"); // fill color

        // Define the lines of text
        // fast food popularity text
        vis.lines = [
            "Fast food is remains incredibly popular in the US, regardless of health data",
            "The popularity continues as fast food is easy to obtain, cheap, and efficient",
            "32% percent of Americans stated that they ate fast food because it was cheap",
            "Americans typically spend over $50 Billion annually on fast food, a huge amount"
        ];

        // Append each line of text as a separate text element
        vis.lines.forEach((line, i) => {
            let text = vis.svg.append("text")
                .attr("x", vis.width/2)
                .attr("y", i < 2 ? vis.height*0.25 + i * 35 : vis.height*0.25 + i * 35 + 20)  // Increment the y attribute for each line
                .attr("text-anchor", "middle")     // Center the text
                .attr("font-size", 20)             // Font size
                .attr('font-family', 'Avenir, serif')
                .attr("textLength", vis.width/1.75 - 20) // Set the desired text length to the width of the rectangle minus some padding
                .attr("lengthAdjust", "spacingAndGlyphs") // Adjust the spacing and glyphs to fit the text within the desired length
                .text(line)

            // If it's one of the first two lines, make the text semibold
            if (i < 2) {
                text.style("font-weight", "500");
                text.style("fill", "white")
            }
            // If it's one of the last two lines, make the text italic
            if (i >= vis.lines.length - 2) {
                text.style("font-style", "italic");
            }
        });

        // third rectangle with black outline
        vis.svg.append("rect")
            .attr("x", vis.width/3 - (vis.width/3.5) + vis.margin.left) // Subtract half of the rectangle's width
            .attr("y", vis.height * 0.55 - 35) // y position
            .attr("width", vis.width/2.5) // width
            .attr("height", 230) // height
            .attr("rx", 10) // horizontal corner radius
            .attr("ry", 10) // vertical corner radius
            .attr("stroke", "black") // border color
            .attr("stroke-width", 2) // border width
            .attr("fill", "white"); // fill color

        // nested fourth title rectangle with black outline
        vis.svg.append("rect")
            .attr("x", vis.width/3 - (vis.width/3.5) + vis.margin.left) // Subtract half of the rectangle's width
            .attr("y", vis.height * 0.55 - 35) // y position
            .attr("width", vis.width/4) // width
            .attr("height", 50) // height
            .attr("rx", 10) // horizontal corner radius
            .attr("ry", 10) // vertical corner radius
            .attr("stroke", "black") // border color
            .attr("stroke-width", 2) // border width
            .attr("fill", "black"); // fill color

        // fifth rectangle with black outline
        vis.svg.append("rect")
            .attr("x", vis.width/2 + vis.margin.right) // Subtract half of the rectangle's width
            .attr("y", vis.height * 0.55 - 35) // y position
            .attr("width", vis.width/2.5) // width
            .attr("height", 230) // height
            .attr("rx", 10) // horizontal corner radius
            .attr("ry", 10) // vertical corner radius
            .attr("stroke", "black") // border color
            .attr("stroke-width", 2) // border width
            .attr("fill", "white"); // fill color

        // nested sixth title rectangle with black outline
        vis.svg.append("rect")
            .attr("x", vis.width/2 + vis.margin.left) // Subtract half of the rectangle's width
            .attr("y", vis.height * 0.55 - 35) // y position
            .attr("width", vis.width/4) // width
            .attr("height", 50) // height
            .attr("rx", 10) // horizontal corner radius
            .attr("ry", 10) // vertical corner radius
            .attr("stroke", "black") // border color
            .attr("stroke-width", 2) // border width
            .attr("fill", "black"); // fill color

        // economic impact text
        vis.econLines = [
            "Despite common perception, there is not much of a",
            "correlation between median household income and the",
            "number of fast food restaurants. Instead, the number",
            "of fast food restaurants in a given state seems more",
            "related to the size of that state than median income"

        ];

        // Append each line of text as a separate text element
        vis.econLines.forEach((line, i) => {
            let text = vis.svg.append("text")
                .attr("x", vis.width - (vis.width / 1.07) + 10)
                .attr("y", vis.height * 0.6 + i * 35)  // Increment the y attribute for each line
                .attr("text-anchor", "start")     // Center the text
                .attr("font-size", 15)             // Font size
                .attr('font-family', 'Avenir, serif')
                .attr("textLength", vis.width / 2.5 - 30) // Set the desired text length to the width of the rectangle minus some padding
                .attr("lengthAdjust", "spacingAndGlyphs") // Adjust the spacing and glyphs to fit the text within the desired length
                .text(line)
        });

        // economic impact text
        vis.healthLines = [
            "Obesity risk factor prevalence seems to be consistent",
            "over all age groups, but hypertension spikes in people",
            "above 40 years old. This suggests that older individuals",
            "should be more concerned and careful about their health",
            "and diet in order to prevent cardiovascular diseases."

        ];

        // Append each line of text as a separate text element
        vis.healthLines.forEach((line, i) => {
            let text = vis.svg.append("text")
                .attr("x", vis.width - (vis.width/2) + 30)
                .attr("y", vis.height * 0.6 + i * 35)  // Increment the y attribute for each line
                .attr("text-anchor", "start")     // Center the text
                .attr("font-size", 15)             // Font size
                .attr('font-family', 'Avenir, serif')
                .attr("textLength", vis.width / 2.5 - 30) // Set the desired text length to the width of the rectangle minus some padding
                .attr("lengthAdjust", "spacingAndGlyphs") // Adjust the spacing and glyphs to fit the text within the desired length
                .text(line)
        });

        vis.svg.append("text")
            .attr("x", vis.width - (vis.width/1.07) + 10)
            .attr("y", vis.height * 0.55)
            .attr("text-anchor", "start")
            .attr('font-size', 20)
            .attr('font-family', 'monospace')
            .attr('weight', 'bold')
            .attr('fill', 'white')
            .text("Economic Findings")

        vis.svg.append("text")
            .attr("x", vis.width - (vis.width/2) + 30)
            .attr("y", vis.height * 0.55)
            .attr("text-anchor", "start")
            .attr('font-size', 20)
            .attr('font-family', 'monospace')
            .attr('weight', 'bold')
            .attr('fill', 'white')
            .text("Health Findings")
    }

}
