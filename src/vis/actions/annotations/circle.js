import Annotator from './annotator'
import Color from '../../visualization/color';

const COLOR = new Color();

/**
 * @description An annotator for adding circle.
 * 
 * @class
 * @extends Annotator
 */
class Circle extends Annotator {

    /**
     * @description Add circles in target marks.
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
        let selected = svg.selectAll(".mark")
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
            })

        const padding = 5;

        selected.nodes().forEach(item => {
            if (item.nodeName === "circle") {
                let circleR = Number(item.getAttribute("r")) + padding,
                    circleX = item.getAttribute("cx"),
                    circleY = item.getAttribute("cy");

                svg.append("circle")
                    .attr("fill", "none")
                    .attr("stroke", function (d) {
                        if ('color' in style) {
                            return style['color']
                        } else {
                            return COLOR.ANNOTATION
                        }
                    })
                    .attr("stroke-width", 2)
                    .attr("x", circleX)
                    .attr("y", circleY)
                    .attr("transform", "translate(" + circleX + "," + circleY + ")")
                    .transition()
                    .attr("r", circleR)
                    .duration('duration' in animation ? animation['duration'] : 0)
                    .attr("fill-opacity", 1)

            } else if (item.nodeName === "rect") {
                let circleY = item.getAttribute("y"),
                    width = item.getAttribute("width"),
                    circleX = Number(item.getAttribute("x")) + width / 2,
                    circleR = width / 2 + padding;
                svg.append("circle")
                    .attr("fill", "none")
                    .attr("stroke", function (d) {
                        if ('color' in style) {
                            return style['color']
                        } else {
                            return COLOR.ANNOTATION
                        }
                    })
                    .attr("stroke-width", 2)
                    .attr("x", circleX)
                    .attr("y", circleY)
                    .attr("transform", "translate(" + circleX + "," + circleY + ")")
                    .attr("r", circleR)
            }

        });

    }
}

export default Circle