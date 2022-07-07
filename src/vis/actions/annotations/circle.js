import Annotator from './annotator'
import Color from '../../visualization/color';
import * as d3 from 'd3';

const COLOR = new Color();

/**
 * @description An annotator for adding circle.
 *
 * @class
 * @extends Annotator
 */
class Circle extends Annotator {

    /**
     * @description Add circles in target marks.
     *
     * @param {Chart} chart src/vis/charts/chart.js
     * @param {Array} target It describes the data scope of the annotation, which is defined by a list of filters: [{field_1: value_1}, ..., {field_k, value_k}]. By default, the target is the entire data.
     * @param {{color: string}} style Style parameters of the annotation.
     * @param {{delay: number, duration: number}} animation Animation parameters of the annotation.
     *
     * @return {void}
     */
    annotate(chart, target, style, animation) {
        let animationType;
        if(animation) {
            animationType = animation.type || "fade";
        }
        let svg = chart.svg();
        let selected = svg.selectAll(".mark")
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
            })
        const defaultR = 15;
        selected.nodes().forEach(item => {
            if (item.nodeName === "circle") {
                let radiusX = style["width"] || defaultR,
                    radiusY = style["height"] || defaultR,
                    circleX = item.getAttribute("cx"),
                    circleY = item.getAttribute("cy");

                let arc = d3.arc()
                    .innerRadius(9)
                    .outerRadius(10);
                let circle_data = {
                    "x": parseFloat(circleX),
                    "y": parseFloat(circleY),
                    "startAngle": 0,
                    "endAngle": 2 * Math.PI
                };

                switch (animationType) {
                    case "fade":
                        svg.append("ellipse")
                            .attr("fill", "none")
                            .attr("stroke", function (d) {
                                if ('color' in style) {
                                    return style['color']
                                } else {
                                    return COLOR.ANNOTATION
                                }
                            })
                            .attr("stroke-width", 2)
                            .attr("cx", circleX)
                            .attr("cy", circleY)
                            // .attr("transform", "translate(" + circleX + "," + circleY + ")")
                            .attr("rx", radiusX)
                            .attr("ry", radiusY)
                            .attr("opacity", 0)
                            .transition()
                            .duration('duration' in animation ? animation['duration'] : 0)
                            .attr("opacity", 1)
                        break;

                    case "wipe":
                        svg.append("path")
                            .attr("fill", function (d) {
                                if ('color' in style) {
                                    return style['color']
                                } else {
                                    return COLOR.ANNOTATION
                                }
                            })
                            .attr("stroke", function (d) {
                                if ('color' in style) {
                                    return style['color']
                                } else {
                                    return COLOR.ANNOTATION
                                }
                            })
                            .attr("stroke-width", 0.5)
                            .attr("x", circleX)
                            .attr("y", circleY)
                            .attr("transform", "translate(" + circleX + "," + circleY + ") scale(" + (radiusX / 10) + "," + (radiusY / 10) + ")")
                            .datum(circle_data)
                            .attr("d", arc)
                            .transition()
                            .duration(animation.duration)
                            .attrTween('d', function (d) {
                                var i = d3.interpolate(d.startAngle, d.endAngle);
                                return function (t) {
                                    d.endAngle = i(t);
                                    return arc(d);
                                }
                            });

                        break;

                    case "fly":
                        const chartWidth = chart.width() - chart.margin().top;
                        svg.append("ellipse")
                            .attr("fill", "none")
                            .attr("stroke", function (d) {
                                if ('color' in style) {
                                    return style['color']
                                } else {
                                    return COLOR.ANNOTATION
                                }
                            })
                            .attr("stroke-width", 2)
                            .attr("cx", circleX)
                            .attr("cy", circleY)
                            .attr("rx", radiusX)
                            .attr("ry", radiusY)
                            .attr("transform", "translate(" + (chartWidth - circleX) + ",0)")
                            .attr("x", 600)
                            .transition()
                            .duration('duration' in animation ? animation['duration'] : 0)
                            .attr("transform", "translate(0,0")
                        break;

                    default:
                        svg.append("ellipse")
                            .attr("fill", "none")
                            .attr("stroke", function (d) {
                                if ('color' in style) {
                                    return style['color']
                                } else {
                                    return COLOR.ANNOTATION
                                }
                            })
                            .attr("stroke-width", 2)
                            .attr("cx", circleX)
                            .attr("cy", circleY)
                            .attr("rx", radiusX)
                            .attr("ry", radiusY)
                        break;
                }

            } else if (item.nodeName === "rect") {
                let radiusX = style["width"] || defaultR,
                    radiusY = style["height"] || defaultR,
                    width = item.getAttribute("width"),
                    circleX = Number(item.getAttribute("x")) + width / 2,
                    circleY = item.getAttribute("y");

                let arc = d3.arc()
                    .innerRadius(9)
                    .outerRadius(10);
                let circle_data = {
                    "x": parseFloat(circleX),
                    "y": parseFloat(circleY),
                    "startAngle": 0,
                    "endAngle": 2 * Math.PI
                };
                switch (animationType) {
                    case "fade":
                        svg.append("ellipse")
                            .attr("fill", "none")
                            .attr("stroke", function (d) {
                                if ('color' in style) {
                                    return style['color']
                                } else {
                                    return COLOR.ANNOTATION
                                }
                            })
                            .attr("stroke-width", 2)
                            .attr("cx", circleX)
                            .attr("cy", circleY)
                            // .attr("transform", "translate(" + circleX + "," + circleY + ")")
                            .attr("rx", radiusX)
                            .attr("ry", radiusY)
                            .attr("opacity", 0)
                            .transition()
                            .duration('duration' in animation ? animation['duration'] : 0)
                            .attr("opacity", 1)
                        break;

                    case "wipe":
                        svg.append("path")
                            .attr("fill", function (d) {
                                if ('color' in style) {
                                    return style['color']
                                } else {
                                    return COLOR.ANNOTATION
                                }
                            })
                            .attr("stroke-width", 1)
                            .attr("x", circleX)
                            .attr("y", circleY)
                            .attr("transform", "translate(" + circleX + "," + circleY + ") scale(" + (radiusX / 10) + "," + (radiusY / 10) + ")")
                            .attr("r", radiusX)
                            .datum(circle_data)
                            .attr("d", arc)
                            .transition()
                            .duration(animation.duration)
                            .attrTween('d', function (d) {
                                var i = d3.interpolate(d.startAngle, d.endAngle);
                                return function (t) {
                                    d.endAngle = i(t);
                                    return arc(d);
                                }
                            });

                        break;

                    case "fly":
                        const chartWidth = chart.width() - chart.margin().top;
                        svg.append("ellipse")
                            .attr("fill", "none")
                            .attr("stroke", function (d) {
                                if ('color' in style) {
                                    return style['color']
                                } else {
                                    return COLOR.ANNOTATION
                                }
                            })
                            .attr("stroke-width", 2)
                            .attr("cx", circleX)
                            .attr("cy", circleY)
                            .attr("rx", radiusX)
                            .attr("ry", radiusY)
                            .attr("transform", "translate(" + (chartWidth - circleX) + ",0)")
                            .attr("x", 600)
                            .transition()
                            .duration('duration' in animation ? animation['duration'] : 0)
                            .attr("transform", "translate(0,0")
                        break;

                    default:
                        svg.append("ellipse")
                            .attr("fill", "none")
                            .attr("stroke", function (d) {
                                if ('color' in style) {
                                    return style['color']
                                } else {
                                    return COLOR.ANNOTATION
                                }
                            })
                            .attr("stroke-width", 2)
                            .attr("cx", circleX)
                            .attr("cy", circleY)
                            // .attr("transform", "translate(" + circleX + "," + circleY + ")")
                            .attr("rx", radiusX)
                            .attr("ry", radiusY)
                        break;
                }
            }

        });

    }
}

export default Circle
