import Annotator from './annotator';

class Symbol extends Annotator {
    annotate(chart, target, style, animation) {
        let svg = chart.svg();
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

            // identify the position
            let data_x, data_y, data_r, offset_y;
            const size_icon = 20;
            const nodeName = focus_element.nodeName;
            if (nodeName === "circle") { // get center
                data_x = parseFloat(focus_element.getAttribute("cx"));
                data_y = parseFloat(focus_element.getAttribute("cy"));
                data_r = parseFloat(focus_element.getAttribute("r"));
                offset_y = - data_r - size_icon;
            } else if (nodeName === "rect") {
                const bbox = focus_element.getBBox();
                data_x = bbox.x + bbox.width / 2;
                data_y = bbox.y;
                offset_y = 10;
            } else { // currently not support
                return;
            }

            // append icon
            svg.append("image")
                .attr("class", "icon-img")
                .attr("x", data_x - size_icon / 2)
                .attr("y", data_y + offset_y)
                .attr("width", size_icon)
                .attr("height", size_icon)
                .attr("xlink:href", () => {
                    if("icon-url" in style) {
                        return style["icon-url"];
                    } else {
                        return ;
                    }
                })
        
        }   
            
    }
}

export default Symbol;