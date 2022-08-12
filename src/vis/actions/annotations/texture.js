import * as d3 from 'd3';
import Annotator from './annotator';
import { PieChart,Unitvis,LineChart,Scatterplot,AreaChart,TreeMap } from '../../charts';

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

        // var config = {
        //     "texture_size" : 300
        // }
        // var defs = svg.append('svg:defs');
        // defs.append("svg:pattern")
        //     .attr("id", "texture_background")
        //     .attr("width", config.texture_size)
        //     .attr("height", config.texture_size)
        //     .attr("patternUnits", "userSpaceOnUse")
        //     .append("svg:image")
        //     .attr("xlink:href", style["background-image"])
        //     .attr("x", 0)
        //     .attr("y", 0);

            
        const uid = Date.now().toString() + Math.random().toString(36).substring(2);
        let focus_elements = svg.selectAll(".mark")
        .filter(function (d) {
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
        });

        if ("type" in animation && animation["type"] === "wipe") {
            var configWipe = {
                "texture_size" : 300
            }
            var defsWipe = svg.append('svg:defs');
            defsWipe.append("svg:pattern")
                .attr("id", "texture_background")
                .attr("width", configWipe.texture_size)
                .attr("height", configWipe.texture_size)
                .attr("patternUnits", "userSpaceOnUse")
                .append("svg:image")
                .attr("xlink:href", style["background-image"])
                .attr("x", 0)
                .attr("y", 0);
    
            focus_elements.nodes().forEach(one_element => {
                const nodeName = one_element.nodeName;
                if (nodeName === "rect") {
                    let e_x = parseFloat(one_element.getAttribute("x"));
                    let e_y = parseFloat(one_element.getAttribute("y"));
                    let e_width = parseFloat(one_element.getAttribute("width"));
                    let e_height = parseFloat(one_element.getAttribute("height"));
                    let e_color = one_element.getAttribute("fill");

                    const cover  = svg.append("rect")
                        .attr("class", "cover")
                        .attr("clip-path", `url(#clip_cover_${uid})`)
                        .attr("x", e_x)
                        .attr("y", e_y)
                        .attr("width", e_width)
                        .attr("height", e_height)
                        .attr("fill", e_color)
                    
                    const regBox = cover.node().getBBox();

                    svg.append("defs")
                        .append("clipPath")
                        .attr("id", `clip_cover_${uid}`)
                        .append("rect")
                        .attr("x", regBox.x)
                        .attr("y", regBox.y)
                        .attr("height", regBox.height)
                        .attr("width", regBox.width)
                        .transition()
                        .duration('duration' in animation ? animation['duration']: 0)
                        .attr("height", 0);
                }
            })

            focus_elements.style("fill", "url(#texture_background)"); 

        } 
        else {
            if (chart instanceof Unitvis) {
                svg.selectAll(".mark")
                    .filter(function (d) {
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
                    .duration('duration' in animation ? animation['duration'] : 0)
                    .attr("fill", (d, i) => {
                        const uid = Date.now().toString() + Math.random().toString(36).substring(2);
                        let defs = svg.append('svg:defs');
                        defs.append("svg:pattern")
                            .attr("id", "unit-texture-image-" + uid)
                            .attr("width", 1)
                            .attr("height", 1)
                            .attr("patternUnits", "objectBoundingBox")
                            .append("svg:image")
                            .attr("xlink:href", style["background-image"])
                            .attr("width", 2 * d.radius())
                            .attr("height", 2 * d.radius())
                            .attr("x", 0)
                            .attr("y", 0);
                        return "url(#unit-texture-image-" + uid + ")"
                    }
                    )
            } else if (chart instanceof LineChart) {
                svg.selectAll(".mark")
                    .filter(function (d) {
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
                    .duration('duration' in animation ? animation['duration'] : 0)
                    .attr("fill", (d, i) => {
                        let dotRadius;
                        focus_elements.nodes().forEach(one_element => {
                            dotRadius = parseFloat(one_element.getAttribute("r"));
                        })
                        const uid = Date.now().toString() + Math.random().toString(36).substring(2);

                        let defs = svg.append('svg:defs');
                        defs.append("svg:pattern")
                            .attr("id", "linechart-texture-image-" + uid)
                            .attr("width", 1)
                            .attr("height", 1)
                            .attr("patternUnits", "objectBoundingBox")
                            .append("svg:image")
                            .attr("xlink:href", style["background-image"])
                            .attr("width", 2 * dotRadius)
                            .attr("height", 2 * dotRadius)
                            .attr("x", 0)
                            .attr("y", 0);
                        return "url(#linechart-texture-image-" + uid + ")"
                    }
                    )
            } else if (chart instanceof Scatterplot) {
                svg.selectAll(".mark")
                    .filter(function (d) {
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
                    .duration('duration' in animation ? animation['duration'] : 0)
                    .attr("fill", (d, i) => {
                        let defsScatterplot = svg.append('svg:defs');
                        const uid = Date.now().toString() + Math.random().toString(36).substring(2);
                        defsScatterplot.append("svg:pattern")
                            .attr("id", "scatterplot-texture-image-" + uid)
                            .attr("width", 1)
                            .attr("height", 1)
                            .attr("patternUnits", "objectBoundingBox")
                            .append("svg:image")
                            .attr("xlink:href", style["background-image"])
                            .attr("width", 2 * d.size())
                            .attr("height", 2 * d.size())
                            .attr("x", 0)
                            .attr("y", 0);
                        return "url(#scatterplot-texture-image-" + uid + ")"
                    }
                    )
            } else if (chart instanceof PieChart) {
                var selectedMarks = svg.selectAll(".mark")
                    .filter(function (d) {
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
                    .duration('duration' in animation ? animation['duration'] : 0)
                    .style("fill", (d, i) => {
                        const uid = Date.now().toString() + Math.random().toString(36).substring(2);
                        var image = new Image();
                        image.src = style["background-image"];
                        image.id = uid;

                        let markWidth = focus_elements.node().getBBox().width;
                        let markHeight = focus_elements.node().getBBox().height;
                    
                        var textureWidth, textureHeight, scaleWidth, scaleHeight
                        var configPieChart
                    
                        image.onload = function () {
                            textureWidth = image.naturalWidth ? image.naturalWidth : markWidth
                            textureHeight = image.naturalHeight ? image.naturalHeight : markWidth
                            scaleWidth = textureWidth / markWidth
                            scaleHeight = textureHeight / markHeight
                            if (scaleWidth < scaleHeight) {
                                configPieChart = {
                                    "texture_size_width": markWidth,
                                    "texture_size_height": markWidth * textureHeight / textureWidth
                                }
                            } else {
                                configPieChart = {
                                    "texture_size_width": markHeight * textureWidth / textureHeight,
                                    "texture_size_height": markHeight
                                }
                            }
               
                            var defsPieChart = svg.append('svg:defs');
                            defsPieChart.append("svg:pattern")
                                .attr("id", "piechart-texture-image-" + uid)
                                .attr("width", 1)
                                .attr("height", 1)
                                .attr("patternUnits", "objectBoundingBox")
                                .append("svg:image")
                                .attr("xlink:href", style["background-image"])
                                .attr("width", configPieChart.texture_size_width)
                                .attr("height", configPieChart.texture_size_height)
                        }
                        return "url(#piechart-texture-image-" + uid + ")"
                    })

                focus_elements.nodes().forEach(one_element => {
                    let data_temp = one_element.__data__;
                    let data_x = data_temp.centroidX();
                    let data_y = data_temp.centroidY();
                    selectedMarks.attr("x", data_x - 150)
                        .attr("y", data_y - 150)
                })

            } else if (chart instanceof AreaChart) {
                svg.selectAll(".mark")
                    .filter(function (d) {
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
                    .duration('duration' in animation ? animation['duration'] : 0)
                    .attr("fill", (d, i) => {
                        let dotRadius;
                        focus_elements.nodes().forEach(one_element => {
                            dotRadius = parseFloat(one_element.getAttribute("r"));
                        })
                        const uid = Date.now().toString() + Math.random().toString(36).substring(2);

                        let defs = svg.append('svg:defs');
                        defs.append("svg:pattern")
                            .attr("id", "linechart-texture-image-" + uid)
                            .attr("width", 1)
                            .attr("height", 1)
                            .attr("patternUnits", "objectBoundingBox")
                            .append("svg:image")
                            .attr("xlink:href", style["background-image"])
                            .attr("width", 2 * dotRadius)
                            .attr("height", 2 * dotRadius)
                            .attr("x", 0)
                            .attr("y", 0);
                        return "url(#linechart-texture-image-" + uid + ")"
                    }
                    )
            } else if (chart instanceof TreeMap) { 
                let focus_elements = svg.selectAll(".mark")
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
                if (focus_elements.nodes().length === 0) {
                    return 
                }
                let node = focus_elements.nodes()[0]
                let bbox = node.getBBox()
                var config = {
                    "texture_size": bbox.width
                }
                var defs = svg.append('svg:defs');
                defs.append("svg:pattern")
                    .attr("id", "texture_background")
                    .attr("width", config.texture_size)
                    .attr("height", config.texture_size)
                    .attr("patternUnits", "userSpaceOnUse")
                    .append("svg:image")
                    .attr("xlink:href", style["background-image"])
                    .attr("preserveAspectRatio","xMidYMid slice")
                    .attr("width", config.texture_size)
                    .attr("height", bbox.height)
                    .attr("x", 0)
                    .attr("y", 0);
                
                focus_elements.transition()
                    .duration('duration' in animation ? animation['duration']: 0)
                    .style("fill", "url(#texture_background)")
                
            } else {                
                var config = {
                    "texture_size" : 300
                }
                var defs = svg.append('svg:defs');
                defs.append("svg:pattern")
                    .attr("id", "texture_background")
                    .attr("width", config.texture_size)
                    .attr("height", config.texture_size)
                    .attr("patternUnits", "userSpaceOnUse")
                    .append("svg:image")
                    .attr("xlink:href", style["background-image"])
                    .attr("width", config.texture_size)
                    .attr("height", config.texture_size)
                    .attr("x", 0)
                    .attr("y", 0);
        
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
                .style("fill", "url(#texture_background)")
            }      
        }
    }
}

export default Texture;