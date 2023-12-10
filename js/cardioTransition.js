class CardioTransitionVis {
    constructor(parentElement) {
        this.parentElement = parentElement;
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = window.innerWidth - vis.margin.left - vis.margin.right;
        vis.height = window.innerHeight - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // Set up a timer to draw a circle every 30 seconds
        setInterval(() => {
            vis.drawCircle();
        }, 33000);

        // Draw the circles before the text so that the text is on top
        vis.drawCircle()

        // Print text at the center of the SVG
        vis.svg.append("text")
            .attr("x", vis.width/2)
            .attr("y", vis.height/3)
            .attr("text-anchor", "middle")  // Center the text
            .attr("font-size", 25)          // Font size
            .attr("font-weight", "bold")    // Font weight
            .text("Cardiovascular Disease is the leading cause of death in the US")
    }

    drawCircle() {
        let vis = this;

        // Draw the circle at a random position within the SVG
        vis.svg.append("circle")
            .attr("cx", Math.random() * vis.width)  // Random x position
            .attr("cy", Math.random() * vis.height) // Random y position
            .attr("r", 20)                          // Radius of the circle
            .style("fill", "red");                  // Color of the circle

        //console.log("circle drawn")

        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        // Define the lines of text
        let lines = [
            "One person dies every 33 seconds in the United States from cardiovascular disease",
            "In total about 695,000 people in the United States died from heart disease in 2021",
            "That's 1 in every 5 deaths",
            "Each circle here is one more cardiovascular death."
        ];

        // Append each line of text as a separate text element
        lines.forEach((line, i) => {
            vis.svg.append("text")
                .attr("x", vis.width/2)
                .attr("y", vis.height/2 + i * 35)  // Increment the y attribute for each line
                .attr("text-anchor", "middle")     // Center the text
                .attr("font-size", 20)             // Font size
                .text(line);
        });
    }
}