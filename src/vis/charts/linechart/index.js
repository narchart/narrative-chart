import * as d3 from 'd3';
import Chart from '../chart';
import Color from '../../visualization/color';
import Background from '../../visualization/background';

const COLOR = new Color();
const background = new Background();
const offset = 30;

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
            .attr("id", "svgBackGrnd")
            .append("rect")
            .attr("width", this.Wscaleratio * 640)
            .attr("height", this.Hscaleratio * 640)


        d3.select(container)
            .select("svg")
            .append("g")
            .attr("id","chartBackGrnd")
            .append("rect")
            .attr("width", chartbackgroundsize.width)
            .attr("height", margin.top === 130*this.Hscaleratio? 500*this.Hscaleratio: chartbackgroundsize.height)
            .attr("transform", "translate(" + (20*this.Wscaleratio) + "," + margin.top + ")");
            

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
                .attr("preserveAspectRatio", "xMidYMid slice")
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
                                
        if(this.style()['background-color']){
            d3.select("#chartBackGrnd").attr("fill", this.style()['background-color'].color ?? "white").attr("fill-opacity", this.style()['background-color'].opacity ?? 1)
        } 
        else if (this.style()['background-image']){
            let defs = d3.select(container).select("svg").append('svg:defs');
            defs.append("svg:pattern")
                .attr("id", "chart-backgroundimage")
                .attr("width", chartbackgroundsize.width)
                .attr("height", margin.top === 130*this.Hscaleratio? 500*this.Hscaleratio: chartbackgroundsize.height)
                .attr("patternUnits", "userSpaceOnUse")
                .append("svg:image")
                .attr("xlink:href", this.style()["background-image"].url)
                .attr("preserveAspectRatio", "xMidYMid slice")
                .attr("opacity", this.style()["background-image"].opacity ?? 1)
                .attr("filter", this.style()["background-image"].grayscale ? "grayscale(" + this.style()["background-image"].grayscale + "%)" : "grayscale(0%)")
                .attr("width", chartbackgroundsize.width)
                .attr("height", margin.top === 130*this.Hscaleratio? 500*this.Hscaleratio: chartbackgroundsize.height)
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
            height = this.height() - offset;
        
        /* axis */
        this.axis().data(this.processedData());
        this.axis().width(width);
        this.axis().height(height);
        
        /* content */
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
    encodeX(axisStyle = {}) {
        if(this.x){
            const xEncoding = this.x;
            
            /** range */
            let width = this.width() - 12;
            this.xScale = d3.scaleBand()
                .range([0, width])
                .domain(this.processedData().map(d => d[xEncoding]));

            /* axis */
            this.axis().xScale(this.xScale);
            this.axis().addTemporalX(xEncoding, axisStyle); 
        }
    }

    /**
     * @description Using Y-axis to encode a data field.
     *
     * @return {void}
     */
    encodeY(axisStyle = {}) {
        if (this.y) {
            const yEncoding = this.y;

            /* range */
            const height = this.height() - offset;
            this.yScale = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(this.processedData(), d => d[yEncoding])])
            .nice();

            /* axis */
            this.axis().yScale(this.yScale);
            this.axis().addY("Numerical", yEncoding, axisStyle);
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
            height = this.height() - offset;
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
    
        // svg.append("g")
        //     .attr("class", "axis");
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
    addEncoding(channel, field, animation = {}, axisStyle = {}) {
        if(!this[channel]) {
            this[channel] = field;

            switch(channel) {
                case "x":
                    this.encodeX(axisStyle);
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
                    console.log("no channel select") ;   
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
                this.axis().removeX();
            }
            if(channel === 'y'){
                this.axis().removeY();
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
                this.axis().removeX();
            }
            if(channel === 'y'){
                this.axis().removeY();
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
export default LineChart;