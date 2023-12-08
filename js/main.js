
/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

let riskFactorVis;
let foodMapVis;
let stateMapVis;
let myRankChart;
let medianIncomeVis;
let chainByStateVis;
let cardioMapVis;
let brushVis;
let titlePage;
let chainSalesVis;

// load data using promises
let promises = [
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json"), // already projected -> you can just scale it to fit your browser window
    d3.csv("data/fastFoodChains.csv"),
    d3.csv("data/fastFoodLocations.csv"),
    d3.json("data/chainLocations.geojson"),
    d3.csv("data/cause_of_death.csv"),
    d3.csv("data/top-50-fast-food-chains.csv"),
    d3.csv("data/stateIncome.csv"),
    d3.csv("data/coronary_2012.csv"),
    // d3.csv("data/coronary_heart_disease_mortality.csv"),
    d3.csv("data/fast_food_change.csv"),
    // d3.json("data/usa_counties.geojson")
    d3.csv("data/cause_of_death_definitions.csv")
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
    titlePage = new TitlePage('titlePage');
    chainByStateVis = new ChainByStateVis('stateMapDiv', allDataArray[2], [42.3601, -71.0589]);
    foodMapVis = new FoodMapVis('mapDiv', allDataArray[0], allDataArray[1], allDataArray[2], allDataArray[3], allDataArray[4])
    stateMapVis = new StateMapVis('stateMapDiv', allDataArray[0], allDataArray[2])
    myRankChart = new rankChart('rankChart', allDataArray[4], allDataArray[9]);
    chainSalesVis = new ChainSalesVis('salesDiv', allDataArray[1], allDataArray[2]);
    medianIncomeVis = new medianIncome('medianIncome', allDataArray[6], allDataArray[2]);
    cardioMapVis = new cardioMap('cardioSelectDiv', allDataArray[7], allDataArray[8], allDataArray[2])
}


// Respond to user input
document.getElementById('restaurantSelect').addEventListener('change', function() {
    let selectedRestaurant = this.value;
    chainByStateVis.updateSelectedRestaurant(selectedRestaurant);
    chainSalesVis.updateSelectedChain(selectedRestaurant);
});
