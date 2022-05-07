import * as d3 from 'd3';
import Color from '../../visualization/color';
import Annotator from './annotator';

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
                const _x = parseFloat(one_element.getAttribute("x")) - 1;
                const _y = parseFloat(one_element.getAttribute("y")) - 1;
                const _width = parseFloat(one_element.getAttribute("width")) + 2;
                const _height = parseFloat(one_element.getAttribute("height")) + 2;

                const d_contour_rect = `M${_x+_width},${_y}
                                      V${_y+_height}
                                      H${_x}
                                      V${_y}
                                      H${_x+_width+1}`;
                const contour_rect = svg.append("path")
                    .attr("d", d_contour_rect)
                    .attr("fill", "none")
                    .attr("stroke", function() {
                        if ('color' in style) {
                            return style['color']
                        } else {
                            return COLOR.ANNOTATION
                        }
                    })
                    .attr("stroke-width", 2);
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
                let _r = Number(one_element.getAttribute("r")) + 1,
                    _x = Number(one_element.getAttribute("cx")),
                    _y = Number(one_element.getAttribute("cy"));

                const d_contour_circle = d3.path();

                d_contour_circle.arc(_x, _y , _r, 0, 360)

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
                    .attr("stroke-width", 2);
                
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
            }
        }) 

    }
}

export default Contour;