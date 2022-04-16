import Annotator from './annotator'
import Color from '../../visualization/color';
import * as d3 from 'd3';


class Arrow extends Annotator {
    annotate(chart, target, style, animation) {
        let svg = chart.svg();
        let focus_elements = svg.selectAll(".mark")
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

        // if the focus defined in the spec does not exist
        if (focus_elements.empty()) {
            return;
        }

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
            // identify the position
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
                .attr("fill", () => {
                    if ("color" in style) {
                        return style["color"];
                    } else {
                        return Color().ANNOTATION;
                    }
                });
        })


    }
}

export default Arrow