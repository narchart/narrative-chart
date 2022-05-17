import * as d3 from 'd3';
import Chart from '../chart';
import Color from '../../visualization/color';
import Background from '../../visualization/background';


const COLOR = new Color();
const background = new Background();


/**
 * @description A bar chart is a chart type.
 * 
 * @class
 * @extends Chart
 */
class BarChart extends Chart {

    /**
     * @description Main function of drawing bar chart.
     *
     * @return {function} It represents the canvas that has been created, on which subsequent charts, titles, and other content expand.
     */
    visualize() {
        let margin = this.margin()

        this.width(this.width() - margin.left - margin.right);
        this.height(this.height() - margin.top - margin.bottom);

        // this._svg = d3.select(this.container())
        //         .append("svg")
        //         .attr("width", this.width() + margin.left + margin.right)
        //         .attr("height", this.height() + margin.top + margin.bottom)
        //         .append("g")
                // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        this.cornerRadius = this.markStyle()['corner-radius'] ? this.markStyle()['corner-radius'] : 0;
        this.binSpacing = this.markStyle()['bin-spacing'] ? this.markStyle()['bin-spacing'] : 0.5;
        this.stroke = this.markStyle()['stroke'] ? this.markStyle()['stroke'] : COLOR.DEFAULT;
        this.strokeWidth = this.markStyle()['stroke-width'] ? this.markStyle()['stroke-width'] : 0;
        this.strokeOpacity = this.markStyle()['stroke-opacity'] ? this.markStyle()['stroke-opacity'] : 1;
        this.fill = this.markStyle()['fill'] ? this.markStyle()['fill'] : (this.style()["mask-image"]? "url(#chart-mask-image)" : COLOR.DEFAULT);
        this.fillOpacity = this.markStyle()['fill-opacity'] ? this.markStyle()['fill-opacity'] : 1;

        this.drawBackground();

        let svg = this.svg();

        if(this.style()["mask-image"]) {
            let margin = this.margin()
            let chartmaskgroundsize = {
                width: 600,
                height: 600
            }
            let defs = svg.append('svg:defs');
            defs.append("svg:pattern")
                .attr("id", "chart-mask-image")
                .attr("width", chartmaskgroundsize.width)
                .attr("height", margin.top === 130? 480: chartmaskgroundsize.height)
                .attr("patternUnits", "userSpaceOnUse")
                .append("svg:image")
                .attr("xlink:href", this.style()["mask-image"])
                .attr("width", chartmaskgroundsize.width)
                .attr("height", margin.top === 130? 480: chartmaskgroundsize.height)
                .attr("x", 0)
                .attr("y", 0);
        }

        this.axis = svg.append("g")
           .attr("class", "axis")
        this.content = svg.append("g")
           .attr("class", "content")
           .attr("chartWidth", this.width())
           .attr("chartHeight", this.height())

        return this.svg();       
    }

    /**
     * @description Draw Background for bar chart.
     *
     * @return {void}
     */
    drawBackground() {
        let margin = this.margin()

           
        let chartbackgroundsize = {
            width: 600,
            height: 600
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
            .attr("height", margin.top === 130? 490: chartbackgroundsize.height)
            .attr("transform", "translate(" + 20 + "," + margin.top + ")");
            

        this._svg = d3.select(container)
                    .select("svg")
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        
        if(background.Background_Image){
                d3.select(container).select("svg").style("background", "url(" + background.Background_Image + ") center ").style("background-size", "cover")
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
    }

    /**
     * @description Draw Axis for bar chart.
     *
     * @return {void}
     */
     drawAxis() {
        if(this.x && this.y) {
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
                .attr("fill", COLOR.TEXT)
                .text(x || "Count");
            axis.append("path")
                .attr("class", "triangle")
                .attr("transform", `translate(${width - triangleSize / 25 * 2}, ${height})rotate(90)`)
                .attr("d", d3.symbol().type(d3.symbolTriangle).size(triangleSize))
                .attr("fill", COLOR.AXIS);
            axis.append("line")
                .attr("x1", -strokeWidth / 2)
                .attr("x2", width)
                .attr("y1", height)
                .attr("y2", height)
                .attr("stroke-width", strokeWidth)
                .attr("stroke", COLOR.AXIS);
            axis.append("text")
                .attr("transform", `translate(${-padding}, ${height / 2}) rotate(-90)`)
                .attr("font-size", fontsize)
                .attr("text-anchor", "middle")
                .attr("fill", COLOR.TEXT)
                .text(y || "Count");
            axis.append("path")
                .attr("class", "triangle")
                .attr("transform", `translate(0, ${triangleSize / 25 * 2})`)
                .attr("d", d3.symbol().type(d3.symbolTriangle).size(triangleSize))
                .attr("fill", COLOR.AXIS);
            axis.append("line")
                .attr("y1", 0)
                .attr("y2", height)
                .attr("stroke-width", strokeWidth)
                .attr("stroke", COLOR.AXIS);
        }
        
    }

    /**
     * @description Draw bars with xy encoding.
     *
     * @return {void}
     */
    encodeXY() {
        if(this.x && this.y) {
            let svg = this.svg();
            let width = this.width(),
                height = this.height();
            const processedData = this.processedData();
            const xEncoding = this.x,
                yEncoding = this.y;
        
            /** set the ranges */
            let xScale = d3.scaleBand()
                .range([0, width - 12])
                .domain(processedData.map(d => d[xEncoding]))
                .padding(this.binSpacing);
        
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
            
            // draw y axis path
            axis.selectAll(".axis_y")
                .append("line")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", 0)
                .attr("y2", height);

            axis.selectAll(".axis_y .tick text")
                .attr("transform",  "translate(3, 0)");
            
            // axix-label
            const labelPadding = 20, fontsize = 12;

            axis.append("text")
                .attr("x", width / 2)
                .attr("y", height + svg.selectAll(".axis_x").select("path").node().getBBox().height + 10)
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
            
            /** draw grid */
            axis.selectAll(".axis_y .tick line")
                .attr("class", "gridline")
                .attr("stroke", d => {
                    if(d ===0) return 0;
                    else return COLOR.DIVIDER;
                });
            
            /* draw rects */
            content.append("g")
                .attr("class", "rects")
                .selectAll("rect")
                .data(processedData)
                .enter().append("rect")
                .attr("class", "mark")
                .attr("x", d => xScale(d[xEncoding]))
                .attr("y", d => yScale(d[yEncoding]))
                .attr("width", xScale.bandwidth())
                .attr("height", d => height - yScale(d[yEncoding]))
                .attr("fill", COLOR.DEFAULT);
        }
    }

     /**
     * @description Using X-axis to encode a data field.
     *
     * @return {void}
     */
      encodeX() {
          if (this.x) {
            let svg = this.svg();
            let width = this.width(),
                height = this.height();
            const processedData = this.processedData();
            const xEncoding = this.x;

            /** set the ranges */
            this.xScale = d3.scaleBand()
                .range([0, width - 12])
                .domain(processedData.map(d => d[xEncoding]))
                .padding(this.binSpacing);

            let axisX = d3.axisBottom(this.xScale);

            let axis_X = this.axis.append("g")
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
            
            // axix-label
            const fontsize = 12;

            axis_X.append("text")
                 .attr("x", width / 2)
                 .attr("y", height + svg.selectAll(".axis_x").select("path").node().getBBox().height + 10)
                 .attr("text-anchor", "middle")
                 .attr("dominant-baseline", "hanging")
                 .attr("font-size", fontsize)
                 .attr("fill", COLOR.AXIS)
                 .text(xEncoding);
          } 
      }

     /**
     * @description Using Y-axis to encode a data field.
     *
     * @return {void}
     */
    encodeY() {
        if (this.y) {
            let height = this.height();
            const processedData = this.processedData();
            const yEncoding = this.y;

            let obj = {};
            this.bardata = [];

            //
            if(this.x){
                processedData.forEach(item => {
                    if(obj.hasOwnProperty(item[this.x])) {
                        obj[item[this.x]] =  obj[item[this.x]] + item[this.y]
                    }
                    else{
                        obj[item[this.x]] = item[this.y]
                    }
                })
                for(let key in obj){
                    let temp = {};
                    temp[this.x] = key
                    temp[this.y] = obj[key]
                    this.bardata.push(temp)
                }
            }
            else{
                console.log("encode x lacks")
            }

            /** set the ranges */
            // this.yScale = d3.scaleLinear()
            //     .range([height, 0])
            //     .domain([0, d3.max(processedData, d => d[yEncoding])])
            //     .nice();
            
            this.yScale = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(this.bardata, d => d[yEncoding])])
                .nice();

            let axisY = d3.axisLeft(this.yScale)
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

            let axis_Y = this.axis.append("g")
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
            
            // draw y axis path
            axis_Y.selectAll(".axis_y")
                .append("line")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", 0)
                .attr("y2", height);

            axis_Y.selectAll(".axis_y .tick text")
                .attr("transform",  "translate(3, 0)");
            
            // axix-label
            const labelPadding = 20, fontsize = 12;

            axis_Y.append("text")
                .attr("transform", `translate(${-labelPadding}, ${height / 2}) rotate(-90)`)
                .attr("text-anchor", "middle")
                .attr("font-size", fontsize)
                .attr("fill", COLOR.AXIS)
                .text(yEncoding);
            
            /** draw grid */
            axis_Y.selectAll(".axis_y .tick line")
                .attr("class", "gridline")
                .attr("stroke", d => {
                    if(d ===0) return 0;
                    else return COLOR.DIVIDER;
                });
        }
    }

    /**
     * @description Coloring bars with color encoding.
     *
     * @return {void}
     */
    encodeColor(animation = {}) {
        // if colorEncoding, clear and redraw 
        if(this.color) {
            let width = this.width(),
                height = this.height();
            const data = this.data();
            const xEncoding = this.x,
                yEncoding = this.y;
            const colorEncoding = this.color;
            let content = d3.select(".content");


            /** clear rects */
            d3.selectAll(".rects").remove();

            /** process data */
            let stackData = [];
            // get categories
            let categoriesData = {};
            data.forEach((d, i) => {
                if(categoriesData[d[xEncoding]]) {
                    categoriesData[d[xEncoding]].push(d);
                } else {
                    categoriesData[d[xEncoding]] = [d];
                }
            });
            // get series
            let seriesData = {};
            data.forEach(d => {
                if(seriesData[d[colorEncoding]]) {
                    seriesData[d[colorEncoding]].push(d);
                } else {
                    seriesData[d[colorEncoding]] = [d];
                }
            });
            let series = Object.keys(seriesData);

            // get stack data
            let processedData = [];
            for(let category in categoriesData) {
                let row = {};
                row[xEncoding] = category;
                // series.map(s => row[s] = 0); 
                // categoriesData[category].map(d => row[d[colorEncoding]] = d[yEncoding]);
                series.map(s => row[s] = [0]); 
                categoriesData[category].map(d => row[d[colorEncoding]].push(d[yEncoding]));
                series.map(s => row[s] = d3.sum(row[s]));

                processedData.push(row);
            }
            stackData = d3.stack().keys(series)(processedData);

            /** set the ranges */
            let xScale = d3.scaleBand()
            .range([0, width - 12])
            .domain(data.map(d => d[xEncoding]))
            .padding(this.binSpacing);

            let yScale = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(stackData[stackData.length - 1], d => d[1])])
                .nice();

            /** draw rect layers */
            let rectLayers = content.append("g")
                .selectAll("g")
                .data(stackData)
                .join("g")
                .attr("class", "rectLayer")
                // .attr("fill", (d, i) => COLOR.CATEGORICAL[i]);
                .attr("fill", COLOR.DEFAULT);
            rectLayers.selectAll("rect")
                .data(d => d)
                .enter().append("rect")
                .attr("class", "mark")
                .attr("x", d => xScale(d.data[xEncoding]))
                .attr("y", d => yScale(d[1]))
                .attr("width", xScale.bandwidth())
                .attr("height", d => Math.abs(yScale(d[1]) - yScale(d[0])))
                .attr("rx", this.cornerRadius)
                .attr("ry", this.cornerRadius)
                .attr("fill-opacity", this.fillOpacity)
                .attr("stroke", this.stroke)
                .attr("stroke-width", this.strokeWidth)
                .attr("stroke-opacity", this.strokeOpacity)

            d3.selectAll(".rectLayer")
                .transition()
                .duration('duration' in animation ? animation['duration'] : 0)
                .attr("fill", (d, i) => COLOR.CATEGORICAL[i]);
        }
    }

    /**
     * @description Add encoding and redraw bars.
     *
     * @return {void}
     */
    addEncoding(channel, field, animation = {}) {
        if(!this[channel]) {
            this[channel] = field;

            let changeX = false;
            let changeY = false;

            switch(channel) {
                case "x":
                    changeX = true;
                    this.encodeX();
                    break;
                case "y":
                    changeY = true;
                    this.encodeY()
                    break;
                case "color":
                    this.encodeColor(animation);
                    break;
                default:
                    console.log("no channel select") ;   
            }

            if((this.x && this.y) && (changeX || changeY)) {
                this.content.append("g")
                    .attr("class", "rects")
                    .selectAll("rect")
                    .data(this.bardata)
                    .enter().append("rect")
                    .attr("class", "mark")
                    .attr("x", d => this.xScale(d[this.x]))
                    .attr("y", this.height())
                    .attr("width", this.xScale.bandwidth())
                    .attr("height", 0)
                    .attr("fill", (d,i) => {
                        if(this.markStyle()['fill']) {
                            return this.fill
                        } else if(this.markStyle()['background-image']) {
                            let margin = this.margin()
                            let chartBackgroundSize = {
                                width: 600,
                                height: 600
                            }
                            let defs = this.svg().append('svg:defs');
                            defs.append("svg:pattern")
                                .attr("id", "chart-background-image-" + i)
                                .attr("width", chartBackgroundSize.width)
                                .attr("height", margin.top === 130? 480: chartBackgroundSize.height)
                                .attr("patternUnits", "userSpaceOnUse")
                                .append("svg:image")
                                .attr("xlink:href", this.markStyle()["background-image"])
                                .attr("width", chartBackgroundSize.width)
                                .attr("height", margin.top === 130? 480: chartBackgroundSize.height)
                                .attr("x", this.xScale(d[this.x]))
                                .attr("y", 0);
                            return "url(#chart-background-image-" + i + ")"
                        } else {
                            return this.fill
                        }
                    })
                    .attr("rx", this.cornerRadius)
                    .attr("ry", this.cornerRadius)
                    .attr("fill-opacity", this.fillOpacity)
                    .attr("stroke", this.stroke)
                    .attr("stroke-width", this.strokeWidth)
                    .attr("stroke-opacity", this.strokeOpacity);
                if( 'duration' in animation ){
                    this.animationGrow(animation);
                }
                else{
                    this.content.selectAll(".mark")
                        .attr("y", d => this.yScale(d[this.y]))
                        .attr("height", d => this.height() - this.yScale(d[this.y]))
                }
                
            }
        }
    }

    /**
     * @description Modify encoding and redraw bars.
     *
     * @return {void}
     */
    modifyEncoding(channel, field, animation = {}) {
        if (this[channel]) {
            this[channel] = field;

            switch (channel) {
                case 'x':
                    new Promise((resolve, reject) => {
                        this.content.selectAll(".mark")
                                .transition()
                                .duration('duration' in animation ? animation['duration']/2 : 0)
                                .style('opacity', 0)
                                .on("end", resolve)
                    })
                    .then(()=>{
                        this.svg().selectAll(".rects").remove();
                        this.svg().selectAll(".axis_x").remove();
                        this.svg().selectAll(".axis_y").remove();
                    })
                    .then(()=>{
                        this.encodeX();
                        this.encodeY();
                        this.content.append("g")
                            .attr("class", "rects")
                            .selectAll("rect")
                            .data(this.bardata)
                            .enter().append("rect")
                            .attr("class", "mark")
                            .attr("x", d => this.xScale(d[this.x]))
                            .attr("y", this.height())
                            .attr("width", this.xScale.bandwidth())
                            .attr("height", 0)
                            .attr("fill", (d,i) => {
                                if(this.markStyle()['fill']) {
                                    return this.fill
                                } else if(this.markStyle()['background-image']) {
                                    let margin = this.margin()
                                    let chartBackgroundSize = {
                                        width: 600,
                                        height: 600
                                    }
                                    let defs = this.svg().append('svg:defs');
                                    defs.append("svg:pattern")
                                        .attr("id", "chart-background-image-" + i)
                                        .attr("width", chartBackgroundSize.width)
                                        .attr("height", margin.top === 130? 480: chartBackgroundSize.height)
                                        .attr("patternUnits", "userSpaceOnUse")
                                        .append("svg:image")
                                        .attr("xlink:href", this.markStyle()["background-image"])
                                        .attr("width", chartBackgroundSize.width)
                                        .attr("height", margin.top === 130? 480: chartBackgroundSize.height)
                                        .attr("x", this.xScale(d[this.x]))
                                        .attr("y", 0);
                                    return "url(#chart-background-image-" + i + ")"
                                } else {
                                    return this.fill
                                }
                            })
                            .attr("rx", this.cornerRadius)
                            .attr("ry", this.cornerRadius)
                            .attr("fill-opacity", this.fillOpacity)
                            .attr("stroke", this.stroke)
                            .attr("stroke-width", this.strokeWidth)
                            .attr("stroke-opacity", this.strokeOpacity);
                        if('duration' in animation){
                            animation['duration'] = animation['duration']/2
                            this.animationGrow(animation)
                        }
                        else{
                            this.content.selectAll(".mark")
                                    .attr("y", d => this.yScale(d[this.y]))
                                    .attr("height", d => this.height() - this.yScale(d[this.y]))
                        }
                    })
                    break;
                case 'y':
                    new Promise((resolve, reject) => {
                        this.content.selectAll(".mark")
                                .transition()
                                .duration('duration' in animation ? animation['duration']/2 : 0)
                                .style('opacity', 0)
                                .on("end", resolve)
                    })
                    .then(()=>{
                        this.svg().selectAll(".rects").remove();
                        this.svg().selectAll(".axis_y").remove();
                    })
                    .then(()=>{
                        this.encodeY();
                        this.content.append("g")
                            .attr("class", "rects")
                            .selectAll("rect")
                            .data(this.bardata)
                            .enter().append("rect")
                            .attr("class", "mark")
                            .attr("x", d => this.xScale(d[this.x]))
                            .attr("y", this.height())
                            .attr("width", this.xScale.bandwidth())
                            .attr("height", 0)
                            .attr("fill", (d,i) => {
                                if(this.markStyle()['fill']) {
                                    return this.fill
                                } else if(this.markStyle()['background-image']) {
                                    let margin = this.margin()
                                    let chartBackgroundSize = {
                                        width: 600,
                                        height: 600
                                    }
                                    let defs = this.svg().append('svg:defs');
                                    defs.append("svg:pattern")
                                        .attr("id", "chart-background-image-" + i)
                                        .attr("width", chartBackgroundSize.width)
                                        .attr("height", margin.top === 130? 480: chartBackgroundSize.height)
                                        .attr("patternUnits", "userSpaceOnUse")
                                        .append("svg:image")
                                        .attr("xlink:href", this.markStyle()["background-image"])
                                        .attr("width", chartBackgroundSize.width)
                                        .attr("height", margin.top === 130? 480: chartBackgroundSize.height)
                                        .attr("x", this.xScale(d[this.x]))
                                        .attr("y", 0);
                                    return "url(#chart-background-image-" + i + ")"
                                } else {
                                    return this.fill
                                }
                            })
                            .attr("rx", this.cornerRadius)
                            .attr("ry", this.cornerRadius)
                            .attr("fill-opacity", this.fillOpacity)
                            .attr("stroke", this.stroke)
                            .attr("stroke-width", this.strokeWidth)
                            .attr("stroke-opacity", this.strokeOpacity);;
                        if('duration' in animation){
                            animation['duration'] = animation['duration']/2
                            this.animationGrow(animation)
                        }
                        else{
                            this.content.selectAll(".mark")
                                    .attr("y", d => this.yScale(d[this.y]))
                                    .attr("height", d => this.height() - this.yScale(d[this.y]))
                        }
                    })
                    break;
                case 'color':
                    this.encodeColor(animation)
                    break;
                default:
                    console.log("no channel select")
            }
        }
    }

    /**
     * @description Remove encoding and redraw bars.
     *
     * @return {void}
     */
    removeEncoding(channel, animation = {}) {
        this[channel] = null;

        if(channel === 'x'){
            new Promise((resolve, reject) => {
                this.content.selectAll(".mark")
                        .transition()
                        .duration('duration' in animation ? animation['duration'] : 0)
                        .style('opacity', 0)
                        .on("end", resolve)
            })
            .then(()=>{
                this.svg().selectAll(".rects").remove();
                this.svg().selectAll(".axis_x").remove();
            })
        }
        if(channel === 'y'){
            new Promise((resolve, reject) => {
                this.content.selectAll(".mark")
                        .transition()
                        .duration('duration' in animation ? animation['duration']-100 : 0)
                        .style('opacity', 0)
                        .on("end", resolve)
            })
            .then(()=>{
                this.svg().selectAll(".axis_y").remove().on("end", this.removemark = true);      
            })
        }
        if(channel === 'color'){
            new Promise((resolve, reject) => {
                this.content.selectAll(".rectLayer")
                .transition()
                .duration('duration' in animation ? animation['duration'] : 0)
                .attr("fill", COLOR.DEFAULT)
                .on("end", resolve)
            })
            .then(()=>{
                this.svg().selectAll(".rectLayer").remove();
                let processedData = this.processedData();
                this.content.append("g")
                    .attr("class", "rects")
                    .selectAll("rect")
                    .data(processedData)
                    .enter().append("rect")
                    .attr("class", "mark")
                    .attr("x", d => this.xScale(d[this.x]))
                    .attr("y", d => this.yScale(d[this.y]))
                    .attr("width", this.xScale.bandwidth())
                    .attr("height", d => this.height() - this.yScale(d[this.y]))
                    .attr("fill", this.fill)
                    .attr("rx", this.cornerRadius)
                    .attr("ry", this.cornerRadius)
                    .attr("fill-opacity", this.fillOpacity)
                    .attr("stroke", this.stroke)
                    .attr("stroke-width", this.strokeWidth)
                    .attr("stroke-opacity", this.strokeOpacity);             
            })
        }
    }

    /**
     * @description Adding grow(one by one) animation to the chart
     * 
     * @param {{delay: number, duration: number}} animation Animation parameters of the action.
     * 
     * @return {void}
    */
   animationGrow(animation){
        let processedData = this.processedData();
        //let barduration = animation['duration']/processedData.length
        let unitnum = d3.sum(processedData, item => item[this.y]);
        let unitduration  = animation['duration']/unitnum;
        let duration = 0;
        let transDelay = d3.scaleBand()
                .range([0, animation['duration']])
                .domain(processedData.map(d => d[this.x]))

        this.content.selectAll(".mark")
                .transition()
                //.duration(barduration)
                .duration(d => {duration = d[this.y] * unitduration; return duration})
                .ease(d3.easeLinear)
                .attr("y", d => this.yScale(d[this.y]))
                .attr("height", d => this.height() - this.yScale(d[this.y]))
                //.delay((d, i) => {return (i*barduration)})
                .delay(d => {return transDelay(d[this.x])})
                //.delay((d, i) => {if(i===0){delay = 0}else{delay = delay + durationlist[i-1];};return delay})
   }

}
export default BarChart;

