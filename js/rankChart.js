class rankChart {
    constructor(parentElement, causeOfDeathData, causeDefinitions) {
        this.parentElement = parentElement;
        this.data = causeOfDeathData;
        this.displayData = this.data;
        this.definitions = causeDefinitions

        // Parse date method
        this.parseDate = d3.timeParse("%Y");

        // Define colors to use for color scale
        this.colors = ["#FFFFFF", "#8A3324",
            "#FF4D4D", "#FF0000",
            "#FFA07A", "#FF8C00",
            '#d3a27f', "#FFCC00",
            "#8B4513",
            '#8b0000','#b2182b',
            "#000000", "#333333",
            "#FF6347", "#FF4500",
            "#FFA500", '#FC670F',
            "#FFFF00", '#d6604d',
            "#B8860B", "#D2691E",
            '#fddbc7', "#666666"
        ]

        this.initVis()
    }

    initVis() {
        let vis = this;

        // Set sizing and margins
        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height;
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;

        // Initialize drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`)

        // Initialize scales
        vis.x = d3.scaleTime().range([3*vis.margin.right, vis.width - vis.margin.right]);
        vis.y = d3.scaleLinear().range([vis.height - 3 * vis.margin.top, 2 * vis.margin.top]);

        // Define transformations
        vis.xTransform = vis.height - 5 * vis.margin.top / 2
        vis.rightYTransform = vis.width - vis.margin.right

        // Initialize x & y axis
        vis.xAxis = vis.svg.append("g")
            .attr("class", "rank-axis axis axis--x")
            .attr("transform", "translate(0," + vis.xTransform + ")");
        vis.yAxis = vis.svg.append("g")
            .attr("class", "rank-axis axis axis--y")
            .attr("transform", "translate(" + 3 * vis.margin.right + ", -0)");
        vis.rightYAxis = vis.svg.append("g")
            .attr("class", "rank-axis axis axis--y")
            .attr("transform", "translate(" + vis.rightYTransform + ", 0)");

        vis.xAxis.append("text")
            .style("fill", "black")
            .attr("font-weight", 5)
            .style("font-size", "16px")
            .attr("x", vis.width/2)
            .attr("y", 40)
            .text("Year")

        vis.yAxis.append("text")
            .style("fill", "black")
            .attr("font-weight", 5)
            .style("font-size", "16px")
            .attr("text-anchor", "middle")
            .attr("x", -vis.height/2)
            .attr("y", -40)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Cause of Death Ranking")


        // Initialize legend sizing and drawing area
        vis.legendElement = "rankLegend"

        vis.legendheight = document.getElementById(vis.legendElement).getBoundingClientRect().height;
        vis.legendwidth = document.getElementById(vis.legendElement).getBoundingClientRect().width - vis.margin.right;

        vis.legendsvg = d3.select("#" + vis.legendElement).append("svg")
            .attr("width", vis.legendwidth)
            .attr("height", vis.legendheight)

        // Initialize color and legend scales
        vis.colorScale = d3.scaleOrdinal()
            .range(vis.colors)

        vis.legendScaleColor = d3.scaleOrdinal()
            .range([0, (4*vis.width/5)]);

        // Initialize legend and legend tooltip
        vis.legend = vis.legendsvg.append("g")
            .attr('class', 'legend')
            .attr('transform', `translate(20, ${vis.height - 150})`)

        vis.legendTooltip = d3.select("#" + vis.legendElement).append('div')
            .attr('class', "rank-tooltip tooltip")
            .attr('id', 'rankLegendTooltip')
            .style("z-index", 1)
            .style("position", "absolute")
            .style("padding", "10px")

        // Create legend tooltip
        vis.tooltip = d3.select("#" + vis.parentElement).append('div')
            .attr('class', "rank-tooltip tooltip")
            .attr('id', 'rankTooltip')
            .style("z-index", 1)
            .style("position", "absolute")
            .style("padding", "10px")

        // Init pathGroup for rank chart lines
        vis.pathGroup = vis.svg.append('g').attr('class', 'pathGroup')

        // Define function for line
        vis.line = d3.line()
            .x(function (d) {
                return vis.x(d.data.date);
            })
            .y(function (d) {
                return vis.y(d.data.rank);
            });

        // Create select box for state
        let selectBox = vis.legendsvg.append("foreignObject")
            .attr("x", 20)
            .attr("y", 10)
            .attr("width", "30vh")
            .attr("height", 40)
            .attr("class", "select-box")
            .append("xhtml:body")
            .html('<select id="rankSelect" class="form-select" aria-label= "Default select example" style="width: 30vh"></select>');

        vis.allStates = [["All States"],
            ['Alabama', 'AL'],
            ['Alaska', 'AK'],
            ['Arizona', 'AZ'],
            ['Arkansas', 'AR'],
            ['California', 'CA'],
            ['Colorado', 'CO'],
            ['Connecticut', 'CT'],
            ['Delaware', 'DE'],
            ['District of Columbia', 'DC'],
            ['Florida', 'FL'],
            ['Georgia', 'GA'],
            ['Hawaii', 'HI'],
            ['Idaho', 'ID'],
            ['Illinois', 'IL'],
            ['Indiana', 'IN'],
            ['Iowa', 'IA'],
            ['Kansas', 'KS'],
            ['Kentucky', 'KY'],
            ['Louisiana', 'LA'],
            ['Maine', 'ME'],
            ['Maryland', 'MD'],
            ['Massachusetts', 'MA'],
            ['Michigan', 'MI'],
            ['Minnesota', 'MN'],
            ['Mississippi', 'MS'],
            ['Missouri', 'MO'],
            ['Montana', 'MT'],
            ['Nebraska', 'NE'],
            ['Nevada', 'NV'],
            ['New Hampshire', 'NH'],
            ['New Jersey', 'NJ'],
            ['New Mexico', 'NM'],
            ['New York', 'NY'],
            ['North Carolina', 'NC'],
            ['North Dakota', 'ND'],
            ['Ohio', 'OH'],
            ['Oklahoma', 'OK'],
            ['Oregon', 'OR'],
            ['Pennsylvania', 'PA'],
            ['Rhode Island', 'RI'],
            ['South Carolina', 'SC'],
            ['South Dakota', 'SD'],
            ['Tennessee', 'TN'],
            ['Texas', 'TX'],
            ['Utah', 'UT'],
            ['Vermont', 'VT'],
            ['Virginia', 'VA'],
            ['Washington', 'WA'],
            ['West Virginia', 'WV'],
            ['Wisconsin', 'WI'],
            ['Wyoming', 'WY']]

        let options = d3.select("#rankSelect")
            .selectAll("rank-option")
            .data(vis.allStates)
            .enter()
            .append("option")
            .text((d) => d[0]);

        // Change rank chart based on selected state
        d3.select("#rankSelect").on("change", function () {
            vis.selectedState = d3.select(this).property("value");

            // Call wrangleData() when the selection changes
            vis.wrangleData();
        });

        vis.wrangleData()
    }

    wrangleData() {
        let vis = this;

        vis.allData = this.displayData;

        // Sort data in order of highest number of deaths
        vis.allData.sort((a, b) => b["Deaths"] - a["Deaths"])

        vis.selectedData = [];

        // Convert years into date format
        vis.allData.forEach(row => {
            if (vis.parseDate(row["Year"]) !== null) {
                row["Year"] = vis.parseDate(row["Year"])
            }
        })

        // Filter based on selected state
        if (vis.selectedState) {
            if (vis.selectedState === 'All States') {
                vis.filteredData = vis.allData
            } else {
                vis.allData.forEach((entry, index) => {

                    if (vis.selectedState === entry['State']) {
                        vis.selectedData.push(entry)
                    }
                })
                vis.filteredData = vis.selectedData
            }
        } else {
            vis.filteredData = vis.allData
        }

        // Group data by year
        let sumDataByState = Array.from(d3.group(vis.filteredData, d => d["Year"]), ([key, value]) => ({key, value}))

        vis.dataLines = [];
        vis.dataDates = [];
        vis.causes = [];
        vis.dataByDate = [];
        let value = [];

        // Loop through each year
        sumDataByState.forEach((year, index) => {

            // Add year to array
            vis.dataDates.push(year.key)

            vis.causes = []
            value[index] = [];

            // Go through each entry in each year
            year.value.forEach((entry, i) => {

                // Sum deaths for each cause of death and store in vis.causes array
                if (!vis.causes[entry["Cause of death"]]) {
                    vis.causes[entry["Cause of death"]] = 0
                }
                entry['Deaths'] = 1 * entry['Deaths']
                vis.causes[entry["Cause of death"]] += entry['Deaths']

            })

            // Create new array with causes and deaths stored as keys and values
            Object.keys(vis.causes).forEach(cause => {
                    value[index].push({cause: cause, deaths: vis.causes[cause]})
                }
            )

            // Sort highest causes of death within each year
            value[index].sort((a, b) => b["Deaths"] - a["Deaths"])

            // Assign rank to top 5 causes of death and store key info
            value[index].forEach((entry, i) => {
                if (i < 5) {
                    entry.rank = i + 1;
                    vis.dataLines.push(
                        {date: year.key, cause: entry.cause, rank: entry.rank, deaths: entry.deaths}
                    )
                } else {
                    vis.dataLines.push(
                        {date: year.key, cause: entry.cause, rank: null, deaths: entry.deaths}
                    )
                }
            })

        })

        // Group data by cause of death
        vis.dataByCause = Array.from(d3.group(vis.dataLines, d => d["cause"]), ([cause, data]) => ({cause, data}))

        vis.topCauses = []
        vis.uniqueCauses = new Set();


        // Loop through each cause of death
        vis.dataByCause.forEach((cause, index) => {

            // Sort by year
            cause.data.sort((a, b) => {
                return a["date"] - b["date"];
            })

            cause.data.forEach((entry, i) => {
                if (entry.rank !== null && !vis.uniqueCauses.has(cause.cause)) {
                    vis.topCauses.push(cause)
                    vis.uniqueCauses.add(cause.cause)
                }
            })
        })

        vis.updateVis()
    }

    updateVis() {

        let vis = this;

        // Update scale domains
        vis.x.domain(d3.extent(vis.dataDates, function (d) {
            return d
        }));
        vis.y.domain([5, 1]);
        vis.colorScale.domain(vis.topCauses, function (d) {
            return d.cause
        })


        // Draw x & y axes
        vis.xAxis.transition().duration(400).call(d3.axisBottom(vis.x).tickFormat(d3.timeFormat("%Y")));
        vis.yAxis.transition().duration(400).call(d3.axisLeft(vis.y).ticks(5));
        vis.rightYAxis.transition().duration(400).call(d3.axisRight(vis.y).ticks(5));

        // Create rectangles and labels for legend
        const rects = vis.legend.selectAll("rect")
            .data(vis.topCauses);

        rects.exit()
            .transition()
            .duration(400)
            .style("opacity", 0)
            .remove();

        const labels = vis.legend.selectAll("text")
            .data(vis.topCauses);

        labels.exit()
            .transition()
            .duration(400)
            .style("opacity", 0)
            .remove();

        // Drank ranking line for each cause of death in top 5
        vis.dataByCause.forEach((cause, index) => {
            const lineGenerator = d3.line()
                .defined((d) => d.rank !== null)
                .x(d => vis.x(d.date))
                .y(d => vis.y(d.rank));

            // Select paths inside the loop
            const paths = vis.pathGroup.selectAll(`.path-${index}`)
                .data([cause.data]);

            // ENTER
            paths.enter()
                .append("path")
                .attr("class", `path-${index}`)
                .attr("fill", "none")
                .attr("stroke-width", 2)
                .attr("stroke", (d, i) => vis.colorScale(d[i].cause))
                .attr("d", lineGenerator)
                .style("opacity", 0)
                .transition()
                .duration(400)
                .style("opacity", 1);

            // UPDATE
            paths.transition()
                .duration(400)
                .attr("d", lineGenerator)
                .attr("stroke", (d, i) => vis.colorScale(d[i].cause));

            // EXIT
            paths.exit()
                .transition()
                .duration(400)
                .style("opacity", 0)
                .remove();

            // Remove old circles
            vis.pathGroup.selectAll(`.circle-${index}`)
                .exit()
                .transition()
                .duration(400)
                .style("opacity", 0)
                .remove();

            // Circle and Tooltip Creation
            cause.data.forEach((date, i) => {
                if (date.rank !== null) {
                    const circles = vis.pathGroup.selectAll(`.circle-${index}-${i}`)
                        .data([date]);

                    // ENTER
                    circles.enter()
                        .append("circle")
                        .attr("class", `circle-${index}-${i}`)
                        .attr("class", `circle-${index}`)
                        .attr("cx", vis.x(date.date))
                        .attr("cy", vis.y(date.rank))
                        .attr("r", 4)
                        .attr("fill", vis.colorScale(date.cause))
                        .attr("stroke", vis.colorScale(date.cause))
                        .attr("stroke-width", 1)
                        .style("opacity", 0)
                        .on('mouseover', function(event, d){
                            d3.select(this)
                                .attr('stroke', vis.colorScale(date.cause))
                                .attr('fill', 'black')

                            // update tooltip with data
                            vis.tooltip
                                .style("opacity", 1)
                                .html(`
                                 <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 15px">
                                     <h3>${date.cause}<h3>
                                     <h4> Year: ${d3.timeFormat("%Y")(date.date)}</h4>
                                     <h4> Deaths: ${d3.format(",")(date.deaths)}</h4>
                                     <h4> Rank: ${(date.rank)}</h4>
                                 </div>`);

                            // Adjust tooltip position dynamically to prevent overflow
                            const tooltipWidth = vis.tooltip.node().offsetWidth;
                            const tooltipHeight = vis.tooltip.node().offsetHeight;

                            const xPosition = event.pageX + 20;
                            const yPosition = event.pageY;

                            const rightOverflow = xPosition + tooltipWidth > window.innerWidth;
                            const bottomOverflow = yPosition + tooltipHeight > window.innerHeight;

                            if (rightOverflow) {
                                vis.tooltip.style("left", event.pageX - tooltipWidth - 20 + "px");
                            } else {
                                vis.tooltip.style("left", xPosition + "px");
                            }

                            if (bottomOverflow) {
                                vis.tooltip.style("top", event.pageY - tooltipHeight + "px");
                            } else {
                                vis.tooltip.style("top", yPosition + "px");
                            }
                        })
                        .on('mouseout', function(event, d){
                            d3.select(this)
                                .attr('stroke', vis.colorScale(date.cause))
                                .attr('fill', vis.colorScale(date.cause))

                            // hide tooltip
                            vis.tooltip
                                .style("opacity", 0)
                                .style("left", 0 + "px")
                                .style("top", 0 + "px")
                                .html(`
                            `);
                        })
                        .transition()
                        .duration(400)
                        .style("opacity", 1);

                    // EXIT
                    circles.exit()
                        .transition()
                        .duration(400)
                        .style("opacity", 0)
                        .remove();
                }

            });

            // Display legend with top causes of death for selected state
            vis.topCauses.forEach((cause, index) => {
                vis.legendBoxes = vis.legend.selectAll(`.rect-${index}`)
                    .data([cause.data]);

                vis.legendBoxes.exit()
                    .transition()
                    .duration(400)
                    .style("opacity", 0)
                    .remove();

                vis.labels = vis.legend.selectAll(`.text-${index}`)
                    .data([cause.data]);

                vis.labels.exit()
                    .transition()
                    .duration(400)
                    .style("opacity", 0)
                    .remove();

                vis.legendBoxes
                    .enter()
                    .append("rect")
                    .attr("class",`rect-${index}`)
                    .attr("y", -350 + index * 40)
                    .attr("x", 0)
                    .attr("height", 20)
                    .attr("width", 20)
                    // .attr("r", 20)
                    .merge(vis.legendBoxes)
                    .attr("fill", (d, i) => vis.colorScale(d[i].cause))

                // Display shortened name in legend
                function shortenCause(cause){
                    let causeName = null
                    vis.definitions.forEach(definition => {
                        if (definition.Cause === cause){
                            causeName = definition.Shorthand
                        }
                    })
                    return causeName
                }

                vis.labels
                    .enter()
                    .append("text")
                    .attr("class", `text-${index}`)
                    .attr("y", -335 + index * 40)
                    .attr("x", 40)
                    .attr("fill", "black")
                    .merge(vis.labels)
                    .text(shortenCause(cause.cause))


                // Define each cause of death
                function defineCause(cause){
                    let causeDefinition = null
                    vis.definitions.forEach(definition => {
                        if (definition.Cause === cause){
                            causeDefinition = definition.Meaning
                        }
                    })
                    return causeDefinition
                }

                vis.labels
                    .on('mouseover', function(event, d){
                        d3.select(this)
                            .attr("fill", "white")

                        // update tooltip with data
                        vis.legendTooltip
                            .style("opacity", 1)
                            .html(`
                                 <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                                     <h4> ${defineCause(cause.cause)}</h4>
                                 </div>`);

                        // Adjust tooltip position dynamically
                        const tooltipWidth = vis.tooltip.node().offsetWidth;
                        const tooltipHeight = vis.tooltip.node().offsetHeight;

                        const xPosition = event.pageX + 20;
                        const yPosition = event.pageY;

                        const rightOverflow = xPosition + tooltipWidth > window.innerWidth;
                        const bottomOverflow = yPosition + tooltipHeight > window.innerHeight;

                        if (rightOverflow) {
                            vis.legendTooltip.style("left", event.pageX - tooltipWidth - 20 + "px");
                        } else {
                            vis.legendTooltip.style("left", xPosition + "px");
                        }

                        if (bottomOverflow) {
                            vis.legendTooltip.style("top", event.pageY - tooltipHeight + "px");
                        } else {
                            vis.legendTooltip.style("top", yPosition + "px");
                        }
                    })
                    .on('mouseout', function(event, d){
                        d3.select(this)
                            .attr('fill', "black")

                        // hide tooltip
                        vis.legendTooltip
                            .style("opacity", 0)
                            .style("left", 0 + "px")
                            .style("top", 0 + "px")
                            .html(`
                            `);
                    })

            })

        })

    }

}
