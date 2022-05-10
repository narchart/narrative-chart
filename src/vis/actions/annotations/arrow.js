import Annotator from './annotator'
import Color from '../../visualization/color';
import { PieChart } from '../../charts';
import * as d3 from 'd3';

const COLOR = new Color();

/**
 * @description An annotator for drawing arrow.
 * 
 * @class
 * @extends Annotator
 */
class Arrow extends Annotator {
    /**
     * @description place arrows nearby targeted elements.
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
        // filter for elements that meet the conditions(`target`)
        let focus_elements = svg.selectAll(".mark")
            .filter(function (d) {
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
            });

        // return if the focus defined in the spec does not exist
        if (focus_elements.empty()) {
            return;
        }

        // arrow shape params
        const arrow_points = [
            [0, 0],
            [20, 5],
            [15, 10],
            [25, 20],
            [20, 25],
            [10, 15],
            [5, 20],
            [0, 0]
        ];

        focus_elements.nodes().forEach((one_element) => {
            // identify the position to place the arrow
            let data_x, data_y, offset;
            const nodeName = one_element.nodeName;
            if (nodeName === "circle") { // get center 
                data_x = parseFloat(one_element.getAttribute("cx"));
                data_y = parseFloat(one_element.getAttribute("cy"));
                offset = parseFloat(one_element.getAttribute("r")) / 1.414; // √2 ~ 1.414
            } else if (nodeName === "rect") {
                offset = parseFloat(one_element.getAttribute("width")) / 2;
                data_x = parseFloat(one_element.getAttribute("x")) + offset;
                data_y = parseFloat(one_element.getAttribute("y"));
            } else { // currently only support piechart
                if(chart instanceof PieChart){
                    let data_temp = one_element.__data__;
                    data_x = data_temp.centroidX();
                    data_y = data_temp.centroidY();
                    offset = 0;
                }else{
                    return;
                }
            }

            // move the arrow to the data point
            const new_arrow_points = arrow_points.map((point) => [data_x + offset + point[0], data_y + offset + point[1]]);

            // draw arrow
            if ("type" in animation && animation["type"] === "fly") {
                const bbox = svg.node().getBBox();
                const parentWidth = Number(svg.node().parentNode.getAttribute("width"));

                svg.append("path")
                    .attr("class", "arrow")
                    .attr("d", d3.line()(new_arrow_points))
                    .attr("fill", () => {
                        if ("color" in style) {
                            return style["color"];
                        } else {
                            return COLOR.ANNOTATION;
                        }
                    })
                    .attr("transform", `translate(${bbox.width-Math.abs(bbox.x)-(data_x+offset)+(parentWidth-bbox.width)/2}, 0)`) // (parentWidth-bbox.width)/2 for margin
                    .transition()
                    .duration('duration' in animation ? animation['duration']: 0)
                    .attr("transform", "translate(0, 0)")
            } else if ("type" in animation && animation["type"] === "wipe") {
                // ensure that clip-paths for different arrows won't affect one another. 
                const uid = Date.now().toString() + Math.random().toString(36).substring(2);

                const arrow = svg.append("path")
                    .attr("class", "arrow")
                    .attr("clip-path", `url(#clip_arrow_${uid})`)
                    .attr("d", d3.line()(new_arrow_points))
                    .attr("fill", () => {
                        if ("color" in style) {
                            return style["color"];
                        } else {
                            return COLOR.ANNOTATION;
                        }
                    });
                
                const arrowBox = arrow.node().getBBox();

                svg.append("defs")
                    .append("clipPath")
                    .attr("id", `clip_arrow_${uid}`)
                    .append("rect")
                    .attr("x", arrowBox.x+arrowBox.width)
                    .attr("y", arrowBox.y+arrowBox.height)
                    .attr("height", 0)
                    .attr("width", 0)
                    .transition()
                    .duration('duration' in animation ? animation['duration']: 0)
                    .attr("x", arrowBox.x)
                    .attr("y", arrowBox.y)
                    .attr("height", arrowBox.height)
                    .attr("width", arrowBox.width);
            } else {
                svg.append("path")
                    .attr("class", "arrow")
                    .attr("d", d3.line()(new_arrow_points))
                    .attr("fill-opacity", 0)
                    .transition()
                    .duration('duration' in animation ? animation['duration']: 0)
                    .attr("fill", () => {
                        if ("color" in style) {
                            return style["color"];
                        } else {
                            return COLOR.ANNOTATION;
                        }
                    })
                    .attr("fill-opacity", 1);
            }
        })
    }
}

export default Arrow