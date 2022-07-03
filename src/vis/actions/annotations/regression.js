import Annotator from './annotator';
import Color from '../../visualization/color';
import { Unitvis, LineChart, BarChart, Scatterplot, areachart } from '../../charts';


const COLOR = new Color();

/**
 * @description An annotator for drawing regression line.
 * 
 * @class
 * @extends Annotator
 */
class Regression extends Annotator {
    /**
     * @description Annotate targeted elements with contour.
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
        if (focus_elements.empty()) return;

        // now only support linechart/barchart/scatterplot/unitvis
        if (!(chart instanceof LineChart || chart instanceof BarChart || chart instanceof Scatterplot || chart instanceof Unitvis|| chart instanceof areachart)) return;

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
        let x_lower_bound, x_upper_bound, y_lower_bound, y_upper_bound
        if (chart instanceof Unitvis) {
            let x_bbox = svg.select(".circleGroup").node().getBBox();
            x_lower_bound = x_bbox.x;
            x_upper_bound = x_bbox.x + x_bbox.width;
        } else {
            let x_axis_path = svg.selectAll('.axis_x').select(".domain");
            let x_axis_bbox = x_axis_path.node().getBBox();
            x_lower_bound = x_axis_bbox.x;
            x_upper_bound = x_lower_bound + x_axis_bbox.width;
        }
        

        // range on Y
        if (chart instanceof Unitvis) {
            let y_bbox = svg.select(".circleGroup").node().getBBox();
            y_lower_bound = y_bbox.x;
            y_upper_bound = y_bbox.x + y_bbox.width;
        } else {
            let y_axis_path = svg.selectAll('.axis_y').select(".domain");
            let y_axis_bbox = y_axis_path.node().getBBox();
            y_lower_bound = y_axis_bbox.y;
            y_upper_bound = y_lower_bound + y_axis_bbox.height;
        }
        

        // step 3: get regression line parameters
        // params for regression line
        let x1, x2, y1, y2;

        // process params for regression line 
        if (positions.length === 1) { // horizontal line
            y1 = positions[0][1];
            y2 = y1;

            x1 = x_lower_bound;
            x2 = x_upper_bound;
        } else { // calculate regression 
            const ret = this.getLeastSquares(positions);
            let x_ymin = (y_upper_bound - y_lower_bound - ret.b) / ret.m,
                x_ymax = (0 - ret.b) / ret.m;

            if (x_ymin > x_ymax) {
                [x_ymin, x_ymax] = [x_ymax, x_ymin];
            }

            x1 = x_lower_bound;
            x2 = x_upper_bound;
            x1 = x1 < x_ymin ? x_ymin : x1;
            x2 = x2 > x_ymax ? x_ymax : x2;
            if (ret.m === 0) x1 = 0;
            y1 = ret.m * x1 + ret.b;
            y2 = ret.m * x2 + ret.b;
            if (ret.m === -Infinity) {
                x1 = x2;
                y1 = y_lower_bound;
                y2 = y_upper_bound;
            }
        }

        const s_width = style['stroke-width'] ?? 2;
        const s_dasharray = style["stroke-dasharray"] ? style["stroke-dasharray"] : "8, 4";
        const s_linecap = style["stroke-linecap"] ? style["stroke-linecap"] : "butt";

        // step 4: draw regression line
        if ("type" in animation && animation["type"] === "wipe") {
            svg.append("line")
                .attr("class", "regression")
                .attr("x1", x1)
                .attr("x2", x1)
                .attr("y1", y1)
                .attr("y2", y1)
                .attr("stroke-width", s_width)
                .attr("stroke-linecap", s_linecap)
                .attr("stroke-dasharray", s_dasharray)
                .attr("stroke", () => {
                    if ("color" in style) {
                        return style["color"];
                    } else {
                        return COLOR.ANNOTATION;
                    }
                })
                .transition()
                .duration('duration' in animation ? animation['duration']: 0)
                .attr("x2", x2)
                .attr("y2", y2);
        } else {
            svg.append("line")
                .attr("class", "regression")
                .attr("x1", x1)
                .attr("x2", x2)
                .attr("y1", y1)
                .attr("y2", y2)
                .attr("stroke-width", s_width)
                .attr("stroke-linecap", s_linecap)
                .attr("stroke-dasharray", s_dasharray)
                .attr("stroke", () => {
                    if ("color" in style) {
                        return style["color"];
                    } else {
                        return COLOR.ANNOTATION;
                    }
                })
                .attr("opacity", 0)
                .transition()
                .duration('duration' in animation ? animation['duration']: 0)
                .attr("opacity", 1);
        }
    }

    /**
     * @description Compute least squares on given data points.
     * 
     * @param {Array} points positions of points to draw a regression line
     * @returns {{m: number, b: number}} params of the least squares results {m: gradient, b: intercept}
     */
    getLeastSquares(points) {
        let ret = {}

        let sumX = 0
        let sumY = 0
        let sumXY = 0
        let sumXSq = 0
        let N = points.length

        for (let i = 0; i < N; ++i) {
            sumX += points[i][0]
            sumY += points[i][1]
            sumXY += points[i][0] * points[i][1]
            sumXSq += points[i][0] * points[i][0]
        }

        ret.m = ((sumXY - sumX * sumY / N)) / (sumXSq - sumX * sumX / N)
        ret.b = sumY / N - ret.m * sumX / N

        return ret;
    }
}

export default Regression;