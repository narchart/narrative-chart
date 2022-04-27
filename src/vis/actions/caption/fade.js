import Captioner from './captioner';
import * as d3 from 'd3';
/**
 * @description An captioner for adding caption with fade animation
 * 
 * @class
 * @extends Captioner
 */

class Fade extends Captioner {
    /**
     * @description Add the caption at the bottom of chart
     * 
     * @param {vis} visualization src/vis/visualization.js
     * @param {{text: text, font-size:font-size}} style Style parameters of the caption.
     * @param {{delay: number, duration: number}} animation Animation parameters of the caption.
     * 
     * 
     * @return {void}
     */

    makecaption(vis, style, animation) {


        let svg = d3.select(vis.container()).select("svg")

        let words = style.text.split(" ").filter(d => d !== "");

        let textsize = style['font-size']? style['font-size']: 16

    
        let virtualE = svg.append("text")
            .attr("font-family", 'Arial-Regular')
            .attr("font-size", textsize)
            .text(words[0]);

        let textE = svg.append("text")
            .attr("dominant-baseline", "central")
            .attr("transform", "translate(" + 0 + "," + 60 + ")")
            .attr("font-family", 'Arial-Regular')
            .attr("font-size", textsize)
        
            let position
            switch(style.position){
                case 'top-left':
                    position = 30
                    textE.attr("text-anchor", "start")
                    break; 
                case 'top-center':
                    position = "50%"
                    textE.attr("text-anchor", "middle")
                    break; 
                case 'top-right':
                    position = 610
                    textE.attr("text-anchor", "end")
                    break; 
                default:
                    position = 40
                    textE.attr("text-anchor", "start") 
                }
    


        let maxWidth = Math.max(virtualE.node().getComputedTextLength(), 590);
        const lineHeight = virtualE.node().getBBox().height * 0.9;
        let line = '';
        let rowCount = 0;
        const maxRow = textsize > 14 ? 2: 3;

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
                            .duration(animation.duration*0.25)
                            .attr("fill-opacity", 1)
                            .transition()
                            .delay(animation.duration*0.5)
                            .duration(animation.duration*0.25)
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
                .duration(animation.duration*0.25)
                .attr("fill-opacity", 1)
                .transition()
                .delay(animation.duration*0.5)
                .duration(animation.duration*0.25)
                .attr("fill-opacity", 0)
                .remove();
            virtualE.remove();
            
        }
    }
}

export default Fade