import Color from '../../visualization/color';
import Annotator from './annotator'

class Glow extends Annotator {
    annotate(chart, target, style) {
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
                for (const item of target) {
                    if (d[item.field] === item.value) {
                        return true
                    }
                }
                return false
            })
            .style("stroke",  Color().ANNOTATION)
            .style("stroke-width", 2)
            .style("filter", "url(#drop-shadow)")
            .attr("opacity", 1)
    }
}

export default Glow;