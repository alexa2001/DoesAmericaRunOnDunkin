// Summary Findings Page
class SummaryPage {
    constructor(parentElement) {
        this.parentElement = parentElement;

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById("summaryFindings").getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById("summaryFindings").getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        //init drawing area
        vis.svg = d3.select("#summaryFindings").append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.title = vis.svg.append("text")
            .attr("x", vis.width/2)
            .attr("y", vis.height * 0.2)
            .attr("text-anchor", "middle")
            .attr('font-size', 30)
            .attr('font-family', 'monospace')
            .attr('fill', 'black')
            .text("Takeaways")

        vis.bodyText = vis.svg.append("text")
            .attr("x", vis.width/2)
            .attr("y", vis.height * 0.4)
            .attr("text-anchor", "middle")
    }
}

// Text to include on the summary findings page
// why fast food is still so popular, regardless of health data,
// and also talking about how there’s not really too much of a correlation
// between income and fast food restaurants? The number of fast food restaurants
// in a state seems more related to the size of that state than income
// Also the obesity risk factor prevalence seems to be consistent over all age group
// but hypertension spikes after 40 years old
// So maybe like our future considerations/actions should be that older groups should be more concerned about their health/diet?
