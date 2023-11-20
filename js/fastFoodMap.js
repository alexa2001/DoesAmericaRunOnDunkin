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
        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

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
            .attr('text-anchor', 'middle');

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
            .attr('id', 'mapTooltip')

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
        vis.states.attr("fill", d => {
            let stateName = d.properties.name; // Replace 'code' with the correct property key
            // Use the state code to get the restaurant count
            let storeCount = vis.chainDataByState[stateName];
            // Apply color scale based on store count
            return vis.colorScale(storeCount);

        });

        vis.states.on("click", (event, d) => {
            let stateName = d.properties.name; // Or any identifier
            renderStateMap(stateName);
        });


    }

    // renderStateMap(stateIdentifier, ) {
    //     let vis = this;
    //
    //     d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json").then(function(us) {
    //         let usStates = topojson.feature(us, us.objects.states).features;
    //         let selectedState = usStates.find(d => d.properties.name === stateIdentifier);
    //
    //         let restaurantLocations = vis.restaurantLocationData.filter(d => d.province === stateIdentifier);
    //
    //         console.log(selectedState);
    //
    //         new StateMapVis("stateMapDiv", us, selectedState, restaurantLocations);
    //     });
    // }
}