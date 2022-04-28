import * as d3 from 'd3';
import Chart from '../chart';
import Color from '../../visualization/color';

const COLOR = new Color();

/**
 * @description A line chart is a chart type.
 * 
 * @class
 * @extends Chart
 */
class LineChart extends Chart {

    /**
     * @description Description Main function of drawing line chart.
     * 
     * @return {function} It represents the canvas that has been created, on which subsequent charts, titles, and other content expand.
     */
    visualize() {
        let margin = this.margin()
        this.width(this.width() - margin.left - margin.right);
        this.height(this.height() - margin.top - margin.bottom);

        let chartbackgroundsize = {
            width: 600,
            height: 600
        }
        
        d3.select(this.container())
            .append("svg")
            .attr("width", this.width() + margin.left + margin.right)
            .attr("height", this.height() + margin.top + margin.bottom)

        d3.select("svg")
            .append("g")
            .attr("id","chartBackGrnd")
            .append("rect")
            .attr("width", chartbackgroundsize.width)
            .attr("height", margin.top === 130? 490: chartbackgroundsize.height)
            .attr("transform", "translate(" + 20 + "," + margin.top + ")");
            

        this._svg = d3.select("svg")
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // d3.select("svg").style("background", "url(" + this.style()['background-image'] + ") center ").style("background-size", "cover")
        
        if(this.style()['background-color']){
            d3.select("#chartBackGrnd").attr("fill", this.style()['background-color']) 
        } 
        else if (this.style()['background-image']){
            let defs = this._svg.append('svg:defs');
            defs.append("svg:pattern")
                .attr("id", "chart-backgroundimage")
                .attr("width", chartbackgroundsize.width)
                .attr("height", margin.top === 130? 480: chartbackgroundsize.height)
                .attr("patternUnits", "userSpaceOnUse")
                .append("svg:image")
                .attr("xlink:href", this.style()["background-image"])
                .attr("width", chartbackgroundsize.width)
                .attr("height", margin.top === 130? 480: chartbackgroundsize.height)
                .attr("x", 0)
                .attr("y", 0);
                d3.select("#chartBackGrnd").attr("fill", "url(#chart-backgroundimage)")
        }
        else {
            d3.select("#chartBackGrnd").attr("fill-opacity", 0)
        }   

        
        this.drawAxis();
        this.encodeXY();
        this.encodeColor();

        return this.svg();       
    }


    /**
     * @description Draw lines with xy encoding.
     *
     * @return {void}
     */
    encodeXY() {
        if(this.x && this.y) {
            let svg = this.svg();
            let width = this.width() - 12,
                height = this.height() - 7;
            const processedData = this.processedData();
            const xEncoding = this.x,
                yEncoding = this.y;

            /** set the ranges */
            let xScale = d3.scaleBand()
                .range([0, width])
                .domain(processedData.map(d => d[xEncoding]));
        
            let yScale = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(processedData, d => d[yEncoding])])
                .nice();
        
            /** draw axis */
            let axis = svg.append("g")
                .attr("class", "axis"),
            content = svg.append("g")
                .attr("class", "content")
                .attr("chartWidth", width)
                .attr("chartHeight", height);
            let axisX = d3.axisBottom(xScale);
        
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
        
            axis.append("g")
                .attr("class", "axis_x")
                .attr('transform', `translate(0, ${height})`)
                .call(axisX);
        
        
            axis.append("g")
                .attr("class", "axis_y")
                .call(axisY);
            
            // specify color for axis elements
            // tick
            axis.selectAll(".tick line")
                .attr("stroke", COLOR.AXIS);
            // domain path
            axis.selectAll(".domain")
                .attr("stroke", COLOR.AXIS);
            // tick label
            axis.selectAll(".tick")
                .selectAll("text")
                .attr("fill", COLOR.AXIS);

            /** draw grid */
            axis.selectAll(".axis_y")
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
            const labelPadding = 20, fontsize = 12;

            axis.append("text")
                .attr("x", width / 2)
                .attr("y", height + svg.selectAll(".axis_x").select("path").node().getBBox().height + labelPadding)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "hanging")
                .attr("font-size", fontsize)
                .attr("fill", COLOR.AXIS)
                .text(xEncoding);

            axis.append("text")
                .attr("transform", `translate(${-labelPadding}, ${height / 2}) rotate(-90)`) 
                .attr("text-anchor", "middle")
                .attr("font-size", fontsize)
                .attr("fill", COLOR.AXIS)
                .text(yEncoding);

            /* draw lines */
            const line = d3.line()
            .x(d => xScale(d[xEncoding]))
            .y(d => yScale(d[yEncoding]))

            content.append("g")
                .attr("class", "lineGroup")
                .attr("fill", "none")
                .attr("stroke", COLOR.DEFAULT)
                .attr("stroke-width", 2)
                .attr("opacity", 1)
                .selectAll("path")
                .data(processedData)
                .enter()
                .append("path")
                .attr("class", "path")
                .attr("d" , line(processedData));

            /* draw points */
            const circleSize = Math.min(Math.ceil(Math.sqrt(height * width) / 50), 4);
            content.append("g")
                .attr("class", "circleGroup")
                .attr("fill", COLOR.DEFAULT)
                .selectAll("circle")
                .data(processedData)
                .enter().append("circle")
                .attr("class", "mark")
                .attr("r", circleSize)
                .attr("cx", d => xScale(d[xEncoding]))
                .attr("cy", d => yScale(d[yEncoding]));
        }
        
    }

    /**
     * @description Coloring lines with color encoding.
     *
     * @return {void}
     */
    encodeColor() {
        
        // const factData = this.factdata();
        // const measure = this.measure();
        // const breakdown = this.breakdown();
        // const xEncoding = breakdown[0].field,
        //     yEncoding = (measure[0].aggregate === "count" ? "COUNT" : measure[0].field),
        //     colorEncoding = breakdown.length < 2  ? null : breakdown[1].field;
        
        if(this.color) {
            let width = this.width(),
                height = this.height();
            const data = this.data();
            const xEncoding = this.x,
                yEncoding = this.y;
            const colorEncoding = this.color;

            let processedData = [];
            /** get series */
            let seriesData = {};
            data.forEach(d => {
                if(seriesData[d[colorEncoding]]) {
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

            /* draw lines */
            for(let factKey in processedData) {
                const line = d3.line()
                .x(d => xScale(d[xEncoding]))
                .y(d => yScale(d[yEncoding]))

                d3.select(".content")
                    .append("g")
                    .attr("class", "lineGroup")
                    .attr("fill", "none")
                    .attr("stroke", COLOR.DEFAULT)
                    .attr("stroke-width", 3)
                    .attr("opacity", 1)
                    .selectAll("path")
                    .data(processedData[factKey])
                    .enter()
                    .append("path")
                    .attr("class", "path")
                    .attr("d" , line(processedData[factKey]));
            }

            /* draw points */
            const circleSize = Math.min(Math.ceil(Math.sqrt(height * width) / 50), 4);
            for(let factKey in processedData) {
                d3.select(".content")
                    .append("g")
                    .attr("class", "circleGroup")
                    .attr("fill", COLOR.DEFAULT)
                    .selectAll("circle")
                    .data(processedData[factKey])
                    .enter().append("circle")
                    .attr("class", "mark")
                    .attr("r", circleSize)
                    .attr("cx", d => xScale(d[xEncoding]))
                    .attr("cy", d => yScale(d[yEncoding]));
            }
            
            d3.selectAll(".circleGroup")
                .attr("fill", (d,i) => {
                    return COLOR.CATEGORICAL[i]
                })

            d3.selectAll(".lineGroup")
                .attr("stroke", (d,i) => {
                    return COLOR.CATEGORICAL[i]
                })

        } 
    }

    /**
     * @description Add encoding and redraw lines.
     *
     * @return {void}
     */
    addEncoding(channel, field) {
        if(!this[channel]) {
            this[channel] = field;
            // d3.selectAll("svg > g > *").remove();
            this.drawAxis();
            if (this.x && this.y) this.encodeXY();
            if (this.color) this.encodeColor();
        }
    }

    /**
     * @description Modify encoding and redraw lines.
     *
     * @return {void}
     */
    modifyEncoding(channel, field) {
        if (this[channel]) {
            this[channel] = field;
            // d3.selectAll("svg > g > *").remove();
            this.drawAxis();
            if (this.x && this.y) this.encodeXY();
            if (this.color) this.encodeColor();
        }
    }

    /**
     * @description Remove encoding and redraw lines.
     *
     * @return {void}
     */
    removeEncoding(channel) {
        this[channel] = null;
        // d3.selectAll("svg > g > *").remove();
        if (this.x && this.y) this.encodeXY();
        if (this.color) this.encodeColor();
    }


}
export default LineChart;