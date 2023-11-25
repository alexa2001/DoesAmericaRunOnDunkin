class RiskFactorPrevalence{
    constructor(_parentElement, _data){
        this.parentElement = _parentElement;
        this.data = _data;

        this.initVis();
    }

    initVis(){
        let vis = this;
        // console.log(vis.data);

        vis.margin = {top: 20, right: 20, bottom: 20, left: 40};
        // vis.width = 700;
        vis.height = 700;
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        // vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.obesityLabel = vis.svg.append('text')
            .attr("class", "label")
            .attr('x', vis.width/2) // X-coordinate of the text
            .attr('y',40) // Y-coordinate of the text
            .attr('fill', 'black') // Text color
            .attr("text-anchor", "middle")
            .attr('font-size', '20px') // Font size
            .attr('font-weight', 'bold')
            .text("Obesity");

        vis.hypertensionLabel = vis.svg.append('text')
            .attr("class", "label")
            .attr('x', vis.width/2) // X-coordinate of the text
            .attr('y',240) // Y-coordinate of the text
            .attr('fill', 'black') // Text color
            .attr("text-anchor", "middle")
            .attr('font-size', '20px') // Font size
            .attr('font-weight', 'bold')
            .text("Hypertension");

        vis.highcholesterolLabel = vis.svg.append('text')
            .attr("class", "label")
            .attr('x', vis.width/2) // X-coordinate of the text
            .attr('y',485) // Y-coordinate of the text
            .attr('fill', 'black') // Text color
            .attr("text-anchor", "middle")
            .attr('font-size', '20px') // Font size
            .attr('font-weight', 'bold')
            .text("High Cholesterol");

        vis.ages = vis.svg.append("text")
            .attr("x", 0)
            .attr("y", 0)
            .attr('font-size', '18px') // Font size
            .text("Select Age Group:")
        ;

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
            .data(["20 and over", "20-39", "40-59", "60 and over"])
            .enter()
            .append("option")
            .text(d => d);

        d3.select("#mySelect").on("change", function() {
            const selectedOption = d3.select(this).property("value");
            // console.log("Selected option:", selectedOption);

            // Call updateVis() when the selection changes
            vis.updateVis(selectedOption);
        });

        vis.wrangleData();



    }

    wrangleData(){
        let vis = this;
        vis.obesity = [];
        vis.hypertension = [];
        vis.highcholesterol = [];

        vis.data.forEach(function(d){
            if (d.Measure === "Obesity"){
                vis.obesity.push(d);
            }
            else if (d.Measure === "Hypertension"){
                vis.hypertension.push(d);
            }
            else{
                vis.highcholesterol.push(d);
            }
        });



        vis.updateVis("20 and over");

    }
    updateVis(selectedOption){
        let vis = this;

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'tooltip')

        //OBESITY
        vis.filteredObesityCircles = vis.obesity.filter(function(d){
            return (d.AgeGroup === selectedOption) && (d.Sex === "All");
        });

        vis.xScale = d3.scaleLinear()
            .domain([0, vis.filteredObesityCircles.length - 1]) // Mapping domain to the number of circles
            .range([50, vis.width - 50]);

        let obesityCircles = vis.svg.selectAll(".obesityCircles")
            .data(vis.filteredObesityCircles);

        obesityCircles.exit().remove();

        obesityCircles
            .enter()
            .append("circle")
            .attr("class", "obesityCircles")
            .merge(obesityCircles)
            .on('mouseover', function (event, d){
                d3.select(this)
                    .attr('stroke', 'black')
                    .attr('fill', "yellow");
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(
                        `<div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                             <h5>Percent: ${d.Percent}</h5>
                        </div>`
                    );
            })
            .on("mouseout", function(event, d){
                d3.select(this)
                    .attr('stroke', 'none')
                    .attr('fill', '#e36830')
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
            .transition()
            .attr("cx", function(d, i){
                return vis.xScale(i);
            })
            .attr("cy", 110)
            .attr("r", function(d){
                return d.Percent;

            })
            .attr('fill', '#e36830');

        let obesityLabels = vis.svg.selectAll(".obesityLabels")
            .data(vis.filteredObesityCircles);

        obesityLabels.exit().remove();

        obesityLabels
            .enter()
            .append("text")
            .attr("class", "obesityLabels")
            .attr("x", function(d, i){
                return vis.xScale(i);
            })
            .attr("y", 175)
            .attr('fill', 'black') // Text color
            .attr("text-anchor", "middle")
            .attr('font-size', '15px') // Font size
            .text(d => d.SurveyYears)

        //HYPERTENSION

        vis.filteredHypertensionCircles = vis.hypertension.filter(function(d){
            return (d.AgeGroup === selectedOption) && (d.Sex === "All");
        });

        vis.xScaleHypertension = d3.scaleLinear()
            .domain([0, vis.filteredHypertensionCircles.length - 1]) // Mapping domain to the number of circles
            .range([50, vis.width - 50 ]);

        let hypertensionCircles = vis.svg.selectAll(".hypertensionCircles")
            .data(vis.filteredHypertensionCircles);

        hypertensionCircles.exit().remove();

        hypertensionCircles
            .enter()
            .append("circle")
            .attr("class", "hypertensionCircles")
            .merge(hypertensionCircles)
            .on('mouseover', function (event, d){
                d3.select(this)
                    .attr('stroke', 'black')
                    .attr('fill', "yellow");
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(
                        `<div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                             <h5>Percent: ${d.Percent}</h5>
                        </div>`
                    );
            })
            .on("mouseout", function(event, d){
                d3.select(this)
                    .attr('stroke', 'none')
                    .attr('fill', '#e36830')
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
            .transition()
            .attr("cx", function(d, i){
                // console.log(`label x: ${i}, label xScale: ${vis.xScale(i)}`)
                return vis.xScaleHypertension(i);
            })
            .attr("cy", 340)
            .attr("r", function(d){
                return d.Percent*0.80;

            })
            .attr('fill', '#e36830');

        let hypertensionLabels = vis.svg.selectAll(".hypertensionLabels")
            .data(vis.filteredHypertensionCircles);

        hypertensionLabels.exit().remove();

        hypertensionLabels
            .enter()
            .append("text")
            .attr("class", "hypertensionLabels")
            .attr("x", function(d, i){
                return vis.xScaleHypertension(i);
            })
            .attr("y", 415)
            .attr('fill', 'black') // Text color
            .attr("text-anchor", "middle")
            .attr('font-size', '15px') // Font size
            .text(d => d.SurveyYears)

        //HIGH CHOLESTEROL

        vis.filteredCholesterolCircles = vis.highcholesterol.filter(function(d){
            return (d.AgeGroup === selectedOption) && (d.Sex === "All");
        });

        vis.xScaleCholesterol = d3.scaleLinear()
            .domain([0, vis.filteredCholesterolCircles.length - 1]) // Mapping domain to the number of circles
            .range([50, vis.width - 50]);

        let cholesterolCircles = vis.svg.selectAll(".cholesterolCircles")
            .data(vis.filteredCholesterolCircles);

        cholesterolCircles.exit().remove();

        cholesterolCircles
            .enter()
            .append("circle")
            .attr("class", "cholesterolCircles")
            .merge(cholesterolCircles)
            .on('mouseover', function (event, d){
                d3.select(this)
                    .attr('stroke', 'black')
                    .attr('fill', "yellow");
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(
                        `<div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                             <h5>Percent: ${d.Percent}</h5>
                        </div>`
                    );
            })
            .on("mouseout", function(event, d){
                d3.select(this)
                    .attr('stroke', 'none')
                    .attr('fill', '#e36830')
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
            .transition()
            .attr("cx", function(d, i){
                // console.log(`label x: ${i}, label xScale: ${vis.xScale(i)}`)
                return vis.xScaleCholesterol(i);
            })
            .attr("cy", 540)
            .attr("r", function(d){
                return d.Percent;

            })
            .attr('fill', '#e36830');

        let cholesterolLabels = vis.svg.selectAll(".cholesterolLabels")
            .data(vis.filteredCholesterolCircles);

        cholesterolLabels.exit().remove();

        cholesterolLabels
            .enter()
            .append("text")
            .attr("class", "cholesterolLabels")
            .attr("x", function(d, i){
                return vis.xScaleCholesterol(i);
            })
            .attr("y", 615)
            .attr('fill', 'black') // Text color
            .attr("text-anchor", "middle")
            .attr('font-size', '15px') // Font size
            .text(d => d.SurveyYears)

    }




}