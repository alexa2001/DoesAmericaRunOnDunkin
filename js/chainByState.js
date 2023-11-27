class ChainByStateVis {
    constructor(parentElement, chainData, zoom) {
        this.parentElement = parentElement;
        this.chainData = chainData;
        this.zoom = zoom;
        this.initVis();
    }

    initVis(){
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 40};
        // vis.width = 700;
        vis.height = 500;
        vis.width = 500;
        // vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        // vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // let selectBox = vis.svg.append("foreignObject")
        //     .attr("x", 0)
        //     .attr("y", 20)
        //     .attr("width", 107)
        //     .attr("height", 200)
        //     .attr("class", "select-box")
        //     .append("xhtml:body")
        //     .html('<select id="mySelect"></select>');
        //
        // let options = d3.select("#mySelect")
        //     .selectAll("option")
        //     .data(["MA", "NY", "CA", "IL"])
        //     .enter()
        //     .append("option")
        //     .text(d => d);
        //
        // d3.select("#mySelect").on("change", function() {
        //     const selectedOption = d3.select(this).property("value");
        //     // console.log("Selected option:", selectedOption);
        //
        //     // Call updateVis() when the selection changes
        //     vis.wrangleData(selectedOption);
        // });

        vis.selectedState = "MA";
        vis.stateCoord = {
            "MA" :[42.4072, -71.3824],
            "NY": [40.7128, -74.0060],
            "IL": [40.6331, -89.3985],
            "CA": [36.7783, -119.4179]
        }

        document.getElementById('stateSelect').addEventListener('change', function() {
            vis.selectedState = this.value;
            // vis.wrangleData(vis.selectedState);

        });

        vis.map = L.map('chainVis').setView(vis.stateCoord[vis.selectedState], 7);

        L.Icon.Default.imagePath = 'images/leafletImages/';

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(vis.map);

        vis.wrangleData(vis.selectedState);


    }

    wrangleData(selectedOption){
        let vis = this;

        console.log("STATE: ", selectedOption);

        vis.displayData = []

        // Prepare data by looping over stations and populating empty data structure

        vis.chainData.forEach(function(s){
            vis.displayData.push({
                "name": s.name,
                "lat": +s.latitude,
                "lon": +s.longitude,
                "province": s.province
            })
        })

        console.log("DISPLAYDATA:");
        console.log(vis.displayData);

        vis.updateVis(selectedOption);
    }

    updateVis(state){
        let vis = this;

        vis.displayData.forEach(function(d) {
            if (d.province === state){
                vis.marker = L.marker([d["lat"], d["lon"]]).addTo(vis.map);
            }
        })
    }
}