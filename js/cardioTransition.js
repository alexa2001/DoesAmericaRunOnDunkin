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

        // Create 'g' elements for circles and text -- to ensure circles print behind text
        vis.circlesGroup = vis.svg.append('g');
        vis.textGroup = vis.svg.append('g');

        // init title
        vis.textGroup.append("text")
            .attr("x", vis.width/2)
            .attr("y", vis.height/3)
            .attr("text-anchor", "middle")  // Center the text
            .attr("font-size", 25)          // Font size
            .attr("font-weight", "bold")    // Font weight
            .attr('font-family', 'monospace, serif')
            .text("Cardiovascular Disease is the leading cause of death in the US")

        // Set 33 second timer
        setInterval(() => {
            vis.drawCircle();
        }, 33000);

        vis.drawCircle()
    }

    drawCircle() {
        let vis = this;

        // Add circles every 33 seconds
        vis.circlesGroup.append("circle")
            .attr("cx", Math.random() * vis.width)  // Random x position
            .attr("cy", Math.random() * vis.height) // Random y position
            .attr("r", 20)                          // Radius of the circle
            .attr("stroke", "#7B1818")                // Color of the circle border
            .style("fill", "#D22B2B");                  // Color of the circle

        //console.log("circle drawn")

        vis.updateVis()
    }

    updateVis() {
        let vis = this;


        let lines = [
            "One person dies every 33 seconds in the United States from cardiovascular disease",
            "In total about 695,000 people in the United States died from heart disease in 2021",
            "That's 1 in every 5 deaths",
            "Each circle here is one more cardiovascular death."
        ];

        // Append each line of text as a separate text element
        lines.forEach((line, i) => {
            let text = vis.svg.append("text")
                .attr("x", vis.width/2)
                // Increment the y attribute for each line so the lines after the first are further down
                .attr("y", i < 1 ? vis.height/2 + i * 35 : vis.height/2 + i * 35 + 20)
                .attr("text-anchor", "middle")     // Center the text
                .attr("font-size", 20)             // Font size
                .attr('font-family', 'monospace, serif')
                .text(line);

            // If it's one of the first two lines, make the text semibold
            if (i < 1) {
                text.style("font-weight", "bold");
            }
        });

    }
}