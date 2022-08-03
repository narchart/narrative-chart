import * as d3 from 'd3';
import Chart from '../chart';
import Color from '../../visualization/color';
import Background from '../../visualization/background';

const COLOR = new Color();
const background = new Background();
const offset = 30;

/**
 * @description A area chart is a chart type.
 * 
 * @class
 * @extends Chart
 */
class AreaChart extends Chart {

    /**
     * @description Description Main function of drawing area chart.
     * 
     * @return {function} It represents the canvas that has been created, on which subsequent charts, titles, and other content expand.
     */
    visualize() {
        let margin = this.margin()

        this.Hscaleratio = this.height() / 640
        this.Wscaleratio = this.width() / 640

        this.width(this.width() - margin.left - margin.right);
        this.height(this.height() - margin.top - margin.bottom);

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


        this._svg = d3.select(container)
            .select("svg")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
        }
        else if (background.Background_Color) {
            d3.select("#svgBackGrnd").attr("fill", background.Background_Color.color ?? "white").attr("fill-opacity", background.Background_Color.opacity ?? 1)
        }
        else {
            d3.select("#svgBackGrnd").remove()
        }

        if (this.style()['background-image'] || this.style()['background-color']) {
            let defs = d3.select(container).select("svg").append('svg:defs');
            let pattern = defs.append("svg:pattern")
            .attr("id", "chart-backgroundimage")
            .attr("width", chartbackgroundsize.width)
            .attr("height", margin.top === 130 * this.Hscaleratio ? 500 * this.Hscaleratio : chartbackgroundsize.height)
                .attr("patternUnits", "userSpaceOnUse")
            
            if (this.style()['background-color']) {
                pattern.append("svg:rect")
                    .attr("width",chartbackgroundsize.width)
                    .attr("height",margin.top === 130 * this.Hscaleratio ? 500 * this.Hscaleratio : chartbackgroundsize.height)
                    .attr("fill", this.style()['background-color'].color ?? "white")
                    .attr("fill-opacity", this.style()['background-color'].opacity ?? 1)
            } 

            if (this.style()['background-image']) {
                let preserveAspectRatio = "xMidYMid slice"
                if (this.style()["background-image"].fit) {
                    switch (this.style()["background-image"].fit) {
                        case "fitMid":
                            preserveAspectRatio = "xMidYMid slice"
                            break;
                        case "fitLeft":
                            preserveAspectRatio = "xMinYMin slice"
                            break;
                        case "fitRight":
                            preserveAspectRatio = "xMaxYMax slice"
                            break;
                        case "fitUp":
                            preserveAspectRatio = "xMinYMin slice"
                            break;
                        case "fitDown":
                            preserveAspectRatio = "xMaxYMax slice"
                            break;
                        case "origin":
                            preserveAspectRatio = "xMidYMid meet"
                            break;
                        case "stretch":
                            preserveAspectRatio = "none"
                            break;
                        default:
                            break
                    }
                }
                pattern.append("svg:image")
                .attr("xlink:href", this.style()["background-image"].url)
                .attr("preserveAspectRatio", preserveAspectRatio)
                .attr("opacity", this.style()["background-image"].opacity ?? 1)
                .attr("filter", this.style()["background-image"].grayscale ? "grayscale(" + this.style()["background-image"].grayscale + "%)" : "grayscale(0%)")
                .attr("width", chartbackgroundsize.width)
                .attr("height", margin.top === 130 * this.Hscaleratio ? 500 * this.Hscaleratio : chartbackgroundsize.height)
                .attr("x", 0)
                .attr("y", 0);
            }

            d3.select("#chartBackGrnd").attr("fill", "url(#chart-backgroundimage)")
        } else {
            d3.select("#chartBackGrnd").attr("fill-opacity", 0)
        }

        this.initvis();

        return this.svg();
    }

    /**
     * @description The initial status of areachart vis
     *      * 
     * @return {void}
    */
    initvis() {
        let svg = this.svg();
        let width = this.width() - 12,
            height = this.height() - offset;

        svg.append("g")
            .attr("class", "axis");
        svg.append("g")
            .attr("class", "content")
            .attr("chartWidth", width)
            .attr("chartHeight", height);
    }

    /**
     * @description Using X-axis to encode a data field.
     *
     * @return {void}
     */
    encodeX(axis = {}) {
        let processedData = this.processedData();
        if (this.x) {
            let svg = this.svg();
            let width = this.width() - 12,
                height = this.height() - offset;
            const xEncoding = this.x;
            let axisClass = svg.select(".axis");

            /** set the ranges */
            let xScale = d3.scaleBand()
                .range([0, width])
                .domain(processedData.map(d => d[xEncoding]));

            let axis_X = axisClass.append("g")
                .attr("class", "axis_X");

            let axisX = d3.axisBottom(xScale)
                .ticks(5)
                .tickSize(5)
                .tickPadding(5)
                .tickFormat(function (d) {
                    var date = d.split('/')
                    return date[1] + '/' + date[2];
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
                .attr("font-size", axis['labelFontSize'] ? axis['labelFontSize'] : 10)
                .attr("text-anchor", axis['labelAngle'] ? "end" : "middle")
                .attr("transform", `rotate(-${axis['labelAngle'] ? axis['labelAngle'] : 0} 0 0)`);

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

        }
        else {

        }
    }

    /**
     * @description Using Y-axis to encode a data field.
     *
     * @return {void}
     */
    encodeY() {
        let processedData = this.processedData();
        if (this.y) {
            let svg = this.svg();
            let width = this.width() - 12,
                height = this.height() - offset;
            const yEncoding = this.y;
            let axis = svg.select(".axis");

            /** set the ranges */
            let yScale = d3.scaleLinear()
                .range([height, 10])
                .domain([0, d3.max(processedData, d => d[yEncoding])])
                .nice();

            let axis_Y = axis.append("g")
                .attr("class", "axis_Y");

            /** draw axis */
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

            axis_Y.append("g")
                .attr("class", "axis_y")
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
                .attr("fill", COLOR.AXIS);

            /** draw grid */
            axis_Y.selectAll(".axis_y")
                .selectAll("line")
                .attr("stroke", d => {
                    if (d === 0) return COLOR.AXIS;
                    else return COLOR.DIVIDER;
                })
                .attr("class", "gridline")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", width)
                .attr("y2", 0)
                .attr("opacity", 1);

            /* draw labels */
            const labelPadding = 24, fontsize = 16;
            axis_Y.append("text")
                .attr("transform", `translate(${-labelPadding}, ${height / 2}) rotate(-90)`)
                .attr("text-anchor", "middle")
                .attr("font-size", fontsize)
                .attr("fill", COLOR.AXIS)
                .text(yEncoding);

        }
        else {

        }
    }

    /**
     * @description Drawing area and dots of areachart vis
     *
     * @return {void}
     */
    encodeLine() {
        const xEncoding = this.x,
            yEncoding = this.y;

        let svg = this.svg();
        let width = this.width() - 12,
            height = this.height() - offset;
        let processedData = this.processedData();

        const lineWidth = this.markStyle()['stroke-width'] ? this.markStyle()['stroke-width'] : 2;
        const lineColor = this.markStyle()['stroke'] ? this.markStyle()['stroke'] : COLOR.DEFAULT;
        const dotRadius = this.markStyle()['point-radius'] ? this.markStyle()['point-radius'] : Math.min(Math.ceil(Math.sqrt(height * width) / 50), 4);
        const dotFill = this.markStyle()['point-fill'] ? this.markStyle()['point-fill'] : COLOR.DEFAULT;
        const dotStroke = this.markStyle()['point-stroke'] ? this.markStyle()['point-stroke'] : COLOR.DEFAULT;
        const dotStrokeWidth = this.markStyle()['point-stroke-width'] ? this.markStyle()['point-stroke-width'] : 0;
        const dotOpacity = this.markStyle()['point'] ? 1 : 0;

        const areaFill = this.markStyle()['area-fill'] ? this.markStyle()['area-fill'] : COLOR.DEFAULT;


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

        const area = d3.area()
            .x(d => xScale(d[xEncoding]) + xScale(processedData[1][xEncoding])/2)
            .y0(height)
            .y1(d => yScale(d[yEncoding]))

        /** set the ranges */
        let xScale = d3.scaleBand()
            .range([0, width])
            .domain(processedData.map(d => d[xEncoding]));

        let yScale = d3.scaleLinear()
            .range([height, 5])
            .domain([0, d3.max(processedData, d => d[yEncoding])])
            .nice();
        let content = svg.append("g")
            .attr("class", "content")
            .attr("chartWidth", width)
            .attr("chartHeight", height);
        /* draw lines */
        this.line = content.append("g")
            .attr("fill", "none")
            .attr("class", "areaGroup")
            .attr("stroke", lineColor)
            .attr("stroke-width", lineWidth)
            .attr("opacity", 1)
            .append("path")
            .attr("fill", areaFill) // color for the area
            .attr("d", area(processedData))
            .attr("class", "area");


        /* draw points */
        content.append("g")
            .attr("class", "circleGroup")
            .attr("stroke", dotStroke)
            .attr("stroke-width", dotStrokeWidth)
            .attr("opacity", dotOpacity)
            .selectAll("circle")
            .data(processedData)
            .enter().append("circle")
            .attr("class", "mark")
            .attr("r", dotRadius)
            .attr("cx", d => {
                return xScale(d[xEncoding]) + xScale(processedData[1][xEncoding]) / 2;
            })
            .attr("cy", d => yScale(d[yEncoding]))
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
                        .attr("width", 2 * dotRadius)
                        .attr("height", 2 * dotRadius)
                        .attr("x", 0)
                        .attr("y", 0);
                    return "url(#mark-background-image-" + i + ")"
                } else {
                    return dotFill;
                }
            });
    }

    /**
     * @description Coloring lines with color encoding.
     *
     * @return {void}
     */
    encodeColor() {
        if (this.color) {
            let width = this.width(),
                height = this.height() - offset;
            const data = this.data();
            const xEncoding = this.x,
                yEncoding = this.y;
            const colorEncoding = this.color;

            const lineWidth = this.markStyle()['stroke-width'] ? this.markStyle()['stroke-width'] : 2;
            const lineColor = this.markStyle()['stroke'] ? this.markStyle()['stroke'] : COLOR.DEFAULT;
            const dotRadius = this.markStyle()['point-radius'] ? this.markStyle()['point-radius'] : Math.min(Math.ceil(Math.sqrt(height * width) / 50), 4);
            const dotFill = this.markStyle()['point-fill'] ? this.markStyle()['point-fill'] : COLOR.DEFAULT;
            const dotStroke = this.markStyle()['point-stroke'] ? this.markStyle()['point-stroke'] : COLOR.DEFAULT;
            const dotStrokeWidth = this.markStyle()['point-stroke-width'] ? this.markStyle()['point-stroke-width'] : 0;
            const dotOpacity = this.markStyle()['point'] ? 1 : 0;

            let processedData = [];
            /** get series */
            let seriesData = {};
            data.forEach(d => {
                if (seriesData[d[colorEncoding]]) {
                    seriesData[d[colorEncoding]].push(d);
                } else {
                    seriesData[d[colorEncoding]] = [d];
                }
            });
            processedData = seriesData;

            /** set the ranges */
            let xScale = d3.scaleBand()
                .range([0, width])
                .domain(data.map(d => d[xEncoding]));

            let yScale = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(data, d => d[yEncoding])])
                .nice();

            this.svg().selectAll(".circleGroup").remove();
            this.svg().selectAll(".areaGroup").remove();

            /* draw lines */
            for (let factKey in processedData) {
                const line = d3.line()
                    .x(d => xScale(d[xEncoding]) + xScale(processedData[factKey][1][xEncoding]) / 2)
                    .y(d => yScale(d[yEncoding]))

                d3.select(".content")
                    .append("g")
                    .attr("class", "areaGroup")
                    .attr("fill", "none")
                    .attr("stroke", lineColor)
                    .attr("stroke-width", lineWidth)
                    .attr("opacity", 1)
                    .selectAll("path")
                    .data(processedData[factKey])
                    .enter()
                    .append("path")
                    .attr("d", line(processedData[factKey]));
            }

            /* draw points */
            for (let factKey in processedData) {
                d3.select(".content")
                    .append("g")
                    .attr("class", "circleGroup")
                    .attr("fill", dotFill)
                    .attr("stroke", dotStroke)
                    .attr("stroke-width", dotStrokeWidth)
                    .attr("opacity", dotOpacity)
                    .selectAll("circle")
                    .data(processedData[factKey])
                    .enter().append("circle")
                    .attr("class", "mark")
                    .attr("r", dotRadius)
                    .attr("cx", d => {
                        return xScale(d[xEncoding]) + xScale(processedData[factKey][1][xEncoding]) / 2
                    })
                    .attr("cy", d => yScale(d[yEncoding]));
            }

            d3.selectAll(".circleGroup")
                .attr("fill", (d, i) => {
                    return COLOR.CATEGORICAL[i]
                })

            d3.selectAll(".areaGroup")
                .attr("stroke", (d, i) => {
                    return COLOR.CATEGORICAL[i]
                })
        }
    }

    /**
     * @description Add encoding and redraw lines.
     *
     * @return {void}
     */
    addEncoding(channel, field, animation = {}, axis = {}) {
        if (!this[channel]) {
            this[channel] = field;

            switch (channel) {
                case "x":
                    this.encodeX(axis);
                    break;
                case "y":
                    this.encodeY();
                    this.encodeLine();
                    this.animationWipe(animation);
                    break;
                case "color":
                    this.encodeColor();
                    break;
                default:
                    console.log("no channel select");
            }

            // if (this.x) this.encodeX(axis);
            // if (this.y) this.encodeY();
            // if (this.x && this.y) {
            //     this.encodeLine();
            //     this.animationWipe(animation)
            // }
            // if (this.color) this.encodeColor();
        }
    }

    /**
     * @description Modify encoding and redraw lines.
     *
     * @return {void}
     */
    modifyEncoding(channel, field, animation = {}) {
        if (this[channel]) {
            this[channel] = field;

            let svg = this.svg();
            let content = svg.selectAll(".content")

            new Promise((resolve) => {
                if (channel === 'x' || channel === 'color') {
                    content.selectAll(".areaGroup")
                        .transition()
                        .duration('duration' in animation ? animation['duration'] / 2 : 0)
                        .style('opacity', 0)
                        .on("end", resolve)
                    content.selectAll(".circleGroup")
                        .transition()
                        .duration('duration' in animation ? animation['duration'] / 2 : 0)
                        .style('opacity', 0)
                        .on("end", resolve)
                }
                else if (channel === 'y') {
                    resolve();
                }
            })
                .then(() => {
                    if (channel === 'x') {
                        this.svg().selectAll(".areaGroup").remove();
                        this.svg().selectAll(".circleGroup").remove();
                        this.svg().selectAll(".axis_X").remove();
                    }
                    if (channel === 'y') {
                        this.svg().selectAll(".axis_Y").remove();
                    }
                    if (channel === 'color') {
                        this.svg().selectAll(".areaGroup").remove();
                        this.svg().selectAll(".circleGroup").remove();
                    }
                })
                .then(() => {
                    if (channel === 'x') {
                        this.encodeX();
                        this.encodeLine();
                        if (this.color) {
                            this.encodeColor();
                        }
                        if ('duration' in animation) {
                            animation['duration'] = animation['duration'] / 2
                            this.animationWipe(animation)
                        }
                    }
                    if (channel === 'y') {
                        this.encodeY();
                        let processedData = this.processedData();
                        let width = this.width() - 12,
                            height = this.height() - offset;
                        let svg = this.svg();
                        let content = svg.selectAll(".content");
                        let xScale = d3.scaleBand()
                            .range([0, width])
                            .domain(processedData.map(d => d[this.x]));
                        let yScale = d3.scaleLinear()
                            .range([height, 0])
                            .domain([0, d3.max(processedData, d => d[this.y])])
                            .nice();
                        let newline = d3.line()
                            .x(d => xScale(d[this.x]) + xScale(processedData[1][this.x]) / 2)
                            .y(d => yScale(d[this.y]))

                        this.line.transition()
                            .duration('duration' in animation ? animation['duration'] : 0)
                            .attr("d", newline(processedData))
                        content.selectAll(".mark")
                            .transition()
                            .duration('duration' in animation ? animation['duration'] : 0)
                            .attr("cy", d => yScale(d[this.y]))
                        if (this.color) {
                            this.svg().selectAll(".areaGroup").remove();
                            this.svg().selectAll(".circleGroup").remove();
                            this.encodeColor();
                            if ('duration' in animation) {
                                animation['duration'] = animation['duration'] / 2
                                this.animationWipe(animation)
                            }
                        }
                    }
                    if (channel === 'color') {
                        this.encodeColor()
                        if ('duration' in animation) {
                            animation['duration'] = animation['duration'] / 2
                            this.animationWipe(animation)
                        }
                    }
                })
        }
    }

    /**
     * @description Remove encoding and redraw lines.
     *
     * @return {void}
     */
    removeEncoding(channel, animation = {}) {
        this[channel] = null;
        let svg = this.svg();
        let content = svg.selectAll(".content")

        new Promise((resolve) => {
            content.selectAll(".areaGroup")
                .transition()
                .duration('duration' in animation ? animation['duration'] / 2 : 0)
                .style('opacity', 0)
                .on("end", resolve)
            content.selectAll(".circleGroup")
                .transition()
                .duration('duration' in animation ? animation['duration'] / 2 : 0)
                .style('opacity', 0)
                .on("end", resolve)
        })
            .then(() => {
                this.svg().selectAll(".areaGroup").remove();
                this.svg().selectAll(".circleGroup").remove();
                if (channel === 'x') {
                    this.svg().selectAll(".axis_X").remove();
                }
                if (channel === 'y') {
                    this.svg().selectAll(".axis_Y").remove();
                }
                if (channel === 'color') {
                    this.encodeX();
                    this.encodeY();
                    this.encodeLine();
                    if ('duration' in animation) {
                        animation['duration'] = animation['duration'] / 2
                        this.animationWipe(animation)
                    }
                }
            })
    }

    /**
     * @description Adding wipe animation to the chart
     * 
     * @param {{delay: number, duration: number}} animation Animation parameters of the action.
     * 
     * @return {void}
    */
    animationWipe(animation) {
        let svg = this.svg();
        let width = this.width() - 12,
            height = this.height() - offset;
        let content = svg.selectAll(".content")

        content.attr("id", "lineChartClip")
            .attr("clip-path", "url(#clip_linechart)");

        content.append("defs")
            .attr("class", "line_defs")
            .append("clipPath")
            .attr("id", "clip_linechart")
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 0)
            .attr("height", height);

        content.selectAll("#clip_linechart rect")
            .attr("width", 0)
            .transition()
            .duration('duration' in animation ? animation['duration'] : 0)
            .ease(d3.easeLinear)
            .attr("width", width);
    }


}
export default AreaChart;