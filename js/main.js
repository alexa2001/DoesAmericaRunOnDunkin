
/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

let riskFactorVis;
let foodMapVis;
let stateMapVis;
let myRankChart;
let medianIncomeVis;
let chainByStateVis;

// load data using promises
let promises = [
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json"), // already projected -> you can just scale it to fit your browser window
    d3.csv("data/fastFoodChains.csv"),
    d3.csv("data/fastFoodLocations.csv"),
    d3.json("data/chainLocations.geojson"),
    d3.csv("data/cause_of_death.csv"),
    d3.csv("data/top-50-fast-food-chains.csv"),
    d3.csv("data/stateIncome.csv"),

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
    chainByStateVis = new ChainByStateVis('chainVis', allDataArray[2], [42.3601, -71.0589]);
    foodMapVis = new FoodMapVis('mapDiv', allDataArray[0], allDataArray[1], allDataArray[2], allDataArray[3], allDataArray[4])
    stateMapVis = new StateMapVis('stateMapDiv', allDataArray[0], allDataArray[2])
    myRankChart = new rankChart('rankChart', allDataArray[4]);
    medianIncomeVis = new medianIncome('medianIncome', allDataArray[6], allDataArray[2]);

}

// document.getElementById('restaurantSelect').addEventListener('change', function() {
//     let selectedRestaurant = this.value;
//     stateMapVis.updateSelectedRestaurant(selectedRestaurant);
// });