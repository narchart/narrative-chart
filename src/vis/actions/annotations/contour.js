import * as d3 from 'd3';
import Color from '../../visualization/color';
import Annotator from './annotator';
import { PieChart,Bubblechart } from '../../charts';

const COLOR = new Color();

/**
 * @description An annotator for drawing contour.
 *
 * @class
 * @extends Annotator
 */
class Contour extends Annotator {
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
        // method to move the specific element to the top layer
        d3.selection.prototype.moveToFront = function() {
            return this.each(function(){
                this.parentNode.appendChild(this);
            });
        };

        const focus_elements = svg.selectAll(".mark")
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
            });

        focus_elements.nodes().forEach((one_element) => {
            const nodeName = one_element.nodeName;
            if (nodeName === 'rect') {
                const _x = parseFloat(one_element.getAttribute("x"));
                const _y = parseFloat(one_element.getAttribute("y"));
                const _width = parseFloat(one_element.getAttribute("width"));
                const _height = parseFloat(one_element.getAttribute("height"));

                const d_width = style['stroke-width'] ?? chart.markStyle()["stroke-width"] ?? 2;

                function draw_rect(x, y, w, h, r) {
                    let retval;
                    retval  = "M" + (x + r) + "," + y;
                    retval += "h" + (w - 2*r);
                    retval += "a" + r + "," + r + " 0 0 1 " + r + "," + r;
                    retval += "v" + (h - 2*r);
                    retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + r;
                    retval += "h" + (2*r - w);
                    retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + -r;
                    retval += "v" + (2*r - h);
                    retval += "a" + r + "," + r + " 0 0 1 " + r + "," + -r;
                    retval += "z";

                    return retval;

                }
                const contour_rect = svg
                    .append("path")
                    .attr("d", draw_rect(_x, _y, _width, _height, 'corner-radius' in chart.markStyle() ? chart.markStyle()['corner-radius'] : 0))
                    .attr("fill", "none")
                    .attr("stroke", function() {
                        if ('color' in style) {
                            return style['color']
                        } else {
                            return COLOR.ANNOTATION
                        }
                    })
                    .attr("stroke-width", d_width)
                    .attr("stroke-linecap", "square"); // to make sure the path can be closed completely
                if ("type" in animation && animation["type"] === "wipe") {
                    let pathLength;

                    contour_rect.attr("stroke-dasharray", function() {
                                    return pathLength = this.getTotalLength();
                                })
                                .attr("stroke-dashoffset", pathLength)
                                .transition()
                                .duration('duration' in animation ? animation['duration']: 0)
                                .attr("stroke-dashoffset", 0);
                } else {
                    contour_rect.attr("opacity", 0)
                                .transition()
                                .duration('duration' in animation ? animation['duration']: 0)
                                .attr("opacity", 1);
                }
            } else if (nodeName === 'circle') {
                let _r = Number(one_element.getAttribute("r")),
                    _x = Number(one_element.getAttribute("cx")),
                    _y = Number(one_element.getAttribute("cy"));

                const d_contour_circle = d3.path();

                d_contour_circle.arc(_x, _y , _r, 0, 360)

                let d_width = style['stroke-width'] ?? chart.markStyle()["stroke-width"] ?? 2;
                if(chart instanceof Bubblechart){
                    d_width = d_width ? d_width : 2;
                }
                const contour_circle = svg.append("path")
                    .attr("d", d_contour_circle)
                    .attr("fill", "none")
                    .attr("stroke", function() {
                        if ('color' in style) {
                            return style['color']
                        } else {
                            return COLOR.ANNOTATION
                        }
                    })
                    .attr("stroke-width", d_width);

                if ("type" in animation && animation["type"] === "wipe") {
                    let pathLength;
                    contour_circle.attr("stroke-dasharray", function() {
                                    return pathLength = this.getTotalLength();
                                })
                                .attr("stroke-dashoffset", pathLength)
                                .transition()
                                .duration('duration' in animation ? animation['duration']: 0)
                                .attr("stroke-dashoffset", 0);
                } else {
                    contour_circle.attr("opacity", 0)
                                .transition()
                                .duration('duration' in animation ? animation['duration']: 0)
                                .attr("opacity", 1);
                }
            } else if(chart instanceof PieChart){
                const d_contour_arc = one_element.getAttribute("d");
                const d_width = style['stroke-width'] ?? chart.markStyle()["stroke-width"] ?? 2;
                const contour_arc = svg.append("path")
                    .attr("d", d_contour_arc)
                    .attr("fill", "none")
                    .attr("transform", one_element.parentNode.getAttribute("transform"))
                    .attr("stroke", function() {
                        if ('color' in style) {
                            return style['color']
                        } else {
                            return COLOR.ANNOTATION
                        }
                    })
                    .attr("stroke-width", d_width)
                    .attr("stroke-linecap", "square"); // to make sure the path can be closed completely
                if ("type" in animation && animation["type"] === "wipe") {
                    let pathLength;

                    contour_arc.attr("stroke-dasharray", function() {
                                    return pathLength = this.getTotalLength();
                                })
                                .attr("stroke-dashoffset", pathLength)
                                .transition()
                                .duration('duration' in animation ? animation['duration']: 0)
                                .attr("stroke-dashoffset", 0);
                } else {
                    contour_arc.attr("opacity", 0)
                                .transition()
                                .duration('duration' in animation ? animation['duration']: 0)
                                .attr("opacity", 1);
                }
            } else{
                return;
            }
        })

    }
}

export default Contour;
