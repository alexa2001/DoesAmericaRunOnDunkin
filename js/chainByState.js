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
        vis.height = 700;
        vis.width = 700;
        // vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        // vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        let selectBox = vis.svg.append("foreignObject")
            .attr("x", 0)
            .attr("y", 20)
            .attr("width", 107)
            .attr("height", 200)
            .attr("class", "select-box")
            .append("xhtml:body")
            .html('<select id="mySelect"></select>');

        let options = d3.select("#mySelect")
            .selectAll("option")
            .data(["MA", "NY", "CA", "IL"])
            .enter()
            .append("option")
            .text(d => d);

        d3.select("#mySelect").on("change", function() {
            const selectedOption = d3.select(this).property("value");
            // console.log("Selected option:", selectedOption);

            // Call updateVis() when the selection changes
            vis.wrangleData(selectedOption);
        });

        vis.map = L.map('chainVis').setView(vis.zoom, 7);

        L.Icon.Default.imagePath = 'images/leafletImages/';

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(vis.map);

        console.log("HERE")

        // L.geoJson(d3.json("data/MBTA-Lines.json")).addTo(vis.map);

        vis.wrangleData("MA");
    }

    wrangleData(selectedOption){
        let vis = this;

        vis.displayData = []

        // Prepare data by looping over stations and populating empty data structure

        vis.chainData.forEach(function(s){
            vis.displayData.push({
                "name": s.name,
                "lat": s.latitude,
                "lon": s.longitude,
                "province": s.province
            })
        })

        console.log("DISPLAYDATA:");
        console.log(vis.displayData);

        vis.updateVis();
    }

    updateVis(){
        let vis = this;
    }
}