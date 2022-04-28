import Annotator from './annotator';
import { Scatterplot } from '../../charts';
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


    textMultiline (container, text, textSize, maxWidth, x, y, textAnchor = "middle"){

        let words = text.split(" ").filter(d => d !== "");
    
        let virtualE = container.append("text")
            .attr("font-family", 'Arial-Regular')
            .attr("font-size", textSize)
            .text(words[0]);
    
        let textE = container.append("text")
            .attr("transform", "translate(" + x + "," + (y) + ")")
            .attr("font-family", 'Arial-Regular')
            .attr("font-size", textSize)
            .attr("text-anchor", textAnchor);
    
        maxWidth = Math.max(virtualE.node().getComputedTextLength(), maxWidth);
        const lineHeight = virtualE.node().getBBox().height * 0.9;
        let line = '';
        let rowCount = 0;
        const maxRow = 5;
        for (let n = 0; n < words.length; n++) {
            let testLine = line + ' ' + words[n];
            /*  Add line in testElement */
            if(rowCount === maxRow - 1){
                virtualE.text(testLine+ "…");
            }else{
                virtualE.text(testLine);
            }
            /* Messure textElement */
            let testWidth = virtualE.node().getComputedTextLength();
            if (testWidth > maxWidth) {
                if(rowCount === maxRow - 1){//最后一行还有文字没显示
                    line += "…";
                    break;
                }else{//new row
                    textE.append("tspan")
                        .attr("x", 0)
                        .attr("dy", lineHeight)
                        .text(line);
                    line = words[n];
                    rowCount ++;
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
     * @param {{delay: number, duration: number}} animation Animation parameters of the annotation.
     * 
     * @return {void}
     */


    annotate(chart, target, style, animation) {
      
        let svg = chart.svg();
        let yEncoding = chart.y;
         
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
            });
        
        // if the focus defined in the spec does not exist
        if (focus_elements.length === 0) {
            return;
        }

        for(let focus_element of focus_elements.nodes()) {
           
            // get node data info
            let formatData
            if ("text" in style) {
                formatData = style["text"];
            }
            else if ("field" in style) {
                formatData = focus_element.__data__[style["field"]]
            } else if (chart instanceof Scatterplot) {
                formatData = focus_element.__data__[yEncoding]
            } else {
                let data_d = parseFloat(focus_element.__data__[yEncoding]);
                if ((data_d / 1000000) >= 1) {
                    formatData = data_d / 1000000 + "M";
                } else if ((data_d / 1000) >= 1) {
                    formatData = data_d / 1000 + "K";
                }else {
                    formatData = data_d + "";
                }
            }

            // identify the position
            let data_x, data_y, data_r, offset_y;
            const nodeName = focus_element.nodeName;
            let tranglesize = 50
            let fontsize 

             if ("font-size" in style) 
                fontsize =  style["font-size"];
            else 
                fontsize =  10;                

            
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
            } else { // currently not support
                return;
            }

            let toolTipSvg = svg.append("g").attr("class", "tooltip")
            let tooltipRect = toolTipSvg
                            .append('rect')
                            .attr("class", "tooltipRect");
            
            let tooltip = toolTipSvg.append("text")
                        .attr("font-size", fontsize)                            
                        .attr("fill", () => {
                            if ("color" in style) {
                                return style["color"];
                            } else {
                                return '#FFFFFF';
                            }
                        })
                        .attr("text-anchor", "start");
            
            if ("text" in style){
                tooltip.remove();
                tooltip = this.textMultiline(toolTipSvg, formatData, fontsize, 80, data_x, data_y);
                tooltip
                    .attr("transform", "translate(" + data_x + "," + 0 + ")")
                    .attr("fill", 'white');
                }
            else if ("field in style"){
                tooltip.append("tspan")
                .text(formatData)
                .attr("dy", tooltip.selectAll("tspan").node().getBBox().height * 0.9);
            }
            
        

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
                    .attr("fill", COLOR.TOOLTIP)
                    .attr("opacity", 1.0);

            // let yyy = data_y - 10
            let tooltipTriangle = toolTipSvg.append("path")
                .attr("class", "triangle")
                .attr("transform", "translate(" + data_x + "," + (data_y + offset_y) + ")rotate(180)")
                .attr("d", d3.symbol().type(d3.symbolTriangle).size(tranglesize))
                .attr("fill", COLOR.TOOLTIP)


                
            tooltipRect.attr("x", data_x - rectWidth / 2)
                        .attr("y", data_y + offset_y - rectHeight );
            
            tooltip.attr("width", textWidth)
                    .attr("height", textHeight)
                    .attr("x", data_x - rectWidth / 2 + (rectWidth- textWidth)/2 )
                    .attr("y",  data_y + offset_y - rectHeight );
                            
                        
            tooltipTriangle.attr("opacity", 1);

            toolTipSvg.attr("opacity", 0)
                        .transition()
                        .duration('duration' in animation ? animation['duration']*0.25: 0)
                        .attr("opacity", 1)





        }
            
    }
}

export default Tooltip;