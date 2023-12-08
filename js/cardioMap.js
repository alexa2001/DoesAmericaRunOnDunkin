class cardioMap {
    constructor(parentElement, coronaryData, fastFoodData) {
        this.parentElement = parentElement;
        this.fastFoodData = fastFoodData;
        this.coronaryData = coronaryData;
        // this.countyLocations = countyLocations
        // console.log("counties", this.countyLocations)
        // this.ffLocations = ffLocations;

        // console.log("fast food data", this.fastFoodData)
        // console.log("coronary data", this.coronaryData)
        // console.log("location data", this.ffLocations)


        this.initVis()
    }

    initVis() {
        let vis = this;

        // set margins, width, and height
        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        // vis.width = 250;

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.colorScale = d3.scaleLinear()
            // .range(['blue', 'white', 'red']);
            .range(['white', 'blue']);


        vis.radiusScale = d3.scaleLinear()
            .range([1, 10])


        // Zoom
        vis.viewpoint = {'width': 975, 'height': 610};
        vis.zoom = vis.width / vis.viewpoint.width;


        vis.map = L.map('cardioMapDiv').setView([39.8283, -98.5795], 4);

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(vis.map);

        // fetch('data/usa_counties.geojson')
        //     .then(response => response.json())
        //     .then(data => {
        //         // Create a GeoJSON layer and add it to the map with a blue fill color
        //         vis.countyMap = L.geoJSON(data, {
        //             style: {
        //                 fillColor: 'blue',
        //                 weight: 2,
        //                 opacity: 1,
        //                 color: 'white',
        //                 dashArray: '3',
        //                 fillOpacity: 0.7
        //             }
        //         }).addTo(vis.map);
        //     });

        // vis.countyMap = L.geoJSON(vis.countyLocations, {
        //     style: {
        //         fillColor: 'blue',
        //         weight: 2,
        //         opacity: 1,
        //         color: 'white',
        //         dashArray: '3',
        //         fillOpacity: 0.7
        //     }
        // }).addTo(vis.map);

        // legend scale
        vis.legendScaleColor = d3.scaleOrdinal()
            .range([0, (4*vis.width/5)]);

        vis.legend = vis.svg.append("g")
            .attr('class', 'legend')
            .attr('transform', `translate(20, ${vis.height - 200})`)

        vis.legendAxisGroup = vis.legend.append("g")
            .attr("class", "legend-axis")


        // Create linear color gradient
        vis.defs = vis.svg.append("defs");

        vis.gradient = vis.defs.append("linearGradient")
            .attr("id", "cardioGradient")
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
            .attr("stop-color", "blue")
            .attr("stop-opacity", 1);

        vis.legendAxis = d3.axisBottom(vis.legendScaleColor)
            .tickFormat(d3.format(".2f"));

        vis.legend
            .append("rect")
            .attr("class", "legend-color")
            .attr("x", 20)
            .attr("y", -200)
            .attr("width", (4*vis.width/5))
            .attr("height", 30)
            .attr("fill", "url(#cardioGradient)"); // pull gradient color scale

        let cardioSelectBox = vis.svg.append("foreignObject")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 200)
            .attr("height", 30)
            .attr("class", "select-box")
            .append("xhtml:body")
            .html('<select id="cardioSelect"></select>');

        let ageSelectBox = vis.svg.append("foreignObject")
            .attr("x", 0)
            .attr("y", 50)
            .attr("width", 120)
            .attr("height", 30)
            .attr("class", "select-box")
            .append("xhtml:body")
            .html('<select id="ageSelect"></select>');

        let ageOptions = d3.select("#ageSelect")
            .selectAll("option")
            .data(["35-64","65 and over"])
            .enter()
            .append("option")
            .text(d => d);

        let cardioOptions = d3.select("#cardioSelect")
            .selectAll("option")
            .data(["Coronary Heart Disease", "Stroke"])
            .enter()
            .append("option")
            .text(d => d);

        d3.select("#ageSelect").on("change", function() {
            vis.selectedAge = d3.select(this).property("value");
            // console.log("Selected option:", selectedOption);

            // Call updateVis() when the selection changes
            vis.wrangleData();
        });

        d3.select("#cardioSelect").on("change", function() {
            vis.selectedCardio = d3.select(this).property("value");
            // console.log("Selected option:", selectedOption);

            // Call updateVis() when the selection changes
            vis.wrangleData();
        });


        vis.wrangleData()
    }

    wrangleData () {
        let vis = this;

        vis.allFastFoodData = this.fastFoodData;
        vis.allCoronaryData = this.coronaryData;

        vis.selectedAgeData = [];
        vis.selectedCardioData = [];
        vis.counties = [];
        vis.fastFoodCounties = [];


        // Filter by age group
        if (vis.selectedAge === "65 and over") {
            vis.allCoronaryData.forEach(entry => {
                if (entry['Stratification1'] === "Ages 65 years and older") {
                    vis.selectedAgeData.push(entry)
                }
            })
            vis.filteredData = vis.selectedAgeData

        } else {
            vis.allCoronaryData.forEach(entry => {
                if (entry['Stratification1'] === "Ages 35-64 years") {
                    vis.selectedAgeData.push(entry)
                }
            })
            vis.filteredData = vis.selectedAgeData
        }
        // console.log("age filtered", vis.filteredData)

        // Filter by type of coronary heart disease
        if (vis.selectedCardio === "Stroke") {
            vis.filteredData.forEach(entry => {
                if (entry['Topic'] === "Stroke") {
                    vis.selectedCardioData.push(entry)
                }

                vis.allFastFoodData.forEach(change => {
                    if (change['County'] === entry['LocationDesc'] && change['State'] === entry['LocationAbbr']){
                        entry['ff_change']= 1 * change['PC_FSRSALES12']
                        entry['cardio_change']= 1 * entry["Data_Value"]
                        entry['county'] = entry["LocationDesc"]
                        entry['state'] = entry["LocationAbbr"]

                    }
                })


            })
            vis.filteredData = vis.selectedCardioData

        } else {
            vis.filteredData.forEach(entry => {
                if (entry['Topic'] === "Coronary Heart Disease") {
                    vis.selectedCardioData.push(entry)
                }

                vis.allFastFoodData.forEach(change => {
                    if (change['County'] === entry['LocationDesc'] && change['State'] === entry['LocationAbbr']){
                        entry['ff_change']= 1 * change['PC_FSRSALES12']
                        entry['cardio_change']= 1 * entry["Data_Value"]
                        entry['county'] = entry["LocationDesc"]
                        entry['state'] = entry["LocationAbbr"]

                    }
                })

            })
            vis.filteredData = vis.selectedCardioData

        }

        //
        // console.log("both filtered", vis.filteredData)
        // console.log("counties", vis.counties)
        // console.log("ffd", vis.fastFoodCounties)


        vis.updateVis()

    }

    updateVis () {
        let vis = this;

        // Set up color scale
        vis.colorScale.domain([d3.min(vis.filteredData, function(d) { return d["ff_change"]; }), d3.max(vis.filteredData, function(d) { return d["ff_change"]; })])
        // console.log("color scale", vis.colorScale.domain())
        // console.log("color scale", vis.colorScale.range())
        // console.log("color scale", vis.colorScale.range())


        vis.radiusScale.domain([d3.min(vis.filteredData, function(d) { return d["cardio_change"]; }), d3.max(vis.filteredData, function(d) { return d["cardio_change"]; })])
        // console.log("radius scale", vis.radiusScale.domain())
        // console.log("radius scale", vis.radiusScale.range())
        // console.log("radius scale", vis.radiusScale(d3.max(vis.filteredData, function(d) { return d["ff_change"]; })))

        vis.geojsonLayer = L.geoJSON();

        fetch('data/usa_counties.geojson')
            .then(response => response.json())
            .then(data => {
                // Create a GeoJSON layer and add it to the map with a blue fill color
                // vis.countyMap = L.geoJSON(data, {
                //     style: {
                //         fillColor: 'blue',
                //         weight: 2,
                //         opacity: 1,
                //         color: 'white',
                //         dashArray: '3',
                //         fillOpacity: 0.7
                //     }
                // }).addTo(vis.map);
                console.log(data)

                vis.geojsonLayer.addData(data);

                // Style the counties based on a variable (e.g., using 'STATEFP' as an example)
                vis.geojsonLayer.setStyle(function (feature) {
                    let county = feature.properties;
                    return {
                        fillColor: getColor(county),
                        weight: 0.5,
                        opacity: 1,
                        color: 'white',
                        // dashArray: '3',
                        fillOpacity: 0.7
                    };
                });

                vis.geojsonLayer.addTo(vis.map);
            });

        function getColor(county){
            let color = 'transparent'
            // console.log("colorful county",county)
            vis.filteredData.forEach(function(data) {
                if (county['name'] === data['county'] && county['STATE'] === data['state']){
                    color = vis.colorScale(data['ff_change'])
                    // console.log(vis.colorScale(data['ff_change']))
                }
            })
            return color
            // return 'blue'
        }

        // Remove all circle markers from the map
        function removeAllCircleMarkers() {
            vis.map.eachLayer(layer => {
                if (layer instanceof L.CircleMarker) {
                    vis.map.removeLayer(layer);
                }
            });
        }

        removeAllCircleMarkers()

// Add circles for each location

        vis.filteredData.forEach(function(circle) {

            let popupContent =  circle.county + ", " + circle.state + "<br/>";
            let ff_change =  "Fast Food Expenditure Per Capita: $" + circle.ff_change + "</br>";
            let cardio_change =  "Cardiovascular Disease Mortality per 100,000: " + circle.cardio_change;
            popupContent += ff_change;
            popupContent += cardio_change;

            let radius
            let color

            if (circle["cardio_change"]){
                radius = vis.radiusScale(circle["cardio_change"])
                color = 'black'

            }else{
                radius = 1
                color = 'transparent'
            }

            L.circleMarker([circle["Y_lat"], circle["X_long"]],
                {
                radius: radius,
                color: color,
                fillColor: 'black',
                fillOpacity: 1,
                weight: 1
            })
                .bindPopup(popupContent)
                .addTo(vis.map).bringToFront()

        })

        // After adding both layers to the map
        // console.log(vis.map.getPane('overlayPane').children);

// Alternatively, you can use the following to log all layers (not just overlayPane)
        console.log(vis.map._layers);

        vis.legendScaleColor.domain([d3.min(vis.filteredData, function(d) { return d["ff_change"]; }), d3.max(vis.filteredData, function(d) { return d["ff_change"]; })])

        vis.legendAxisGroup
            .attr('transform', `translate(20, ${-170})`)
            .call(vis.legendAxis);

    }
}