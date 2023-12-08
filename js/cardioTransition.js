class CardioTransitionVis {
    constructor(parentElement) {
        this.parentElement = parentElement;
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // Set up a timer to draw a circle every 30 seconds
        setInterval(() => {
            this.drawCircle();
        }, 30000);
    }

    drawCircle() {
        let vis = this;

        // Assuming you want to draw the circle in your existing SVG
        vis.svg.append("circle")
            .attr("cx", Math.random() * vis.width)  // Random x position
            .attr("cy", Math.random() * vis.height) // Random y position
            .attr("r", 20)                          // Radius of the circle
            .style("fill", "red");                  // Color of the circle
    }

    updateVis() {
        let vis = this;

        // print text
        vis.svg.append("text")
            .attr("x", vis.width/2)
            .attr("y", vis.height/2)
            .text("One person dies every 33 seconds in the United States from cardiovascular disease. About 695,000 people in the United States died from heart disease in 2021—that's 1 in every 5 deaths")
    }
}