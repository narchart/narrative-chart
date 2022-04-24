import * as d3 from 'd3';
import Color from '../../visualization/color';
import Annotator from './annotator';

/**
 * @description An annotator for drawing contour.
 * 
 * @class
 * @extends Annotator
 */
class Contour extends Annotator {
    /**
     * @description Annotate targeted elements with contour.
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
        // method to move the specific element to the top layer
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
            .transition()
            .duration('duration' in animation ? animation['duration']: 0)
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
            // .moveToFront();

    }
}

export default Contour;