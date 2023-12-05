
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

        vis.makeCircles(0);
        vis.makeCircles(1);
        vis.makeCircles(2);
        vis.makeCircles(3);
        vis.makeCircles(4);
        vis.makeCircles(5);
        vis.makeCircles(6);


        let colorPalette = d3.scaleOrdinal(d3.schemePastel1);

        // for (let theta=0; theta<=360; theta += (360/7)) {
        //     console.log("theta: ", theta)
        //     let answer = vis.circleXY(300, theta);
        //     vis.circ = vis.svg.append("circle")
        //         .attr("class", "logoCircle")
        //         .attr('cx', answer.x + 640)
        //         .attr("cy", answer.y + 360)
        //         .attr("r", 50)
        //         .attr("stroke", "white")
        //         .attr("stroke-width", 3)
        //         .transition()
        //         .attr("fill", colorPalette(theta))
        //
        //
        //     vis.logo = vis.svg.append("image")
        //         .attr("xlink:href", vis.logos[index]) // Set the image URL
        //         .attr('x', answer.x + 640 - 35) // X position of the image
        //         .attr("y", answer.y + 360 - 35) // Y position of the image
        //         .attr("width", 70) // Set the width of the image
        //         .attr("height", 70);
        //
        //     index += 1;
        // }


    }

    makeCircles(r){
        console.log("r: ", r)
        let vis=this;
        let colorPalette = d3.scaleOrdinal(d3.schemePastel1);
        vis.circle = vis.svg.append("circle")
            .attr("fill", colorPalette(50))
            .attr("cx", 50)
            .attr("cy", 50)
            .attr("r", 50)
            .attr("stroke", "white")
            .attr("stroke-width", 3)


        vis.logo = vis.svg.append("image")
            .attr("xlink:href", vis.logos[r]) // Set the image URL
            .attr('x', 50) // X position of the image
            .attr("y", 50) // Y position of the image
            .attr("width", 70) // Set the width of the image
            .attr("height", 70);

// Function to animate the circle's movement
        function moveCircle() {
            console.log("(6%1/7)*360): ", (6%1/7)*360)
            console.log("((6+1)%7/7)*360): ", ((6+1)%7/7)*360 )
            console.log("((6+2)%7/7)*360): ", ((6+2)%7/7)*360 )
            console.log("((6+3)%7/7)*360): ", ((6+3)%7/7)*360 )

            vis.logo.transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("x",  vis.circleXY(300, (r%7/7)*360).x + 640 - 35)
                .attr("y",  vis.circleXY(300, (r%7/7)*360).y + 360 - 35)
                .transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("x",  vis.circleXY(300, ((r+1)%7/7)*360).x + 640 - 35)
                .attr("y",  vis.circleXY(300, ((r+1)%7/7)*360).y + 360 - 35)
                .transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("x",  vis.circleXY(300, ((r+2)%7/7)*360).x + 640 - 35)
                .attr("y",  vis.circleXY(300, ((r+2)%7/7)*360).y + 360 - 35)
                .transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("x",  vis.circleXY(300, ((r+3)%7/7)*360).x + 640 - 35)
                .attr("y",  vis.circleXY(300, ((r+3)%7/7)*360).y + 360 - 35)
                .transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("x",  vis.circleXY(300, ((r+4)%7/7)*360).x + 640 - 35)
                .attr("y",  vis.circleXY(300, ((r+4)%7/7)*360).y + 360 - 35)
                .transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("x",  vis.circleXY(300, ((r+5)%7/7)*360).x + 640 - 35)
                .attr("y",  vis.circleXY(300, ((r+5)%7/7)*360).y + 360 - 35)
                .transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("x",  vis.circleXY(300, ((r+6)%7/7)*360).x + 640 - 35)
                .attr("y",  vis.circleXY(300, ((r+6)%7/7)*360).y + 360 - 35)
                .transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("x",  vis.circleXY(300, ((r+7)%7/7)*360).x + 640 - 35)
                .attr("y",  vis.circleXY(300, ((r+7)%7/7)*360).y + 360 - 35)
                .on("end", moveCircle);


            vis.circle.transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("cx",  vis.circleXY(300, (r%7/7)*360).x + 640)
                .attr("cy",  vis.circleXY(300, (r%7/7)*360).y + 360)
                .transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("cx",  vis.circleXY(300, ((r+1)%7/7)*360).x + 640)
                .attr("cy",  vis.circleXY(300, ((r+1)%7/7)*360).y + 360)
                .transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("cx",  vis.circleXY(300, ((r+2)%7/7)*360).x + 640)
                .attr("cy",  vis.circleXY(300, ((r+2)%7/7)*360).y + 360)
                .transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("cx",  vis.circleXY(300, ((r+3)%7/7)*360).x + 640)
                .attr("cy",  vis.circleXY(300, ((r+3)%7/7)*360).y + 360)
                .transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("cx",  vis.circleXY(300, ((r+4)%7/7)*360).x + 640)
                .attr("cy",  vis.circleXY(300, ((r+4)%7/7)*360).y + 360)
                .transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("cx",  vis.circleXY(300, ((r+5)%7/7)*360).x + 640)
                .attr("cy",  vis.circleXY(300, ((r+5)%7/7)*360).y + 360)
                .transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("cx",  vis.circleXY(300, ((r+6)%7/7)*360).x + 640)
                .attr("cy",  vis.circleXY(300, ((r+6)%7/7)*360).y + 360)
                .transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("cx",  vis.circleXY(300, ((r+7)%7/7)*360).x + 640)
                .attr("cy",  vis.circleXY(300, ((r+7)%7/7)*360).y + 360)
                .on("end", moveCircle);

        }
        moveCircle();
    }


// Start the animation

}