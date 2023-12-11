class ChainSalesVis {
    constructor(parentElement, chainData, foodLocationData) {
        this.parentElement = parentElement;
        this.restaurantSalesData = chainData;
        this.restaurantLocationData = foodLocationData;

        // Check the data is loaded correctly
        // console.log("restaurant locations", this.restaurantLocationData)
        // console.log("restaurant sales", this.restaurantSalesData)

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.textColor = "white";

        // set margins, width, and height
        vis.margin = {top: 20, right: 40, bottom: 50, left: 10};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // init title
        vis.title = vis.svg.append('g')
            .attr('class', 'title')
            .attr('id', 'chart-title')
            .attr('font-family', 'monospace, serif')
            .attr('fill', vis.textColor)
        vis.title.append('text')
            .attr('transform', `translate(${vis.width / 2}, 20)`)
            .attr('text-anchor', 'middle');

        // starting selected chain
        vis.selectedChain = "McDonald's";

        // Scales setup
        vis.xScale = d3.scaleBand().range([0, vis.width]).padding(0.1);
        vis.yScale = d3.scaleLinear().range([vis.height *0.90, vis.height * 0.10]);

        // Axes setup
        vis.xAxis = vis.svg.append("g")
            .attr("transform", `translate(0,${vis.height * 0.90})`)
            .attr("class", "x-axis axis")

        vis.yAxis = vis.svg.append("g")
            .attr("class", "y-axis axis")

        // Axis labels
        // X-axis label
        vis.svg.append("text")
            .attr("class", "x-axis-label")
            .attr("text-anchor", "middle")
            .attr("x", vis.width * 0.50)
            .attr("y", 40)  // Increase this value as needed
            .attr("font-family", "monospace")
            .attr("fill", vis.textColor)
            .text("Nationwide Sales Metrics");

        /////////////// TOOLTIP ///////////////
        // Initialize tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'salesToolTip')

        // Hover style
        vis.hoverColor = "#D22B2B"; // Change as desired
        vis.hoverStrokeColor = "#7B1818"; // Change as desired
        vis.hoverStrokeWidth = 3; // Change as desired
        vis.defaultStrokeColor = "black";
        vis.defaultStrokeWidth = 1;

        vis.wrangleData(vis.selectedChain);
    }

    wrangleData(selectedChain){
        let vis = this;

        //console.log("CHAIN: ", selectedChain);
        //console.log("DATA: ", vis.restaurantSalesData);

        vis.displayData = [];

        //Prepare data by looping over stations and populating empty data structure
        vis.restaurantSalesData.forEach(function(d){
            vis.displayData.push({
                "name": d.FastFoodChain,
                "Systemwide Sales (millions of dollars)": +d.SystemwideSales,
                "Unit Sales (thousands of dollars)": +d.AvgSalesPerUnit,
                "Franchise Stores": +d.FranchisedStores,
                "Company Stores": +d.CompanyStores,
                "Total Units Sold": +d.TotalUnits,
            })
        })
        //console.log("CLEAN DISPLAYDATA:", vis.displayData);

        // select for given chain and map to chart data structure
        vis.chainData = vis.displayData.filter(d => d.name === selectedChain)

        // Data transformation
        vis.chartData = [];
        if (vis.chainData.length > 0) {
            let data = vis.chainData[0]; // the first element is the one we want
            for (let key in data) {
                if (data.hasOwnProperty(key) && key !== 'name') {
                    vis.chartData.push({ category: key, value: data[key] });
                }
            }
        }
        //console.log("chart data on store:", vis.chartData);

        // Update domains
        vis.xScale.domain(vis.chartData.map(d => d.category));
        vis.yScale.domain([0, d3.max(vis.chartData, d => d.value) * 1.3]);

        vis.updateVis();
    }

    updateSelectedChain(chainName) {
        let vis = this;

        // If "all restaurant chains" is selected, revert to "McDonald’s"
        // Do this because there is no system-wide sales data for "all restaurant chains"
        if (chainName === "") {
            vis.selectedChain = "McDonald's";
        } else {
            vis.selectedChain = chainName;
        }

        //vis.selectedChain = chainName;
        vis.wrangleData(vis.selectedChain);
    }

    updateVis() {
        let vis = this;

        // Bind data to bars
        let bars = vis.svg.selectAll(".bar").data(vis.chartData);

        // Add title for the selected chain
        vis.title.select('text')
            .text(vis.selectedChain)
            .attr('transform', `translate(${vis.width / 2}, 20)`)
            .attr('text-anchor', 'middle');

        // Update existing bars
        bars.attr("x", d => vis.xScale(d.category))
            .attr("width", vis.xScale.bandwidth())
            .attr("y", d => d.value === 0 ? vis.height : vis.yScale(d.value)) // make height 0 is value is 0
            .attr("height", d => d.value === 0 ? 0 : vis.height - vis.yScale(d.value)) // make height 0 is value is 0
            .attr("transform", `translate(0,${-1*vis.height*0.10})`); // shift up to make room for x-axis

        // Enter new bars
        bars.enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => vis.xScale(d.category))
            .attr("width", vis.xScale.bandwidth())
            .attr("y", d => vis.yScale(d.value))
            .attr("height", d => vis.height - vis.yScale(d.value))
            .attr("fill", "#F05E16")
            .attr("stroke", "black")
            .on("mouseover", function(event, d) {
                //highlight when hovering
                d3.select(this)
                    .attr("fill", vis.hoverColor)
                    .attr("stroke", vis.hoverStrokeColor)
                    .attr("stroke-width", vis.hoverStrokeWidth);
                // Show tooltip
                // Update tooltip
                vis.tooltip
                    .transition()
                    .duration(200)
                    .style("opacity", .9);
                vis.tooltip.style("display", "block")
                    .html(`<strong>Category:</strong> ${d.category}<br><strong>
                    Value:</strong> ${d.category === "Systemwide Sales (millions of dollars)" ? (d.value).toLocaleString() + " million or $"+ (d.value*1000000).toLocaleString() :
                        d.category === "Unit Sales (thousands of dollars)" ? (d.value).toLocaleString() + " thousand or $"+ (d.value*1000).toLocaleString() :
                            d.category.includes("Sales") ? "$" + d.value.toLocaleString() : d.value.toLocaleString()}`);
                // Adjust tooltip to show both the stored value for the category and the actual value as a dollar amount
                // add commas to numbers and dollar signs to dollar values
            })
            .on("mousemove", function(event) {
                vis.tooltip.style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                // Revert fill and stroke when not hovered
                d3.select(this)
                    .attr("fill", "#F05E16")
                    .attr("stroke", vis.defaultStrokeColor)
                    .attr("stroke-width", vis.defaultStrokeWidth);
                // Hide tooltip
                vis.tooltip.style("display", "none");
            })
            .attr("transform", `translate(0,${-1*vis.height*0.10})`);

        // Exit and remove old bars
        bars.exit().remove();

        // Create custom x axis labels to fit everything neatly
        let categoryLabels = {
            "Systemwide Sales (millions of dollars)": "System Sales (M)",
            "Unit Sales (thousands of dollars)": "Unit Sales (K)",
            "Franchise Stores": "Franchise Stores",
            "Company Stores": "Company Stores",
            "Total Units Sold": "Total Units Sold"
        };


        // Update the x-axis
        vis.xAxis = d3.axisBottom(vis.xScale)
            .tickFormat(d => categoryLabels[d]);

        // Call the x-axis
        vis.svg.select(".x-axis")
            .call(vis.xAxis)
            .selectAll("text") // Select the labels of the x-axis
            .attr("fill", "white"); // Set the fill color to white

        vis.svg.select(".x-axis")
            .selectAll("line") // Select the ticks of the x-axis and make white
            .attr("stroke", "white");

        // Update the y-axis
        vis.yAxis = d3.axisLeft(vis.yScale);
        vis.yAxis.tickSize(0).tickFormat("");

        // Call the y-axis
        //vis.svg.select(".y-axis").call(vis.yAxis); // not calling because y axis is inconsistent in scale
    }
}