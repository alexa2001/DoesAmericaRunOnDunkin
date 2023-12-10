class FoodMapVis {
    constructor(parentElement, topoData, foodMapData, foodLocationData, chainsGeoData, USGeoData) {
        this.parentElement = parentElement;
        this.dataTopographic = topoData;
        this.restaurantSalesData = foodMapData;
        this.restaurantLocationData = foodLocationData;
        this.chainsGeoData = chainsGeoData;
        this.USGeoData = USGeoData;


        console.log("restaurant data", this.restaurantSalesData)
        console.log("map data", this.restaurantLocationData)
        console.log("chains geo", this.chainsGeoData)

        this.initVis()
    }

    initVis() {
        let vis = this;

        // set margins, width, and height
        vis.margin = {top: 20, right: 30, bottom: 20, left: 20};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width;
        vis.height = window.innerHeight - margin.top - margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // add title
        vis.svg.append('g')
            .attr('class', 'title')
            .attr('id', 'map-title')
            .append('text')
            .text('Fast Food Restaurants by State')
            .attr('transform', `translate(${vis.width / 2}, 20)`)
            .attr('text-anchor', 'middle')
            .attr('font-family', 'Avenir, serif');

        console.log("here")

        // Zoom
        vis.viewpoint = {'width': 975, 'height': 610};
        vis.zoom = vis.width / vis.viewpoint.width;


        // Create map
        // note: data was already projected
        vis.path = d3.geoPath()

        vis.usa = topojson.feature(vis.dataTopographic, vis.dataTopographic.objects.states).features
        vis.states = vis.svg.selectAll(".state")
            .data(vis.usa)
            .enter()
            .append("path")
            .attr("class", "states")
            .attr('transform', `scale(${vis.zoom} ${vis.zoom})`)
            .attr("class", "country")
            .attr("d", vis.path)
            .attr("fill", "transparent")
            .attr("stroke", "black")
            .attr("stroke-width", 0.5);

        /////////////// TOOLTIP ///////////////
        // Initialize tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'mapToolTip')

        /////////////// LEGEND ///////////////
        // legend scale
        vis.legendScale = d3.scaleOrdinal()
            .range([0, (vis.width/3)]);

        //creating a legend group
        vis.legend = vis.svg.append("g")
            .attr('class', 'legend')
            .attr('transform', `translate(${vis.width/ 2}, ${vis.height * 0.8})`);

        vis.legendAxisGroup = vis.legend.append("g")
            .attr("class", "legend-axis")

        //add d3 linear gradient

        //Create linear color gradient
        vis.defs = vis.svg.append("defs");

        vis.gradient = vis.defs.append("linearGradient")
            .attr("id", "svgGradient")
            .attr("x1", "0%")
            .attr("x2", "100%")
            .attr("y1", "100%")
            .attr("y2", "100%");

        vis.gradient.append("stop")
            .attr("class", "start")
            .attr("offset", "0%")
            .attr("stop-color", "white")
            .attr("stop-opacity", 1);

        vis.gradient.append("stop")
            .attr("class", "end")
            .attr("offset", "100%")
            .attr("stop-color", "#F05E16")
            .attr("stop-opacity", 1);

        // Hover style
        vis.hoverColor = "#D22B2B"; // Change as desired
        vis.hoverStrokeColor = "#7B1818"; // Change as desired
        vis.hoverStrokeWidth = 3; // Change as desired
        vis.defaultStrokeColor = "black";
        vis.defaultStrokeWidth = 0.5;

        // legend axis
        vis.legendAxis = d3.axisBottom(vis.legendScale);

        vis.legend
            .append("rect")
            .attr("class", "legend-color")
            .attr("x", 0)
            .attr("y", -20)
            .attr("width", (vis.width/3))
            .attr("height", 20)
            .attr("fill", "url(#svgGradient)"); // pull gradient color scale

        vis.wrangleData()
    }

    wrangleData () {
        let vis = this;

        // Roll up to count the number of restaurants by state abbreviation
        let countByStateAbbr = d3.rollup(vis.restaurantLocationData, v => v.length, d => d.province);

        // Transform the data to map state names to counts
        vis.chainDataByState = {};
        countByStateAbbr.forEach((count, abbr) => {
            let stateName = nameConverter.getFullName(abbr); // Convert abbreviation to full name
            vis.chainDataByState[stateName] = count;
        });

        console.log("Chain Data By State", vis.chainDataByState);

        vis.updateVis()

    }

    updateVis () {
        let vis = this;

        // Set up color scale
        vis.colorScale = d3.scaleLinear()
            .domain([0, d3.max(Object.values(vis.chainDataByState))])
            .range(["white", "#F05E16"]);
        // console.log("color scale", vis.colorScale.domain())

        // Apply color to states
        vis.states
            .attr("fill", d => {
                let stateName = d.properties.name;
                vis.storeCount = vis.chainDataByState[stateName];
                return vis.colorScale(vis.storeCount);
            })
            .on("mouseover", function(event, d) {
                let stateName = d.properties.name;

                // Change fill and stroke on hover
                d3.select(this)
                    .attr("fill", vis.hoverColor)
                    .attr("stroke", vis.hoverStrokeColor)
                    .attr("stroke-width", vis.hoverStrokeWidth);

                // Update tooltip
                vis.tooltip
                    .transition()
                    .duration(200)
                    .style("opacity", .9);
                vis.tooltip.html(`<strong>State:</strong> ${d.properties.name}<br><strong>Restaurants:</strong> ${vis.chainDataByState[stateName]}`)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mousemove", function(event) {
                vis.tooltip.style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                // Revert fill and stroke when not hovered
                d3.select(this)
                    .attr("fill", d => {
                        let stateName = d.properties.name;
                        vis.storeCount = vis.chainDataByState[stateName];
                        return vis.colorScale(vis.storeCount);
                    })
                    .attr("stroke", vis.defaultStrokeColor)
                    .attr("stroke-width", vis.defaultStrokeWidth);

                // Hide tooltip
                vis.tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // send information about selected state to chainByState.js
        vis.states.on("click", (event, d) => {
            let clickedState = nameConverter.getAbbreviation(d.properties.name); // Gets the name of the clicked state
            console.log("clicked state", clickedState);
            updateStateMap(clickedState); // Calls the global function to update the state map
        });


        // Update legend
        vis.legendScale.domain([0, d3.max(Object.values(vis.chainDataByState))])
        vis.legendAxisGroup.call(vis.legendAxis);

    }
}