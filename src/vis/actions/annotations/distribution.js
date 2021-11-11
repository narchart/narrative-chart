import Annotator from './annotator';
import * as d3 from 'd3';
import Color from '../../visualization/color';

class Distribution extends Annotator {
    annotate(chart, target, style) {
        let svg = chart.svg();
        let focus_elements = svg.selectAll(".mark")
            .filter(function(d) {
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

        svg.append("path")
            .attr("class", "regression")
            .attr("d", line_generator(positions))
            .attr("stroke", Color().ANNOTATION)
            .attr("stroke-width", 3)
            .attr("fill", "none");

    }
}

export default Distribution;