import Annotator from './annotator'

class Desaturate extends Annotator {
    annotate(chart, target, style, animation) {
        let svg = chart.svg();
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
            .attr("opacity", 1)
            .transition()
            .duration('duration' in animation ? animation['duration']: 0)
            .attr("fill", "lightgray")
    }
}

export default Desaturate