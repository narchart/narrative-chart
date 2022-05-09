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

        this.initvis();

        return this.svg();       
    }

    /**
     * @description The initial status of linechart vis
     *      * 
     * @return {void}
    */
    initvis() {
        let svg = this.svg();
        let width = this.width() - 12,
            height = this.height() - 7;
        let processedData = this.processedData();
    
        svg.append("g")
            .attr("class", "axis");
        let content = svg.append("g")
            .attr("class", "content")
            .attr("chartWidth", width)
            .attr("chartHeight", height);
  
        /* draw points */
        let initX = width / 2;
        let initY = height / 2;
        const circleSize = Math.min(Math.ceil(Math.sqrt(height * width) / 50), 4);
        content.append("g")
            .attr("class", "circleGroup")
            .attr("fill", COLOR.DEFAULT)
            .selectAll("circle")
            .data(processedData)
            .enter().append("circle")
            .attr("class", "mark")
            .attr("r", circleSize)
            .attr("cx", d => initX)
            .attr("cy", d => initY)
            .attr("opacity", 0);
    }

    /**
     * @description Using X-axis to encode a data field.
     *
     * @return {void}
     */
    encodeX() {
        let processedData = this.processedData();
        if(this.x){
            let svg = this.svg();
            let width = this.width() - 12,
                height = this.height() - 7;
            const xEncoding = this.x;
            let axis = svg.select(".axis");

            /** set the ranges */
            let xScale = d3.scaleBand()
                .range([0, width])
                .domain(processedData.map(d => d[xEncoding]));

            let axis_X = axis.append("g")
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
                .attr("fill", COLOR.AXIS);

            /* draw labels */
            const labelPadding = 20, fontsize = 12;

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
                height = this.height() - 7;
            const yEncoding = this.y;
            let axis = svg.select(".axis");

            /** set the ranges */
            let yScale = d3.scaleLinear()
                .range([height, 0])
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
            const labelPadding = 20, fontsize = 12;
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
     * @description Drawing line and dots of linechart vis
     *
     * @return {void}
     */
    encodeLine() {
        let svg = this.svg();
        let width = this.width() - 12,
            height = this.height() - 7;
        let processedData = this.processedData();
        const line = d3.line()
            .x(d => xScale(d[xEncoding]) + xScale(processedData[1][xEncoding])/2)
            .y(d => yScale(d[yEncoding]))
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
    
        svg.append("g")
            .attr("class", "axis");
        let content = svg.append("g")
            .attr("class", "content")
            .attr("chartWidth", width)
            .attr("chartHeight", height);
        /* draw lines */
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
            .attr("cx", d => {
                return xScale(d[xEncoding]) + xScale(processedData[1][xEncoding])/2;
            })
            .attr("cy", d => yScale(d[yEncoding]));
    }

    /**
     * @description Coloring lines with color encoding.
     *
     * @return {void}
     */
    encodeColor() {           
        if(this.color) {
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
            if (this.x) this.encodeX();
            if (this.y) this.encodeY();
            if (this.x && this.y) this.encodeLine();
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
            if (this.x) this.encodeX();
            if (this.y) this.encodeY();
            if (this.x && this.y) this.encodeLine();
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
        if (this.x) this.encodeX();
        if (this.y) this.encodeY();
        if (this.x && this.y) this.encodeLine();
        if (this.color) this.encodeColor();
    }


}
export default LineChart;