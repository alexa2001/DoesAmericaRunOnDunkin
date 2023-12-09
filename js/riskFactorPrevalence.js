class RiskFactorPrevalence{
    constructor(_parentElement, _data){
        this.parentElement = _parentElement;
        this.data = _data;

        this.initVis();
    }

    initVis(){
        let vis = this;
        // console.log(vis.data);

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = window.innerWidth * 0.90;
        vis.height = window.innerHeight * 0.75;
        // vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        // vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")


        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.title = vis.svg.append('text')
            .attr('x', vis.width/2) // X-coordinate of the text
            .attr('y', 0) // Y-coordinate of the text
            .attr('fill', 'black') // Text color
            .attr("text-anchor", "middle")
            .attr('font-size', '20px') // Font size
            .attr('font-weight', 'bold')
            .text("Risk Factor Prevalence Over Time");

        vis.obesityLabel = vis.svg.append('text')
            .attr("class", "label")
            .attr('x', vis.width/2) // X-coordinate of the text
            .attr('y', vis.height * 0.05) // Y-coordinate of the text
            .attr('fill', 'black') // Text color
            .attr("text-anchor", "middle")
            .attr('font-size', '20px') // Font size
            .attr('font-weight', 'bold')
            .text("Obesity");

        vis.obesityInfo = vis.svg.append('circle')
            .attr("class", "obesityInfo")
            .attr('cx', vis.width/2 + 50)
            .attr("cy", vis.height * 0.04)
            .attr("r", 10)
            .attr("fill", "blue")
            .attr("cursor", "pointer")
            .on('click', function (event){
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(
                        `<div style="border: thin solid grey; border-radius: 5px; background: white; padding: 20px">
                             <h4>Obesity: Body mass index 
                             (BMI, weight in kilograms divided by 
                             height in meters squared) greater than 
                             or equal to 30.</h4>
                        </div>`
                    );
            })
            .on("mouseout", function(event, d){
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })

        vis.obesityInfoSym = vis.svg.append('text')
            .attr("class", "obesityInfo")
            .attr('x', vis.width/2 + 50)
            .attr("y", vis.height * 0.04 + 5)
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .attr('font-weight', 'bold')
            .attr("cursor", "pointer")
            .text("?")
            .on('click', function (event){
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(
                        `<div style="border: thin solid grey; border-radius: 5px; background: white; padding: 20px">
                             <h4>Obesity: Body mass index 
                             (BMI, weight in kilograms divided by 
                             height in meters squared) greater than 
                             or equal to 30.</h4>
                        </div>`
                    );
            })


        vis.hypertensionLabel = vis.svg.append('text')
            .attr("class", "label")
            .attr('x', vis.width/2) // X-coordinate of the text
            .attr('y', vis.height * 0.40) // Y-coordinate of the text
            .attr('fill', 'black') // Text color
            .attr("text-anchor", "middle")
            .attr('font-size', '20px') // Font size
            .attr('font-weight', 'bold')
            .text("Hypertension");

        vis.hypertensionInfo = vis.svg.append('circle')
            .attr("class", "hypertensionInfo")
            .attr('cx', vis.width/2 + 70)
            .attr("cy", vis.height * 0.40)
            .attr("r", 10)
            .attr("fill", "blue")
            .attr("cursor", "pointer")
            .on('click', function (event){
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(
                        `<div style="border: thin solid grey; border-radius: 5px; background: white; padding: 20px">
                             <h4>Hypertension: Systolic blood pressure
                              greater than or equal to 130 mmHg or 
                              diastolic blood pressure greater than or 
                              equal to 80 mmHg, or currently taking 
                              medication to lower high blood pressure</h4>
                        </div>`
                    );
            })
            .on("mouseout", function(event, d){
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })

        vis.hypertensionInfoSym = vis.svg.append('text')
            .attr('x', vis.width/2 + 70)
            .attr("y", vis.height * 0.40 + 5)
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .attr('font-weight', 'bold')
            .text("?")
            .attr("cursor", "pointer")
            .on('click', function (event){
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(
                        `<div style="border: thin solid grey; border-radius: 5px; background: white; padding: 20px">
                             <h4>Hypertension: Systolic blood pressure
                              greater than or equal to 130 mmHg or 
                              diastolic blood pressure greater than or 
                              equal to 80 mmHg, or currently taking 
                              medication to lower high blood pressure</h4>
                        </div>`
                    );
            })

        vis.highcholesterolLabel = vis.svg.append('text')
            .attr("class", "label")
            .attr('x', vis.width/2) // X-coordinate of the text
            .attr('y',vis.height * 0.80) // Y-coordinate of the text
            .attr('fill', 'black') // Text color
            .attr("text-anchor", "middle")
            .attr('font-size', '20px') // Font size
            .attr('font-weight', 'bold')
            .text("High Cholesterol");

        vis.cholesterolInfo = vis.svg.append('circle')
            .attr("class", "hypertensionInfo")
            .attr('cx', vis.width/2 + 70)
            .attr("cy", vis.height * 0.80)
            .attr("r", 10)
            .attr("fill", "blue")
            .attr("cursor", "pointer")
            .on('click', function (event){
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(
                        `<div style="border: thin solid grey; border-radius: 5px; background: white; padding: 20px">
                             <h4>High total cholesterol: 
                             Serum total cholesterol greater
                              than or equal to 240 mg/dL.</h4>
                        </div>`
                    );
            })
            .on("mouseout", function(event, d){
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })

        vis.cholesterolInfoSym = vis.svg.append('text')
            .attr('x', vis.width/2 + 70)
            .attr("y", vis.height * 0.80 + 5)
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .attr('font-weight', 'bold')
            .text("?")
            .attr("cursor", "pointer")
            .on('click', function (event){
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(
                        `<div style="border: thin solid grey; border-radius: 5px; background: white; padding: 20px">
                             <h4>High total cholesterol: 
                             Serum total cholesterol greater
                              than or equal to 240 mg/dL.</h4>
                        </div>`
                    );
            })

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
                    .attr('fill', "#DA1884");
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(
                        `<div style="border: thin solid grey; border-radius: 5px; background: white; padding: 20px">
                             <h5>${d.Percent}%</h5>
                        </div>`
                    );
            })
            .on("mouseout", function(event, d){
                d3.select(this)
                    .attr('stroke', 'none')
                    .attr('fill', '#FF671F')
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
            .attr("cy", vis.height * 0.20)
            .attr("r", function(d){
                return d.Percent;

            })
            .attr('fill', '#FF671F');

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
            .attr("y", vis.height * 0.20 + 60)
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
                    .attr('fill', "#DA1884");
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(
                        `<div style="border: thin solid grey; border-radius: 5px; background: white; padding: 20px">
                             <h5>${d.Percent}%</h5>
                        </div>`
                    );
            })
            .on("mouseout", function(event, d){
                d3.select(this)
                    .attr('stroke', 'none')
                    .attr('fill', '#FF671F')
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
            .attr("cy", vis.height * 0.55)
            .attr("r", function(d){
                return d.Percent*0.80;

            })
            .attr('fill', '#FF671F');

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
            .attr("y", vis.height * 0.55 + 60)
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
                    .attr('fill', "#DA1884");
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(
                        `<div style="border: thin solid grey; border-radius: 5px; background: white; padding: 20px">
                             <h5>${d.Percent}%</h5>
                        </div>`
                    );
            })
            .on("mouseout", function(event, d){
                d3.select(this)
                    .attr('stroke', 'none')
                    .attr('fill', '#FF671F')
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
            .attr("cy", vis.height * 0.90)
            .attr("r", function(d){
                return d.Percent;

            })
            .attr('fill', '#FF671F');

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
            .attr("y", vis.height * 0.90 + 30)
            .attr('fill', 'black') // Text color
            .attr("text-anchor", "middle")
            .attr('font-size', '15px') // Font size
            .text(d => d.SurveyYears)

    }




}