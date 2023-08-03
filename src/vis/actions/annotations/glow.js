import Color from '../../visualization/color';
import Annotator from './annotator'

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
     * @param {Array} target It describes the data scope of the annotation, which is defined by a list of filters: [{axis_1}, {axis_2}, {field_1: value_1}, ..., {field_k, value_k}]. Where {axis} stands for target as a coordinate axis and {field, value} stands for target as a point. By default, the target is the entire data.
     * @param {{color: string}} style Style parameters of the annotation.
     * @param {{delay: number, duration: number}} animation Animation parameters of the annotation.
     * 
     * @return {void}
     */
    annotate(chart, target, style, animation) {
        let svg = chart.svg();
        var defs = svg.append("defs");
        var filteredTarget = target;
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

        // target is the axis(s) 
        if (target.length !== 0) {
            target.forEach(function(item) {
                if ('axis' in item) {
                  // Handle cases that contain "axis"
                  console.log('Axis:', item.axis);
                  if(item.axis === "x"){
                    // domain path
                    svg.select(".axis_x")
                       .selectAll(".domain")
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
                    // tick
                    svg.select(".axis_x")
                       .selectAll(".tick")
                       .selectAll("line")
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
                    //    .style("filter", "url(#drop-shadow)")
                       .attr("opacity",1)
                  }
                  else if(item.axis === "y"){
                    // domain path
                    svg.select(".axis_y")
                       .selectAll(".domain")
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
                    // tick
                    svg.select(".axis_y")
                       .selectAll(".tick")
                       .selectAll("line")
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
                    //    .style("filter", "url(#drop-shadow)")
                       .attr("opacity",1)
                  }
                }
            })
            filteredTarget = target.filter(function(item) {
                if ('axis' in item) {
                  return false; // Returning false excludes axis objects from the new array
                } else {
                  return true; 
                }
              });
        }

        // target is the point(s) 
        svg.selectAll(".mark")
            .filter(function(d) {
                if (filteredTarget.length === 0) {
                    return true
                }
                for (const item of filteredTarget) {
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