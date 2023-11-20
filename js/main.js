/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables & switches
let myRankChart;


// load data using promises
let promises = [

    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"),  // not projected -> you need to do it
    d3.csv("data/Top 50 Fast-Food Chains in USA.csv"),
    d3.csv("data/cause_of_death.csv")
];

Promise.all(promises)
    .then(function (data) {
        initMainPage(data)
    })
    .catch(function (err) {
        console.log(err)
    });

// initMainPage
function initMainPage(dataArray) {

    // log data
    console.log('check out the data', dataArray);

    // init rank chart
    myRankChart = new rankChart('rankChart', dataArray[2]);

}


