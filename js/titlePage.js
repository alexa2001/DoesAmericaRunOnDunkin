
class TitlePage{
    constructor(_parentElement){
        this.parentElement = _parentElement;
        this.initVis();
    }

    //credit to: https://stackoverflow.com/questions/43641798/how-to-find-x-and-y-coordinates-on-a-flipped-circle-using-javascript-methods

    circleXY(r, theta) {
        // Convert angle to radians
        theta = (theta-90) * Math.PI/180;

        return {x: r*Math.cos(theta),
            y: -r*Math.sin(theta)}
    }

    initVis(){
        let vis = this;

        vis.logoDims = 50;
        vis.radius = 250;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = window.innerWidth;
        vis.height = window.innerHeight;

        console.log(`center: (${vis.width/2}, ${vis.height/2})`) //(640, 360)

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g');



        vis.title = vis.svg.append("text")
            .attr("x", vis.width/2)
            .attr("y", vis.height/2)
            .attr("fill", "white")
            .attr("text-anchor", "middle")
            .attr('font-size', 25) // Font size
            .attr('font-family', 'monospace')
            .text("Does America Run on Dunkin'?")

        vis.subtitle = vis.svg.append("text")
            .attr("x", vis.width/2)
            .attr("y", vis.height/2 + 60)
            .attr("fill", "white")
            .attr("text-anchor", "middle")
            .attr('font-size', 15) // Font size
            .attr('font-family', 'monospace')
            .text("A look into America's fast food and health trends")

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
        let vis=this;

        console.log("r: ", r)

        let colorPalette = d3.scaleOrdinal(d3.schemeCategory10);

        vis.circle = vis.svg.append("circle")
            .attr("cx", vis.width/2)  // Center of the circle is the title
            .attr("cy", vis.height/2)  // Center of the circle is the title
            .attr("r", 40)
            .attr("stroke", "white")
            .attr("stroke-width", 3)
            .attr("fill", "#ffd1dc")


        vis.logo = vis.svg.append("image")
            .attr("xlink:href", vis.logos[r]) // Set the image URL
            .attr('x', vis.width/2 - vis.logoDims/2) // X position of the image is the title
            .attr("y", vis.height/2 - vis.logoDims/2) // Y position of the image is the title
            .attr("width", vis.logoDims) // Set the width of the image
            .attr("height", vis.logoDims);


// Function to animate the circle's movement
        function moveCircle() {

            vis.logo.transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("x",  vis.circleXY(vis.radius, (r%7/7)*360).x + vis.width/2 - vis.logoDims/2)
                .attr("y",  vis.circleXY(vis.radius, (r%7/7)*360).y + vis.height/2 - vis.logoDims/2)
                .transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("x",  vis.circleXY(vis.radius, ((r+1)%7/7)*360).x + vis.width/2 - vis.logoDims/2)
                .attr("y",  vis.circleXY(vis.radius, ((r+1)%7/7)*360).y + vis.height/2 - vis.logoDims/2)
                .transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("x",  vis.circleXY(vis.radius, ((r+2)%7/7)*360).x + vis.width/2 - vis.logoDims/2)
                .attr("y",  vis.circleXY(vis.radius, ((r+2)%7/7)*360).y + vis.height/2 - vis.logoDims/2)
                .transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("x",  vis.circleXY(vis.radius, ((r+3)%7/7)*360).x + vis.width/2 - vis.logoDims/2)
                .attr("y",  vis.circleXY(vis.radius, ((r+3)%7/7)*360).y + vis.height/2 - vis.logoDims/2)
                .transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("x",  vis.circleXY(vis.radius, ((r+4)%7/7)*360).x + vis.width/2 - vis.logoDims/2)
                .attr("y",  vis.circleXY(vis.radius, ((r+4)%7/7)*360).y + vis.height/2 - vis.logoDims/2)
                .transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("x",  vis.circleXY(vis.radius, ((r+5)%7/7)*360).x + vis.width/2 - vis.logoDims/2)
                .attr("y",  vis.circleXY(vis.radius, ((r+5)%7/7)*360).y + vis.height/2 - vis.logoDims/2)
                .transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("x",  vis.circleXY(vis.radius, ((r+6)%7/7)*360).x + vis.width/2 - vis.logoDims/2)
                .attr("y",  vis.circleXY(vis.radius, ((r+6)%7/7)*360).y + vis.height/2 - vis.logoDims/2)
                .transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("x",  vis.circleXY(vis.radius, ((r+7)%7/7)*360).x + vis.width/2 - vis.logoDims/2)
                .attr("y",  vis.circleXY(vis.radius, ((r+7)%7/7)*360).y + vis.height/2 - vis.logoDims/2)
                // .on("end", moveCircle);


            vis.circle.transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("cx",  vis.circleXY(vis.radius, (r%7/7)*360).x + vis.width/2)
                .attr("cy",  vis.circleXY(vis.radius, (r%7/7)*360).y + vis.height/2)
                .transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("cx",  vis.circleXY(vis.radius, ((r+1)%7/7)*360).x + vis.width/2)
                .attr("cy",  vis.circleXY(vis.radius, ((r+1)%7/7)*360).y + vis.height/2)
                .transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("cx",  vis.circleXY(vis.radius, ((r+2)%7/7)*360).x + vis.width/2)
                .attr("cy",  vis.circleXY(vis.radius, ((r+2)%7/7)*360).y + vis.height/2)
                .transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("cx",  vis.circleXY(vis.radius, ((r+3)%7/7)*360).x + vis.width/2)
                .attr("cy",  vis.circleXY(vis.radius, ((r+3)%7/7)*360).y + vis.height/2)
                .transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("cx",  vis.circleXY(vis.radius, ((r+4)%7/7)*360).x + vis.width/2)
                .attr("cy",  vis.circleXY(vis.radius, ((r+4)%7/7)*360).y + vis.height/2)
                .transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("cx",  vis.circleXY(vis.radius, ((r+5)%7/7)*360).x + vis.width/2)
                .attr("cy",  vis.circleXY(vis.radius, ((r+5)%7/7)*360).y + vis.height/2)
                .transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("cx",  vis.circleXY(vis.radius, ((r+6)%7/7)*360).x + vis.width/2)
                .attr("cy",  vis.circleXY(vis.radius, ((r+6)%7/7)*360).y + vis.height/2)
                .transition()
                .duration(2000) // Animation duration in milliseconds
                .attr("cx",  vis.circleXY(vis.radius, ((r+7)%7/7)*360).x + vis.width/2)
                .attr("cy",  vis.circleXY(vis.radius, ((r+7)%7/7)*360).y + vis.height/2)
                // .on("end", moveCircle);

        }
        moveCircle();

    }


// Start the animation

}