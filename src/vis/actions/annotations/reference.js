import Annotator from './annotator';
import Color from '../../visualization/color';

const COLOR = new Color();

/**
 * @description An annotator for drawing reference line.
 * 
 * @class
 * @extends Annotator
 */
class Reference extends Annotator {

     /**
     * @description Fit targeted elements with a reference line.
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
                for (const item of target) {
                    if (d[item.field] === item.value) {
                        continue
                    } else {
                        return false
                    }
                }
                return true
            });

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
            if (data_x && data_y) {
                positions.push([data_x, data_y]);
            }
        })

        // step 2: get content range
        // range on X
        let x_axis_path = svg.selectAll('.axis_x').select(".domain");
        let x_axis_bbox = x_axis_path.node().getBBox();
        let x_lower_bound = x_axis_bbox.x;
        let x_upper_bound = x_lower_bound + x_axis_bbox.width;

        // step 3: get value line parameters
        // params for value line
        let x1, x2, y1, y2;

        // process params for value line 
        if (positions.length === 1) { // horizontal line
            y1 = positions[0][1];
            y2 = y1;

            x1 = x_lower_bound;
            x2 = x_upper_bound;
        } else { // calculate value 
            const mean = this.getAverageValue(positions);

            y1 = mean;
            y2 = y1;

            x1 = x_lower_bound;
            x2 = x_upper_bound;
        }

        // step 4: draw value line
        const strokeWidth = style["stroke-width"]?style["stroke-width"]:2;
        const strokeDasharray = style["stroke-dasharray"]?style["stroke-dasharray"]:"8, 4";
        const strokeLinecap = style["stroke-linecap"] ? style["stroke-linecap"] : "butt";
        if ("type" in animation && animation["type"] === "wipe") {
            const uid = Date.now().toString() + Math.random().toString(36).substring(2);

            const reference = svg.append("line")
                .attr("class", "value")
                .attr("clip-path", `url(#clip_reference_${uid})`)
                .attr("x1", x1)
                .attr("x2", x2)
                .attr("y1", y1)
                .attr("y2", y2)
                .attr("stroke-width", strokeWidth)
                .attr("stroke-linecap", strokeLinecap)
                .attr("stroke-dasharray", strokeDasharray)
                .attr("stroke", () => {
                    if ("color" in style) {
                        return style["color"];
                    } else {
                        return COLOR.ANNOTATION;
                    }
                });
            const regBox = reference.node().getBBox();

            svg.append("defs")
                .append("clipPath")
                .attr("id", `clip_reference_${uid}`)
                .append("rect")
                .attr("x", positions[0][0])
                .attr("y", regBox.y-strokeWidth/2)
                .attr("height", regBox.height+strokeWidth)
                .attr("width", 0)
                .transition()
                .duration('duration' in animation ? animation['duration']: 0)
                .attr("x", 0)
                .attr("width", regBox.width);

        }else if("type" in animation && animation["type"] === "fly"){
            const uid = Date.now().toString() + Math.random().toString(36).substring(2);
            const reference = svg.append("line")
                .attr("class", "value")
                .attr("clip-path", `url(#clip_reference_${uid})`)
                .attr("x1", x1)
                .attr("x2", x2)
                .attr("y1", y1)
                .attr("y2", y2)
                .attr("stroke-width", strokeWidth)
                .attr("stroke-linecap", strokeLinecap)
                .attr("stroke-dasharray", strokeDasharray)
                .attr("stroke", () => {
                    if ("color" in style) {
                        return style["color"];
                    } else {
                        return COLOR.ANNOTATION;
                    }
                });
            const regBox = reference.node().getBBox();

            svg.append("defs")
                .append("clipPath")
                .attr("id", `clip_reference_${uid}`)
                .append("rect")
                .attr("x", regBox.width)
                .attr("y", regBox.y-strokeWidth/2)
                .attr("height", regBox.height+strokeWidth)
                .attr("width", 0)
                .transition()
                .duration('duration' in animation ? animation['duration']: 0)
                .attr("x", 0)
                .attr("width", regBox.width);
        }else {
            svg.append("line")
            .attr("class", "value")
            .attr("x1", x1)
            .attr("x2", x2)
            .attr("y1", y1)
            .attr("y2", y2)
            .attr("stroke", function() {
                if ('color' in style) {
                    return style['color']
                } else {
                    return COLOR.ANNOTATION
                }
            })
            .attr("stroke-width", strokeWidth)
            .attr("stroke-linecap", strokeLinecap)
            .attr("stroke-dasharray", strokeDasharray);
        }

    }

    /**
     * average value on given data points
     * @param {*} points positions of points to draw a value line
     * @returns average value
     */
    getAverageValue(points) {
        let sumY = 0
        let N = points.length

        for (let i = 0; i < N; ++i) {
            sumY += points[i][1]
        }

        return sumY/N;
    }
}

export default Reference;