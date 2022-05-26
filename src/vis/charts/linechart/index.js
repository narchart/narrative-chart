import * as d3 from 'd3';
import Chart from '../chart';
import Color from '../../visualization/color';
import Background from '../../visualization/background';

const COLOR = new Color();
const background = new Background();

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

        this.Hscaleratio = this.height()/640
        this.Wscaleratio = this.width()/640

        this.width(this.width() - margin.left - margin.right);
        this.height(this.height() - margin.top - margin.bottom);

        let chartbackgroundsize = {
            width: 600*this.Wscaleratio,
            height: 600*this.Hscaleratio
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
            .attr("id","chartBackGrnd")
            .append("rect")
            .attr("width", chartbackgroundsize.width)
            .attr("height", margin.top === 130*this.Hscaleratio? 490*this.Hscaleratio: chartbackgroundsize.height)
            .attr("transform", "translate(" + (20*this.Wscaleratio) + "," + margin.top + ")");
            

        this._svg = d3.select(container)
                    .select("svg")
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        if(background.Background_Image){
            d3.select(container).select("svg").style("background", "url(" + background.Background_Image + ") center ").style("background-size", "cover").style("background-repeat", "no-repeat")
            }
    
        if(background.Background_Color){
                d3.select(container).select("svg").style("background", background.Background_Color + " center ").style("background-size", "cover")
            }
                    
        if(this.style()['background-color']){
            d3.select("#chartBackGrnd").attr("fill", this.style()['background-color']) 
        } 
        else if (this.style()['background-image']){
            let defs = d3.select(container).select("svg").append('svg:defs');
            defs.append("svg:pattern")
                .attr("id", "chart-backgroundimage")
                .attr("width", 1)
                .attr("height", 1)
                .attr("patternUnits", "objectBoundingBox")
                .append("svg:image")
                .attr("xlink:href", this.style()["background-image"])
                .attr("preserveAspectRatio", "xMidYMid slice") 
                .attr("width", chartbackgroundsize.width)
                .attr("height", margin.top === 130*this.Hscaleratio? 490*this.Hscaleratio: chartbackgroundsize.height)
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

        const lineWidth = this.markStyle()['stroke-width'] ? this.markStyle()['stroke-width'] : 2;
        const lineColor = this.markStyle()['stroke'] ? this.markStyle()['stroke'] : COLOR.DEFAULT;
        const dotRadius = this.markStyle()['point-radius'] ? this.markStyle()['point-radius'] : Math.min(Math.ceil(Math.sqrt(height * width) / 50), 4);
        const dotFill = this.markStyle()['point-fill'] ? this.markStyle()['point-fill'] : COLOR.DEFAULT;
        const dotStroke = this.markStyle()['point-stroke'] ? this.markStyle()['point-stroke'] : COLOR.DEFAULT;
        const dotStrokeWidth = this.markStyle()['point-stroke-width'] ? this.markStyle()['point-stroke-width'] : 0;
        const dotOpacity = this.markStyle()['point'] ? 1 : 0;

        var config = {
            "point_size" : 300
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
            .range([height, 10])
            .domain([0, d3.max(processedData, d => d[yEncoding])])
            .nice();
    
        svg.append("g")
            .attr("class", "axis");
        let content = svg.append("g")
            .attr("class", "content")
            .attr("chartWidth", width)
            .attr("chartHeight", height);
        /* draw lines */
        this.line = content.append("g")
            .attr("class", "lineGroup")
            .attr("fill", "none")
            .attr("stroke", lineColor)
            .attr("stroke-width", lineWidth)
            .attr("opacity", 1)
            .selectAll("path")
            .data(processedData)
            .enter()
            .append("path")
            .attr("class", "path")
            .attr("d" , line(processedData));   
            
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
                return xScale(d[xEncoding]) + xScale(processedData[1][xEncoding])/2;
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
        if(this.color) {
            let width = this.width(),
            height = this.height();
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

            this.svg().selectAll(".circleGroup").remove();
            this.svg().selectAll(".lineGroup").remove();

            /* draw lines */
            for(let factKey in processedData) {
                const line = d3.line()
                .x(d => xScale(d[xEncoding]) + xScale(processedData[factKey][1][xEncoding])/2)
                .y(d => yScale(d[yEncoding]))

                d3.select(".content")
                    .append("g")
                    .attr("class", "lineGroup")
                    .attr("fill", "none")
                    .attr("stroke", lineColor)
                    .attr("stroke-width", lineWidth)
                    .attr("opacity", 1)
                    .selectAll("path")
                    .data(processedData[factKey])
                    .enter()
                    .append("path")
                    .attr("class", "path")
                    .attr("d" , line(processedData[factKey]));
            }

            /* draw points */
            for(let factKey in processedData) {
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
                        return xScale(d[xEncoding])  + xScale(processedData[factKey][1][xEncoding])/2
                    })
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
    addEncoding(channel, field, animation = {}) {
        if(!this[channel]) {
            this[channel] = field;
            if (this.x) this.encodeX();
            if (this.y) this.encodeY();
            if (this.x && this.y) {
                this.encodeLine();
                this.animationWipe(animation)
            }
            if (this.color) this.encodeColor();
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
            if(channel === 'x' || channel === 'color' ){
                content.selectAll(".lineGroup")
                    .transition()
                    .duration('duration' in animation ? animation['duration']/2 : 0)
                    .style('opacity', 0)
                    .on("end", resolve)
                content.selectAll(".circleGroup")
                    .transition()
                    .duration('duration' in animation ? animation['duration']/2 : 0)
                    .style('opacity', 0)
                    .on("end", resolve)
            }
            else if(channel === 'y'){
                resolve();
            }
        })
        .then(()=>{
            if(channel === 'x'){
                this.svg().selectAll(".lineGroup").remove();
                this.svg().selectAll(".circleGroup").remove();
                this.svg().selectAll(".axis_X").remove();
            }
            if(channel === 'y'){
                this.svg().selectAll(".axis_Y").remove();
            }
            if(channel === 'color'){
                this.svg().selectAll(".lineGroup").remove();
                this.svg().selectAll(".circleGroup").remove();
            }
        })
        .then(()=>{
            if(channel === 'x'){
                this.encodeX();
                this.encodeLine();
                if(this.color) {
                    this.encodeColor();
                }
                if('duration' in animation){
                    animation['duration'] = animation['duration']/2
                    this.animationWipe(animation)
                }
            }
            if(channel === 'y'){
                this.encodeY();
                let processedData = this.processedData();
                let width = this.width() - 12,
                    height = this.height() - 7;
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
                        .x(d => xScale(d[this.x]) + xScale(processedData[1][this.x])/2)
                        .y(d => yScale(d[this.y]))
                    
                this.line.transition()
                        .duration('duration' in animation ? animation['duration'] : 0)
                        .attr("d", newline(processedData))
                content.selectAll(".mark")
                        .transition()
                        .duration('duration' in animation ? animation['duration'] : 0)
                        .attr("cy", d => yScale(d[this.y]))
                if(this.color) {
                    this.svg().selectAll(".lineGroup").remove();
                    this.svg().selectAll(".circleGroup").remove();
                    this.encodeColor();
                    if('duration' in animation){
                        animation['duration'] = animation['duration']/2
                        this.animationWipe(animation)
                    }
                }
            }
            if(channel === 'color'){
                this.encodeColor()
                if('duration' in animation){
                    animation['duration'] = animation['duration']/2
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
            content.selectAll(".lineGroup")
                    .transition()
                    .duration('duration' in animation ? animation['duration']/2 : 0)
                    .style('opacity', 0)
                    .on("end", resolve)
            content.selectAll(".circleGroup")
                    .transition()
                    .duration('duration' in animation ? animation['duration']/2 : 0)
                    .style('opacity', 0)
                    .on("end", resolve)
        })
        .then(()=>{
            this.svg().selectAll(".lineGroup").remove();
            this.svg().selectAll(".circleGroup").remove();
            if(channel === 'x'){
                this.svg().selectAll(".axis_X").remove();
            }
            if(channel === 'y'){
                this.svg().selectAll(".axis_Y").remove();
            }
            if(channel === 'color'){
                this.encodeX();
                this.encodeY();
                this.encodeLine();
                if('duration' in animation){
                    animation['duration'] = animation['duration']/2
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
   animationWipe(animation){
        let svg = this.svg();
        let width = this.width() - 12,
            height = this.height() - 7;
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
export default LineChart;