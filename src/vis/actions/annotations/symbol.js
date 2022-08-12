import Annotator from './annotator';
import { PieChart, HBarChart,TreeMap } from '../../charts';

/**
 * @description An annotator for drawing symbols.
 *
 * @class
 * @extends Annotator
 */
class Symbol extends Annotator {

    /**
     * @description Draw symbols for target marks.
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
            .filter(function (d) {
                if (target.length === 0) {
                    return true
                }
                if (chart instanceof TreeMap) {
                    d = d.data
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

            // identify the position
            let data_x, data_y, data_r, offset_x, offset_y;
            const width_icon = style["width"] || 20;
            const height_icon = style["width"] || style["height"] || 20;
            const nodeName = focus_element.nodeName;
            if (nodeName === "circle") { // get center
                data_x = parseFloat(focus_element.getAttribute("cx"));
                data_y = parseFloat(focus_element.getAttribute("cy"));
                data_r = parseFloat(focus_element.getAttribute("r"));
                offset_y = - data_r - height_icon;
            } else if (nodeName === "rect") {
                const bbox = focus_element.getBBox();
                if (chart instanceof HBarChart) {
                    data_x = bbox.width;
                    data_y = bbox.y + bbox.height / 2;
                    offset_x = 10;
                    offset_y = -10;
                } else if (chart instanceof TreeMap) { 
                    data_x = bbox.x + bbox.width / 2;
                    data_y = bbox.y + bbox.height / 2;
                    offset_x = 0;
                    offset_y = -10;
                } else {
                    data_x = bbox.x + bbox.width / 2;
                    data_y = bbox.y;
                    offset_x = 0;
                    offset_y = -10;
                }
            } else { // currently only support piechart
                if (chart instanceof PieChart) {
                    let data_temp = focus_element.__data__;
                    data_x = data_temp.centroidX();
                    data_y = data_temp.centroidY();
                    offset_y = -height_icon / 2;
                } else {
                    return;
                }
            }

            const customizeOffset_x = style["offset-x"] || 0;
            const customizeOffset_y = style["offset-y"] || 0;

            // append icon
            if ("type" in animation && animation["type"] === "fly") {
                const parentWidth = Number(svg.node().parentNode.getAttribute("width"));
                svg.append("image")
                    .attr("class", "icon-img")
                    .attr("width", width_icon)
                    .attr("height", height_icon)
                    .attr("xlink:href", () => {
                        if ("icon-url" in style) {
                            return style["icon-url"];
                        } else {
                            return;
                        }
                    })
                    .attr("x", parentWidth)
                    .attr("y", data_y + offset_y + customizeOffset_y)
                    .transition()
                    .duration('duration' in animation ? animation['duration'] : 0)
                    .attr("x", data_x - width_icon / 2 + offset_x + customizeOffset_x)
                    .attr("y", data_y + offset_y + customizeOffset_y)

            } else if ("type" in animation && animation["type"] === "wipe") {
                // ensure that clip-paths for different symbols won't affect one another.
                const uid = Date.now().toString() + Math.random().toString(36).substring(2);
                const icon = svg.append("image")
                    .attr("class", "icon-img")
                    .attr("clip-path", `url(#clip_icon_${uid})`)
                    .attr("width", width_icon)
                    .attr("height", height_icon)
                    .attr("xlink:href", () => {
                        if ("icon-url" in style) {
                            return style["icon-url"];
                        } else {
                            return;
                        }
                    })
                    .attr("x", data_x - width_icon / 2 + offset_x + customizeOffset_x)
                    .attr("y", data_y + offset_y + customizeOffset_y)

                const iconBox = icon.node().getBBox();

                svg.append("defs")
                    .append("clipPath")
                    .attr("id", `clip_icon_${uid}`)
                    .append("rect")
                    .attr("height", iconBox.height)
                    .attr("width", iconBox.width)
                    .attr("x", iconBox.x)
                    .attr("y", iconBox.y + iconBox.height)
                    .transition()
                    .duration('duration' in animation ? animation['duration'] : 0)
                    .attr("x", iconBox.x)
                    .attr("y", iconBox.y);

            } else {
                svg.append("image")
                    .attr("class", "icon-img")
                    .attr("x", data_x - width_icon / 2 + offset_x + customizeOffset_x)
                    .attr("y", data_y + offset_y + customizeOffset_y)
                    .attr("width", width_icon)
                    .attr("height", height_icon)
                    .attr("xlink:href", () => {
                        if ("icon-url" in style) {
                            return style["icon-url"];
                        } else {
                            return;
                        }
                    })
                    .attr("opacity", 0)
                    .transition()
                    .duration('duration' in animation ? animation['duration'] : 0)
                    .attr("opacity", 1);
            }
        }

    }
}

export default Symbol;