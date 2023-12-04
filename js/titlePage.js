
class TitlePage{
    constructor(_parentElement){
        this.parentElement = _parentElement;
        this.initVis();
    }

    circleXY(r, theta) {
        // Convert angle to radians
        theta = (theta-90) * Math.PI/180;

        return {x: r*Math.cos(theta),
            y: -r*Math.sin(theta)}
    }



    initVis(){
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 40};
        vis.width = window.screen.width;
        vis.height = window.screen.height;

        console.log(`center: (${vis.width/2}, ${vis.height/2})`) //(640, 360)

// init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);



        vis.title = vis.svg.append("text")
            .attr("x", vis.width/2)
            .attr("y", vis.height/2)
            .attr("fill", "white")
            .attr("text-anchor", "middle")
            .attr('font-size', 30) // Font size
            .attr('font-family', 'monospace')
            .attr("width", 100)
            .text("Does America Run on Dunkin'?")

        vis.logos = [
            "./images/BKLogo.png",
            "./images/chickfilaLogo.png",
            "./images/DDLogo.png",
            "./images/mcdonaldsLogo.png",
            "./images/popeyesLogo.png",
            "./images/starbucksLogo.png",
            "./images/wendysLogo.png"
        ];

        let index = 0;
        let colorPalette = d3.scaleOrdinal(d3.schemePastel1);

        // function moveCircle() {
        //     circle.transition()
        //         .duration(2000) // Animation duration in milliseconds
        //         .attr("cx", 350) // Move the circle to x-coordinate 350
        //         .attr("cy", 350) // Move the circle to y-coordinate 350
        //         .transition()
        //         .duration(2000) // Animation duration in milliseconds
        //         .attr("cx", 50) // Move the circle back to x-coordinate 50
        //         .attr("cy", 50) // Move the circle back to y-coordinate 50
        //         .on("end", moveCircle); // Restart the animation when it ends
        // }

        for (let theta=0; theta<=360; theta += (360/7)) {
            let answer = vis.circleXY(300, theta);
            vis.circ = vis.svg.append("circle")
                .attr("class", "logoCircle")
                .attr('cx', answer.x + 640)
                .attr("cy", answer.y + 360)
                .attr("r", 50)
                .attr("stroke", "white")
                .attr("stroke-width", 3)
                .transition()
                .attr("fill", colorPalette(theta))

            // moveCircle();

            vis.logo = vis.svg.append("image")
                .attr("xlink:href", vis.logos[index]) // Set the image URL
                .attr('x', answer.x + 640 - 35) // X position of the image
                .attr("y", answer.y + 360 - 35) // Y position of the image
                .attr("width", 70) // Set the width of the image
                .attr("height", 70);

            index += 1;
        }


    }
}