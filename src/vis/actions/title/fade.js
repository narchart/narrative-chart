import Titler from './titler'
import * as d3 from 'd3';
class Fade extends Titler {
    maketitle(vis, style, animation) {

        let margin = {
            top : 20,
            left: 30

        }

        
        let svg = d3.select(vis.container()).select("svg")

        let words = style.text.split(" ").filter(d => d !== "");

        let textsize = style['font-size']? style['font-size']: 16
        

    
        let virtualE = svg.append("text")
            .attr("font-family", 'Arial-Regular')
            .attr("font-size", textsize)
            .text(words[0]);

        let textE = svg.append("text")
            .attr("dominant-baseline", "central")
            .attr("transform", "translate(" + margin.left + "," + 0 + ")")
            .attr("font-family", 'Arial-Regular')
            .attr("font-weight","bold")
            .attr("font-size", textsize)
            .attr("text-anchor", "start");
        
        let maxWidth = Math.max(virtualE.node().getComputedTextLength(), 600);
        const lineHeight = virtualE.node().getBBox().height * 0.9;

        let line = '';
        let rowCount = 0;
        const maxRow = textsize > 16 ? 2: 3;

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
                            .attr("x", 0)
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
                .attr("x", 0)
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
                            .attr("x", 0)
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
                .attr("x", 0)
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
    }
}

export default Fade