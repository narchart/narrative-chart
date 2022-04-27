import * as d3 from 'd3';
import Annotator from './annotator'
import Color from '../../visualization/color';

/**
 * @description An annotator for adding colored area.
 * 
 * @class
 * @extends Annotator
 */
 class Band extends Annotator {

    /**
     * @description Add colored areas in target marks.
     * 
     * @param {Chart} chart src/vis/charts/chart.js
     * @param {Array} target It describes the data scope of the annotation, which is defined by a list of filters: [{field_1: value_1}, ..., {field_k, value_k}]. By default, the target is the entire data.
     * @param {{color: string}} style Style parameters of the annotation.
     * @param {{delay: number, duration: number}} animation Animation parameters of the annotation.
     * 
     * @return {void}
     */
    annotate(chart, target, style, animation) {
        let svg = chart.svg();
        d3.selection.prototype.moveToFront = function () {
            return this.each(function () {
                this.parentNode.appendChild(this);
            });
        };
        const selected = svg.selectAll(".mark")
            .filter(function (d) {
                if (target.length === 0) {
                    return true
                }
                for (const item of target) {
                    if (d[item.field] === item.value) {
                        return true
                    }
                }
                return false
            });

        const padding = 10;
        selected.nodes().forEach(item => {
            if (item.nodeName === "circle") {
                let circleR = Number(item.getAttribute("r")) + padding,
                    circleX = item.getAttribute("cx"),
                    circleY = item.getAttribute("cy");

                svg.select(".content").select(".circleGroup").append("circle")
                    .attr("fill", Color().ANNOTATION)
                    .attr("stroke-width", 0)
                    .attr("x", circleX)
                    .attr("y", circleY)
                    .attr("transform", "translate(" + circleX + "," + circleY + ")")
                    .attr("r", circleR)
                    .transition()
                    .duration('duration' in animation ? animation['duration']: 0)
                    .attr("fill-opacity", 0.3)

                    
                svg.select(".lineGroup").moveToFront();

            } else if (item.nodeName === "rect") {
                let rectX = Number(item.getAttribute("x")) - padding,
                    rectY = Number(item.getAttribute("y")) - padding,
                    width = Number(item.getAttribute("width")) + padding * 2,
                    height = Number(item.getAttribute("height")) + padding;

                svg.select(".content").select("g").append("rect")
                    .transition()
                    .duration('duration' in animation ? animation['duration']: 0)
                    .attr("fill", Color().ANNOTATION)
                    .attr("fill-opacity", 0.3)
                    .attr("stroke-width", 0)
                    .attr("x", rectX)
                    .attr("y", rectY)
                    .attr("width", width)
                    .attr("height", height)
            }
        });
    }
}

export default Band