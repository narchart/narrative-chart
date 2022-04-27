import Titler from './titler'
import * as d3 from 'd3';

/**
 * @description An titler for adding title with fade animation
 * 
 * @class
 * @extends Titler
 */


class Fade extends Titler {
    /**
     * @description Add the caption at the bottom of chart
     * 
     * @param {vis} visualization src/vis/visualization.js
     * @param {{text: text, font-size:font-size}} style Style parameters of the title.
     * @param {{delay: number, duration: number}} animation Animation parameters of the caption.
     * 
     * 
     * @return {void}
     */

     maketitle(vis, style, animation) {
        
        let bannerarea = {
            width : 640,
            height: 130
        }

        let titleborderarea= {
            width : 600
        }

        let titlebordermargin = {
            left: 20,
            top: 12
        }

        let titlbackgroundearea= {
            width : 600
        }

        let titlebackgroundmargin= {
            left: 20,
            top: 12
        }

        let titleposition = {
            left: 30 , 
            center: "50%", 
            right: 610
        }

        let titletransform = {
            left: 0, 
            top: 10 
        }

        
        let svg = d3.select(vis.container()).select("svg")

        let words = style.text.split(" ").filter(d => d !== "");

        let textsize = style['font-size']?? 20
        
    
        let virtualE = svg.append("text")
            .attr("font-family", 'Arial-Regular')
            .attr("font-size", textsize)
            .text(words[0]);

        let maxWidth = Math.max(virtualE.node().getComputedTextLength(), 590);
        const lineHeight = virtualE.node().getBBox().height * 0.9;
        const maxRow = textsize > 16 ? 2: 3;
    
        let backgroundimage 
        let backgroundcolor 
        //  title embellishment

        // 1. text-background-color
        if (style["text-background-color"]){
            let defs = svg.append('svg:defs');
            let filter=defs.append("svg:filter")
                .attr("id", "text-backgroundcolor")
                .attr("width", 1)
                .attr("height", 1)
                .attr("x", 0)
                .attr("y", 0)
                filter.append("feFlood")
                .attr("flood-color", style["text-background-color"])
                filter.append("feComposite")
                .attr("in", "SorceGraphic")
            backgroundcolor = "url(#text-backgroundcolor)"
            }

        // 2. banner section background-image
        if (style["background-image"]){
            let defs = svg.append('svg:defs');
            let config = {
                "texture_size" : 300
            }
            defs.append("svg:pattern")
                .attr("id", "text-backgroundimage")
                .attr("width", config.texture_size)
                .attr("height", config.texture_size)
                .attr("patternUnits", "userSpaceOnUse")
                .append("svg:image")
                .attr("xlink:href", style["background-image"])
                .attr("x", 0)
                .attr("y", 0);
            backgroundimage = "url(#text-backgroundimage)"
            
        
            svg.append("g")
                .attr("id","textBack")
                .append("rect")
                .attr("width", bannerarea.width)
                .attr("height", bannerarea.height)
                .attr("fill", backgroundimage)
        }

        

            
        let textE = svg.append("g") 
            .attr("id","textContent")
            .append("text")
            .attr("dominant-baseline", "Alphabetic")
            .attr("transform", "translate(" + titletransform.left + "," + titletransform.top + ")")
            .attr("font-family", 'Arial-Regular')
            .attr("font-weight","bold")
            .attr("font-size", textsize)
            .attr("filter", backgroundcolor)
            

        let textE1 = svg.append("g") 
            .attr("id","textContent")
            .append("text")
            .attr("dominant-baseline", "Alphabetic")
            .attr("transform", "translate(" + titletransform.left + "," + titletransform.top + ")")
            .attr("font-family", 'Arial-Regular')
            .attr("font-weight","bold")
            .attr("font-size", textsize)
        

        
        // setting the text position in the title
        let position
        switch(style.position){
            case 'top-left':
                position = titleposition.left
                textE.attr("text-anchor", "start")
                textE1.attr("text-anchor", "start")
                break; 
            case 'top-center':
                position = titleposition.center
                textE.attr("text-anchor", "middle")
                textE1.attr("text-anchor", "middle")
                break; 
            case 'top-right':
                position = titleposition.right
                textE.attr("text-anchor", "end")
                textE1.attr("text-anchor", "end")
                break; 
            default:
                position = titleposition.left
                textE.attr("text-anchor", "start") 
                textE1.attr("text-anchor", "start")           
            }
        


        let line = '';
        let rowCount = 0;
        

        // 如果没有定义 duration
        if(animation.duration===-1){
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
                            .attr("x", position)
                            .attr("dy", lineHeight)
                            .text(line)
                            .transition()
                            .duration(0)
                            .attr("fill-opacity", 1);

                        textE1.append("tspan")
                            .attr("x", position)
                            .attr("dy", lineHeight)
                            .text(line)
                            .transition()
                            .duration(0)
                            .attr("fill-opacity", 1);

                        line = words[n];
                        rowCount ++;
                    }
                } else {
                    line = testLine;
                }
            }
            
            textE.append("tspan")
                .attr("x", position)
                .attr("dy", lineHeight)
                .text(line)
                .transition()
                .duration(0)
                .attr("fill-opacity", 1);

            textE1.append("tspan")
                .attr("x", position)
                .attr("dy", lineHeight)
                .text(line)
                .transition()
                .duration(0)
                .attr("fill-opacity", 1);

            virtualE.remove();
        }
        // 定义了 duration
        else{
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
                            .attr("x", position)
                            .attr("dy", lineHeight)
                            .text(line)
                            .transition()
                            .duration(animation.duration/2)
                            .attr("fill-opacity", 1)
                            .transition()
                            .duration(animation.duration/2)
                            .attr("fill-opacity", 0)
                            .remove();

                        textE1.append("tspan")
                            .attr("x", position)
                            .attr("dy", lineHeight)
                            .text(line)
                            .transition()
                            .duration(animation.duration/2)
                            .attr("fill-opacity", 1)
                            .transition()
                            .duration(animation.duration/2)
                            .attr("fill-opacity", 0)
                            .remove();

                        line = words[n];
                        rowCount ++;
                    }
                } else {
                    line = testLine;
                }
            }
            
            textE.append("tspan")
                .attr("x", position)
                .attr("dy", lineHeight)
                .text(line)
                .transition()
                .duration(animation.duration/2)
                .attr("fill-opacity", 1)
                .transition()
                .duration(animation.duration/2)
                .attr("fill-opacity", 0)
                .remove();

            textE1.append("tspan")
                .attr("x", position)
                .attr("dy", lineHeight)
                .text(line)
                .transition()
                .duration(animation.duration/2)
                .attr("fill-opacity", 1)
                .transition()
                .duration(animation.duration/2)
                .attr("fill-opacity", 0)
                .remove();
              
            virtualE.remove();
        }

        // 3. title section background color
    if (style["background-color"]){
            d3.select("#textContent")
            .insert("g", "text")
            .attr("id","titleBackGrnd")
            .append("rect")
            .attr("width", titlbackgroundearea.width)
            .attr("height", textE.node().getBBox().height)
            .attr("transform", "translate(" + titlebackgroundmargin.left + "," + titlebackgroundmargin.top + ")")
            .attr("fill", style["background-color"]);
        }

        
    // 4. title section border
    if (style["border-color"] || style["border-width"]){    
        svg.append("g")
        .attr("id","titleBackGrnd")
        .append("rect")
        .attr("width", titleborderarea.width)
        .attr("height", textE.node().getBBox().height)
        .attr("transform", "translate(" + titlebordermargin.left + "," + titlebordermargin.top + ")")
        .attr("stroke", style["border-color"]??  "black")
        .attr("stroke-width", style["border-width"]?? 2)
        .attr("fill-opacity",0)
    }

    // 5. divide-line border
    if (style["divide-line-width"] || style["divide-line-color"]){    
        svg.append("line")
        .attr("stroke", style["divide-line-color"]??  "black")
        .attr("stroke-width", style["divide-line-width"]?? 2)
        .attr("x1", textE.node().getBBox().x)
        .attr("y1", 15 + textE.node().getBBox().height)
        .attr("x2", textE.node().getBBox().x + textE.node().getBBox().width)
        .attr("y2", 15 +  textE.node().getBBox().height);     
    }
    
    
    }
}

export default Fade