import * as d3 from 'd3';
import Chart from '../chart';
import Color from '../../visualization/color';
import Background from '../../visualization/background';
import Unit from './unit';

const COLOR = new Color();
const background = new Background();

/**
 * @description unit visualization
 * 
 * @class
 * @extends Chart
 */
class Unitvis extends Chart {

    /**
     * @description generating the unit visualization
     *      * 
     * @return {void}
    */

    visualize() {
        let margin = this.margin()

        let Hscaleratio = this.height() / 640

        let Wscaleratio = this.width() / 640


        let minHeightWidth = Math.min(this.width(), this.height())

        this.scaleratio = minHeightWidth / 640

        let chartbackgroundsize = {
            width: 600 * this.scaleratio,
            height: 600 * this.scaleratio
        }

        let container = this.container()

        d3.select(container)
            .append("svg")
            .attr("width", this.width())
            .attr("height", this.height())
            .style("background-color", COLOR.BACKGROUND);

        // Make sure the chart is a square
        this.width(minHeightWidth - margin.left - margin.right);
        this.height(minHeightWidth - margin.top - margin.bottom);
        this.units = []

        d3.select(container)
            .select("svg")
            .append("g")
            .attr("id", "svgBackGrnd")
            .append("rect")
            .attr("width", Wscaleratio * 640)
            .attr("height", Hscaleratio * 640)



        d3.select(container)
            .select("svg")
            .append("g")
            .attr("id", "chartBackGrnd")
            .append("rect")
            .attr("width", chartbackgroundsize.width)
            .attr("height", margin.top === 130 * this.scaleratio ? 490 * this.scaleratio : chartbackgroundsize.height)
            .attr("transform", "translate(" + (20 * this.scaleratio) + "," + margin.top + ")");

        this._svg = d3.select(container)
            .select("svg")
            .append("g")
            .attr("transform", margin.top === 130 * this.scaleratio ? "translate(" + (margin.left * this.scaleratio) + "," + margin.top + ")" : "translate(" + margin.left * this.scaleratio + "," + margin.top + ")");




        if (background.Background_Image) {
            let defs = d3.select(container).select("svg").append('svg:defs');
            defs.append("svg:pattern")
                .attr("id", "svg-backgroundimage")
                .attr("width", 1)
                .attr("height", 1)
                .attr("patternUnits", "objectBoundingBox")
                .append("svg:image")
                .attr("xlink:href", background.Background_Image.url)
                .attr("preserveAspectRatio", "xMidYMid slice")
                .attr("opacity", background.Background_Image.opacity ?? 1)
                .attr("filter", background.Background_Image.grayscale ? "grayscale(" + background.Background_Image.grayscale + "%)" : "grayscale(0%)")
                .attr("width", Wscaleratio * 640)
                .attr("height", Hscaleratio * 640)
                .attr("x", 0)
                .attr("y", 0);
            d3.select("#svgBackGrnd").attr("fill", "url(#svg-backgroundimage)")
        } else if (background.Background_Color) {
            d3.select("#svgBackGrnd").attr("fill", background.Background_Color.color ?? "white").attr("fill-opacity", background.Background_Color.opacity ?? 1)
        }
        else {
            d3.select("#svgBackGrnd").remove()
        }



        if (this.style()['background-color']) {
            d3.select("#chartBackGrnd").attr("fill", this.style()['background-color'].color ?? "white").attr("fill-opacity", this.style()['background-color'].opacity ?? 1)
        }
        else if (this.style()['background-image']) {
            let defs = d3.select(container).select("svg").append('svg:defs');
            defs.append("svg:pattern")
                .attr("id", "chart-backgroundimage")
                .attr("width", 1)
                .attr("height", 1)
                .attr("patternUnits", "objectBoundingBox")
                .append("svg:image")
                .attr("xlink:href", this.style()["background-image"].url)
                .attr("preserveAspectRatio", "xMidYMid slice")
                .attr("opacity", this.style()["background-image"].opacity ?? 1)
                .attr("filter", this.style()["background-image"].grayscale ? "grayscale(" + this.style()["background-image"].grayscale + "%)" : "grayscale(0%)")
                .attr("width", chartbackgroundsize.width)
                .attr("height", margin.top === 130 * this.scaleratio ? 490 * this.scaleratio : chartbackgroundsize.height)
                .attr("x", 0)
                .attr("y", 0);
            d3.select("#chartBackGrnd").attr("fill", "url(#chart-backgroundimage)")
        }
        else {
            d3.select("#chartBackGrnd").remove()
        }



        this.radiusMultiplier = 1

        this.data()
        this.initvis()

        this.axis = {}


        return this.svg();
    }

    /**
     * @description assigning identity and data information for each unit mark
     *      * 
     * @return {void}
    */


    data() {
        let processedData = this.processedData();
        processedData.forEach((d, i) => {
            let unit = new Unit();
            unit.id(i);
            unit.data(d)
            this.units.push(unit);
        })
        return this;
    }

    /**
     * @description calculating the length of text
     *      * 
     * @return {void}
    */

    textSizef(fontSize, fontFamily, text) {
        var span = document.createElement("span");
        var result = {};
        result.width = span.offsetWidth;
        result.height = span.offsetHeight;
        span.style.visibility = "hidden";
        span.style.fontSize = fontSize;
        span.style.fontFamily = fontFamily;
        span.style.display = "inline-block";
        document.body.appendChild(span);
        if (typeof span.textContent != "undefined") {
            span.textContent = text;
        } else {
            span.innerText = text;
        }
        result.width = parseFloat(window.getComputedStyle(span).width) - result.width;
        result.height = parseFloat(window.getComputedStyle(span).height) - result.height;
        return result;
    }

    /**
     * @description calculating the mapping of unit when channel x & y are selected
     *      * 
     * @return {void}
    */

    XYLayout(height, width, svg) {
        let margin = {
            left: width / 20 * this.scaleratio,
            right: width / 20 * this.scaleratio
        }

        let textSize = 14 * this.scaleratio;

        let xField = this.x;
        let yField = this.y;

        let xValueFreq = d3.nest().key(function (d) { return d[xField] }).rollup(function (v) { return v.length; }).entries(this.processedData())

        let yValueFreq = d3.nest().key(function (d) { return d[yField] }).rollup(function (v) { return v.length; }).entries(this.processedData())


        let xbar = xValueFreq.length;
        let length = Math.ceil(30 / xbar) < 4 ? 4 : 5
        let ybar = yValueFreq.length;



        xValueFreq.sort(function (x, y) {
            return d3.ascending(x['key'], y['key']);
        })

        yValueFreq.sort(function (x, y) {
            return d3.descending(x['key'], y['key']);
        })

        let xValue = xValueFreq.map(d => d['key']);
        let yValue = yValueFreq.map(d => d['key']);

        let unit = [];
        let ymax = {}

        let visibleUnits = this.units.filter(d => d.visible() === "1");

        for (let i = 0; i < xbar; i++) {
            let xunit = [];
            let barUnits = visibleUnits.filter(d => d[xField] === xValue[i]);
            for (let j = 0; j < ybar; j++) {
                let yuint = barUnits.filter(d => d[yField] === yValue[j]);
                if (!ymax[yValue[j]]) { ymax[yValue[j]] = yuint.length }
                if (yuint.length > ymax[yValue[j]]) {
                    ymax[yValue[j]] = yuint.length
                }
                xunit.push({ "x": xValue[i], "y": yValue[j], "data": yuint })
            }
            unit.push(xunit);
        }

        let xmaxCount = 0
        for (const value of Object.values(ymax)) {
            xmaxCount += Math.ceil(value / length);
        }


        let wradius = ((width - margin.left - margin.right) / ((length + 1) * (xbar - 1) + length)) / 2.2;
        let hradius = d3.min([(height * 0.8 - 2 * textSize) / (xmaxCount) / 2, (height * 0.9 - 2 * textSize) / ybar / (Math.ceil(length) + 1) / 2]);
        // let radius = Math.min(wradius, hradius);
        let radius = this.radiusMultiplier * Math.min(Math.min(wradius, hradius), 6 * this.scaleratio);
        let textpadding = 10 * this.scaleratio
        let s = (0.9 * width - 2 * (xbar) * length * radius) / (radius) / (xbar + 3) / 2 < 1 ? 0.2 : Math.floor((0.9 * width - 2 * (xbar) * length * radius) / (radius) / (xbar + 3) / 2)
        let padding = (0.9 * width - xbar * length * 2 * radius - (xbar - 1) * s * 2 * radius) / 2
        let baseX

        if (xbar === 1) {
            baseX = (width - length * radius * 2.2) / 2
        }
        else if (xbar >= 2) {
            baseX = d3.range(padding, width - padding, (width - 2 * padding - (2 * length) * radius) / (xbar - 1));
        }


        let topPadding = d3.max([(height - xmaxCount * radius * 2 - ybar * radius * 2 - 3 * textpadding) / 2 + (20 * this.scaleratio), 0.025 * height]) // 30 added in here is the difference between svg size and this.height()


        let baseY = [topPadding]

        let y = baseY[0]
        for (let i = 0; i < ybar; i++) {
            y += ymax[yValue[i]] / length * 2 * radius + d3.max([6 * this.scaleratio, 1.5 * radius])
            baseY.push(y)
        }

        // setTimeout(()=>{svg.select(".content").selectAll("text").remove()},5000);
        svg.select(".content").selectAll("text")
            .transition()
            .duration(this.duration / 2)
            .attr("fill-opacity", 0)

        let xtick = svg.select(".content")
            .append("g")
            .attr("class", "xaxistick")


        let ytick = svg.select(".content")
            .append("g")
            .attr("class", "yaxistick")

        let xstrlen

        let xstrmax


        if (this.axis.xaxis.labelAngle) {
            xstrlen = xValueFreq.map(d => this.textSizef(textSize, 'Arial', d).width)
            xstrmax = Math.abs(d3.max(xstrlen) * Math.sin(this.axis.xaxis.labelAngle * Math.PI / 180))
        } else {
            xstrlen = xValueFreq.map(d => this.textSizef(textSize, 'Arial', d).height)
            xstrmax = d3.max(xstrlen)
        }

        for (let i = 0; i < xbar; i++) {
            xtick.append("text")
                .attr("fill", COLOR.TEXT)
                .text(xValue[i])
                .attr("transform", "translate(" + (baseX[i] + (length - 1) * radius) + "," + (baseY[baseY.length - 1] + 0.5 * xstrmax) + ") rotate(" + (this.axis.xaxis.labelAngle ?? 0) + ")")
                // .attr("x", baseX[i] + (length - 1) * radius)
                // .attr("y", baseY[baseY.length - 1] + textpadding)
                .attr("font-size", this.axis.xaxis.labelFontSize ?? textSize)
                .attr("text-anchor", "middle")
                .attr("fill-opacity", 0)
                .transition()
                .delay(this.duration ? this.duration / 2 : 0)
                .duration(this.duration / 2)
                .attr("fill-opacity", 1)

            let xbar = unit[i]


            for (let j = 0; j < ybar; j++) {
                // svg.select(".content")
                ytick.append("text")
                    .attr("fill", COLOR.TEXT)
                    .text(yValue[j])
                    .attr("x", baseX[0] - radius - 2 * textpadding)
                    .attr("y", baseY[j] + radius * 2)
                    .attr("font-size", textSize)
                    .attr("text-anchor", "end")
                    .attr("fill-opacity", 0)
                    .transition()
                    .delay(this.duration ? this.duration / 2 : 0)
                    .duration(this.duration / 2)
                    .attr("fill-opacity", 1)

                let x = baseX[i]
                let y = baseY[j]

                let yset = xbar[j]
                if (yset) {
                    yset['data'].forEach((d, i) => {
                        let row = Math.floor(i / length);
                        let col = i % length;
                        d.x(x + 2 * radius * col);
                        d.y(y + 2 * radius * row);
                        d.radius(radius);
                        d.opacity(1);
                        d.unitgroup('y', yField);

                    })
                }
            }
        }



        svg.select(".content")
            .append("text")
            .attr("fill", COLOR.TEXT)
            .text(xField)
            .attr("x", xbar % 2 === 0 ? baseX[Math.floor(xbar / 2) - 1] + (length - 1) * radius : baseX[Math.floor(xbar / 2)] + (length - 1) * radius)
            .attr("y", Math.min(baseY[baseY.length - 1] + 2.2 * xstrmax, height))
            .attr("font-size", textSize)
            .attr('text-anchor', 'middle')
            .attr("fill-opacity", 0)
            .transition()
            .delay(this.duration ? this.duration / 2 : 0)
            .duration(this.duration)
            .attr("fill-opacity", 1)

        let ystrlen = yValueFreq.map(d => this.textSizef(textSize, 'Arial', d['key']).width)
        let ystrmax = d3.max(ystrlen)


        svg.select(".content")
            .append("text")
            .attr("fill", COLOR.TEXT)
            .text(yField)
            .attr("x", baseX[0] - radius - 2 * textpadding - 1.2 * ystrmax)
            .attr("y", ybar % 2 === 0 ? baseY[Math.floor(ybar / 2) - 1] : baseY[Math.floor(ybar / 2)])
            .attr("font-size", textSize)
            .attr("transform", `rotate(-90, ${baseX[0] - radius - 2 * textpadding - 1.2 * ystrmax}, ${ybar % 2 === 0 ? baseY[Math.floor(ybar / 2) - 1] : baseY[Math.floor(ybar / 2)]})`)
            .attr('text-anchor', 'middle')
            .attr("fill-opacity", 0)
            .transition()
            .delay(this.duration ? this.duration / 2 : 0)
            .duration(this.duration)
            .attr("fill-opacity", 1)

    }

    /**
     * @description calculating the mapping of unit when channel x & size are selected
     *      * 
     * @return {void}
    */

    XSizeLayout(height, width, svg) {

        let xField = this.x;

        let sizeField = this.size;

        let xValueFreq = d3.nest().key(function (d) { return d[xField] }).rollup(function (v) { return v.length; }).entries(this.processedData())

        let textSize = 14 * this.scaleratio;

        xValueFreq.sort(function (x, y) {
            return d3.ascending(x['key'], y['key']);
        })

        let xValue = xValueFreq.map(d => d['key']);

        let categories = xValueFreq

        let row = 1
        let column = xValueFreq.length

        let maxR = d3.min([0.8 * height / (row + 1) / 2, 0.8 * width / (column + 1) / 2])


        let nodesmaxcount = d3.max(xValueFreq, function (d) { return d.value; })


        let averageradius;
        if (column > 4)
            averageradius = Math.sqrt(nodesmaxcount) / 3;
        else
            averageradius = Math.sqrt(nodesmaxcount) / 2;

        let ratio = 2;
        let radiusa = this.radiusMultiplier * ratio * maxR / Math.sqrt(averageradius);

        let rowTotalWidth;
        if (categories.length % 2 === 0) {
            rowTotalWidth = 2.5 * maxR * column;//2.4
        } else {
            rowTotalWidth = 2.5 * maxR * (column + 1);
        }


        let centernodex = xValueFreq.map(function (d, i) {
            if (column === 1) {
                if (xValueFreq.length === 2) {//
                    return i === 0 ? radiusa : 3.1 * maxR + radiusa
                }
                return (width - radiusa) / 2
            }
            else {
                rowTotalWidth = d3.min([rowTotalWidth, width])
                let paddingMaxR = 3.3;
                let leftPadding = (width - (rowTotalWidth - paddingMaxR * maxR) - maxR) / 2;
                return leftPadding + (rowTotalWidth - paddingMaxR * maxR) / (column - 1) * (Math.floor(i % column));
            }
        })


        let centernodey = xValueFreq.map(function (d, i) {
            let startPoint = height / 2
            return startPoint
        })

        let unitnew = [];
        let nodesvalue1 = [];

        unitnew = this.units.map(function (d, i) {
            nodesvalue1[i] = d[sizeField]
            return {
                id: d.id(),
                distribution: d[xField],
                category: xValue.indexOf(d[xField]),
                radius: 0,
                value: d[sizeField]
            }
        })


        let unitExtent = d3.extent(this.units, d => d[sizeField]); //d3.extent(focusextent1.concat(focusextent2))
        let size = d3.scaleLinear()
            .domain([unitExtent[0], unitExtent[1]])
            .range([radiusa / 100, radiusa]);

        for (let index in unitnew) {
            unitnew[index].radius = Math.sqrt(size(unitnew[index].value))
        }

        let simulation = d3.forceSimulation(unitnew)
            .force('charge', d3.forceManyBody().strength(0.01))
            .force('x', d3.forceX().x(function (d) {
                return centernodex[d.category]
            }))
            .force('y', d3.forceY().y(function (d) {
                return centernodey[d.category];
            }))
            .force('collision', d3.forceCollide().strength(1).radius(d => d.radius + 0.15))
            .stop()

        simulation.tick(200);

        for (let index in this.units) {

            let f = unitnew.find(item => item.id == index) //eslint-disable-line
            if (f) {
                this.units[f.id].x(f.x);
                this.units[f.id].y(f.y);
                this.units[f.id].visible("1")
                this.units[index].radius(f.radius)
                this.units[f.id].color(f.color)
                this.units[f.id].unitgroup('size', sizeField)

            }
            else {
                this.units[index].visible("0")
            }

            this.units[index].opacity("1")
        }

        // setTimeout(()=>{svg.select(".content").selectAll("text").remove()},5000);
        svg.select(".content").selectAll("text")
            .transition()
            .duration(this.duration / 2)
            .attr("fill-opacity", 0)

        let xtick = svg.select(".content")
            .append("g")
            .attr("class", "xaxistick")

        let xstrlen

        let xstrmax


        if (this.axis.xaxis.labelAngle) {
            xstrlen = xValueFreq.map(d => this.textSizef(textSize, 'Arial', d).width)
            xstrmax = Math.abs(d3.max(xstrlen) * Math.sin(this.axis.xaxis.labelAngle * Math.PI / 180))
        } else {
            xstrlen = xValueFreq.map(d => this.textSizef(textSize, 'Arial', d['key']).height)
            xstrmax = d3.max(xstrlen)
        }




        xValueFreq.forEach((bar, iBar) => {
            xtick.append("text")
                .attr("fill", COLOR.TEXT)
                .text(xValue[iBar])
                .attr("transform", "translate(" + centernodex[iBar] + "," + (centernodey[0] + 2 * radiusa + 1 * maxR) + ") rotate(" + (this.axis.xaxis.labelAngle ?? 0) + ")")
                // .attr("x", centernodex[iBar])
                // .attr("y", centernodey[0] + 2 * radiusa + 1 * maxR)
                .attr("font-size", this.axis.xaxis.labelFontSize ?? textSize)
                .attr("text-anchor", "middle")
                .attr("fill-opacity", 0)
                .transition()
                .delay(this.duration ? this.duration / 2 : 0)
                .duration(this.duration / 2)
                .attr("fill-opacity", 1)
        })


        svg.select(".content").append("text")
            .attr("fill", COLOR.TEXT)
            .text(xField)
            .attr("x", column % 2 === 0 ? centernodex[Math.floor(column / 2) - 1] : centernodex[Math.floor(column / 2)])
            .attr("y", centernodey[0] + 2 * radiusa + 1 * maxR + 1.2 * xstrmax)
            .attr("font-size", textSize)
            .attr('text-anchor', 'middle')
            .attr("fill-opacity", 0)
            .transition()
            .delay(this.duration ? this.duration / 2 : 0)
            .duration(this.duration / 2)
            .attr("fill-opacity", 1)



    }

    /**
     * @description calculating the mapping of unit when channel y & size are selected
     *      * 
     * @return {void}
    */

    YSizeLayout(height, width, svg) {

        let textSize = 14 * this.scaleratio;

        let yField = this.y;

        let sizeField = this.size;

        let yValueFreq = d3.nest().key(function (d) { return d[yField] }).rollup(function (v) { return v.length; }).entries(this.processedData())


        yValueFreq.sort(function (x, y) {
            return d3.ascending(x['key'], y['key']);
        })

        let yValue = yValueFreq.map(d => d['key']);


        let categories = yValueFreq

        let row = 1

        let column = yValueFreq.length

        let maxR = d3.min([0.8 * height / (row + 1) / 2, 0.8 * width / (column + 1) / 2])


        let nodesmaxcount = d3.max(yValueFreq, function (d) { return d.value; })


        let averageradius;
        if (column > 4)
            averageradius = Math.sqrt(nodesmaxcount) / 3;
        else
            averageradius = Math.sqrt(nodesmaxcount) / 2;

        let ratio = 2;
        let radiusa = this.radiusMultiplier * ratio * maxR / Math.sqrt(averageradius);

        let rowTotalHeight;

        if (categories.length % 2 === 0) {
            rowTotalHeight = 2.5 * maxR * column;//2.4
        } else {
            rowTotalHeight = 2.5 * maxR * (column + 1);
        }
        rowTotalHeight = d3.min([rowTotalHeight, height])


        let centernodey = yValueFreq.map(function (d, i) {
            if (column === 1) {
                if (yValueFreq.length === 2) {//
                    return i === 0 ? radiusa : 3.1 * maxR + radiusa
                }
                return (height - radiusa) / 2
            }
            else {
                let paddingMaxR = 2.3;
                let TopPadding = (height - (rowTotalHeight - paddingMaxR * maxR)) / 2;
                return TopPadding + (rowTotalHeight) / (column) * (Math.floor(i % column));
            }
        })


        let strlen = yValueFreq.map(d => this.textSizef(textSize, 'Arial', d['key']).width)
        let strmax = d3.max(strlen)

        let centernodex = maxR + 2 * radiusa + this.textSizef(textSize, 'Arial', yField).height + d3.max([1.2 * strmax, 50 * this.scaleratio])


        let unitnew = [];
        let nodesvalue1 = [];

        unitnew = this.units.map(function (d, i) {
            nodesvalue1[i] = d[sizeField]
            return {
                id: d.id(),
                distribution: d[yField],
                category: yValue.indexOf(d[yField]),
                radius: 0,
                value: d[sizeField]
            }
        })


        let unitExtent = d3.extent(this.units, d => d[sizeField]); //d3.extent(focusextent1.concat(focusextent2))
        let size = d3.scaleLinear()
            .domain([unitExtent[0], unitExtent[1]])
            .range([radiusa / 100, radiusa]);

        for (let index in unitnew) {
            unitnew[index].radius = Math.sqrt(size(unitnew[index].value))
        }

        let simulation = d3.forceSimulation(unitnew)
            .force('charge', d3.forceManyBody().strength(0.01))
            .force('x', d3.forceX().x(function (d) {
                return centernodex
            }))
            .force('y', d3.forceY().y(function (d) {
                return centernodey[d.category];
            }))
            .force('collision', d3.forceCollide().strength(1).radius(d => d.radius + 0.15))
            .stop()

        simulation.tick(200);

        for (let index in this.units) {

            let f = unitnew.find(item => item.id == index) //eslint-disable-line
            if (f) {
                this.units[f.id].x(f.x);
                this.units[f.id].y(f.y);
                this.units[f.id].visible("1")
                this.units[index].radius(f.radius)
                this.units[f.id].color(f.color)
                this.units[f.id].unitgroup('size', sizeField)

            }
            else {
                this.units[index].visible("0")
            }

            this.units[index].opacity("1")
        }

        // setTimeout(()=>{svg.select(".content").selectAll("text").remove()},5000);
        svg.select(".content").selectAll("text")
            .transition()
            .duration(this.duration / 2)
            .attr("fill-opacity", 0)

        yValueFreq.forEach((bar, iBar) => {
            svg.select(".content").append("text")
                .attr("fill", COLOR.TEXT)
                .text(yValue[iBar])
                .attr("x", centernodex - 2 * radiusa - maxR)
                .attr("y", centernodey[iBar])
                .attr("font-size", textSize)
                .attr("text-anchor", "middle")
                .attr("fill-opacity", 0)
                .transition()
                .delay(this.duration ? this.duration / 2 : 0)
                .duration(this.duration / 2)
                .attr("fill-opacity", 1)
        })


        svg.select(".content").append("text")
            .attr("fill", COLOR.TEXT)
            .text(yField)
            .attr("x", Math.max(centernodex - 2 * radiusa - maxR - 1.2 * strmax, 0))
            .attr("y", column % 2 === 0 ? centernodey[Math.floor(column / 2) - 1] : centernodey[Math.floor(column / 2)])
            .attr("font-size", textSize)
            .attr("transform", `rotate(-90, ${Math.max(centernodex - 2 * radiusa - maxR - 1.2 * strmax, 0)}, ${column % 2 === 0 ? centernodey[Math.floor(column / 2) - 1] : centernodey[Math.floor(column / 2)]})`)
            .attr('text-anchor', 'middle')
            .attr("fill-opacity", 0)
            .transition()
            .delay(this.duration ? this.duration / 2 : 0)
            .duration(this.duration / 2)
            .attr("fill-opacity", 1)

    }



    /**
     * @description calculating the mapping of unit when channel x & y & size are selected
     *      * 
     * @return {void}
    */

    XYSizeLayout(height, width, svg) {

        let textSize = 14 * this.scaleratio;
        let sizeField = this.size
        let yField = this.y
        let xField = this.x


        let xValueFreq = d3.nest().key(function (d) { return d[xField] }).key(function (d) { return d[yField] }).rollup(function (v) { return v.length; }).entries(this.processedData())
        let yValueFreq = d3.nest().key(function (d) { return d[yField] }).rollup(function (v) { return v.length; }).entries(this.processedData())

        xValueFreq.sort(function (x, y) {
            return d3.ascending(x['key'], y['key']);
        })

        yValueFreq.sort(function (x, y) {
            return d3.descending(x['key'], y['key']);
        })


        let num_of_x = xValueFreq.length;
        let num_of_y = yValueFreq.length;

        let column = num_of_x
        let row = num_of_y


        let maxR = d3.min([0.8 * height / (row + 1) / 2, 0.8 * width / (column + 1) / 2])


        xValueFreq.sort(function (x, y) {
            return d3.ascending(x['key'], y['key']);
        })

        xValueFreq.forEach(d => {
            d.values.sort(function (x, y) {
                return d3.descending(x['key'], y['key'])
            })
        });

        let nodesmaxcount = 0

        for (let i = 0; i < num_of_x; i++) {
            let MaxNodeinEach = d3.max(xValueFreq[i].values, function (j) { return j.value; })
            nodesmaxcount = Math.max(nodesmaxcount, MaxNodeinEach)
        }

        let averageradius;
        let ratio
        if (column > 4) { averageradius = Math.sqrt(nodesmaxcount) / 3; ratio = 1.5; }
        else { averageradius = Math.sqrt(nodesmaxcount) / 2; ratio = 1.8; }
        let radiusa = this.radiusMultiplier * maxR / Math.sqrt(averageradius) * ratio;
        let rowTotalWidth;

        rowTotalWidth = 2.1 * maxR * (column)


        let strlen = yValueFreq.map(d => this.textSizef(textSize, 'Arial', d['key']).width)
        let strmax = d3.max(strlen)

        let Minleftpadding = 2 * maxR + this.textSizef(textSize, 'Arial', yField).height + strmax - 40 // 40 minus in here is the difference between svg size and this.height()
        rowTotalWidth = d3.min([rowTotalWidth, width * 0.8])

        let scaleratio = this.scaleratio
        let centernodex = xValueFreq.map(function (d, i) {
            if (column === 1) {
                if (xValueFreq.length === 2) {//异常处理
                    return i === 0 ? radiusa : 3.1 * maxR + radiusa
                }
                return (width - radiusa) / 2
            }
            else {
                if (width - rowTotalWidth - 2 * Minleftpadding > 0) {
                    let leftpadding = Math.min(100 * scaleratio, (1 * width - rowTotalWidth - 2 * Minleftpadding) / 2 + Minleftpadding)
                    let rightpadding = leftpadding
                    let padding = (width - leftpadding - rightpadding) / (column - 1) * (Math.floor(i % column))

                    return leftpadding + padding

                }
                else if (width - rowTotalWidth - 2 * Minleftpadding <= 0) {
                    let leftpadding = 1 * Minleftpadding
                    let rightpadding = 1 * Minleftpadding
                    return leftpadding + (width - leftpadding - rightpadding) / (column - 1) * (Math.floor(i % column))
                }
            }
            return null;
        })

        let columnTotalHeight;
        if (row % 2 === 0) {
            columnTotalHeight = 2.5 * maxR * row;//2.4
        } else {
            columnTotalHeight = 2.5 * maxR * (row + 1);
        }

        let centernodey = yValueFreq.map(function (d, i) {
            if (row > 2) {
                columnTotalHeight = d3.min([columnTotalHeight, height])
                let topPadding = (height - columnTotalHeight) / 2 + 2 * maxR;
                let bottomPadding = topPadding
                return topPadding + d3.min([(height - bottomPadding - 5 * maxR) / (row - 1), 4 * maxR]) * (i);
            }
            else {
                let topPadding = ((height - 3.6 * maxR) / (row - 1) <= 3 * maxR ? 3 * maxR : (height - 3 * maxR * (row - 1)) / 1.4);
                return topPadding + d3.min([(height - 3.6 * maxR) / (row - 1), 3 * maxR]) * (i);
            }
        })

        let unitnew = [];
        let nodesvalue1 = [];
        let xValue = xValueFreq.map(d => d['key']);
        let yValue = yValueFreq.map(d => d['key']);
        unitnew = this.units.map(function (d, i) {
            nodesvalue1[i] = d[sizeField]
            return {
                id: d.id(),
                distribution: d[xField],
                category: [xValue.indexOf(d[xField]), yValue.indexOf(d[yField])],
                radius: 0,
                value: d[sizeField]
            }
        })

        let unitExtent = d3.extent(this.units, d => d[sizeField]); //d3.extent(focusextent1.concat(focusextent2))
        let size = d3.scaleLinear()
            .domain([unitExtent[0], unitExtent[1]])
            .range([radiusa / 100, radiusa]);

        for (let index in unitnew) {
            unitnew[index].radius = Math.sqrt(size(unitnew[index].value))
        }


        let simulation = d3.forceSimulation(unitnew)
            .force('charge', d3.forceManyBody().strength(0.01))
            .force('x', d3.forceX().x(function (d) {
                return centernodex[d.category[0]]
            }))
            .force('y', d3.forceY().y(function (d) {
                return centernodey[d.category[1]];
            }))
            .force('collision', d3.forceCollide().strength(1).radius(d => d.radius + 0.15))
            .stop()


        simulation.tick(200);
        for (let index in this.units) {

            let f = unitnew.find(item => item.id == index) //eslint-disable-line
            if (f) {
                this.units[f.id].x(f.x);
                this.units[f.id].y(f.y);
                this.units[f.id].visible("1")
                this.units[index].radius(f.radius)
                this.units[f.id].color(f.color)
                this.units[f.id].unitgroup('size', sizeField)
            }
            else {
                this.units[index].visible("0")
            }

            this.units[index].opacity("1")
        }

        // setTimeout(()=>{svg.select(".content").selectAll("text").remove()},5000);
        svg.select(".content").selectAll("text")
            .transition()
            .duration(this.duration / 2)
            .attr("fill-opacity", 0)

        let xtick = svg.select(".content")
            .append("g")
            .attr("class", "xaxistick")

        let ytick = svg.select(".content")
            .append("g")
            .attr("class", "yaxistick")


        let xstrheight

        let xstrheightmax


        if (this.axis.xaxis.labelAngle) {
            xstrheight = xValueFreq.map(d => this.textSizef(textSize, 'Arial', d).width)
            xstrheightmax = Math.abs(d3.max(xstrheight) * Math.sin(this.axis.xaxis.labelAngle * Math.PI / 180))
        } else {
            xstrheight = xValueFreq.map(d => this.textSizef(textSize, 'Arial', d['key']).height)
            xstrheightmax = d3.max(xstrheight)
        }



        xValueFreq.forEach((bar, iBar) => {
            xtick.append("text")
                .attr("fill", COLOR.TEXT)
                .text(xValue[iBar])
                .attr("transform", "translate(" + (centernodex[iBar]) + "," + (centernodey[centernodey.length - 1] + 2.5 * maxR) + ") rotate(" + (this.axis.xaxis.labelAngle ?? 0) + ")")
                .attr("font-size", this.axis.xaxis.labelFontSize ?? textSize)
                .attr("text-anchor", "middle")
                .attr("fill-opacity", 0)
                .transition()
                .delay(this.duration ? this.duration / 2 : 0)
                .duration(this.duration / 2)
                .attr("fill-opacity", 1)

        })

        yValueFreq.forEach((bar, iBar) => {
            ytick.append("text")
                .attr("fill", COLOR.TEXT)
                .text(yValue[iBar])
                .attr("x", centernodex[0] - 2 * maxR)
                .attr("y", centernodey[iBar])
                .attr("font-size", textSize)
                .attr("text-anchor", "end")
                .attr("fill-opacity", 0)
                .transition()
                .delay(this.duration ? this.duration / 2 : 0)
                .duration(this.duration / 2)
                .attr("fill-opacity", 1)
        })




        svg.select(".content").append("text")
            .attr("fill", COLOR.TEXT)
            .text(xField)
            .attr("x", column % 2 === 0 ? centernodex[Math.floor(column / 2) - 1] : centernodex[Math.floor(column / 2)])
            .attr("y", Math.min(centernodey[centernodey.length - 1] + 2.5 * maxR + 1.2 * xstrheightmax, height))
            .attr("font-size", textSize)
            .attr('text-anchor', 'middle')
            .attr("fill-opacity", 0)
            .transition()
            .delay(this.duration ? this.duration / 2 : 0)
            .duration(this.duration / 2)
            .attr("fill-opacity", 1)


        svg.select(".content").append("text")
            .attr("fill", COLOR.TEXT)
            .text(yField)
            .attr("x", centernodex[0] - 2 * maxR - 1.1 * strmax)
            .attr("y", row % 2 === 0 ? centernodey[Math.floor(row / 2) - 1] : centernodey[Math.floor(row / 2)])
            .attr("font-size", textSize)
            .attr('text-anchor', 'middle')
            .attr("transform", `rotate(-90, ${centernodex[0] - 2 * maxR - 1.1 * strmax}, ${row % 2 === 0 ? centernodey[Math.floor(row / 2) - 1] : centernodey[Math.floor(row / 2)]})`)
            .attr("fill-opacity", 0)
            .transition()
            .delay(this.duration ? this.duration / 2 : 0)
            .duration(this.duration / 2)
            .attr("fill-opacity", 1)



    }

    /**
     * @description adding the mark background
     *      * 
     * @return {void}
    */

    AddMarkBackGrnd(svg) {
        svg.select(".content").selectAll("circle")
            .transition()
            .duration(this.duration / 2)
            .attr("fill", (d, i) => {
                if (this.markStyle()['background-image']) {
                    let defs = this.svg().select(".content").append('svg:defs');
                    defs.append("svg:pattern")
                        .attr("id", "mark-background-image-" + i)
                        .attr("width", 1)
                        .attr("height", 1)
                        .attr("patternUnits", "objectBoundingBox")
                        .append("svg:image")
                        .attr("xlink:href", this.markStyle()["background-image"])
                        .attr("preserveAspectRatio", "none")
                        .attr("width", 2 * d.radius())
                        .attr("height", 2 * d.radius())
                        .attr("x", 0)
                        .attr("y", 0);
                    return "url(#mark-background-image-" + i + ")"
                } else if (this.markStyle()['fill']) {
                    return this.markStyle()['fill']
                }
                else {
                    return d.color()
                }
            })

    }


    /**
     * @description The initial status of unit vis (square layout)
     *      * 
     * @return {void}
    */

    initvis() {
        let svg = this.svg();
        let width = this.width(),
            height = this.height();


        const processedData = this.processedData()

        let min = Math.min(width, height);
        let vwidth = min;
        let setLength = 50;
        let setNumber = setLength * setLength;
        let margin = {
            left: vwidth / 10,
            right: vwidth / 10
        };

        let maxSet = Math.ceil(processedData.length / setNumber);
        let maxRow = Math.floor(Math.sqrt(maxSet));
        let maxColumn = Math.ceil(maxSet / maxRow);
        let radius = this.radiusMultiplier * Math.min(((vwidth - margin.left - margin.right) / (maxColumn * (setLength + 1) - 1)), 6);
        let row = Math.floor(Math.sqrt(processedData.length));
        let column = Math.ceil(processedData.length / row); // row 3 col 4
        let initX = vwidth / 1.9 - column * radius;
        let initY = vwidth / 2 - row * radius;

        let units = this.units.filter(d => d.visible() === "1");
        let id = 0
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < column; j++) {
                let baseX = initX + 2.2 * radius * j;
                let baseY = initY + 2.2 * radius * i;
                if (id >= units.length) {
                    break;
                }
                units[id].x(baseX);
                units[id].y(baseY)
                units[id].radius(radius);
                id += 1
            }
        }

        let content = svg.append("g")
            .attr("class", "content")
            .attr("chartWidth", width)
            .attr("chartHeight", height);



        content.append("g")
            .attr("class", "circleGroup")
            .selectAll("circle")
            .data(this.units)
            .enter().append("circle")
            .attr("class", "mark")
            .attr("r", d => d.radius())
            .attr("stroke", this.markStyle()["stroke-color"] ?? "#FFF")
            .attr("stroke-width", this.markStyle()["stroke-width"] ?? 0)
            .attr("stroke-opacity", this.markStyle()["stroke-opacity"] ?? 1)
            .attr("fill", (d, i) => {
                if (this.markStyle()['background-image']) {

                    let defs = content.append('svg:defs');
                    defs.append("svg:pattern")
                        .attr("id", "mark-background-image-" + i)
                        .attr("width", 1)
                        .attr("height", 1)
                        .attr("patternUnits", "objectBoundingBox")
                        .append("svg:image")
                        .attr("xlink:href", this.markStyle()["background-image"])
                        .attr("preserveAspectRatio", "none")
                        .attr("width", 2 * d.radius())
                        .attr("height", 2 * d.radius())
                        .attr("x", 0)
                        .attr("y", 0);
                    return "url(#mark-background-image-" + i + ")"
                } else if (this.markStyle()['fill']) {
                    return this.markStyle()['fill']
                }
                else {
                    return d.color()
                }
            })
            .attr("opacity", this.markStyle()["fill-opacity"] ?? 1)
            .attr("cx", d => d.x())
            .attr("cy", d => d.y());



    }

    /**
     * @description Using X-axis to encode a data field
     *      * 
     * @return {void}
    */

    // Draw X axis
    encodeX() {
        let svg = this.svg();
        let width = this.width(),
            height = this.height();

        let margin = {
            left: width / 20,
            right: width / 20
        }

        let textSize = 14 * this.scaleratio;

        // situation 1:      
        if (this.x && this.y && this.size) {
            this.XYSizeLayout(height, width, svg)
        }
        // situation 2
        else if (this.x && !this.y && this.size) {
            this.XSizeLayout(height, width, svg)
        }
        // situation 3
        else if (this.x && this.y && !this.size) {
            this.XYLayout(height, width, svg)
        }
        // situation 4:
        else {

            let breakdownField = this.x;

            let databreakdown = d3.nest().key(function (d) { return d[breakdownField] }).rollup(function (v) { return v.length; }).entries(this.processedData())


            let bar = databreakdown.length;

            databreakdown.sort(function (x, y) {
                return d3.ascending(x['key'], y['key']);
            })


            let breakdownValue = databreakdown.map(d => d['key']);
            let count = databreakdown.map(d => d['value']);

            let maxCount = d3.max(count);


            let length = Math.ceil(30 / bar) < 3 ? Math.ceil(30 / bar) : 3

            let padding = width

            let wradius, hradius, radius, s, baseX, baseY

            while (padding / (width) >= 0.18) {

                length++

                wradius = ((width - margin.left - margin.right) / ((length + 2) * (bar - 1) + length)) / 2;

                hradius = 0.8 * height / Math.ceil(maxCount / length) / 2;

                radius = this.radiusMultiplier * Math.min(Math.min(wradius, hradius), 6);

                s = (0.9 * width - 2 * (bar) * length * radius) / (radius) / (bar + 3) / 2 < 1 ? 0.2 : Math.floor((0.9 * width - 2 * (bar) * length * radius) / (radius) / (bar + 3) / 2)

                padding = (0.8 * width - bar * length * 2 * radius - (bar - 1) * s * 2 * radius) / 2

                // console.log(width)
                baseX = d3.range(padding, width - padding, (width - 2 * padding - (2 * length) * radius) / (bar - 1));



                baseY = (height - Math.ceil(maxCount / length) * 2 * radius) / 2 + Math.ceil(maxCount / length) * 2 * radius - radius;

            }



            let visibleUnits = this.units.filter(d => d.visible() === "1");

            let units = [];
            for (let i = 0; i < bar; i++) {
                let barUnits = visibleUnits.filter(d => d[breakdownField] === breakdownValue[i]);
                units.push(barUnits);
            }

            svg.select(".content").selectAll("text")
                .transition()
                .duration(this.duration / 2)
                .attr("fill-opacity", 0)

            let xtick = svg.select(".content")
                .append("g")
                .attr("class", "xaxistick")

            let xstrlen

            let xstrmax

            if (this.axis.xaxis.labelAngle) {
                xstrlen = breakdownValue.map(d => this.textSizef(textSize, 'Arial', d).width)
                xstrmax = Math.abs(d3.max(xstrlen) * Math.sin(this.axis.xaxis.labelAngle * Math.PI / 180))
            } else {
                xstrlen = breakdownValue.map(d => this.textSizef(textSize, 'Arial', d).height)
                xstrmax = d3.max(xstrlen)
            }

            units.forEach((bar, iBar) => {
                xtick.append("text")
                    .attr("fill", COLOR.TEXT)
                    .text(breakdownValue[iBar])
                    .attr("transform", "translate(" + (baseX[iBar] + (length / 2 - 1) * radius) + "," + (baseY + radius + xstrmax) + ") rotate(" + (this.axis.xaxis.labelAngle ?? 0) + ")")
                    // .attr("x", baseX[iBar] + (length / 2 - 1) * radius)
                    // .attr("y", baseY + radius + textSize)
                    .attr("font-size", this.axis.xaxis.labelFontSize ?? textSize)
                    .attr("text-anchor", "middle")
                    .attr("fill-opacity", 0)
                    // .attr("transform", "rotate(-65)")
                    .transition()
                    .delay(this.duration ? this.duration / 2 : 0)
                    .duration(this.duration / 2)
                    .attr("fill-opacity", 1)

                bar.forEach((d, i) => {
                    let row = Math.floor(i / length);
                    let col = i % length;
                    d.x(baseX[iBar] - (length / 2 - 2 * col) * radius);
                    d.y(baseY - 2 * radius * row);
                    d.radius(radius);
                    d.opacity(1);
                    d.unitgroup('x', breakdownField);
                })
            });


            svg.select(".content").append("text")
                .attr("fill", COLOR.TEXT)
                .text(breakdownField)
                .attr("x", databreakdown.length % 2 === 0 ? baseX[Math.floor(databreakdown.length / 2) - 1] + (length / 2 - 1) * radius : baseX[Math.floor(databreakdown.length / 2)] + (length / 2 - 1) * radius)
                .attr("y", Math.min(baseY + radius + 2.2 * xstrmax, height))
                .attr("font-size", textSize)
                .attr('text-anchor', 'middle')
                .attr("fill-opacity", 0)
                .transition()
                .delay(this.duration ? this.duration / 2 : 0)
                .duration(this.duration / 2)
                .attr("fill-opacity", 1)

        }

        svg.select(".content").selectAll("defs").transition().duration(this.duration / 2).remove()

        this.AddMarkBackGrnd(svg)

    }

    /**
     * @description Using Y-axis to encode a data field
     *      * 
     * @return {void}
    */

    encodeY() {
        let svg = this.svg();
        let width = this.width(),
            height = this.height();
        // situation 1:
        if (this.x && this.y && !this.size) {
            this.XYLayout(height, width, svg)
        }
        // situation 2:
        else if (!this.x && this.y && this.size) {
            this.YSizeLayout(height, width, svg)
        }
        // situation 3:
        else if (this.x && this.y && this.size) {
            this.XYSizeLayout(height, width, svg)
        }
        // situation 4:
        else {

            let margin = {
                left: width / 20 * this.scaleratio,
                right: width / 20 * this.scaleratio
            }
            let textSize = 14 * this.scaleratio;

            let breakdownField = this.y;

            let databreakdown = d3.nest().key(function (d) { return d[breakdownField] }).rollup(function (v) { return v.length; }).entries(this.processedData())

            let bar = databreakdown.length;

            databreakdown.sort(function (x, y) {
                return d3.ascending(x['key'], y['key']);
            })


            let breakdownValue = databreakdown.map(d => d['key']);
            let count = databreakdown.map(d => d['value']);

            let maxCount = d3.max(count);
            // wradius -> calculated radius based on width
            // hradius -> calculated radius based on height

            let length = Math.ceil(30 / bar) < 4 ? Math.ceil(30 / bar) : 4

            let wradius, hradius, radius, s, baseY

            let padding = height

            while (padding / height >= 0.22) {

                length++

                wradius = d3.min([width - margin.left - margin.right, width]) / Math.ceil(maxCount / length) / 2;
                
                hradius = height / bar / (Math.ceil(length) + 1) / 2;

                radius = this.radiusMultiplier * 0.8 * Math.min(wradius, hradius);
                
                s = (height - 2 * (bar) * length * radius) / (radius) / (bar + 3) / 2 < 1 ? 0.2 : Math.floor((height - 2 * (bar) * length * radius) / (radius) / (bar + 3) / 2)
                
                padding = (height - bar * length * 2 * radius - (bar - 1) * s * 2 * radius) / 2

                baseY = d3.range(padding, height - padding, (height - padding - (2 * length - 1) * radius - padding) / (bar - 1));

            }

            let yField = this.y;

            let yValueFreq = d3.nest().key(function (d) { return d[yField] }).rollup(function (v) { return v.length; }).entries(this.processedData())

            let strlen = yValueFreq.map(d => this.textSizef(textSize, 'Arial', d['key']).width)
            let strmax = d3.max(strlen)


            let baseX = radius + this.textSizef(textSize, 'Arial', yField).height + 1.2 * strmax + 2 * textSize


            let visibleUnits = this.units.filter(d => d.visible() === "1");

            let units = [];
            for (let i = 0; i < bar; i++) {
                let barUnits = visibleUnits.filter(d => d[breakdownField] === breakdownValue[i]);
                units.push(barUnits);
            }


            svg.select(".content").selectAll("text")
                .transition()
                .duration(this.duration / 2)
                .attr("fill-opacity", 0)

            units.forEach((bar, iBar) => {
                svg.select(".content")
                    .append("text")
                    .attr("fill", COLOR.TEXT)
                    .text(breakdownValue[iBar])
                    .attr("x", baseX - radius - 2 * textSize)
                    .attr("y", baseY[iBar] + (1.5 * length - 1) * radius)
                    .attr("font-size", textSize)
                    .attr("text-anchor", "middle")
                    .attr("fill-opacity", 0)
                    .transition()
                    .delay(this.duration ? this.duration / 2 : 0)
                    .duration(this.duration / 2)
                    .attr("fill-opacity", 1)

                bar.forEach((d, i) => {
                    let col = Math.floor(i / length);
                    let row = i % length;
                    d.x(baseX + 2 * radius * col);
                    d.y(baseY[iBar] + (length / 2 + 2 * row) * radius);
                    d.radius(radius);
                    d.opacity(1);
                    d.unitgroup('x', breakdownField);
                })

                svg.select(".content").append("text")
                    .attr("fill", COLOR.TEXT)
                    .text(breakdownField)
                    .attr("x", Math.max(baseX - radius - 2 * textSize - 1.2 * strmax, 0))
                    .attr("y", databreakdown.length % 2 === 0 ? baseY[Math.floor(databreakdown.length / 2) - 1] : baseY[Math.floor(databreakdown.length / 2)])
                    .attr("font-size", textSize)
                    .attr("transform", `rotate(-90, ${Math.max(baseX - radius - 2 * textSize - 1.2 * strmax, 0)}, ${databreakdown.length % 2 === 0 ? baseY[Math.floor(databreakdown.length / 2) - 1] : baseY[Math.floor(databreakdown.length / 2)]})`)
                    .attr('text-anchor', 'end')
                    .attr("fill-opacity", 0)
                    .transition()
                    .delay(this.duration ? this.duration / 2 : 0)
                    .duration(this.duration / 2)
                    .attr("fill-opacity", 1)

            });

        }


        svg.select(".content").selectAll("defs").transition().duration(this.duration / 2).remove()
        this.AddMarkBackGrnd(svg)
    }

    /**
     * @description Using mark color to encode a data field
     *      * 
     * @return {void}
    */

    //  add color to the unit circle
    encodeColor() {
        // situation 1
        if (this.color) {
            let colorField = this.color;
            let colorFreqValue = d3.nest().key(function (d) { return d[colorField] }).rollup(function (v) { return v.length; }).entries(this.processedData())
            let colorValue = colorFreqValue.map(d => d['key']);

            let units = [];
            for (let i = 0; i < colorFreqValue.length; i++) {
                let colorUnits = this.units.filter(d => d[colorField] === colorValue[i]);
                units.push(colorUnits);
            }

            units.forEach((color, iColor) => {

                color.forEach((d) => {
                    d.color(COLOR.CATEGORICAL[iColor % 8]);
                    d.unitgroup('color', colorField);
                })
            })
        }

    }

    /**
     * @description Using mark size to encode a data field
     *      * 
     * @return {void}
    */

    //  add size to the unit circle
    encodeSize() {
        let svg = this.svg();
        let width = this.width(),
            height = this.height();
        // situation 1
        if (this.x && this.y && this.size) {
            this.XYSizeLayout(height, width, svg)
        }
        // situation 2
        else if (this.x && !this.y && this.size) {
            this.XSizeLayout(height, width, svg)
        }
        // situation 3
        else if (!this.x && this.y && this.size) {
            this.YSizeLayout(height, width, svg)
        }
        // situation 4
        else {
            let units = this.units.filter(d => d.visible() === "1");
            let sizeField = this.size

            let allcenter = {
                xcenter: width / 2,
                ycenter: height / 2
            };

            // circle size and position calculation
            let nodesradius = [];
            let nodesvalue1 = [];

            nodesradius = units.map((d, i) => {
                nodesvalue1[i] = d[sizeField];
                return {
                    id: d.id(),
                    radius: d.radius(),
                    value: d[sizeField]
                }
            });

            let focusextent1 = d3.extent(units, d => d[sizeField]);
            let nodesScale = d3.scaleLinear()
                .domain([focusextent1[0], focusextent1[1]])
                // .range([height / 300 * height / 300, height / 30 * height / 30])
                .range(units.length > 800 ?
                    [height / 500 * height / 800, height / 50 * height / 80]
                    //  : [height / 300 * height / 300, height / 30 * height / 30]);
                    : [height / 500 * height / 500, height / 50 * height / 50]);


            for (let index in nodesradius) {
                nodesradius[index].radius = 0.8 * this.radiusMultiplier * Math.sqrt(nodesScale(nodesradius[index].value));
            }

            let simulation = d3.forceSimulation(nodesradius)
                .force('charge', d3.forceManyBody().strength(1))
                .force('center', d3.forceCenter(allcenter.xcenter, allcenter.ycenter))
                .force("collide", d3.forceCollide().radius((d, i) => d.radius + 0.5).iterations(2))

            simulation.tick(nodesvalue1.length > 800 ? 100 : 200);


            for (let index in units) {
                let f = nodesradius.find(item => item.id == index) //eslint-disable-line
                if (f) {
                    units[f.id].x(f.x);
                    units[f.id].y(f.y);
                    units[f.id].visible("1")
                    units[f.id].radius(f.radius)
                    units[f.id].unitgroup('size', sizeField)

                }
                else {
                    units[index].visible("0")
                }

                units[index].opacity("1")
            }

        }

        svg.select(".content").selectAll("defs").transition().duration(this.duration / 2).remove()

        this.AddMarkBackGrnd(svg)

    }


    /**
     * @description Using the shape of mark to encode a data field
     *      * 
     * @return {void}
    */

    encodeShape() {

    }

    /**
     * @description allocating the encoding actions based on spec and then update the chart.
     * 
     * @param {string} channel A encoding channel
     * @param {string} field A data field
     * @param {{delay: number, duration: number}} animation Animation parameters of the add encoding.
     * 
     * @return {void}
    */

    addEncoding(channel, field, animation = {}, axisStyle = {}) {
        if (!this[channel]) {
            this[channel] = field;
            this.delay = animation.delay
            this.duration = animation.duration
            let changesize = false;
            let changecolor = false;
            let changelayout = false;

            switch (channel) {
                case 'x':
                    this.axis.xaxis = axisStyle
                    this.encodeX();
                    changelayout = true
                    break;
                case 'y':
                    this.axis.yaxis = axisStyle
                    this.encodeY();
                    changelayout = true
                    break;
                case 'size':
                    this.encodeSize();
                    changelayout = true
                    changesize = true
                    break;
                case 'color':
                    this.encodeColor();
                    changecolor = true
                    break;
                default:
                    console.log('no channel select')
            }

            if (changecolor) {
                this.svg().select(".content")
                    .selectAll("circle")
                    .transition("change color")
                    .duration(this.duration)
                    .attr("fill", d => d.color());
            }

            if (changesize) {
                this.svg().select(".content")
                    .selectAll("circle")
                    .transition("change size")
                    .duration(this.duration)
                    .attr("r", d => d.radius());
            }

            if (changelayout) {
                this.svg().select(".content")
                    .selectAll("circle")
                    .transition("change layout")
                    .duration(this.duration)
                    .attr("cx", d => d.x())
                    .attr("cy", d => d.y())
                    .attr("r", d => d.radius())
            }




        }

    }

    /**
     * @description Modifying a current encoding channel and then update the chart.
     * 
     * @param {string} channel A encoding channel
     * @param {string} field A data field
     * @param {{delay: number, duration: number}} animation Animation parameters of modifying encoding.
     * 
     * @return {void}
    */

    modifyEncoding(channel, field, animation) {
        if (this[channel]) {
            this[channel] = field;
            this.delay = animation.delay
            this.duration = animation.duration
            let changesize = false;
            let changecolor = false;
            let changelayout = false;

            switch (channel) {
                case 'x':
                    this.encodeX();
                    changelayout = true
                    break;
                case 'y':
                    this.encodeY();
                    changelayout = true
                    break;
                case 'size':
                    this.encodeSize();
                    changelayout = true
                    changesize = true
                    break;
                case 'color':
                    this.encodeColor();
                    changecolor = true
                    break;
                default:
                    console.log('no channel select')
            }

            if (changecolor) {
                this.svg().select(".content")
                    .selectAll("circle")
                    .transition("change color")
                    .duration(this.duration)
                    .attr("fill", d => d.color());
            }

            if (changesize) {
                this.svg().select(".content")
                    .selectAll("circle")
                    .transition("change size")
                    .duration(this.duration)
                    .attr("r", d => d.radius());
            }

            if (changelayout) {
                this.svg().select(".content")
                    .selectAll("circle")
                    .transition("change layout")
                    .duration(this.duration)
                    .attr("cx", d => d.x())
                    .attr("cy", d => d.y())
                    .attr("r", d => d.radius())
            }

        }
    }

    /**
     * @description Removing an existing encoding action and update the chart
     * 
     * @param {string} channel A encoding channel
     * @param {string} field A data field
     * @param {{delay: number, duration: number}} animation Animation parameters of removing encoding.
     * 
     * @return {void}
    */

    removeEncoding(channel, animation) {
        this[channel] = null;
        this.delay = animation.delay
        this.duration = animation.duration

        let changesize = false;
        let changecolor = false;
        let changelayout = false;

        if (this.x) { this.encodeX(); changelayout = true }

        if (this.y) { this.encodeY(); changelayout = true }

        if (this.size) { this.encodeSize(); changesize = true }

        if (this.color) { this.encodeColor(); changecolor = true }

        if (changecolor) {
            this.svg().select(".content")
                .selectAll("circle")
                .transition("change color")
                .duration(this.duration)
                .attr("fill", d => d.color());
        }

        if (changesize) {
            this.svg().select(".content")
                .selectAll("circle")
                .transition("change size")
                .duration(this.duration)
                .attr("r", d => d.radius());
        }

        if (changelayout) {
            this.svg().select(".content")
                .selectAll("circle")
                .transition("change layout")
                .duration(this.duration)
                .attr("cx", d => d.x())
                .attr("cy", d => d.y())
                .attr("r", d => d.radius())
        }

    }

}

export default Unitvis;