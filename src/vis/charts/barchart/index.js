import * as d3 from 'd3';
import Chart from '../chart';
import Color from '../../visualization/color';

class BarChart extends Chart {

    visualize() {
        let margin = {
                "top": 10,
                "right": 10,
                "bottom": 24,
                "left": 24
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
            yEncoding = (measure[0].aggregate === "count" ? "COUNT" : measure[0].field);
        
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
            .domain(factData.map(d => d[xEncoding]))
            .padding(0.5);
    
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
            .tickSize(-(height), 0, 0)
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
            .attr("opacity", (d, i) => {
                if(i === 0) return 1;
                else return 0.2;
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
            .attr("fill", Color().DEFAULT);

         /** draw text label */
         content.append("g")
            .attr("class", "texts")
            .selectAll("text")
            .data(processedData)
            .enter().append("text")
            .attr("x", d => xScale(d[xEncoding]) - 6)
            .attr("y", d => yScale(d[yEncoding]) - 10)
            .text(d => {
                let formatData = d[yEncoding];
                if ((formatData / 1000000) >= 1) {
                    formatData = formatData / 1000000 + "M";
                } else if ((formatData / 1000) >= 1) {
                    formatData = formatData / 1000 + "K";
                }
                return formatData;
            })
            .style("font-size", "12px");
            // to do: text position
            // .attr("justify-content", "center");
    }

    encodeColor() {
        // if colorEncoding, clear and redraw 
        const breakdown = this.breakdown();
        const colorEncoding = breakdown.length < 2  ? null : breakdown[1].field;
        if(colorEncoding) {
            let width = this.width(),
                height = this.height();
            const factData = this.factdata();
            const measure = this.measure();
            const xEncoding = breakdown[0].field,
                yEncoding = (measure[0].aggregate === "count" ? "COUNT" : measure[0].field);
                // colorEncoding = breakdown.length < 2  ? null : breakdown[1].field;
            let content = d3.select(".content");

            /** clear rects */
            d3.selectAll(".rects").remove();

            /** process data */
            let stackData = [];
            // get categories
            let categoriesData = {};
            factData.forEach((d, i) => {
                if(categoriesData[d[xEncoding]]) {
                    categoriesData[d[xEncoding]].push(d);
                } else {
                    categoriesData[d[xEncoding]] = [d];
                }
            });
            // get series
            let seriesData = {};
            factData.forEach(d => {
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
                series.map(s => row[s] = 0); 
                categoriesData[category].map(d => row[d[colorEncoding]] = d[yEncoding]);
                processedData.push(row);
            }
            stackData = d3.stack().keys(series)(processedData);

            /** set the ranges */
            let xScale = d3.scaleBand()
            .range([0, width])
            .domain(factData.map(d => d[xEncoding]))
            .padding(0.5);

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
                .attr("fill", (d, i) => Color().CATEGORICAL[i]);
            rectLayers.selectAll("rect")
                .data(d => d)
                .enter().append("rect")
                .attr("class", "mark")
                .attr("x", d => xScale(d.data[xEncoding]))
                .attr("y", d => yScale(d[1]))
                .attr("width", xScale.bandwidth())
                .attr("height", d => Math.abs(yScale(d[1]) - yScale(d[0])));
        }
    }

}
export default BarChart;

