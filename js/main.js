
let riskFactorVis;
let foodMapVis;
let stateMapVis;

// load data using promises
let promises = [
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json"), // already projected -> you can just scale it to fit your browser window
    d3.csv("data/fastFoodChains.csv"),
    d3.csv("data/fastFoodLocations.csv"),
    d3.json("data/chainLocations.geojson"),
];

Promise.all(promises)
    .then( function(data){ initMainPage(data) })
    .catch( function (err){console.log(err)} );


createVis();

function createVis() {

    //risk factor visualization
    d3.csv('data/obesity_hypertension_cholesterol.csv').then(function(data) {
        data.forEach(function(d) {
            d.Percent = +d.Percent;
        });
        riskFactorVis = new RiskFactorPrevalence("riskfactorvis", data);
    });

}

function initMainPage(allDataArray){
    foodMapVis = new FoodMapVis('mapDiv', allDataArray[0], allDataArray[1], allDataArray[2], allDataArray[3], allDataArray[4])
    stateMapVis = new StateMapVis('stateMapDiv', allDataArray[0])
}

function renderStateMap(stateIdentifier) {
    let vis = this;

    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json").then(function(us) {
        let usStates = topojson.feature(us, us.objects.states).features;
        let selectedState = usStates.find(d => d.properties.name === stateIdentifier);

        //let restaurantLocations = vis.restaurantLocationData.filter(d => d.province === stateIdentifier);

        console.log(selectedState);

        new StateMapVis("stateMapDiv", us, selectedState);
    });
}