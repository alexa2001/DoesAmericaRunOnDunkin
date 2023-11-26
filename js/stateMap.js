class StateMapVis {
    constructor(parentElement, topoData, foodLocationData) {
        this.parentElement = parentElement;
        this.dataTopographic = topoData;
        this.restaurantLocationData = foodLocationData;
        this.selectedRestaurantName = "";
        this.initVis();
    }

    updateSelectedState(newState) {
        this.selectedStateName = newState;
        //console.log("selected state", this.selectedStateName)
        this.initVis(); // Make sure to refresh data and visualization
    }

    updateSelectedRestaurant(restaurantName) {
        this.selectedRestaurantName = restaurantName;
        //console.log("selected chain", this.selectedRestaurantName)
        this.wrangleData(); // Refilter data and refresh visualization
    }



    initVis() {

        // clear previous state map
        d3.selectAll("#stateMapDiv > *").remove();

        let vis = this;

        // convert data structure
        vis.usStates = topojson.feature(vis.dataTopographic, vis.dataTopographic.objects.states).features;
        // identify selected state, pulling name and path
        vis.selectedState = vis.usStates.find(d => d.properties.name === vis.selectedStateName);
        console.log("state loading check", vis.usStates, vis.selectedState)

        // set margins, width, and height
        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // Zoom
        vis.viewpoint = {'width': 850, 'height': 610};
        vis.zoom = vis.width / vis.viewpoint.width;

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
            .text('Chains in:')
            .attr('transform', `translate(${vis.width / 2}, 20)`)
            .attr('text-anchor', 'middle');

        // Create tooltip
        vis.tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "5px");


        // Ensure selectedState is an array
        vis.stateFeatureArray = [vis.selectedState];
        //console.log("state feature array", vis.stateFeatureArray)

        // Create state map
        vis.path = d3.geoPath()

        vis.wrangleData();

    }

    wrangleData() {
        let vis = this;

        console.log("state", vis.selectedStateName)

        // Convert state abbreviations to full names
        vis.restaurantNamesLocations = vis.restaurantLocationData.map(location => {
            return {
                ...location,
                province: nameConverter.getFullName(location.province)
            };
        });
        //console.log("Restaurant Locations with Full State Names:", vis.restaurantNamesLocations); -- working!

        // filter to see if matches the selected state
        vis.stateRestaurants = vis.restaurantNamesLocations.filter(d => d.province === vis.selectedStateName);

        // Filter to see if matches the selected restaurant chain, or show all if the selected name is ""
        vis.filteredRestaurants = vis.stateRestaurants.filter(d =>
            vis.selectedRestaurantName === "" || d.name === vis.selectedRestaurantName);

        //console.log("state-based locations", vis.stateRestaurants)//; -- working!
        //console.log("filtered restaurants by chain", vis.filteredRestaurants)

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        // Draw the state path
        vis.statePath = vis.svg.selectAll(".state")
            .data(vis.stateFeatureArray);

        // enter
        vis.statePath
            .enter()
            .append("path")
            .attr("class", "state")
            .merge(vis.statePath)
            .transition()
            .attr("d", vis.path)
            .attr("fill", "#FFA985")
            .attr("stroke", "black")
            .attr("stroke-width", 1);
        // no need to exit because state path doesn't change


        // Print the name of the state above the state
        // Remove any existing title before appending a new one
        vis.svg.selectAll('.state-title').remove();

        // Add state name title
        vis.svg.append('text')
            .attr('class', 'state-title')
            .text(vis.selectedStateName) // Display the state name
            .attr('transform', `translate(${vis.width / 2}, 40)`)
            .attr('text-anchor', 'middle');

        //////////////////////// Project Stores On States ///////////////////////////////
        // Create a projection
        vis.projection = d3.geoAlbersUsa()
            .scale(1300) // Adjust scale as needed
            .translate([487.5, 305]); // Adjust translation as needed

        // Create path generator
        vis.stores = vis.svg.selectAll('.store')
            .data(vis.filteredRestaurants);

        vis.stores.exit().remove();

        // draw stores as points
        vis.stores
            .data(vis.filteredRestaurants)
            .enter()
            .append('circle')
            .attr('class', 'store')
            .transition()
            .attr('cx', d => {
                //console.log("Longitude:", d.longitude, "Latitude:", d.latitude); // Debugging
                let projected = vis.projection([d.longitude, d.latitude]);
                return projected ? projected[0] : null; // Fallback to null if projection is not valid
            })
            .attr('cy', d => {
                let projected = vis.projection([d.longitude, d.latitude]);
                return projected ? projected[1] : null; // Fallback to null if projection is not valid
            })
            .attr('r', 2)
            .attr('display', d => {
                let projected = vis.projection([d.longitude, d.latitude]);
                return projected ? 'inline' : 'none'; // Hide circles if projection is not valid
            })
            .attr('fill', 'transparent')
            .attr('opacity', 0.5)
            .attr('stroke', 'black')
            .on("mouseover", function(event, d) {
                vis.tooltip
                    .transition()
                    .duration(200)
                    .style("opacity", .9);
                vis.tooltip.html(`Name: ${d.name}<br>Location: ${d.city}, ${d.province}`)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mousemove", function(event, d) {
                vis.tooltip
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(event, d) {
                vis.tooltip
                    .transition()
                    .duration(500)
                    .style("opacity", 0);
            });


        ///////////////////// Dynamic Projection////////////////////////////
        // Calculate the bounding box of the selected state
        if (vis.selectedState) {
            let bounds = vis.path.bounds(vis.selectedState);
            //console.log("bounds", bounds)
            let dx = bounds[1][0] - bounds[0][0];
            let dy = bounds[1][1] - bounds[0][1];
            let x = (bounds[0][0] + bounds[1][0]) / 2;
            let y = (bounds[0][1] + bounds[1][1]) / 2;
            //console.log("x", x, "y", y)

            // Adjust scale and translation
            let scale = 0.9 / Math.max(dx / vis.width, dy / vis.height);
            let translate = [vis.width / 2 - scale * x, vis.height / 2 - scale * y];

            vis.projection.scale(scale).translate(translate);

            // Update the projection based on the selected state
            vis.projection.scale(scale).translate(translate);
            vis.path.projection(vis.projection);

            // Re-draw the state path with the updated projection
            //vis.statePath.attr("d", vis.path);

        } else {
            console.error("Selected state is not defined.");
            return;
        }
    }

}

function updateStateMap(newState) {
    if (stateMapVis) {
        stateMapVis.updateSelectedState(newState);
    }
}
