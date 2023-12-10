class ChainByStateVis {

    constructor(parentElement, chainData, zoom) {
        this.parentElement = parentElement;
        this.chainData = chainData;
        this.zoom = zoom;
        this.selectedRestaurantName = "";
        this.initVis();
    }

    initVis(){
        let vis = this;

        vis.margin = {top: 10, right: 30, bottom: 10, left: 20};

        // Dynamically set the size of the map container
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;


        vis.mapContainer = document.getElementById('stateMapDiv');
        vis.mapContainer.style.width = vis.width + 'px';
        vis.mapContainer.style.height = vis.height + 'px';

        console.log("width", vis.width)
        console.log("width new", vis.mapContainer.style.width)

        window.addEventListener('resize', function() {
            vis.map.invalidateSize();
        });


        // init drawing area
        vis.svg = d3.select(vis.parentElement).append("svg")
            .attr("width", vis.mapContainer.style.width)
            .attr("height", vis.mapContainer.style.height)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // starting selected state
        vis.selectedState = "MA";
        // all state coordinates
        vis.stateCoord = {
            "AL": [32.3182, -86.9023],
            "AK": [64.2008, -149.4937],
            "AR": [34.9697, -92.3731],
            "AZ": [34.0489, -111.0937],
            "CA": [36.7783, -119.4179],
            "CO": [39.5501, -105.7821],
            "CT": [41.6032, -73.0877],
            "DE": [38.9108, -75.5277],
            "DC": [38.9072, -77.0369],
            "FL": [27.6648, -81.5158],
            "GA": [32.1656, -82.9001],
            "HI": [19.8968, -155.5828],
            "ID": [44.0682, -114.7420],
            "IA": [42.0046, -93.2140],
            "IL": [40.6331, -89.3985],
            "IN": [39.8494, -86.2583],
            "KS": [38.5266, -96.7265],
            "KY": [37.6681, -84.6701],
            "LA": [31.1695, -91.8678],
            "ME": [44.6939, -69.3819],
            "MD": [39.0639, -76.8021],
            "MA" :[42.4072, -71.3824],
            "MO": [38.4623, -92.3020],
            "MN": [46.2807, -94.3053],
            "MS": [32.7364, -89.6678],
            "MT": [46.8797, -110.3626],
            "MI": [44.2601, -85.4232],
            "NE": [41.4925, -99.9018],
            "NV": [38.8026, -116.4194],
            "NH": [43.1939, -71.5724],
            "NJ": [40.0583, -74.4057],
            "NM": [34.5199, -105.8701],
            "NY": [40.7128, -74.0060],
            "NC": [35.7596, -79.0193],
            "ND": [47.5515, -101.0020],
            "OH": [40.4173, -82.9071],
            "OK": [35.4676, -97.5164],
            "OR": [44.5720, -122.0709],
            "PA": [40.5908, -77.2098],
            "RI": [41.6809, -71.5118],
            "SC": [33.8569, -80.9450],
            "SD": [44.2998, -99.4388],
            "TN": [35.7478, -86.6923],
            "TX": [31.0545, -97.5635],
            "UT": [40.1500, -111.8624],
            "VT": [44.0459, -72.7107],
            "VA": [37.7693, -78.1700],
            "WA": [47.4009, -121.4905],
            "WV": [38.4912, -80.9545],
            "WI": [44.2685, -89.6165],
            "WY": [42.7559, -107.3025]
        }


        console.log("CHAINS", this.chainData)

        // set view
        vis.map = L.map('stateMapDiv').setView(vis.stateCoord[vis.selectedState], 7);

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
                "province": s.province,
                "city": s.city
            })
        })

        console.log("DISPLAYDATA:", vis.displayData);
    }

    updateState(state) {
        let vis = this;

        vis.selectedState = state;

        // Update the map view to the selected state
        if (vis.stateCoord[state]) {
            vis.map.setView(vis.stateCoord[state], 7);
        }

        // Clear existing markers
        if (vis.markers) {
            vis.markers.forEach(marker => vis.map.removeLayer(marker));
        }

        // initialize markers array
        vis.markers = [];

        // Add new markers for the selected state
        vis.displayData.forEach(function(d) {
            if (d.province === state){
                // tooltip content
                vis.tooltipContent = `<strong>${d.name}</strong><br>city: ${d.city}`;

                let marker = L.marker([d["lat"], d["lon"]])
                    .addTo(vis.map)
                    .bindTooltip(vis.tooltipContent, { permanent: false, direction: 'top' }) // Add a tooltip
                    .addTo(vis.map);
                vis.markers.push(marker); // Store the marker reference
            }
        })
    }

    updateSelectedRestaurant(restaurantName) {
        let vis = this;

        vis.selectedRestaurantName = restaurantName;
        vis.selectedChainState = vis.selectedState;
        console.log(this.selectedState)

        // Filter to see if matches the selected restaurant chain, or show all if the selected name is ""
        vis.filteredRestaurants = vis.displayData.filter(d =>
            (vis.selectedRestaurantName === "" || d.name === vis.selectedRestaurantName) &&
            d.province === vis.selectedState);

        // Clear existing markers
        if (vis.markers) {
            vis.markers.forEach(marker => vis.map.removeLayer(marker));
        }
        vis.markers = [];

        // Add new markers for the filtered data
        vis.filteredRestaurants.forEach(function(d) {
            vis.tooltipContent = `<strong>${d.name}</strong><br>city: ${d.city}`;
            let marker = L.marker([d["lat"], d["lon"]])
                .addTo(vis.map)
                .bindTooltip(vis.tooltipContent, { permanent: false, direction: 'top' }) // Add a tooltip
                .addTo(vis.map);
            vis.markers.push(marker); // Store the marker reference
        });
    }
}

function updateStateMap(stateName) {
    chainByStateVis.updateState(stateName);
}