import Annotator from './annotator'
import Color from '../../visualization/color';

class Circle extends Annotator {
    annotate(chart, target, style) {
        let svg = chart.svg();
        let selected = svg.selectAll(".mark")
            .filter(function (d) {
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

        const padding = 5;
        selected.nodes().forEach(item => {
            if (item.nodeName === "circle") {
                let circleR = Number(item.getAttribute("r")) + padding,
                    circleX = item.getAttribute("cx"),
                    circleY = item.getAttribute("cy");

                svg.append("circle")
                    .attr("fill", "none")
                    .attr("stroke", Color().ANNOTATION)
                    .attr("stroke-width", 2)
                    .attr("x", circleX)
                    .attr("y", circleY)
                    .attr("transform", "translate(" + circleX + "," + circleY + ")")
                    .attr("r", circleR)
            } else if (item.nodeName === "rect") {
                let circleY = item.getAttribute("y"),
                    width = item.getAttribute("width"),
                    circleX = Number(item.getAttribute("x")) + width / 2,
                    circleR = width / 2 + padding;
                svg.append("circle")
                    .attr("fill", "none")
                    .attr("stroke", Color().ANNOTATION)
                    .attr("stroke-width", 2)
                    .attr("x", circleX)
                    .attr("y", circleY)
                    .attr("transform", "translate(" + circleX + "," + circleY + ")")
                    .attr("r", circleR)
            }

        });
    }
}

export default Circle