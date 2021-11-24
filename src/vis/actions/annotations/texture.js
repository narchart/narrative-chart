import * as d3 from 'd3';
import Annotator from './annotator'
class Texture extends Annotator {
    annotate(chart, target, style) {
        let svg = chart.svg();
        d3.selection.prototype.moveToFront = function() {  
            return this.each(function(){
                this.parentNode.appendChild(this);
            });
        };
        var config = {
            "avatar_size" : 300
        }
        var defs = svg.append('svg:defs');
        defs.append("svg:pattern")
            .attr("id", "grump_avatar")
            .attr("width", config.avatar_size)
            .attr("height", config.avatar_size)
            .attr("patternUnits", "userSpaceOnUse")
            .append("svg:image")
            .attr("xlink:href", style["background-image"])
            .attr("x", 0)
            .attr("y", 0);
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
            .style("fill", "url(#grump_avatar)")
            .moveToFront();
    }
}

export default Texture;