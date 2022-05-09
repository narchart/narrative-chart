import Annotator from './annotator';
import * as d3 from 'd3';
import Color from '../../visualization/color';

const COLOR = new Color();

/**
 * @description An annotator for drawing distribution curve.
 * 
 * @class
 * @extends Annotator
 */
class Distribution extends Annotator {

    /**
     * @description Draw distribution curve for target marks, position of each control point depends on position of each target mark.
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
        let focus_elements = svg.selectAll(".mark")
            .filter(function(d) {
                if (target.length === 0) {
                    return true
                }
                for (const item of target) {
                    if (d[item.field] === item.value) {
                        continue
                    } else {
                        return false
                    }
                }
                return true
            })
            .attr("opacity", 0.3);

        if (focus_elements.empty()) return;

        // step 1: get all focused elements position
        let positions = [];
        focus_elements.nodes().forEach(one_element => {
            let data_x, data_y;
            const nodeName = one_element.nodeName;
            if (nodeName === "circle") {
                data_x = parseFloat(one_element.getAttribute("cx"));
                data_y = parseFloat(one_element.getAttribute("cy"));
            } else if (nodeName === "rect") {
                data_x = parseFloat(one_element.getAttribute("x")) + parseFloat(one_element.getAttribute("width")) / 2;
                data_y = parseFloat(one_element.getAttribute("y"));
            }
            if (!isNaN(data_x) && !isNaN(data_y)) {
                positions.push([data_x, data_y]);
            }
        })

        // step2: draw curve 
        let line_generator = d3.line()
            .x(d => d[0]) 
            .y(d => d[1])
            .curve(d3.curveCatmullRom);
            
        const line_path = svg.append("path")
                .attr("class", "regression")
                .attr("d", line_generator(positions))  
                .attr("stroke-width", 3)
                .attr("fill", "none")
                .attr("stroke", () => {
                    if ("color" in style) {
                        return style["color"];
                    } else {
                        return COLOR.ANNOTATION;
                    }
                })

        if ("type" in animation && animation["type"] === "wipe") {
            // const bbox = svg.node().getBBox();
            // const parentWidth = Number(svg.node().parentNode.getAttribute("width"));
            
            let pathLength;
            line_path.attr("stroke-dasharray", function() {
                            return pathLength = this.getTotalLength();
                        })
                        .attr("stroke-dashoffset", pathLength)
                        .transition()
                        .duration('duration' in animation ? animation['duration']: 0)
                        .attr("stroke-dashoffset", 0);

        } else {
            svg.append("path")
                .attr("class", "regression")
                .attr("d", line_generator(positions))  
                .attr("stroke-width", 3)
                .attr("fill", "none")
                .attr("opacity", 0)
                .transition()
                .duration('duration' in animation ? animation['duration']: 0)
                .attr("stroke", () => {
                    if ("color" in style) {
                        return style["color"];
                    } else {
                        return COLOR.ANNOTATION;
                    }
                })
                .attr("opacity", 1);
        }
    
    }
}

export default Distribution;