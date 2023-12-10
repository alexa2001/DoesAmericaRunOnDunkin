class FoodAndHealth{
    constructor(parentElement) {
        this.parentElement = parentElement;
        this.initVis();
    }

    initVis() {
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
            .attr("x", vis.width / 2)
            .attr("y", vis.height * 0.1) // Adjust this value as needed
            .attr("text-anchor", "middle")
            .attr('font-size', 30)
            .attr('font-family', 'monospace')
            .text("What's the Long Term Cost of Fast Food?");

        vis.svg
            .append("image")
            .attr("xlink:href", "./images/silhouette.png") // Set the image URL
            .attr("x", vis.width / 2 - 100) // Set the x position
            .attr("y", vis.height / 2 - 200) // Set the y position
            .attr("width", 200) // Set the width
            .attr("height", 400); // Set the height

        let cornerRadius = 10;

        const lineData = [
            { x1: vis.width / 2, y1: (vis.height / 2 - 180), x2: 300, y2: 140 }, //head
            { x1: vis.width / 2 + 10, y1: (vis.height / 2 - 170), x2: 900, y2: 150 }, //face
            { x1: vis.width / 2, y1: (vis.height / 2 - 100), x2: 200, y2: 300 }, //heart
            { x1: vis.width / 2, y1: (vis.height / 2 - 50), x2: 300, y2: 525 }, //stomach
            { x1: vis.width / 2 + 50, y1: (vis.height / 2 - 50), x2: 900, y2: 310 } //arm
        ];



        vis.svg.selectAll("line")
            .data(lineData) // Bind data to line elements
            .enter().append("line") // Append a line for each data point
            .attr("class", "line-class") // Apply a class to the line
            .attr("x1", d => d.x1) // Set x-coordinate of starting point
            .attr("y1", d => d.y1) // Set y-coordinate of starting point
            .attr("x2", d => d.x2) // Set x-coordinate of ending point
            .attr("y2", d => d.y2) // Set y-coordinate of ending point
            .attr("stroke", "#FF671F") // Set the line color
            .attr("stroke-width", 3); // Set the line width

        vis.svg.selectAll("circle")
            .data(lineData) // Bind data to line elements
            .enter().append("circle") // Append a line for each data point
            .attr("class", "line-class") // Apply a class to the line
            .attr("cx", d => d.x1) // Set x-coordinate of starting point
            .attr("cy", d => d.y1) // Set y-coordinate of starting point
            .attr("r", 5)
            .attr("fill", "#FF671F"); // Set the line width

        //head
        vis.svg.append("rect")
            .attr("x", 45)
            .attr("y", 95)
            .attr("width", 308)
            .attr("height", 83)
            .attr("rx", cornerRadius)
            .style("fill", "lightblue")
            .style("stroke", "#FF671F")
            .style("stroke-width", 2);

        //chest
        vis.svg.append("rect")
            .attr("x", 160)
            .attr("y", 240)
            .attr("width", 180)
            .attr("height", 140)
            .attr("rx", cornerRadius)
            .style("fill", "lightblue")
            .style("stroke", "#FF671F")
            .style("stroke-width", 2);

        //stomach
        vis.svg.append("rect")
            .attr("x", 163)
            .attr("y", 440)
            .attr("width", 225)
            .attr("height", 110)
            .attr("rx", cornerRadius)
            .style("fill", "lightblue")
            .style("stroke", "#FF671F")
            .style("stroke-width", 2);

        //skin
        vis.svg.append("rect")
            .attr("x", 810)
            .attr("y", 120)
            .attr("width", 230)
            .attr("height", 50)
            .attr("rx", cornerRadius)
            .style("fill", "lightblue")
            .style("stroke", "#FF671F")
            .style("stroke-width", 2);

        //arm
        vis.svg.append("rect")
            .attr("x", 865)
            .attr("y", 275)
            .attr("width", 220)
            .attr("height", 60)
            .attr("rx", cornerRadius)
            .style("fill", "lightblue")
            .style("stroke", "#FF671F")
            .style("stroke-width", 2);





        vis.lineData = [
            {x1: 0, y1: 40, x2: 300, y2: 50},

        ]




        const head = "Eating too little nutrients can affect" +
            "\nyour overall mood, and eating a lot of" +
            "\nsugar on a regular basis can lead to" +
            "\nyour body to continue to crave it";
        const headText = vis.svg.append("text")
            .attr("y", 100)
            .attr("font-family", "Arial")
            .attr("font-size", 14)
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .attr('font-family', 'monospace');
        const headLines = head.split("\n");
        headText.selectAll("tspan")
            .data(headLines)
            .enter().append("tspan")
            .attr("x", 200)
            .attr("dy", "1.2em")
            .text(d => d);

        const heart = "Poor diet has been" +
            "\nlinked to an increased" +
            "\nrisk of heart disease" +
            "\ndue to elevated risk" +
            "\nfactors like high" +
            "\ncholesterol and high" +
            "\nblood pressure"
        const heartText = vis.svg.append("text")
            .attr("y", 250)
            .attr("font-family", "Arial")
            .attr("font-size", 14)
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .attr('font-family', 'monospace');
        const heartLines = heart.split("\n");
        heartText.selectAll("tspan")
            .data(heartLines)
            .enter().append("tspan")
            .attr("x", 250)
            .attr("dy", "1.2em")
            .text(d => d);

        const skin = "Carb-heavy food such as fries" +
            "\ncan lead to acne flare-ups"
        const skinText = vis.svg.append("text")
            .attr("y", 125)
            .attr("font-family", "Arial")
            .attr("font-size", 14)
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .attr('font-family', 'monospace');
        const skinLines = skin.split("\n");
        skinText.selectAll("tspan")
            .data(skinLines)
            .enter().append("tspan")
            .attr("x", 925)
            .attr("dy", "1.2em")
            .text(d => d);

        const stomach =
            "A high-sodium diet can lead" +
            "\nto water retention and lead" +
            "\nto bloating. It is also" +
            "\nassociated with an increased" +
            "\nrisk of hypertension"
        const stomachText = vis.svg.append("text")
            .attr("y", 450)
            .attr("font-family", "Arial")
            .attr("font-size", 14)
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .attr('font-family', 'monospace');
        const stomachLines = stomach.split("\n");
        stomachText.selectAll("tspan")
            .data(stomachLines)
            .enter().append("tspan")
            .attr("x", 275)
            .attr("dy", "1.2em")
            .text(d => d);

        const arm =
            "Obesity is a risk factor of" +
            "\ntype II diabetes and" +
            "\ncardiovascular diseases"
        const armText = vis.svg.append("text")
            .attr("y", 275)
            .attr("font-family", "Arial")
            .attr("font-size", 14)
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .attr('font-family', 'monospace');
        const armLines = arm.split("\n");
        armText.selectAll("tspan")
            .data(armLines)
            .enter().append("tspan")
            .attr("x", 975)
            .attr("dy", "1.2em")
            .text(d => d);


    }
}

