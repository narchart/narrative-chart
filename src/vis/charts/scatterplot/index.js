import * as d3 from 'd3';
import Chart from '../chart';
import Color from '../../visualization/color';
import Point from './point';
import Background from '../../visualization/background';


const COLOR = new Color();
const background = new Background();


/**
 * @description A scatterplot chart is a chart type.
 * 
 * @class
 * @extends Chart
 */
class Scatterplot extends Chart {
    /** 
     * @description Main function of visualizing scatterplot.
     * @returns {function} It represents the canvas that has been created, on which subsequent charts, titles, and other content expand.
     */
    visualize() {
        let margin = this.margin()

        this.Hscaleratio = this.height() / 640
        this.Wscaleratio = this.width() / 640

        this.width(this.width() - margin.left - margin.right);
        this.height(this.height() - margin.top - margin.bottom);

        this.points = [];

        let chartbackgroundsize = {
            width: 600 * this.Wscaleratio,
            height: 600 * this.Hscaleratio
        }

        let container = this.container()

        d3.select(container)
            .append("svg")
            .attr("width", this.width() + margin.left + margin.right)
            .attr("height", this.height() + margin.top + margin.bottom)
            .style("background-color", COLOR.BACKGROUND)

        d3.select(container)
            .select("svg")
            .append("g")
            .attr("id", "svgBackGrnd")
            .append("rect")
            .attr("width", this.Wscaleratio * 640)
            .attr("height", this.Hscaleratio * 640)


        d3.select(container)
            .select("svg")
            .append("g")
            .attr("id", "chartBackGrnd")
            .append("rect")
            .attr("width", chartbackgroundsize.width)
            .attr("height", margin.top === 130 * this.Hscaleratio ? 500 * this.Hscaleratio : chartbackgroundsize.height)
            .attr("transform", "translate(" + (20 * this.Wscaleratio) + "," + margin.top + ")");

        const marginTopOffset = 6.3;
        this._svg = d3.select(container)
            .select("svg")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + (margin.top + marginTopOffset) + ")");

        if (background.Background_Image) {
            let defs = d3.select(container).select("svg").append('svg:defs');
            defs.append("svg:pattern")
                .attr("id", "svg-backgroundimage")
                .attr("width", 1)
                .attr("height", 1)
                .attr("patternUnits", "objectBoundingBox")
                .append("svg:image")
                .attr("xlink:href", background.Background_Image.url)
                .attr("preserveAspectRatio", "none")
                .attr("opacity", background.Background_Image.opacity ?? 1)
                .attr("filter", background.Background_Image.grayscale ? "grayscale(" + background.Background_Image.grayscale + "%)" : "grayscale(0%)")
                .attr("width", this.Wscaleratio * 640)
                .attr("height", this.Hscaleratio * 640)
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
                .attr("width", chartbackgroundsize.width)
                .attr("height", margin.top === 130 * this.Hscaleratio ? 500 * this.Hscaleratio : chartbackgroundsize.height)
                .attr("patternUnits", "userSpaceOnUse")
                .append("svg:image")
                .attr("xlink:href", this.style()["background-image"].url)
                .attr("preserveAspectRatio", "xMidYMid slice")
                .attr("opacity", this.style()["background-image"].opacity ?? 1)
                .attr("filter", this.style()["background-image"].grayscale ? "grayscale(" + this.style()["background-image"].grayscale + "%)" : "grayscale(0%)")
                .attr("width", chartbackgroundsize.width)
                .attr("height", margin.top === 130 * this.Hscaleratio ? 500 * this.Hscaleratio : chartbackgroundsize.height)
                .attr("x", 0)
                .attr("y", 0);
            d3.select("#chartBackGrnd").attr("fill", "url(#chart-backgroundimage)")
        }
        else {
            d3.select("#chartBackGrnd").attr("fill-opacity", 0)
        }
        // this._svg = d3.select(this.container())
        //     .append("svg")
        //     .attr("width", this.width() + margin.left + margin.right)
        //     .attr("height", this.height() + margin.top + margin.bottom)
        //     .append("g")
        //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        this.data()
        this.initvis()

        return this.svg();
    }

    /**
     * @description assigning identity and data information for each point mark
     *      * 
     * @return {void}
    */
    data() {
        let processedData = this.processedData();
        processedData.forEach((d, i) => {
            let point = new Point();
            point.id(i);
            point.data(d)
            this.points.push(point);
        })
        return this;
    }

    /**
     * @description The initial status of scatterplot vis
     *      * 
     * @return {void}
    */
    initvis() {
        let svg = this.svg();
        svg.append("g")
            .attr("class", "axis");
        const widthOffset = 21;
        let width = this.width() - widthOffset,
            height = this.height();
        let initX = width / 2;
        let initY = height / 2;

        let stroke = this.markStyle()['stroke-color'] ? this.markStyle()['stroke-color'] : "#000000";
        let strokeWidth = this.markStyle()['stroke-width'] ? this.markStyle()['stroke-width'] : 0;
        let strokeOpacity = this.markStyle()['stroke-opacity'] ? this.markStyle()['stroke-opacity'] : 1;
        let fillOpacity = this.markStyle()['fill-opacity'] ? this.markStyle()['fill-opacity'] : 1;

        var config = {
            "point_size": 300
        }
        var defs = svg.append('svg:defs');
        defs.append("svg:pattern")
            .attr("id", "point_image_background")
            .attr("width", config.point_size)
            .attr("height", config.point_size)
            .attr("patternUnits", "userSpaceOnUse")
            .append("svg:image")
            .attr("xlink:href", this.markStyle()['background-image'])
            .attr("x", 0)
            .attr("y", 0);

        let content = svg.append("g")
            .attr("class", "content")
            .attr("chartWidth", width)
            .attr("chartHeight", height);
        content.append("g")
            .attr("class", "circleGroup")
            .selectAll("circle")
            .data(this.points)
            .enter().append("circle")
            .attr("class", "mark")
            .attr("stroke", stroke)
            .attr("stroke-width", strokeWidth)
            .attr("stroke-opacity", strokeOpacity)
            .attr("fill-opacity", fillOpacity)
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
                        .attr("width", 2 * 7)
                        .attr("height", 2 * 7)
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
            .attr("cx", initX)
            .attr("cy", initY)
            .attr("opacity", 0)
    }

    /**
     * @description Using X-axis to encode a data field.
     *
     * @return {void}
     */
    encodeX(animation = {}, axis = {}) {
        if (this.x) {
            const widthOffset = 21, heightOffset = 36;
            let svg = this.svg();
            let width = this.width() - widthOffset,
                height = this.height() - heightOffset;
            const xEncoding = this.x;
            let axisContent = svg.select(".axis")

            // set the ranges
            let xScale = d3.scaleLinear()
                .range([0, width])
                .domain([0, d3.max(this.points, d => d[xEncoding])])
                .nice();

            let axis_X = axisContent.append("g")
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

            axis_X.selectAll(".axis_x .tick")
                .append("line")
                .attr("stroke", d => {
                    if ((d !== 0) || (!this.y)) { return COLOR.DIVIDER; }
                })
                .attr("class", "gridline")
                .attr("x1", 0)
                .attr("y1", -height)
                .attr("x2", 0)
                .attr("y2", 0);

            axis_X.append("line")
                .attr("stroke", COLOR.DIVIDER)
                .attr("class", "gridline")
                .attr("x1", width)
                .attr("y1", height)
                .attr("x2", width)
                .attr("y2", 0);

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
                .attr("font-size", axis['labelFontSize'] || 10)
                .attr("text-anchor", "middle")
                .attr("transform", `rotate(-${axis['labelAngle'] || 0} 0 10)`);

            /* draw labels */
            const labelPadding = 24, fontsize = 16;

            axis_X.append("text")
                .attr("x", width / 2)
                .attr("y", height + svg.selectAll(".axis_x").select("path").node().getBBox().height + labelPadding)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "hanging")
                .attr("font-size", fontsize)
                .attr("fill", COLOR.AXIS)
                .text(xEncoding);

            /* points */
            const circleSize = Math.min(Math.ceil(Math.sqrt(height * width) / 50), 7);
            this.points.forEach((d) => {
                d.x(xScale(d[xEncoding]));
                d.size(circleSize);
                d.color(COLOR.DEFAULT)
            })
            if (!this.y) {
                let defaultY = height / 2;
                this.points.forEach((d) => {
                    d.y(defaultY);
                })
            }
        }
        else {
            let defaultX = this.width() / 2;
            this.points.forEach((d) => {
                d.x(defaultX);
            })
            if (this.y) {
                this.svg().select(".axis_Y")
                    .append("line")
                    .attr("stroke", COLOR.DIVIDER)
                    .attr("class", "gridline")
                    .attr("x1", 0)
                    .attr("y1", this.height() - 9.5)
                    .attr("x2", this.width())
                    .attr("y2", this.height() - 9.5);
            }
        }
    }

    /**
     * @description Using Y-axis to encode a data field.
     *
     * @return {void}
     */
    encodeY(animation = {}, axis = {}) {
        if (this.y) {
            const widthOffset = 21, heightOffset = 36;
            let svg = this.svg();
            let width = this.width() - widthOffset,
                height = this.height() - heightOffset;
            const yEncoding = this.y;
            let axisContent = svg.select(".axis")

            // set the ranges
            let yScale = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(this.points, d => d[yEncoding])])
                .nice();

            let axis_Y = axisContent.append("g")
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
                .attr("font-size", axis['labelFontSize'] || 10)
                .attr("transform", `rotate(-${axis['labelAngle'] || 0} -10 0)`);

            // for grid line
            axis_Y.selectAll(".axis_y .tick")
                .append("line")
                .attr("stroke", d => {
                    if ((d !== 0) || (!this.x)) { return COLOR.DIVIDER; }
                })
                .attr("class", "gridline")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", width)
                .attr("y2", 0);

            axis_Y.append("line")
                .attr("stroke", COLOR.DIVIDER)
                .attr("class", "gridline")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", width)
                .attr("y2", 0);

            /* draw labels */
            const labelPadding = 24, fontsize = 16;

            axis_Y.append("text")
                .attr("transform", `translate(${-labelPadding - svg.selectAll(".axis_y").select("path").node().getBBox().width}, ${height / 2}) rotate(-90)`)
                .attr("text-anchor", "middle")
                .attr("font-size", fontsize)
                .attr("fill", COLOR.AXIS)
                .text(yEncoding);

            /* points */
            const circleSize = Math.min(Math.ceil(Math.sqrt(height * width) / 50), 7);
            this.points.forEach((d) => {
                d.y(yScale(d[yEncoding]));
                d.size(circleSize);
                d.color(COLOR.DEFAULT)
            })
            if (!this.x) {
                let defaultX = width / 2;
                this.points.forEach((d) => {
                    d.x(defaultX);
                })
            }
        }
        else {
            let defaultY = this.height() / 2;
            this.points.forEach((d) => {
                d.y(defaultY);
            })
            if (this.x) {
                this.svg().select(".axis_X")
                    .append("line")
                    .attr("stroke", COLOR.DIVIDER)
                    .attr("class", "gridline")
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", 0)
                    .attr("y2", this.height());
            }
        }
    }

    /**
     * @description Using mark color to encode a data field
     *      * 
     * @return {void}
    */
    encodeColor(animation = {}) {
        if (this.color) {
            let color = this.color
            let categories = Array.from(new Set(this.points.map(d => d[color])))
            this.points.forEach((d) => {
                let i = categories.indexOf(d[color]);
                let pointcolor = COLOR.CATEGORICAL[i % 8];
                d.color(pointcolor)
            })
        }
        else {
            this.points.forEach((d) => {
                d.color(COLOR.DEFAULT)
            })
        }
    }

    /**
     * @description Using mark size to encode a data field
     *  
     * @return {void}
    */
    encodeSize(animation = {}) {
        if (this.size) {
            let size = this.size;
            let width = this.width(),
                height = this.height();
            let sizeEncoding = size;
            const circleSize = Math.min(Math.ceil(Math.sqrt(height * width) / 40), 15);
            const maxR = circleSize;
            const minR = circleSize / 10;
            let minValue = d3.min(this.points, d => d[sizeEncoding]),
                maxValue = d3.max(this.points, d => d[sizeEncoding]);
            let scale = d3.scaleSqrt([minValue, maxValue], [minR, maxR]);
            this.points.forEach((d) => {
                d.size(scale(d[sizeEncoding]));
            })

            d3.select(".content").selectAll("circle")
                .data(this.points)
                .attr("fill", (d, i) => {
                    if (this.markStyle()['background-image']) {
                        let defs = d3.select(".content").append('svg:defs');
                        defs.append("svg:pattern")
                            .attr("id", "mark-background-image-size" + i)
                            .attr("width", 1)
                            .attr("height", 1)
                            .attr("patternUnits", "objectBoundingBox")
                            .append("svg:image")
                            .attr("xlink:href", this.markStyle()["background-image"])
                            .attr("width", 2 * d.size())
                            .attr("height", 2 * d.size())
                            .attr("x", 0)
                            .attr("y", 0);
                        return "url(#mark-background-image-size" + i + ")"
                    } else if (this.markStyle()['fill']) {
                        return this.markStyle()['fill']
                    }
                    else {
                        return d.color()
                    }
                })
        }
        else {
            let width = this.width();
            let height = this.height();
            const circleSize = Math.min(Math.ceil(Math.sqrt(height * width) / 50), 7);
            this.points.forEach((d) => {
                d.size(circleSize);
            })
        }
    }

    /**
     * @description Using the shape of mark to encode a data field
     * 
     * @return {void}
    */
    encodeShape(animation = {}) {

    }

    /**
     * @description allocating the encoding actions based on spec and then update the chart.
     * 
     * @param {string} channel A encoding channel
     * @param {string} field A data field
     * @param {{delay: number, duration: number}} animation Animation parameters of the action.
     * 
     * @return {void}
    */
    addEncoding(channel, field, animation = {}, axis = {}) {
        if (!this[channel]) {
            this[channel] = field;

            let changeX = false;
            let changeY = false;
            let changesize = false;
            let changecolor = false;

            switch (channel) {
                case 'x':
                    changeX = true
                    this.encodeX(animation, axis)
                    break;
                case 'y':
                    changeY = true
                    this.encodeY(animation, axis)
                    break;
                case 'size':
                    changesize = true
                    this.encodeSize(animation)
                    break;
                case 'color':
                    changecolor = true
                    this.encodeColor(animation)
                    break;
                default:
                    console.log("no channel select")
            }
            if (changeX || changeY) {
                this.svg().select(".content")
                    .selectAll("circle")
                    .transition("change layout")
                    .duration('duration' in animation ? animation['duration'] : 0)
                    .attr("cx", d => d.x())
                    .attr("cy", d => d.y())
                    .attr("r", d => d.size())
                if ('duration' in animation) {
                    this.animationFade(animation)
                }
                else {
                    this.svg().select(".content")
                        .selectAll("circle")
                        .attr("opacity", 1);
                }
            }
            if (changecolor) {
                this.svg().select(".content")
                    .selectAll("circle")
                    .transition("change color")
                    .duration('duration' in animation ? animation['duration'] : 0)
                    .attr("fill", d => d.color());
            }
            if (changesize) {
                this.svg().select(".content")
                    .selectAll("circle")
                    .transition("change size")
                    .duration('duration' in animation ? animation['duration'] : 0)
                    .attr("r", d => d.size());
            }
        }
    }

    /**
     * @description Modifying a current encoding channel and then update the chart.
     * 
     * @param {string} channel A encoding channel
     * @param {string} field A data field
     * @param {{delay: number, duration: number}} animation Animation parameters of the action.
     * 
     * @return {void}
    */
    modifyEncoding(channel, field, animation = {}) {
        if (this[channel]) {
            this[channel] = field;

            let changeX = false;
            let changeY = false;
            let changecolor = false;
            let changesize = false;

            switch (channel) {
                case 'x':
                    changeX = true
                    this.svg().selectAll(".axis_X").remove();
                    this.encodeX(animation);
                    break;
                case 'y':
                    changeY = true
                    this.svg().selectAll(".axis_Y").remove();
                    this.encodeY(animation);
                    break;
                case 'size':
                    changesize = true
                    this.encodeSize(animation)
                    break;
                case 'color':
                    changecolor = true
                    this.encodeColor(animation)
                    break;
                default:
                    console.log("no channel select")
            }
            if (changeX || changeY) {
                this.svg().select(".content")
                    .selectAll("circle")
                    .transition("change layout")
                    .duration('duration' in animation ? animation['duration'] : 0)
                    .attr("cx", d => d.x())
                    .attr("cy", d => d.y())
            }
            if (changecolor) {
                this.svg().select(".content")
                    .selectAll("circle")
                    .transition("change color")
                    .duration('duration' in animation ? animation['duration'] : 0)
                    .attr("fill", d => d.color());
            }
            if (changesize) {
                this.svg().select(".content")
                    .selectAll("circle")
                    .transition("change size")
                    .duration('duration' in animation ? animation['duration'] : 0)
                    .attr("r", d => d.size());
            }
        }
    }

    /**
     * @description Removing an existing encoding action and update the chart
     * 
     * @param {string} channel A encoding channel
     * @param {string} field A data field
     * @param {{delay: number, duration: number}} animation Animation parameters of the action.
     * 
     * @return {void}
    */
    removeEncoding(channel, animation = {}) {
        this[channel] = null;
        let svg = this.svg();

        let changeX = false;
        let changeY = false;
        let changesize = false;
        let changecolor = false;

        switch (channel) {
            case 'x':
                changeX = true
                svg.selectAll(".axis_X").remove();
                this.encodeX(animation)
                break;
            case 'y':
                changeY = true
                svg.selectAll(".axis_Y").remove();
                this.encodeY(animation)
                break;
            case 'size':
                changesize = true
                this.encodeSize(animation)
                break;
            case 'color':
                changecolor = true
                this.encodeColor(animation)
                break;
            default:
                console.log("no channel select")
        }
        if (changeX || changeY) {
            this.svg().select(".content")
                .selectAll("circle")
                .transition("change layout")
                .duration('duration' in animation ? animation['duration'] : 0)
                .attr("cx", d => d.x())
                .attr("cy", d => d.y())
        }
        if (changecolor) {
            this.svg().select(".content")
                .selectAll("circle")
                .transition("change color")
                .duration('duration' in animation ? animation['duration'] : 0)
                .attr("fill", d => d.color());
        }
        if (changesize) {
            this.svg().select(".content")
                .selectAll("circle")
                .transition("change size")
                .duration('duration' in animation ? animation['duration'] : 0)
                .attr("r", d => d.size());
        }
    }

    /**
     * @description Adding fade animation to the chart
     * 
     * @param {{delay: number, duration: number}} animation Animation parameters of the action.
     * 
     * @return {void}
    */
    animationFade(animation) {
        let svg = this.svg();
        svg.select(".content")
            .selectAll("circle")
            .transition("Fade In")
            .duration('duration' in animation ? animation['duration'] : 0)
            .attr("opacity", 1)
    }
}

export default Scatterplot;