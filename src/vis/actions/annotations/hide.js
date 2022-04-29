import * as d3 from 'd3';
import Annotator from './annotator'

class Hide extends Annotator {
    annotate(chart, target, style, animation) {
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
                        continue
                    } else {
                        return false
                    }
                }
                return true
            })
            .transition()
            .duration('duration' in animation ? animation['duration']: 0)
            .attr("opacity", 0);
    }
}

export default Hide