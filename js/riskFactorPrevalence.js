class RiskFactorPrevalence{
    constructor(_parentElement, _data){
        this.parentElement = _parentElement;
        this.data = _data;

        this.initVis();
    }

    initVis(){
        let vis = this;
        console.log(vis.data);

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
            .attr('y',25) // Y-coordinate of the text
            .attr('fill', 'black') // Text color
            .attr("text-anchor", "middle")
            .attr('font-size', '20px') // Font size
            .attr('font-weight', 'bold')
            .text("Obesity");

        vis.hypertensionLabel = vis.svg.append('text')
            .attr("class", "label")
            .attr('x', vis.width/2) // X-coordinate of the text
            .attr('y',210) // Y-coordinate of the text
            .attr('fill', 'black') // Text color
            .attr("text-anchor", "middle")
            .attr('font-size', '20px') // Font size
            .attr('font-weight', 'bold')
            .text("Hypertension");

        vis.highcholesterolLabel = vis.svg.append('text')
            .attr("class", "label")
            .attr('x', vis.width/2) // X-coordinate of the text
            .attr('y',420) // Y-coordinate of the text
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
            .attr("width", 110)
            .attr("height", 200)
            .attr("class", "select-box")
            .append("xhtml:body")
            .html('<select id="mySelect"></select>');

        let options = d3.select("#mySelect")
            .selectAll("option")
            .data(["20 and Over", "20-39", "40-59", "60 and Over"])
            .enter()
            .append("option")
            .text(d => d);

        d3.select("#mySelect").on("change", function() {
            const selectedOption = d3.select(this).property("value");
            console.log("Selected option:", selectedOption);

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



        vis.updateVis();

    }

    updateVis(){
        let vis = this;

        vis.firstTenObesity = [] ;
        vis.firstTenHypertension = [] ;
        vis.firstTenCholesterol = [] ;

        for (let i = 0; i < 10; i++){
            vis.firstTenObesity.push(vis.obesity[i]);
            vis.firstTenHypertension.push(vis.hypertension[i]);
            vis.firstTenCholesterol.push(vis.highcholesterol[i]);
        }

        console.log(vis.firstTenObesity);
        // console.log(vis.obesity[0]);

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'tooltip')


        let obesityCircles = vis.svg.selectAll("obesityVis")
            .data(vis.firstTenObesity);

        console.log(vis.obesity);

        obesityCircles.exit().remove();

        obesityCircles
            .enter()
            .append("circle")
            .attr("class", "obesityVis")
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
            .attr("cx", (d, i) => i * ((d.Percent) * 2 + 25) + (d.Percent))
            .attr("cy", 110)
            .attr("r", function(d){
                return d.Percent;

            })
            .attr('fill', '#e36830');

        let obesityCirclesLabels = vis.svg.selectAll("labels")
            .data(vis.firstTenObesity);

        obesityCirclesLabels
            .enter()
            .append("text")
            .attr("class", "labels")
            .attr("x", (d, i) => i * ((d.Percent) * 2 + 25) + (d.Percent))
            .attr("y", 175)
            .attr('fill', 'black') // Text color
            .attr("text-anchor", "middle")
            .attr('font-size', '15px') // Font size
            .text(d => d.SurveyYears)



        let hypertensionCircles = vis.svg.selectAll("hypertensionVis")
            .data(vis.firstTenHypertension);

        hypertensionCircles.exit().remove();

        hypertensionCircles
            .enter()
            .append("circle")
            .attr("class", "hypertensionVis")
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
            .attr("cx", (d, i) => i * ((d.Percent) * 2 + 25) + (d.Percent))
            .attr("cy", 300)
            .attr("r", function(d){
                return d.Percent;

            }) // radius of the circle
            // .attr("height",d => vis.height - vis.x(d.ct))
            .attr('fill', '#e36830');

        let hypertensionCirclesLabels = vis.svg.selectAll("labels")
            .data(vis.firstTenHypertension);

        hypertensionCirclesLabels
            .enter()
            .append("text")
            .attr("class", "labels")
            .attr("x", (d, i) => i * ((d.Percent) * 2 + 25) + (d.Percent))
            .attr("y", 375)
            .attr('fill', 'black') // Text color
            .attr("text-anchor", "middle")
            .attr('font-size', '15px') // Font size
            .text(d => d.SurveyYears)

        let cholesterolCircles = vis.svg.selectAll("cholesterolVis")
            .data(vis.firstTenCholesterol);

        cholesterolCircles.exit().remove();

        vis.d = 0
        cholesterolCircles
            .enter()
            .append("circle")
            .attr("class", "cholesterolVis")
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
            .attr("cx", (d, i) => i * ((d.Percent) * 3 + 90) + (d.Percent))
            .attr("cy", 500)
            .attr("r", function(d){
                return d.Percent;

            }) // radius of the circle
            // .attr("height",d => vis.height - vis.x(d.ct))
            .attr('fill', '#e36830');

        let cholesterolCirclesLabels = vis.svg.selectAll("labels")
            .data(vis.firstTenCholesterol);

        cholesterolCirclesLabels
            .enter()
            .append("text")
            .attr("class", "labels")
            .attr("x", (d, i) => i * ((d.Percent) * 3 + 90) + (d.Percent))
            .attr("y", 540)
            .attr('fill', 'black') // Text color
            .attr("text-anchor", "middle")
            .attr('font-size', '15px') // Font size
            .text(d => d.SurveyYears)
    }




}