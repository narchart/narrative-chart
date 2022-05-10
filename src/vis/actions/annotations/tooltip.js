import Annotator from './annotator';
import { PieChart } from '../../charts';
import Color from '../../visualization/color';
import * as d3 from 'd3';

const COLOR = new Color();

/**
 * @description An annotator for adding tooltip
 * 
 * @class
 * @extends Annotator
 */


class Tooltip extends Annotator {

    /**
     * @description Add the text into the tooltip and Automatic break the text line.
     * 
     * @param {container} container The svg used to contain the tooltip
     * @param {text} text The text in tooltip 
     * @param {number} textSize The font size of text in tooltip
     * @param {number} maxWidth The maximum width of tooltip.
     * @param {number} x The x coordinate of the mark which needs to add tooltip .
     * @param {number} y The y coordinate of the mark which needs to add tooltip .
     * 
     * @return {void}
     */


    textMultiline(container, text, textSize, maxWidth, x, y, style, textAnchor = "middle") {



        let words = text.split(" ").filter(d => d !== "");

        let virtualE = container.append("text")
            .attr("font-family", style['font-family'] ?? 'Arial-Regular')
            .attr("font-weight", style['font-weight'] ?? "normal")
            .attr("font-style", style['font-style'] ?? "normal")
            .attr("font-size", textSize)
            .text(words[0]);

        let textE = container.append("text")
            .attr("id", "tooltipstextContent")
            .attr("transform", "translate(" + x + "," + (y) + ")")
            .attr("font-size", textSize)
            .attr("text-anchor", textAnchor)
            .attr("font-family", style['font-family'] ?? 'Arial-Regular')
            .attr("font-weight", style['font-weight'] ?? "normal")
            .attr("font-style", style['font-style'] ?? "normal");

        maxWidth = Math.max(virtualE.node().getComputedTextLength(), maxWidth);
        const lineHeight = virtualE.node().getBBox().height * 0.9;
        let line = '';
        let rowCount = 0;
        const maxRow = 5;
        for (let n = 0; n < words.length; n++) {
            let testLine = line + ' ' + words[n];
            /*  Add line in testElement */
            if (rowCount === maxRow - 1) {
                virtualE.text(testLine + "…");
            } else {
                virtualE.text(testLine);
            }
            /* Messure textElement */
            let testWidth = virtualE.node().getComputedTextLength();
            if (testWidth > maxWidth) {
                if (rowCount === maxRow - 1) {//最后一行还有文字没显示
                    line += "…";
                    break;
                } else {//new row
                    textE.append("tspan")
                        .attr("x", 0)
                        .attr("dy", lineHeight)
                        .text(line);
                    line = words[n];
                    rowCount++;
                }
            } else {
                line = testLine;
            }
        }

        textE.append("tspan")
            .attr("x", 0)
            .attr("dy", lineHeight)
            .text(line);
        virtualE.remove();

        return textE;
    }

    /**
     * @description Add a tooltip above a mark
     * 
     * @param {Chart} chart src/vis/charts/chart.js
     * @param {Array} target It describes the data scope of the annotation, which is defined by a list of filters: [{field_1: value_1}, ..., {field_k, value_k}]. By default, the target is the entire data.
     * @param {{text: text}} style Style parameters of the annotation.
     * @param {{delay: number, type: string}} animation Animation parameters of the annotation.
     * 
     * @return {void}
     */


    annotate(chart, target, style, animation) {

        let svg = chart.svg();
        // let yEncoding = chart.y;

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
                formatData = focus_element.__data__[style["field"]].toString()
            }
            else {
                formatData = "tooltip"
            }

            // identify the position
            let data_x, data_y, data_r, offset_y;
            const nodeName = focus_element.nodeName;
            let tranglesize = 50
            let fontsize

            if ("font-size" in style)
                fontsize = style["font-size"];
            else
                fontsize = 10;


            if (nodeName === "circle") { // get center
                data_x = parseFloat(focus_element.getAttribute("cx"));
                data_y = parseFloat(focus_element.getAttribute("cy"));
                data_r = parseFloat(focus_element.getAttribute("r"));
                offset_y = - data_r - 5;
            } else if (nodeName === "rect") {
                const bbox = focus_element.getBBox();
                data_x = bbox.x + bbox.width / 2;
                data_y = bbox.y;
                offset_y = -5;
            } else { // currently only support piechart
                 if(chart instanceof PieChart){
                    let data_temp = focus_element.__data__;
                    data_x = data_temp.centroidX();
                    data_y = data_temp.centroidY();
                    offset_y = 0;
                }else{
                    return;
                }
            }

            let toolTipSvg = svg.append("g").attr("class", "tooltip")
            let tooltipRect = toolTipSvg
                .append('rect')
                .attr("class", "tooltipRect");

            let tooltip = toolTipSvg.append("text")
                .attr("font-size", fontsize)
                .attr("text-anchor", "start");

            tooltip = this.textMultiline(toolTipSvg, formatData, fontsize, 80, data_x, data_y, style);
            tooltip.attr("transform", "translate(" + data_x + "," + 0 + ")")
                .attr("fill", () => {
                    if ("font-color" in style) {
                        return style["font-color"];
                    } else {
                        return COLOR.TEXT;
                    }
                });




            let textWidth = tooltip.node().getBBox().width;
            let textHeight = tooltip.node().getBBox().height;
            let widthAlpha = 0.7;
            let rectWidth = Math.min(textWidth / widthAlpha, textWidth + 12);
            let rectHeight = textHeight / 0.8;

            tooltipRect
                .attr("rx", 0.1 * textHeight)
                .attr("ry", 0.1 * textHeight)
                .attr("width", rectWidth)
                .attr("height", rectHeight)
                .attr("fill", style["tooltip-color"] ?? COLOR.TOOLTIP)
                .attr("opacity", 1.0);

            // let yyy = data_y - 10
            let tooltipTriangle = toolTipSvg.append("path")
                .attr("class", "triangle")
                .attr("transform", "translate(" + data_x + "," + (data_y + offset_y) + ")rotate(180)")
                .attr("d", d3.symbol().type(d3.symbolTriangle).size(tranglesize))
                .attr("fill", style["tooltip-color"] ?? COLOR.TOOLTIP)



            tooltipRect.attr("x", data_x - rectWidth / 2)
                .attr("y", data_y + offset_y - rectHeight);

            tooltip.attr("width", textWidth)
                .attr("height", textHeight)
                .attr("x", data_x - rectWidth / 2 + (rectWidth - textWidth) / 2)
                .attr("y", data_y + offset_y - rectHeight);


            tooltipTriangle.attr("opacity", 1);


            switch (animation.type) {
                case 'wipe':
                    let bbox = toolTipSvg.node().getBBox();
                    var gradient = toolTipSvg.append("defs")
                        .append("linearGradient")
                        .attr("id", "gradient")
                        .attr("x1", "0%")
                        .attr("x2", "0%")
                        .attr("spreadMethod", "pad");

                    gradient.append("stop")
                        .attr("offset", "0%")
                        .attr("stop-color", COLOR.BACKGROUND)
                        .attr("stop-opacity", 1);

                    gradient.append("stop")
                        .attr("offset", "100%")
                        .attr("stop-color", COLOR.BACKGROUND)
                        .attr("stop-opacity", 0);

                    let fadeBox = toolTipSvg.append('rect')
                        .attr('x', bbox.x)
                        .attr('y', bbox.y)
                        .attr('width', bbox.width)
                        .attr('height', bbox.height)
                        .style("fill", "url(#gradient)");

                    toolTipSvg.attr("opacity", 0)
                        .transition()
                        .duration(animation['duration'] ?? 0)
                        .attr("opacity", 1)

                    fadeBox.transition()
                        .duration(animation['duration'] ?? 0)
                        .attr('width', 0)
                        .attr('x', bbox.x + bbox.width)

                    gradient.transition()
                        .duration(animation['duration'] ?? 0)
                        .attr('x1', '100%')

                    break;

                case 'fly':

                    tooltipRect.attr("x", 640)
                        .transition()
                        .duration(animation['duration'] ?? 0)
                        .attr("x", data_x - rectWidth / 2);


                    d3.select("#tooltipstextContent tspan")
                        .attr("x", 640 - (data_x - rectWidth / 2))
                        .transition()
                        .duration(animation['duration'] ?? 0)
                        .attr("x", 0)

                    tooltipTriangle.attr("transform", "translate(" + 640 + "," + (data_y + offset_y) + ")rotate(180)")
                        .transition()
                        .duration(animation['duration'] ?? 0)
                        .attr("transform", "translate(" + data_x + "," + (data_y + offset_y) + ")rotate(180)")


                    break;

                default:
                    toolTipSvg.attr("opacity", 0)
                        .transition()
                        .duration('duration' in animation ? animation['duration'] * 0.25 : 0)
                        .attr("opacity", 1)
                    break;

            }






        }

    }
}

export default Tooltip;