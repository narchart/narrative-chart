import * as d3 from 'd3';
import Chart from '../chart';
import Color from '../../visualization/color';

class Scatterplot extends Chart {

    visualize() {
        // if (this.measure().length < 2) return;
        let margin = {
            "top": 10,
            "right": 10,
            "bottom": 50,
            "left": 50
        }
        this.width(this.width() - margin.left - margin.right);
        this.height(this.height() - margin.top - margin.bottom);

        this._svg = d3.select(this.container())
            .append("svg")
            .attr("width", this.width() + margin.left + margin.right)
            .attr("height", this.height() + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const measure = this.measure();
        const breakdown = this.breakdown();
        if (measure[0] && measure[1]) {
            this.x = measure[0]
            this.y = measure[1]
        }
        if (measure[2]) {
            this.size = measure[2]
        }
        if (breakdown[1]) {
            this.color = breakdown[1]
        }

        this.drawAxis();
        this.encodeXY();
        this.encodeColor();
        this.encodeSize();
        return this.svg();
    }

    drawAxis() {
        if (this.x && this.y) {
            let x = this.x,
                y = this.y;
            let svg = this.svg();
            let width = this.width(),
                height = this.height();
            let fontsize = 16, strokeWidth = 2;
            const padding = fontsize * 0.6,
                triangleSize = Math.ceil(Math.sqrt(height * width) / 10);

            let axis = svg.select('.axis');
            svg.select(".axis_x").remove();
            svg.select(".axis_y").remove();

            axis.append("text")
                .attr("x", width / 2)
                .attr("y", height + padding - 1)
                .attr("font-size", fontsize)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "hanging")
                .text(x || "Count");
            axis.append("path")
                .attr("class", "triangle")
                .attr("transform", `translate(${width - triangleSize / 25 * 2}, ${height})rotate(90)`)
                .attr("d", d3.symbol().type(d3.symbolTriangle).size(triangleSize))
                .attr("fill", Color().AXIS);
            axis.append("line")
                .attr("x1", -strokeWidth / 2)
                .attr("x2", width)
                .attr("y1", height)
                .attr("y2", height)
                .attr("stroke-width", strokeWidth)
                .attr("stroke", Color().AXIS);
            axis.append("text")
                .attr("transform", `translate(${-padding}, ${height / 2}) rotate(-90)`)
                .attr("font-size", fontsize)
                .attr("text-anchor", "middle")
                .text(y || "Count");
            axis.append("path")
                .attr("class", "triangle")
                .attr("transform", `translate(0, ${triangleSize / 25 * 2})`)
                .attr("d", d3.symbol().type(d3.symbolTriangle).size(triangleSize))
                .attr("fill", Color().AXIS);
            axis.append("line")
                .attr("y1", 0)
                .attr("y2", height)
                .attr("stroke-width", strokeWidth)
                .attr("stroke", Color().AXIS);
        }
    }

    encodeXY(animation = {}) {
        if (this.x && this.y) {
            let svg = this.svg();
            let width = this.width(),
                height = this.height();
            const processedData = this.processedData();
            const xEncoding = this.x,
                yEncoding = this.y;

            let axis = svg.append("g")
                .attr("class", "axis"),
                content = svg.append("g")
                    .attr("class", "content")
                    .attr("chartWidth", width)
                    .attr("chartHeight", height);

            // set the ranges
            let xScale = d3.scaleLinear()
                .range([0, width])
                .domain([0, d3.max(processedData, d => d[xEncoding])])
                .nice();

            let yScale = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(processedData, d => d[yEncoding])])
                .nice();

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

            axis.append("g")
                .attr("class", "axis_x")
                .attr('transform', `translate(0, ${height})`)
                .call(axisX)

            axis.append("g")
                .attr("class", "axis_y")
                .call(axisY);

            // for grid line
            axis.selectAll(".axis_y .tick")
                .append("line")
                .attr("stroke", d => {
                    if (d === 0) return Color().AXIS;
                    else return Color().DIVIDER;
                })
                .attr("class", "gridline")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", width)
                .attr("y2", 0);

            axis.selectAll(".axis_x .tick")
                .append("line")
                .attr("stroke", Color().DIVIDER)
                .attr("class", "gridline")
                .attr("x1", 0)
                .attr("y1", -height)
                .attr("x2", 0)
                .attr("y2", 0);

            axis.append("line")
                .attr("stroke", Color().DIVIDER)
                .attr("class", "gridline")
                .attr("x1", width)
                .attr("y1", height)
                .attr("x2", width)
                .attr("y2", 0);

            axis.append("line")
                .attr("stroke", Color().DIVIDER)
                .attr("class", "gridline")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", width)
                .attr("y2", 0);

            /* draw labels */
            const labelPadding = 20, fontsize = 12;

            axis.append("text")
                .attr("x", width / 2)
                .attr("y", height + svg.selectAll(".axis_x").select("path").node().getBBox().height + labelPadding)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "hanging")
                .attr("font-size", fontsize)
                .text(xEncoding);

            axis.append("text")
                .attr("transform", `translate(${-labelPadding - svg.selectAll(".axis_y").select("path").node().getBBox().width}, ${height / 2}) rotate(-90)`)
                .attr("text-anchor", "middle")
                .attr("font-size", fontsize)
                .text(yEncoding);

            /* draw points */
            const circleSize = Math.min(Math.ceil(Math.sqrt(height * width) / 50), 7);
            content.append("g")
                .attr("class", "circleGroup")
                .selectAll("circle")
                .data(processedData)
                .enter().append("circle")
                .attr("class", "mark")
                .attr("r", circleSize)
                .attr("stroke", "#FFF")
                .attr("stroke-width", 0)
                .attr("fill", Color().DEFAULT)
                .attr("opacity", 1)
                .attr("cx", d => xScale(d[xEncoding]))
                .attr("cy", d => yScale(d[yEncoding]));
        }

    }

    encodeColor(animation = {}) {
        if (this.color) {
            let color = this.color;
            let categories = Array.from(new Set(this.processedData().map(d => d[color])))
            let svg = this.svg();
            svg.selectAll("circle")
                .attr("fill", (d) => {
                    let i = categories.indexOf(d[color]);
                    return Color().CATEGORICAL[i % 8]
                })
        }
    }

    encodeSize(animation = {}) {
        if (this.size) {
            let size = this.size;
            let width = this.width(),
                height = this.height();
            let sizeEncoding = size;
            const circleSize = Math.min(Math.ceil(Math.sqrt(height * width) / 40), 15);
            const maxR = circleSize;
            const minR = circleSize / 10;
            let minValue = d3.min(this.processedData(), d => d[sizeEncoding]),
                maxValue = d3.max(this.processedData(), d => d[sizeEncoding]);
            let scale = d3.scaleSqrt([minValue, maxValue], [minR, maxR]);
            let svg = this.svg();
            svg.selectAll("circle")
                .attr("r", d => scale(d[sizeEncoding]))
        }
    }

    encodeShape(animation = {}) {

    }

    addEncoding(channel, field, animation = {}) {
        if (!this[channel]) {
            this[channel] = field.field;
            d3.selectAll("svg > g > *").remove();
            this.drawAxis();
            if (this.x && this.y) this.encodeXY(animation);
            if (this.color) this.encodeColor(animation);
            if (this.size) this.encodeSize(animation);
        }
    }

    modifyEncoding(channel, field, animation = {}) {
        if (this[channel]) {
            this[channel] = field;
            d3.selectAll("svg > g > *").remove();
            this.drawAxis();
            if (this.x && this.y) this.encodeXY(animation);
            if (this.color) this.encodeColor(animation);
            if (this.size) this.encodeSize(animation);
        }
    }

    removeEncoding(channel, animation = {}) {
        this[channel] = null;
        d3.selectAll("svg > g > *").remove();
        if (this.x && this.y) this.encodeXY(animation);
        if (this.color) this.encodeColor(animation);
        if (this.size) this.encodeSize(animation);
    }
}

export default Scatterplot;