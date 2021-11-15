import * as d3 from 'd3';
import Color from '../../visualization/color';
import Annotator from './annotator';

class Contour extends Annotator {
    annotate(chart, target, style) {
        let svg = chart.svg();
        d3.selection.prototype.moveToFront = function() {  
            return this.each(function(){
                this.parentNode.appendChild(this);
            });
        };
        svg.selectAll(".mark")
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
            })
            .attr("stroke-width", 2)
            .attr("stroke-alignment", "outer")
            .attr("opacity", 1)
            .attr("stroke", function() {
                if ('color' in style) {
                    return style['color']
                } else {
                    return Color().ANNOTATION
                }
            })
            .moveToFront();

    }
}

export default Contour;