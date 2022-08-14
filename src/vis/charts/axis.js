import * as d3 from 'd3';
import Color from '../visualization/color';

const COLOR = new Color();

class Axis {
    constructor(content) {
        this.content = content; // axis content
        this._data = [];
        this._width = 0;
        this._height = 0;
        this._xScale = {};
        this._yScale = {}
    }

    data(value) {
        if (!value) {
            return this._data;
        }
        this._data = value;
    }

    width(value) {
        if (!value) {
            return this._width;
        }
        this._width = value;
    }

    height(value) {
        if (!value) {
            return this._height;
        }
        this._height = value;
    }

    xScale(value) {
        if (!value) {
            return this._xScale;
        }
        this._xScale = value;
    }

    yScale(value) {
        if (!value) {
            return this._yScale;
        }
        this._yScale = value;
    }

    addX(type, encoding, style = {}) {
        switch (type) {
            case "C":
            case "categorical":
            case "Categorical":
                this.addCategoricalX(encoding, style);
                break;
            case "T":
            case "temporal":
            case "Temporal":
                this.addTemporalX(encoding, style);
                break;
            default:
                this.addNumericalX(encoding, style);
        }
    }

    addY(type, encoding, style = {}) {
        switch (type) {
            case "C":
            case "categorical":
            case "Categorical":
                this.addCategoricalY(encoding, style);
                break;
            case "T":
            case "temporal":
            case "Temporal":
                this.addTemporalY(encoding, style);
                break;
            default:
                this.addNumericalY(encoding, style);
        }
    }

    addNumericalX(encoding, style = {}) {
        let width = this.width();
        let height = this.height();
        let xScale = this.xScale();

        let axis_X = this.content.append("g")
            .attr("class", "axis_X");

        let axisX = d3.axisBottom(xScale)
            .ticks(5)
            .tickPadding(5)
            .tickFormat(function (d) {
                if ((d / 1000000) >= 1) {
                    d = d / 1000000 + "M";
                } else if ((d / 1000) >= 1) {
                    d = d / 1000 + "K";
                }
                return d;
            });

        axis_X.append("g")
            .attr("class", "axis_x")
            .attr('transform', `translate(0, ${height})`)
            .call(axisX)
        
        // Grid line
        // axis_X.selectAll(".axis_x .tick")
        //     .append("line")
        //     .attr("stroke", d => {
        //         if ((d !== 0) || (!this.y)) { return COLOR.DIVIDER; }
        //     })
        //     .attr("class", "gridline")
        //     .attr("x1", 0)
        //     .attr("y1", -height)
        //     .attr("x2", 0)
        //     .attr("y2", 0);

        // axis_X.append("line")
        //     .attr("stroke", COLOR.DIVIDER)
        //     .attr("class", "gridline")
        //     .attr("x1", width)
        //     .attr("y1", height)
        //     .attr("x2", width)
        //     .attr("y2", 0);

        // specify color for axis elements
        // tick 
        axis_X.selectAll(".tick")
            .select("line")
            .attr("stroke", COLOR.AXIS);
        // domain path
        axis_X.selectAll(".domain")
            .attr("stroke", COLOR.AXIS);
        // tick label
        axis_X.selectAll(".tick")
            .selectAll("text")
            .attr("fill", COLOR.AXIS)
            .attr("font-size", style['labelFontSize'] || 10)
            .attr("text-anchor", "middle")
            .attr("transform", `rotate(-${style['labelAngle'] || 0} 0 10)`);

        /* draw labels */
        const labelPadding = 24, fontsize = 16;

        axis_X.append("text")
            .attr("x", width / 2)
            .attr("y", height + labelPadding)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "hanging")
            .attr("font-size", fontsize)
            .attr("fill", COLOR.AXIS)
            .text(encoding);

    }

    addCategoricalX(encoding, style = {}) { 
        let width = this.width();
        let height = this.height();
        let xScale = this.xScale();

        let axisX = d3.axisBottom(xScale);

        let axis_X = this.content.append("g")
            .attr("class", "axis_x")
            .attr('transform', `translate(0, ${height})`)
            .call(axisX);

        // specify color for axis elements
        // tick
        axis_X.selectAll(".tick line")
            .attr("stroke", COLOR.AXIS);
        // domain path
        axis_X.selectAll(".domain")
            .attr("stroke", COLOR.AXIS);
        // tick label
        axis_X.selectAll(".tick")
            .selectAll("text")
            .attr("fill", COLOR.AXIS)
            .attr("font-size", style['labelFontSize'] || 10)
            .attr("text-anchor", "end")
            .attr("transform", `rotate(-${style['labelAngle'] || 45} 0 10)`)

        // axix-label
        const fontsize = 16;

        axis_X.append("text")
            .attr("x", width / 2)
            .attr("y", 65 - 5) //svg.selectAll(".axis_x").select("path").node().getBBox().height + offset
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "hanging")
            .attr("font-size", fontsize)
            .attr("fill", COLOR.AXIS)
            .text(encoding);
    }

    addTemporalX(encoding, style = {}) { 
        let width = this.width();
        let height = this.height();
        let xScale = this.xScale();

        let axis_X = this.content.append("g")
            .attr("class", "axis_X");

        let axisX = d3.axisBottom(xScale)
            .ticks(5)
            .tickSize(5)
            .tickPadding(5)
            .tickFormat(function (d) {
                var date = d.split('/')
                return date[1]+'/'+date[2];
            });
        
        axis_X.append("g")
            .attr("class", "axis_x")
            .attr('transform', `translate(0, ${height})`)
            .call(axisX);
        
        // specify color for axis elements
        // tick
        axis_X.selectAll(".tick line")
            .attr("stroke", COLOR.AXIS);
        // domain path
        axis_X.selectAll(".domain")
            .attr("stroke", COLOR.AXIS);
        // tick label
        axis_X.selectAll(".tick")
            .selectAll("text")
            .attr("fill", COLOR.AXIS)
            .attr("font-size", style['labelFontSize']?style['labelFontSize']:10)
            .attr("text-anchor", style['labelAngle']?"end":"middle")
            .attr("transform", `rotate(-${style['labelAngle']?style['labelAngle']:0} 0 0)`);

        /* draw labels */
        const labelPadding = 24, fontsize = 16;

        axis_X.append("text")
            .attr("x", width / 2)
            .attr("y", height + labelPadding) // + svg.selectAll(".axis_x").select("path").node().getBBox().height
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "hanging")
            .attr("font-size", fontsize)
            .attr("fill", COLOR.AXIS)
            .text(encoding);
    }

    addNumericalY(encoding, style = {}) {
        let height = this.height();
        let yScale = this.yScale();

        let axis_Y = this.content.append("g")
            .attr("class", "axis_Y");

        let axisY = d3.axisLeft(yScale)
            .ticks(5)
            .tickPadding(5)
            .tickFormat(function (d) {
                if ((d / 1000000) >= 1) {
                    d = d / 1000000 + "M";
                } else if ((d / 1000) >= 1) {
                    d = d / 1000 + "K";
                }
                return d;
            });

        axis_Y.append("g")
            .attr("class", "axis_y")
            .call(axisY);

        // specify color for axis elements
        // tick 
        axis_Y.selectAll(".tick")
            .select("line")
            .attr("stroke", COLOR.AXIS);
        // domain path
        axis_Y.selectAll(".domain")
            .attr("stroke", COLOR.AXIS);
        // tick label
        axis_Y.selectAll(".tick")
            .selectAll("text")
            .attr("fill", COLOR.AXIS)
            .attr("font-size", style['labelFontSize'] || 10)
            .attr("transform", `rotate(-${style['labelAngle'] || 0} -10 0)`);

        // for grid line
        // axis_Y.selectAll(".axis_y .tick")
        //     .append("line")
        //     .attr("stroke", d => {
        //         if ((d !== 0) || (!this.x)) { return COLOR.DIVIDER; }
        //     })
        //     .attr("class", "gridline")
        //     .attr("x1", 0)
        //     .attr("y1", 0)
        //     .attr("x2", width)
        //     .attr("y2", 0);

        // axis_Y.append("line")
        //     .attr("stroke", COLOR.DIVIDER)
        //     .attr("class", "gridline")
        //     .attr("x1", 0)
        //     .attr("y1", 0)
        //     .attr("x2", width)
        //     .attr("y2", 0);

        /* draw labels */
        const labelPadding = 24, fontsize = 16;

        axis_Y.append("text")
            .attr("transform", `translate(${-labelPadding}, ${height / 2}) rotate(-90)`)
            .attr("text-anchor", "middle")
            .attr("font-size", fontsize)
            .attr("fill", COLOR.AXIS)
            .text(encoding);
    }

    addCategoricalY(encoding, style = {}) { 
        let width = this.width();
        let height = this.height();
        let yScale = this.yScale();

        let axisY = d3.axisLeft(yScale)
            .ticks(5)
            .tickSize(0, 0, 0)
            .tickPadding(5)
            .tickFormat(function (d) {
                if ((d / 1000000) >= 1) {
                    d = d / 1000000 + "M";
                } else if ((d / 1000) >= 1) {
                    d = d / 1000 + "K";
                }
                return d;
            });

        let axis_Y = this.content.append("g")
            .attr("class", "axis_y")
            .attr('transform', `translate(0, ${height})`)
            .call(axisY);

        // specify color for axis elements
        // tick
        axis_Y.selectAll(".tick line")
            .attr("stroke", COLOR.AXIS);
        // domain path
        axis_Y.selectAll(".domain")
            .attr("stroke", COLOR.AXIS);
        // tick label
        axis_Y.selectAll(".tick")
            .selectAll("text")
            .attr("fill", COLOR.AXIS)
            .attr("font-size", style['labelFontSize'] || 10)
            .attr("text-anchor", "end")
            .attr("transform", `rotate(-${style['labelAngle'] || 45} 0 10)`)

        // draw y axis path
        axis_Y.selectAll(".axis_y .tick")
            .append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", 0 - height);

        axis_Y.selectAll(".axis_y .tick text")
            .attr("transform", "translate(3, 0)");

        // axix-label
        const fontsize = 16;

        axis_Y.append("text")
            .attr("x", width / 2)
            .attr("y", 30) // svg.selectAll(".axis_y").select("path").node().getBBox().height
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "hanging")
            .attr("font-size", fontsize)
            .attr("fill", COLOR.AXIS)
            .text(encoding);

        /** draw grid */
        axis_Y.selectAll(".axis_y .tick line")
            .attr("class", "gridline")
            .attr("stroke", d => {
                if (d === 0) return 0;
                else return COLOR.DIVIDER;
            });
    }

    addTemporalY(encoding, style = {}) { }

    removeX() {
        this.content.selectAll(".axis_X").remove();
    }

    removeY() {
        this.content.selectAll(".axis_Y").remove();
    }
}

export default Axis;