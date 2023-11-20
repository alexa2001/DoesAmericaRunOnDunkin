class rankChart {
    constructor(parentElement, causeOfDeathData) {
        this.parentElement = parentElement;
        this.data = causeOfDeathData;
        this.displayData = this.data;

        // parse date method
        this.parseDate = d3.timeParse("%Y");

        // define colors
        this.colors = ['#fddbc7', '#f4a582', '#d6604d', '#b2182b', '#FF0000', '#FC670F', '#FAB82D', '#FA9D2D', '#FF5329', '#FAC906']

        console.log(this.displayData)

        this.initVis()
    }

    initVis() {
        let vis = this;

        // set margins, width, and height
        vis.margin = {top: 20, right: 20, bottom: 150, left: 100};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`)
            // .style("z-index", -1);

        // add title
        vis.svg.append('g')
            .attr('class', 'title')
            .attr('id', 'rank-title')
            .append('text')
            .text('Top 5 Causes of Death')
            .attr('transform', `translate(${vis.width / 2}, 30)`)
            .attr('text-anchor', 'middle');

        // init scales
        vis.x = d3.scaleTime().range([vis.margin.right, vis.width - vis.margin.right]);
        vis.y = d3.scaleLinear().range([vis.height - 2 * vis.margin.top, 2 * vis.margin.top]);

        vis.xTransform = vis.height - 3*vis.margin.top/2
        vis.rightYTransform = vis.width - vis.margin.right

        // init x & y axis
        vis.xAxis = vis.svg.append("g")
            .attr("class", "rank-axis axis axis--x")
            .attr("transform", "translate(0," + vis.xTransform + ")");
        vis.yAxis = vis.svg.append("g")
            .attr("class", "rank-axis axis axis--y")
            .attr("transform", "translate(" + vis.margin.right + ", 0)");
        vis.rightYAxis = vis.svg.append("g")
            .attr("class", "rank-axis axis axis--y")
            .attr("transform", "translate(" + vis.rightYTransform + ", 0)");

        // create tooltip
        vis.tooltip = d3.select("#" + vis.parentElement).append('div')
            .attr('class', "rank-tooltip tooltip")
            .attr('id', 'rankTooltip')
            .style("z-index", 1)
            .style("position", "absolute")
            .style("padding", "10px")

        // init pathGroup
        vis.pathGroup = vis.svg.append('g').attr('class', 'pathGroup')

        // init path
        vis.path = vis.pathGroup
            .append('path')
            .attr("class", "rank-path path")


        vis.line = d3.line()
            .x(function (d) {
                return vis.x(d.data.date);
            })
            .y(function (d) {
                return vis.y(d.data.rank);
            });

        vis.wrangleData()
    }

    wrangleData () {
        let vis = this;

        vis.filteredData = this.displayData;

        vis.filteredData.sort((a,b) => b["Deaths"] - a["Deaths"])

        vis.filteredData.forEach(row => {
            row["Year"] = vis.parseDate(row["Year"])
        })

        // TO-DO: implement filter by state
        // if (selectedState !== '') {
        //     vis.filteredData.forEach(date => {
        //         if (selectedState === date.state) {
        //             vis.filteredData.push(date)
        //         }
        //     })
        // }


        let sumDataByState = Array.from(d3.group(vis.filteredData, d => d["Year"]), ([key, value]) => ({key, value}))
        console.log("data by data", sumDataByState)

        vis.dataLines = [];
        vis.dataDates = [];
        vis.causes = [];
        vis.dataByDate = [];

        let value = [];
        sumDataByState.forEach((year, index)=> {
            vis.dataDates.push(year.key)
            vis.causes = []
            value[index] = [];


            year.value.forEach((entry, i) => {

                if (!vis.causes[entry["Cause of death"]]) {
                    vis.causes[entry["Cause of death"]] = 0
                }
                entry['Deaths'] = 1 * entry['Deaths']
                vis.causes[entry["Cause of death"]] += entry['Deaths']

            })
            Object.keys(vis.causes).forEach(cause => {
                value[index].push({cause: cause, deaths: vis.causes[cause]})
                }
            )
            value[index].sort((a,b) => b["Deaths"] - a["Deaths"])
            value[index].forEach((entry, i) => {
                if (i < 5){
                    entry.rank = i + 1;
                    vis.dataLines.push(
                            {date: year.key, cause: entry.cause, rank: entry.rank, deaths: entry.deaths}
                        )
                }
                else{
                    vis.dataLines.push(
                        {date: year.key, cause: entry.cause, rank: null, deaths: entry.deaths}
                    )
                }
            })

        })
        // console.log("data lines", vis.dataLines)

        vis.dataByCause = Array.from(d3.group(vis.dataLines, d => d["cause"]), ([cause, data]) => ({cause, data}))

        console.log("data by cause", vis.dataByCause)
        console.log("data within rank", vis.dataByCause[0]["data"][0]["date"])

        vis.dataByCause.forEach((cause, index) => {
            cause.data.sort((a, b) => {
                return a["date"] - b["date"];
            })
            cause.data.forEach((entry, i) => {
                vis.dataByCause[index].data[i].color =  this.colors[index]
            })
        })
        console.log("rank", vis.dataByCause)

        vis.updateVis()
    }

    updateVis () {

        let vis = this;

        // update domains
        vis.x.domain(d3.extent(vis.dataDates, function (d) {
            return d
        }));
        vis.y.domain([5, 1]);

        // draw x & y axis
        vis.xAxis.transition().duration(400).call(d3.axisBottom(vis.x).tickFormat(d3.timeFormat("%Y")));
        vis.yAxis.transition().duration(400).call(d3.axisLeft(vis.y).ticks(5));
        vis.rightYAxis.transition().duration(400).call(d3.axisRight(vis.y).ticks(5));


        vis.dataByCause.forEach((cause, index) => {
            const lineGenerator = d3.line()
                .defined((d) => d.rank !== null)
                .x(d => vis.x(d.date))
                .y(d => vis.y(d.rank));


            vis.pathGroup.append("path")
                .data([cause.data])
                .attr("d", lineGenerator)
                .attr("fill", "none")
                .attr("stroke", (d, i) => d[i].color)
                .attr("stroke-width", 2);

            cause.data.forEach(date => {
                if (date.rank !== null){
                vis.pathGroup.append("circle")
                    .data([date])
                    .attr("cx", vis.x(date.date))
                    .attr("cy", vis.y(date.rank))
                    .attr("r", 4)
                    .attr("fill", date.color)
                    .attr("stroke", date.color)
                    .attr("stroke-width", 1)
                    .on('mouseover', function(event, d){
                        console.log(event, d)
                        d3.select(this)
                            .attr('stroke', date.color)
                            .attr('fill', 'black')

                        // update tooltip with data
                        vis.tooltip
                            .style("opacity", 1)
                            .style("left", event.pageX + 20 + "px")
                            .style("top", event.pageY + "px")
                            .html(`
                             <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                                 <h3>${date.cause}<h3>
                                 <h4> Date: ${d3.timeFormat("%Y")(date.date)}</h4>
                                 <h4> Deaths: ${d3.format(",")(date.deaths)}</h4>
                                 <h4> Rank: ${(date.rank)}</h4>                     
                             </div>`);
                    })
                    .on('mouseout', function(event, d){
                        // console.log(event, d)
                        d3.select(this)
                            .attr('stroke', date.color)
                            .attr('fill', date.color)

                        // hide tooltip
                        vis.tooltip
                            .style("opacity", 0)
                            .style("left", 0 + "px")
                            .style("top", 0 + "px")
                            .html(`
                        `);
                    })}
            })
        });


    }
}