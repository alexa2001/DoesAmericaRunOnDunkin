
class TitlePage{
    constructor(_parentElement){
        this.parentElement = _parentElement;
        this.initVis();
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

        // vis.test = vis.svg.append("image")
        //     .attr("xlink:href", "images/BKLogo.png") // Set the image URL
        //     .attr("x", 50) // X position of the image
        //     .attr("y", 50) // Y position of the image
        //     .attr("width", 100) // Set the width of the image
        //     .attr("height", 100);

        let i =  51.42;
        let index = 0;
        let colorPalette = d3.scaleOrdinal(d3.schemePastel1);
        while(i < 360){
            vis.circs = vis.svg.append("circle")
                .attr("class", "logoCircle")
                .attr('cx', 300*Math.cos(i)+640)
                .attr("cy", 300*Math.sin(i)+360)
                .attr("r", 50)
                .transition()
                .attr("fill", colorPalette(index))

            vis.logo = vis.svg.append("image")
                .attr("xlink:href", vis.logos[index]) // Set the image URL
                .attr("x", 300*Math.cos(i)+640 - 25) // X position of the image
                .attr("y", 300*Math.sin(i)+360 -25) // Y position of the image
                .attr("width", 50) // Set the width of the image
                .attr("height", 50);

            // console.log(`Circle ${index}: (${300*Math.cos(i)+640}, ${300*Math.sin(i)+360})`)
            index += 1;
            i += 51.42;
        }

        // vis.circs2 = vis.svg.append("circle")
        //     .attr("class", "logoCircle")
        //     .attr('cx', 300*Math.cos(51.42)+640)
        //     .attr("cy", 300*Math.sin(51.42)+360)
        //     .attr("r", 50)
        //     .attr("fill", "blue")
        //
        // vis.circs3 = vis.svg.append("circle")
        //     .attr("class", "logoCircle")
        //     .attr('cx', 300*Math.cos(102.84)+640)
        //     .attr("cy", 300*Math.sin(102.84)+360)
        //     .attr("r", 50)
        //     .attr("fill", "blue")

    }


}