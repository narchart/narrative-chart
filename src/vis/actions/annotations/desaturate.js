import Annotator from './annotator'
import { TreeMap } from '../../charts';

class Desaturate extends Annotator {
    annotate(chart, target, style, animation) {
        let svg = chart.svg();
        svg.selectAll(".mark")
            .filter(function(d) {
                if (target.length === 0) {
                    return true
                }
                if (chart instanceof TreeMap) {
                    d = d.data
                    for (const item of target) {
                        if (d[item.field] !== item.value) {
                            return true
                        } else {
                            return false
                        }
                    }
                } else {
                    for (const item of target) {
                        if (d[item.field] === item.value) {
                            continue
                        } else {
                            return false
                        }
                    }
                    return true
                }
            })
            .attr("opacity", 1)
            .transition()
            .duration('duration' in animation ? animation['duration']: 0)
            .attr("fill", "lightgray")
    }
}

export default Desaturate