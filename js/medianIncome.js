class medianIncome {
    constructor(_parentElement, _incomeData, _restaurantData){
        this.parentElement = _parentElement;
        this.incomeData = _incomeData;
        this.restaurantData = _restaurantData;


        this.initVis();
    }

    initVis(){
        let vis = this;

        // console.log(vis.restaurantData);
        // console.log(vis.incomeData)

        vis.margin = {top: 20, right: 20, bottom: 20, left: 40};
        vis.width = window.innerWidth;
        vis.height = window.innerHeight;
        // vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        // vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.title = vis.svg.append("text")
            .attr("x", vis.width/2)
            .attr("y", vis.height * 0.1) // Adjust this value as needed
            .attr("text-anchor", "middle")
            .attr('font-size', 30)
            .attr('font-family', 'monospace')
            .attr("fill", "white")
            .text("Restaurant Count and Median Income Per State");

        // Scales
        vis.radiusScale = d3.scaleLinear()
            .range([0,20])

        vis.x = d3.scaleLinear()
            .range([0,vis.width*0.80]);

        vis.y = d3.scaleLinear()
            .range([vis.height*0.50, 0]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        vis.svg.append("g")
            .attr("class", "x-axis axis");

        // Add labels for axes
        vis.svg.append("text")
            .attr("font-size", "20px")
            .attr("transform", `translate(${vis.width * 0.5}, ${vis.height * 0.90})`)
            .style("text-anchor", "middle")
            .attr("fill", "white")
            .attr('font-family', 'monospace, serif')
            .text("Median Income");

        vis.svg.append("text")
            .attr("y", 60)
            .attr("x", 0-vis.height*0.5)
            .attr("transform", "rotate(-90)")
            .attr("font-size", "20px")
            .style("text-anchor", "middle")
            .attr("fill", "white")
            .attr('font-family', 'monospace, serif')
            .text("Restaurant Count");

        vis.wrangleData();

    }

    wrangleData(){
        let vis = this;

        vis.incomeData.forEach(function(d){
            d.income = +d.income;
        })

        console.log("income data:");
        console.log(vis.incomeData);

        vis.restaurantCount = {};

        vis.restaurantData.forEach(function(d){
            if (vis.restaurantCount[d.province] !== undefined){
                vis.restaurantCount[d.province]+=1;
            }
            else{
                vis.restaurantCount[d.province] = 1;
            }
        });

        console.log("restaurant count:");
        console.log(vis.restaurantCount);

        vis.displayData= [];

        vis.incomeData.forEach(function(d){
            vis.displayData.push({
                "name": d.name,
                "median_income": d.income,
                "restaurant_count": vis.restaurantCount[d.state_ab] // find restaurant count
            })

        })
        console.log("state data:")
        console.log(vis.displayData);

        vis.updateVis();
    }

    updateVis(){
        let vis = this;

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'tooltip')

        vis.x.domain([0, d3.max(vis.displayData, d=> d["median_income"])])
        vis.y.domain([0, d3.max(vis.displayData, d=> d["restaurant_count"])]);
        // vis.radiusScale.domain([0, d3.max(vis.displayData, d=> d["median_income"])])

        // Change the color of the y-axis and its labels to white
        vis.svg.select(".y-axis")
            .attr("transform", "translate(130," + 150 + ")")
            .call(vis.yAxis)
            .selectAll("text")
            .attr("fill", "white");
        vis.svg.select(".y-axis")
            .selectAll("path")
            .attr("stroke", "white");
        vis.svg.select(".y-axis")
            .selectAll("line")
            .attr("stroke", "white");

        // Change the color of the x-axis and its labels to white
        vis.svg.select(".x-axis")
            .attr("transform", "translate(130," + (150 + (vis.height * 0.50)) + ")")
            .call(vis.xAxis)
            .selectAll("text")
            .attr("fill", "white");
        vis.svg.select(".x-axis")
            .selectAll("path")
            .attr("stroke", "white");
        vis.svg.select(".x-axis")
            .selectAll("line")
            .attr("stroke", "white");

        // Rotate x-axis labels by 45 degrees
        vis.svg.selectAll(".x-axis text")
            .style("text-anchor", "end") // Set the text-anchor to "end" to align properly after rotation
            .attr("transform", "rotate(-45)")
            .attr("dx", "-10px") // Adjust the position of the rotated labels if needed
            .attr("dy", "10px");

        // let path = vis.svg.selectAll(".line")
        //     .data([vis.displayData]);
        //
        let circle = vis.svg.selectAll("circle")
            .data(vis.displayData);

        circle
            .enter()
            .append("circle")
            .attr("class", "circle")
            .merge(circle)
            .on('mouseover', function (event, d){
                d3.select(this)
                    .attr('stroke-width', 3)
                    .attr('stroke', '#7B1818')
                    .attr('fill', "#D22B2B");
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(
                        `<div style="border: thin solid grey; border-radius: 5px; background: white; padding: 20px">
                             <h5>${d["name"]}</h5>
                             <h4>Median Income: $${d["median_income"]}</h4>
                             <h4>Fast Food Restaurants: ${d["restaurant_count"]}</h4>
                        </div>`
                    );
            })
            .on("mouseout", function(event, d){
                d3.select(this)
                    .attr('stroke', 'none')
                    .attr('fill', '#F4D9AE')
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
            .attr("transform", "translate(130," + (150) + ")")
            .attr("r", 5)
            .attr("cy", function(d){
                return vis.y(d["restaurant_count"]);
            })
            .attr("cx", function(d){
                return vis.x(d["median_income"]);
            })
            .attr("fill", '#F4D9AE')
            .attr("class", "labels")
            .attr("cursor", "pointer");
        circle.exit().remove();

    }
}