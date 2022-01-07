import Annotator from './annotator';
import { Scatterplot } from '../../charts';
import Color from '../../visualization/color';

class Label extends Annotator {
    annotate(chart, target, style) {
      
        let svg = chart.svg();
        // const measure = chart.measure();
        // const breakdown = chart.breakdown()
        // let yEncoding;
        // if(chart instanceof Scatterplot) {
        //     yEncoding = breakdown[0].field;
        // } else {
        //     yEncoding = measure[0].aggregate === "count" ? "COUNT" : measure[0].field;
        // }

        let yEncoding = chart.y.field;
        // console.log('yEncoding', yEncoding)
         
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
            if (nodeName === "circle") { // get center
                data_x = parseFloat(focus_element.getAttribute("cx"));
                data_y = parseFloat(focus_element.getAttribute("cy"));
                data_r = parseFloat(focus_element.getAttribute("r"));
                offset_y = - data_r - 10;
            } else if (nodeName === "rect") {
                const bbox = focus_element.getBBox();
                data_x = bbox.x + bbox.width / 2;
                data_y = bbox.y;
                offset_y = -10;
            } else { // currently not support
                return;
            }

            // draw text
            svg.append("text")
                .attr("class", "text")
                .attr("x", data_x)
                .attr("y", data_y + offset_y)
                .text(formatData)
                .attr("font-size", () => {
                    if ("font-size" in style) {
                        return style["font-size"];
                    } else {
                        return 12;
                    }
                })
                .attr("fill", () => {
                    if ("color" in style) {
                        return style["color"];
                    } else {
                        return Color().TEXT;
                    }
                })
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "Alphabetic");
        
        }   
            
    }
}

export default Label;