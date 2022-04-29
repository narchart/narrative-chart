import Annotator from './annotator'
import Color from '../../visualization/color';
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
            } else { // currently not support
                return;
            }

            // move the arrow to the data point
            const new_arrow_points = arrow_points.map((point) => [data_x + offset + point[0], data_y + offset + point[1]]);

            // draw arrow
            svg.append("path")
                .attr("class", "arrow")
                .attr("d", d3.line()(new_arrow_points))
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
    })
    }
}

export default Arrow