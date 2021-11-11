import Annotator from './annotator';
import Color from '../../visualization/color';

class Regression extends Annotator {
    annotate(chart, target, style) {
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

        // range on Y
        let y_axis_path = svg.selectAll('.axis_y').select(".domain");
        let y_axis_bbox = y_axis_path.node().getBBox();
        let y_lower_bound = y_axis_bbox.y;
        let y_upper_bound = y_lower_bound + y_axis_bbox.height;

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

        // step 4: draw regression line
        svg.append("line")
            .attr("class", "regression")
            .attr("x1", x1)
            .attr("x2", x2)
            .attr("y1", y1)
            .attr("y2", y2)
            .attr("stroke", Color().ANNOTATION)
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "8, 4");

    }

    /**
     * least squares on given data points
     * @param {*} points positions of points to draw a regression line
     * @returns ret {m: gradient, b: intercept}
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