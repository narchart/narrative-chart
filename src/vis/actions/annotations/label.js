import Annotator from './annotator';
import { Scatterplot, PieChart, HBarChart } from '../../charts';
import Color from '../../visualization/color';

const COLOR = new Color();

/**
 * @description An annotator for drawing labels.
 *
 * @class
 * @extends Annotator
 */
class Label extends Annotator {

    /**
     * @description Draw labels for target marks.
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

        const yEncoding = chart.y;

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

        // if the focus defined in the spec does not exist
        if (focus_elements.length === 0) {
            return;
        }
        for (let focus_element of focus_elements.nodes()) {

            // get node data info
            let formatData
            if ("text" in style) {
                formatData = style["text"];
            }
            else if ("field" in style) {
                formatData = focus_element.__data__[style["field"]]
            } else if (chart instanceof Scatterplot) {
                formatData = focus_element.__data__[yEncoding]
            } else if (chart instanceof PieChart) {
                formatData = focus_element.__data__.text();
            }
            else {
                let data_d = parseFloat(focus_element.__data__[yEncoding]);
                if ((data_d / 1000000) >= 1) {
                    let formatNum = data_d / 1000000
                    formatData = formatNum.toFixed(2) + "M";
                } else if ((data_d / 1000) >= 1) {
                    let formatNum = data_d / 1000
                    formatData = formatNum.toFixed(2) + "K";
                } else {
                    formatData = data_d.toFixed(2) + "";
                }
            }

            // identify the position
            let data_x, data_y, data_r, offset_x = 0, offset_y = 0;
            const nodeName = focus_element.nodeName;
            let arc_angle;

            if (nodeName === "circle") { // get center
                data_x = parseFloat(focus_element.getAttribute("cx"));
                data_y = parseFloat(focus_element.getAttribute("cy"));
                data_r = parseFloat(focus_element.getAttribute("r"));
                offset_y = - data_r - 10;
            } else if (nodeName === "rect") {
                const bbox = focus_element.getBBox();
                if (chart instanceof HBarChart) {
                    data_x = bbox.x;
                    data_y = bbox.y + bbox.height / 2;
                    // TODO - the offset should be determinded by size of label
                    offset_x = 25;
                    offset_y = 5;
                } else {
                    data_x = bbox.x + bbox.width / 2;
                    data_y = bbox.y;
                    offset_x = 0;
                    offset_y = -10;
                }

            } else { // currently only support pie
                if (chart instanceof PieChart) {
                    let data_temp = focus_element.__data__;
                    data_x = data_temp.textX();
                    data_y = data_temp.textY();
                    arc_angle = (focus_element.__data__.angleStart() + focus_element.__data__.angleEnd()) / 2
                    offset_y = 0;
                } else {
                    return;
                }
            }

            const customizeOffset_x = style["offset-x"] || 0;
            const customizeOffset_y = style["offset-y"] || 0;
            // draw text
            svg.append("text")
                .attr("class", "text")
                .attr("x", data_x + offset_x + customizeOffset_x)
                .attr("y", data_y + offset_y + customizeOffset_y)
                .text(formatData)
                .attr("font-size", style["font-size"] || 12)
                .attr("font-family", style["font-family"] || "Inter")
                .attr("fill", style["font-color"] || COLOR.TEXT)
                .attr("font-weight", style["font-weight"] || 400)
                .attr("font-style", style["font-style"] || "normal")
                .attr("text-anchor", (chart instanceof PieChart) ? (arc_angle > Math.PI ? "end" : "start") : "middle")
                .attr("alignment-baseline", "Alphabetic")
                .attr("fill-opacity", 0)
                .transition()
                .duration('duration' in animation ? animation['duration'] : 0)
                .attr("fill-opacity", 1);
        }

    }
}

export default Label;