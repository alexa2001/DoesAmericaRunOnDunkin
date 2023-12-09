class FoodAndHealth{
    constructor(parentElement) {
        this.parentElement = parentElement;
        this.initVis();
    }

    initVis(){
        let vis = this;
        vis.margin = {top: 20, right: 100, bottom: 20, left: 50};
        vis.width = window.innerWidth;
        vis.height = window.innerHeight;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')

        vis.title = vis.svg.append("text")
            .attr("x", vis.width/2)
            .attr("y", vis.height * 0.1) // Adjust this value as needed
            .attr("text-anchor", "middle")
            .attr('font-size', 30)
            .attr('font-family', 'monospace')
            .text("What's the Cost of Fast Food?");

        vis.svg
            .append("image")
            .attr("xlink:href", "./images/silhouette.png") // Set the image URL
            .attr("x", vis.width/2 - 100) // Set the x position
            .attr("y", vis.height/2 - 200) // Set the y position
            .attr("width", 200) // Set the width
            .attr("height", 400); // Set the height
    }
}

