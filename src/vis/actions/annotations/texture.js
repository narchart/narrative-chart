import * as d3 from 'd3';
import Annotator from './annotator'

/**
 * @description An annotator for filling texture.
 * 
 * @class
 * @extends Annotator
 */
class Texture extends Annotator {

    /**
     * @description Fill target marks with texture.
     * 
     * @param {Chart} chart src/vis/charts/chart.js
     * @param {Array} target It describes the data scope of the annotation, which is defined by a list of filters: [{field_1: value_1}, ..., {field_k, value_k}]. By default, the target is the entire data.
     * @param {{color: string}} style Style parameters of the annotation.
     * @param {{delay: number, duration: number}} animation Animation parameters of the annotation.
     * 
     * @return {void}
     */
    annotate(chart, target, style, animation) {
        let svg = chart.svg();
        d3.selection.prototype.moveToFront = function() {  
            return this.each(function(){
                this.parentNode.appendChild(this);
            });
        };
        var config = {
            "texture_size" : 300
        }
        var defs = svg.append('svg:defs');
        console.log(animation)
        defs.append("svg:pattern")
            .attr("id", "texture_background")
            .attr("width", config.texture_size)
            .attr("height", config.texture_size)
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
            .transition()
            .duration('duration' in animation ? animation['duration']: 0)
            .style("fill", "url(#texture_background)")
            // .moveToFront();

    }
}

export default Texture;