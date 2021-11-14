import * as d3 from 'd3';
import Annotator from './annotator'
import Color from '../../visualization/color';

class Band extends Annotator {
    annotate(chart, target, style) {
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
                    .attr("opacity", 0.3)
                    .attr("stroke-width", 0)
                    .attr("x", circleX)
                    .attr("y", circleY)
                    .attr("transform", "translate(" + circleX + "," + circleY + ")")
                    .attr("r", circleR)
                svg.select(".lineGroup").moveToFront();

            } else if (item.nodeName === "rect") {
                let rectX = Number(item.getAttribute("x")) - padding,
                    rectY = Number(item.getAttribute("y")) - padding,
                    width = Number(item.getAttribute("width")) + padding * 2,
                    height = Number(item.getAttribute("height")) + padding;

                svg.select(".content").select("g").append("rect")
                    .attr("fill", Color().ANNOTATION)
                    .attr("opacity", 0.3)
                    .attr("stroke-width", 0)
                    .attr("x", rectX)
                    .attr("y", rectY)
                    .attr("width", width)
                    .attr("height", height)
            }

        });
        selected.moveToFront();
    }
}

export default Band