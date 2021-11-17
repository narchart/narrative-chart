import * as d3 from 'd3';
import Chart from '../chart';
import Color from '../../visualization/color';

class LineChart extends Chart {

    visualize() {
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
        
        this.drawAxis();
        this.encodeXY();
        this.encodeColor();

        return this.svg();       
    }

    drawAxis() {
        let svg = this.svg();
        let width = this.width(),
            height = this.height();
        const measure = this.measure();
        const breakdown = this.breakdown();
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
            .text(breakdown[0].field || "Count");
        axis.append("path")
            .attr("class", "triangle")
            .attr("transform", `translate(${width - triangleSize / 25 * 2}, ${height})rotate(90)`)
            .attr("d", d3.symbol().type(d3.symbolTriangle).size(triangleSize))
            .attr("fill", Color.AXIS);
        axis.append("line")
            .attr("x1", -strokeWidth / 2)
            .attr("x2", width)
            .attr("y1", height)
            .attr("y2", height)
            .attr("stroke-width", strokeWidth)
            .attr("stroke", Color.AXIS);
        axis.append("text")
            .attr("transform", `translate(${-padding}, ${height / 2}) rotate(-90)`)
            .attr("font-size", fontsize)
            .attr("text-anchor", "middle")
            .text(measure[0].field || "Count");
        axis.append("path")
            .attr("class", "triangle")
            .attr("transform", `translate(0, ${triangleSize / 25 * 2})`)
            .attr("d", d3.symbol().type(d3.symbolTriangle).size(triangleSize))
            .attr("fill", Color.AXIS);
        axis.append("line")
            .attr("y1", 0)
            .attr("y2", height)
            .attr("stroke-width", strokeWidth)
            .attr("stroke", Color.AXIS);
    }

    encodeXY() {
        let svg = this.svg();
        let width = this.width(),
            height = this.height();
        const factData = this.factdata();
        const measure = this.measure();
        const breakdown = this.breakdown();
        const xEncoding = breakdown[0].field,
            yEncoding = (measure[0].aggregate === "count" ? "COUNT" : measure[0].field)

        /** process data */
        // get categories
        let categoriesData = {};
        factData.forEach((d, i) => {
            if(categoriesData[d[xEncoding]]) {
                categoriesData[d[xEncoding]].push(d);
            } else {
                categoriesData[d[xEncoding]] = [d];
            }
        });
        // sum value group by category
        let processedData = [];
        for(let category in categoriesData) {
            processedData.push({
                [xEncoding]: category,
                [yEncoding]: d3.sum(categoriesData[category], d => d[yEncoding])
            })
        }


    
        /** set the ranges */
        let xScale = d3.scaleBand()
            .range([0, width])
            .domain(factData.map(d => d[xEncoding]));
    
        let yScale = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(factData, d => d[yEncoding])])
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
            .tickSize(-height, 0, 0)
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

        axis.selectAll(".axis_y")
            .selectAll(".domain")
            .attr("opacity", 0);

         /** draw grid */
        axis.selectAll(".axis_y")
            .selectAll("line")
            .attr("stroke", d => {
                if (d === 0) return Color().AXIS;
                else return Color().DIVIDER;
            })
            .attr("class", "gridline")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", width)
            .attr("y2", 0)
            .attr("opacity", 1);

        axis.selectAll(".axis_x")
            .append("line")
            .attr("stroke", Color().AXIS)
            .attr("class", "gridline")
            .attr("x1", 0)
            .attr("y1", -height)
            .attr("x2", 0)
            .attr("y2", 0);

        /* draw labels */
        const labelPadding = 20, fontsize = 12;
        console.log("measure:", measure)
        console.log("breakdown:",breakdown)

        axis.append("text")
            .attr("x", width / 2)
            .attr("y", height + svg.selectAll(".axis_x").select("path").node().getBBox().height + labelPadding)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "hanging")
            .attr("font-size", fontsize)
            .text(`${breakdown[0].field} (${breakdown[0].pictype})` || "Catogory");

        axis.append("text")
            .attr("transform", `translate(${-labelPadding}, ${height / 2}) rotate(-90)`) 
            .attr("text-anchor", "middle")
            .attr("font-size", fontsize)
            .text(`${measure[0].field} (${measure[0].aggregate})` || "Count");

        /* draw lines */
        const line = d3.line()
        .x(d => xScale(d[xEncoding]))
        .y(d => yScale(d[yEncoding]))

        content.append("g")
            .attr("class", "lineGroup")
            .attr("fill", "none")
            .attr("stroke", Color().DEFAULT)
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
            .attr("fill", Color().DEFAULT)
            .selectAll("circle")
            .data(processedData)
            .enter().append("circle")
            .attr("class", "mark")
            .attr("r", circleSize)
            .attr("cx", d => xScale(d[xEncoding]))
            .attr("cy", d => yScale(d[yEncoding]));
    }

    encodeColor() {
        let width = this.width(),
            height = this.height();
        const factData = this.factdata();
        const measure = this.measure();
        const breakdown = this.breakdown();
        const xEncoding = breakdown[0].field,
            yEncoding = (measure[0].aggregate === "count" ? "COUNT" : measure[0].field),
            colorEncoding = breakdown.length < 2  ? null : breakdown[1].field;
        
        if(colorEncoding) {
            let processedData = [];
            /** get series */
            let seriesData = {};
            factData.forEach(d => {
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
                .domain(factData.map(d => d[xEncoding]));

            let yScale = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(factData, d => d[yEncoding])])
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
                    .attr("stroke", Color().DEFAULT)
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
                    .attr("fill", Color().DEFAULT)
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
                    return Color().CATEGORICAL[i]
                })

            d3.selectAll(".lineGroup")
                .attr("stroke", (d,i) => {
                    return Color().CATEGORICAL[i]
                })

        } 
    }

}
export default LineChart;