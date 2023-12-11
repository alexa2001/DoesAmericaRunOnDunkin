class cardioMap {
    constructor(parentElement, coronaryData, fastFoodData) {
        this.parentElement = parentElement;
        this.fastFoodData = fastFoodData;
        this.coronaryData = coronaryData;

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
            .attr("width", vis.width + margin.left + margin.right)
            .attr("height", vis.height)

        // Initialize and set range of scales
        vis.colorScale = d3.scaleLinear()
            .range(['white', '#95190C']);

        vis.radiusScale = d3.scaleLinear()
            .range([1, 10])


        // Zoom for map
        vis.viewpoint = {'width': 975, 'height': 610};
        vis.zoom = vis.width / vis.viewpoint.width;

        // Create map
        vis.map = L.map('cardioMapDiv', {
            maxBounds: [
                [30, -130], // Southwest coordinates
                [50, -70]   // Northeast coordinates
            ]
        }).setView([39.8283, -98.5795], 4);

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(vis.map);

        // Create color legend scale and group
        vis.legendScaleColor = d3.scaleOrdinal()
            .range([0, (4*vis.width/5)]);

        vis.legend = vis.svg.append("g")
            .attr('class', 'legend')
            .attr('transform', `translate(20, ${vis.height + 65})`)

        // Create radius legend group
        vis.radiusLegend = vis.svg.append("g")
            .attr('class', 'legend')
            .attr('transform', `translate(20, ${vis.height + 100})`)

        vis.legendAxisGroup = vis.legend.append("g")
            .attr("class", "legend-axis")

        // Create linear color gradient to use for legend
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
            .attr("stop-color", '#95190C')
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

        // Create age and cardiovascular disease select boxes and input options
        let cardioSelectBox = vis.svg.append("foreignObject")
            .attr("x", "5vh")
            .attr("y", 10)
            .attr("width", "30vh")
            .attr("height", 30)
            .attr("class", "select-box")
            .append("xhtml:body")
            .html('<select id="cardioSelect" class="form-select" aria-label= "Default select example" style="width: 30vh"></select>');

        let ageSelectBox = vis.svg.append("foreignObject")
            .attr("x", "5vh")
            .attr("y", 60)
            .attr("width", "30vh")
            .attr("height", 30)
            .attr("class", "select-box")
            .append("xhtml:body")
            .html('<select id="ageSelect" class="form-select" aria-label= "Default select example" style="width: 30vh"></select>');

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

        // Change displayed data based on selections
        d3.select("#ageSelect").on("change", function() {
            vis.selectedAge = d3.select(this).property("value");

            // Call updateVis() when the selection changes
            vis.wrangleData();
        });

        d3.select("#cardioSelect").on("change", function() {
            vis.selectedCardio = d3.select(this).property("value");

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


        // Filter by selected age group
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

        // Filter by selected type of coronary heart disease
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


        vis.updateVis()

    }

    updateVis () {
        let vis = this;

        // Set up color scale domain
        vis.colorScale.domain([d3.min(vis.filteredData, function(d) { return d["ff_change"]; }), d3.max(vis.filteredData, function(d) { return d["ff_change"]; })])

        // Set up radius scale domain
        vis.radiusScale.domain([d3.min(vis.filteredData, function(d) { return d["cardio_change"]; }), d3.max(vis.filteredData, function(d) { return d["cardio_change"]; })])

        // Set up radius legend data
        vis.min = d3.min(vis.filteredData, function(d) { return d["cardio_change"]; })
        vis.max = d3.max(vis.filteredData, function(d) { return d["cardio_change"]; })
        vis.range = vis.max - vis.min
        vis.mid1 = vis.range/3 + vis.min
        vis.mid2 = 2*vis.range/3 + vis.min
        vis.radiusLegendData = [vis.min, vis.mid1, vis.mid2, vis.max]
        vis.radiusLabelData = [vis.min, vis.max]

        // Enter, update, exit radius legend circles and labels
        vis.circles = vis.radiusLegend.selectAll("circle")
            .data(vis.radiusLegendData)

        vis.circles
            .enter()
            .append("circle")
            .attr("cx", (d,i) => i * 40 + 40)
            .attr("cy", -150)
            .attr("r", (d) => vis.radiusScale(d))
            .merge(vis.circles)
            .attr("fill", "black")

        vis.radiusLabels = vis.radiusLegend.selectAll("text.label")
            .data(vis.radiusLabelData)

        vis.radiusLabels
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("x", (d,i) => i * 110 - 15 + 40)
            .attr("y", -110)
            .merge(vis.radiusLabels)
            .attr("fill", "black")
            .text(function (d) {
                return d.toFixed(2)
            })

        vis.geojsonLayer = L.geoJSON();

        // Add the county layer to the map
        fetch('data/usa_counties.geojson')
            .then(response => response.json())
            .then(data => {
                vis.countyMap = L.geoJSON(data, {
                    style: {
                        fillColor: 'transparent',
                        opacity: 1,
                        color: 'transparent',
                        dashArray: '3',
                        fillOpacity: 1
                    }
                }).addTo(vis.map);

                // Style the counties
                vis.countyMap.setStyle(function (feature) {
                    let county = feature.properties;
                    return {
                        fillColor: getColor(county),
                        weight: 0.5,
                        opacity: 1,
                        color: 'transparent',
                        dashArray: '3',
                        fillOpacity: 1
                    }})

                vis.countyMap.addTo(vis.map);

                // Remove all circle markers from the map
                function removeAllCircleMarkers() {
                    vis.map.eachLayer(layer => {
                        if (layer instanceof L.CircleMarker) {
                            vis.map.removeLayer(layer);
                        }
                    });
                }

                // Remove all circle markers
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
                    let opacity
                    let stroke

                    if (circle["cardio_change"]){
                        radius = vis.radiusScale(circle["cardio_change"])
                        color = 'black'
                        opacity = 0.3
                        stroke = 'black'

                    }else{
                        radius = 1
                        color = 'transparent'
                    }

                    // Create circles with fast food and cardio info
                    L.circleMarker([circle["Y_lat"], circle["X_long"]],
                        {
                            radius: radius,
                            color: color,
                            fillColor: 'black',
                            fillOpacity: 0.3,
                            weight: 1
                        })
                        .bindPopup(popupContent)
                        .addTo(vis.map).bringToFront()

                })
            });

        // Color based on scale of fast food
        function getColor(county){
            let color = 'transparent'

            vis.filteredData.forEach(function(data) {
                if (county['name'] === data['county'] && county['STATE'] === data['state']){
                    color = vis.colorScale(data['ff_change'])
                }
            })
            return color
        }

        // Create color legend axis
        vis.legendScaleColor.domain([d3.min(vis.filteredData, function(d) { return d["ff_change"]; }), d3.max(vis.filteredData, function(d) { return d["ff_change"]; })])

        vis.legendAxisGroup
            .attr('transform', `translate(20, ${-170})`)
            .call(vis.legendAxis);

    }
}
