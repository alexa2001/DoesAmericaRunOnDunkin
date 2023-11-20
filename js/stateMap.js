class StateMapVis {
    constructor(parentElement, topoData, selectedStateName, foodLocationData) {
        this.parentElement = parentElement;
        this.dataTopographic = topoData;
        this.selectedStateName = selectedStateName;
        this.restaurantLocationData = foodLocationData;
        this.initVis();
    }

    initVis() {
        d3.selectAll("#stateMapDiv > *").remove();

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
            .text('Chains in State')
            .attr('transform', `translate(${vis.width / 2}, 20)`)
            .attr('text-anchor', 'middle');

        // Zoom
        vis.viewpoint = {'width': 850, 'height': 610};
        vis.zoom = vis.width / vis.viewpoint.width;


        //////// SELECT STATE ////////
        // Ensure selectedState is an array
        vis.stateFeatureArray = [vis.selectedStateName];

        // Create map
        vis.path = d3.geoPath()

        vis.states = vis.svg.selectAll()
            .data(vis.stateFeatureArray)
            .enter()
            .append("path")
            .attr("class", "states")
            .attr('transform', `scale(${vis.zoom} ${vis.zoom})`)
            .attr("class", "country")
            .attr("d", vis.path)
            .attr("fill", "#F05E16")
            .attr("stroke", "black")
            .attr("stroke-width", 0.5);

    }
}