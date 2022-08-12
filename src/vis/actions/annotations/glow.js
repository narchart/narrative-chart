import Color from '../../visualization/color';
import Annotator from './annotator'
import { TreeMap } from '../../charts';

const COLOR = new Color();

/**
 * @description An annotator for filling color.
 * 
 * @class
 * @extends Annotator
 */
class Glow extends Annotator {

    /**
     * @description Fill target marks with color.
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
        var defs = svg.append("defs");
        var filter = defs.append("filter")
            .attr("id", "drop-shadow")
            .attr("height", "150%");

        filter.append("feGaussianBlur")
            .attr("in", "StrokePaint")
            // .attr("in", "SourceAlpha")
            .attr("stdDeviation", 2)
            .attr("result", "blur");

        filter.append("feOffset")
            .attr("in", "blur")
            .attr("dx", 0)
            .attr("dy", 0)
            .attr("result", "offsetBlur");

        var feMerge = filter.append("feMerge");


        feMerge.append("feMergeNode")
            .attr("in", "offsetBlur")
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");
        feMerge.append("feMergeNode")
            .attr("in", "FillPaint");

        svg.selectAll(".mark")
            .filter(function(d) {
                if (target.length === 0) {
                    return true
                }
                if (chart instanceof TreeMap) {
                    d = d.data
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
            .style("stroke",  function() {
                if ('color' in style) {
                    return style['color']
                } else {
                    return COLOR.ANNOTATION
                }
            })
            .attr("stroke-opacity", 1)
            .attr("stroke-width", 2)
            .style("filter", "url(#drop-shadow)")
            .attr("opacity",1)
    }
}

export default Glow;