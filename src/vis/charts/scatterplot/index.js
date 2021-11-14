import * as d3 from 'd3';
import Chart from '../chart';
import Color from '../../visualization/color';

class Scatterplot extends Chart {

    visualize() {
        if (this.measure().length < 2) return;
        let margin = {
            "top": 10,
            "right": 10,
            "bottom": 30,
            "left": 30
        }
        this.width(this.width() - margin.left - margin.right);
        this.height(this.height() - margin.top - margin.bottom);

        this._svg = d3.select(this.container())
            .append("svg")
            .attr("width", this.width() + margin.left + margin.right)
            .attr("height", this.height() + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        this.drawAxis();
        this.encodeXY();
        this.encodeColor();
        this.encodeSize();
        return this.svg();
    }

    drawAxis() {
        let svg = this.svg();
        let width = this.width(),
            height = this.height();
        const measure = this.measure();
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
            .text(measure[0].field || "Count");
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
            .text(measure[1].field || "Count");
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

    encodeXY() {
        let svg = this.svg();
        let width = this.width(),
            height = this.height();
        const factData = this.factdata();
        const measure = this.measure();
        const xEncoding = "measure0:" + (measure[0].aggregate === "count" ? "COUNT" : measure[0].field),
            yEncoding = "measure1:" + (measure[1].aggregate === "count" ? "COUNT" : measure[1].field);
        let axis = svg.append("g")
            .attr("class", "axis"),
            content = svg.append("g")
                .attr("class", "content")
                .attr("chartWidth", width)
                .attr("chartHeight", height);

        // set the ranges
        let xScale = d3.scaleLinear()
            .range([0, width])
            .domain([0, d3.max(factData, d => d[xEncoding])])
            .nice();

        let yScale = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(factData, d => d[yEncoding])])
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
            .attr("stroke", (d, i) => {
                if (i === 0) return Color().AXIS;
                else return Color().DIVIDER;
            })
            .attr("class", "gridline")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", width)
            .attr("y2", 0);

        axis.selectAll(".axis_x .tick")
            .append("line")
            .attr("stroke", (d, i) => {
                if (i === 0) return Color().AXIS;
                else return Color().DIVIDER;
            })
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

        /* draw points */
        const circleSize = Math.min(Math.ceil(Math.sqrt(height * width) / 50), 7);
        content.append("g")
            .attr("class", "circleGroup")
            .selectAll("circle")
            .data(factData)
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

    encodeColor() {
        const breakdown = this.breakdown();
        if (breakdown[1]) {
            let categories = Array.from(new Set(this.factdata().map(d => d[breakdown[1].field])))
            let svg = this.svg();
            svg.selectAll("circle")
                .attr("fill", (d) => {
                    let i = categories.indexOf(d[breakdown[1].field]);
                    return Color().CATEGORICAL[i % 8]
                })
        }
    }

    encodeOpacity() {

    }

    encodeSize() {
        const measure = this.measure();
        if (measure[2]) {
            let width = this.width(),
                height = this.height();
            let sizeEncoding = "measure2:" + (measure[2].aggregate === "count" ? "COUNT" : measure[2].field);
            const circleSize = Math.min(Math.ceil(Math.sqrt(height * width) / 40), 15);
            const maxR = circleSize;
            const minR = circleSize / 10;
            let minValue = d3.min(this.factdata(), d => d[sizeEncoding]),
                maxValue = d3.max(this.factdata(), d => d[sizeEncoding]);
            let scale = d3.scaleSqrt([minValue, maxValue], [minR, maxR]);
            let svg = this.svg();
            svg.selectAll("circle")
                .attr("r", d => scale(d[sizeEncoding]))
        }
    }
}

export default Scatterplot;