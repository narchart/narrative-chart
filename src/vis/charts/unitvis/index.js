import * as d3 from 'd3';
import Chart from '../chart';
import Color from '../../visualization/color';
import Unit from './unit';
import { text } from 'd3';
class Unitvis extends Chart {

    visualize() {
        let margin = {
            "top": 10,
            "right": 10,
            "bottom": 10,
            "left": 10
        }
        this.delay = 1500
        this.duration = 2500    
        this.colorduration = 900
        this.sizeduration = 1250
        this.width(this.width() - margin.left - margin.right);
        this.height(this.height() - margin.top - margin.bottom);
        this.units = []
        this._svg = d3.select(this.container())
            .append("svg")
            .attr("width", this.width() + margin.left + margin.right)
            .attr("height", this.height() + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        this.data()
        this.initvis()

        return this.svg();
    }

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
        let radius = Math.min(((vwidth - margin.left - margin.right) / (maxColumn * (setLength + 1) - 1)), 6);

        let row = Math.floor(Math.sqrt(processedData.length));
        let column = Math.ceil(processedData.length / row); // row 3 col 4

        let initX = vwidth / 2.2 - column * radius;
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
            .attr("stroke", "#FFF")
            .attr("stroke-width", 0)
            .attr("fill", d => d.color())
            .attr("opacity", 1)
            .attr("cx", d => d.x())
            .attr("cy", d => d.y());

    }

    encodeX() {
        let svg = this.svg();
        let width = this.width(),
            height = this.height();


        let margin = {
            left: width / 20,
            right: width / 20
        }
        let textSize = 14;

        let breakdownField = this.x.field;

        let databreakdown = d3.nest().key(function (d) { return d[breakdownField] }).rollup(function (v) { return v.length; }).entries(this.processedData())


        let bar = databreakdown.length;

        databreakdown.sort(function (x, y) {
            return d3.ascending(x['key'], y['key']);
        })


        let breakdownValue = databreakdown.map(d => d['key']);
        let count = databreakdown.map(d => d['value']);

        let maxCount = d3.max(count);

        let length = Math.ceil(30 / bar) < 5 ? Math.ceil(30 / bar) : 5

        let wradius = ((width - margin.left - margin.right) / ((length + 2) * (bar - 1) + length)) / 2;
        let hradius = height * 0.8 / Math.ceil(maxCount / length) / 2;

        let radius = Math.min(wradius, hradius);
        let s=(0.9*width-2*(bar)*length*radius)/(radius)/(bar+3)/2<1?0.2:Math.floor((0.9*width-2*(bar)*length*radius)/(radius)/(bar+3)/2)         

        let padding = (0.9* width -bar*length*2*radius-(bar-1)*s*2*radius ) / 2
        let baseX = d3.range(padding + radius, width-padding-(2*length-1)*radius+1, (width-2*padding-(2*length)*radius)/(bar-1));
        let baseY = (height - Math.ceil(maxCount / length) * 2 * radius) / 2 + Math.ceil(maxCount / length) * 2 * radius - radius;
        let visibleUnits = this.units.filter(d => d.visible() === "1");


        let units = [];
        for (let i = 0; i < bar; i++) {
            let barUnits = visibleUnits.filter(d => d[breakdownField] === breakdownValue[i]);
            units.push(barUnits);
        }

        // setTimeout(()=>{svg.select(".content").selectAll("text").remove()},5000);
        svg.select(".content").selectAll("text")
            .transition()
            .delay(this.delay)
            .duration(this.duration/2)
            .attr("fill-opacity", 0)


        units.forEach((bar, iBar) => {
            svg.select(".content")
                .append("text")
                .text(breakdownValue[iBar])
                .attr("x", baseX[iBar] + (length - 1) * radius)
                // .attr("x", baseX[iBar] + radius*6)
                .attr("y", baseY + radius + textSize)
                .attr("font-size", textSize)
                .attr("text-anchor", "middle")
                .attr("transform", "translate(" + baseX[iBar] - radius + length * radius + "," + baseY + radius + textSize + ") rotate(-45)")
                // .attr("transform", `rotate(-45, ${baseX[iBar] - radius + length * radius}, ${baseY + radius + textSize})`)
                .attr("fill-opacity", 0)
                .transition()
                .delay(this.delay + this.duration/2)
                .duration(this.duration/2)
                .attr("fill-opacity", 1)
                

            bar.forEach((d, i) => {
                let row = Math.floor(i / length);
                let col = i % length;
                d.x(baseX[iBar] + 2 * radius * col);
                d.y(baseY - 2 * radius * row);
                d.radius(radius);
                d.opacity(1);
                d.unitgroup('x', breakdownField);
            })

            svg.select(".content").append("text")
                .text(breakdownField)
                .attr("x", width / 2)
                .attr("y", Math.min(baseY + 50, height))
                .attr("font-size", textSize)
                .attr('text-anchor', 'middle')
                .attr("fill-opacity", 0)
                .transition()
                .delay(this.delay)
                .duration(this.delay + this.duration/2)
                .attr("fill-opacity", 1)
    });
    }


    encodeY() {
        let svg = this.svg();
        let width = this.width(),
            height = this.height();

        if (this.x && !this.size) {


            let margin = {
                left: width / 20,
                right: width / 20
            }


            let textSize;
            let xField = this.units[0].unitgroup().x;
            let yField = this.y.field;

            let xValueFreq = d3.nest().key(function (d) { return d[xField] }).rollup(function (v) { return v.length; }).entries(this.processedData())

            let yValueFreq = d3.nest().key(function (d) { return d[yField] }).rollup(function (v) { return v.length; }).entries(this.processedData())


            let xbar = xValueFreq.length;
            let length = Math.ceil(30 / xbar) < 5 ? Math.ceil(30 / xbar) : 5
            if (xbar >= 8) { textSize = 10; }
            else { textSize = 14; }

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
            for (const [key, value] of Object.entries(ymax)) {
                xmaxCount += Math.ceil(value / length);
            }


            let wradius = ((width - margin.left - margin.right) / ((length +1) * (xbar - 1) + length)) / 2.2;
            let hradius = d3.min([(height * 0.9-2*textSize) / (xmaxCount )/ 2,(height * 0.9-2*textSize) / ybar/(Math.ceil( length)+1)/ 2]);
            let radius =1.0* Math.min(wradius, hradius);
            let textpadding = 10
            let baseX = xValueFreq.map(function (d, i) {
                if (xbar === 1) {

                    return (width - length * radius * 2.2) / 2
                }
                else if (xbar >= 2) {
                    let s=(0.9*width-2*(xbar)*length*radius)/(radius)/(xbar+3)/2<1?0.2:Math.floor((0.9*width-2*(xbar)*length*radius)/(radius)/(xbar+3)/2)         
                    let leftPadding = (1* width -xbar*length*2*radius-(xbar-1)*s*2*radius ) / 2+1*margin.left
                    return leftPadding + (width-2*leftPadding)/(xbar-1)*i;
                }
            })

            let topPadding = d3.max([(height - xmaxCount * radius * 2 - ybar * radius * 2 - 2 * textpadding) / 2,0.025*height])
            let baseY = [topPadding]

            let y = baseY[0]
            for (let i = 0; i < ybar; i++) {
                y += ymax[yValue[i]] / length * 2 * radius + 10
                baseY.push(y)
            }

            // setTimeout(()=>{svg.select(".content").selectAll("text").remove()},5000);
            svg.select(".content").selectAll("text")
            .transition()
            .delay(this.delay)
            .duration(this.duration/2)
            .attr("fill-opacity", 0)


            for (let i = 0; i < xbar; i++) {
                svg.select(".content")
                    .append("text")
                    .text(xValue[i])
                    .attr("x", baseX[i] + (length - 1) * radius)
                    // .attr("x", baseX[iBar] + radius*6)
                    .attr("y", baseY[baseY.length - 1] + textpadding)
                    .attr("font-size", textSize)
                    .attr("text-anchor", "middle")
                    .attr("transform", "translate(" + baseX[i] - radius + length * radius + "," + baseY[baseY.length - 1] + radius + textSize + ") rotate(-45)")
                    .attr("fill-opacity", 0)
                    .transition()
                    .delay(this.delay + this.duration/2)
                    .duration(this.duration/2)
                    .attr("fill-opacity", 1)
    
                let xbar = unit[i]
                for (let j = 0; j < ybar; j++) {
                    svg.select(".content")
                        .append("text")
                        .text(yValue[j])
                        .attr("x", baseX[0] - radius - 2 * textpadding)
                        // .attr("x", baseX[iBar] + radius*6)
                        .attr("y", baseY[j] + radius * 2)
                        .attr("font-size", textSize)
                        .attr("text-anchor", "end")
                        .attr("transform", "translate(" + baseY[0] + radius + textSize - radius + length * radius + "," + baseY[j] + radius * 3 + radius + textSize + ") rotate(-45)")
                        // .attr("transform", `rotate(-45, ${baseX[iBar] - radius + length * radius}, ${baseY + radius + textSize})`)
                        .attr("fill-opacity", 0)
                        .transition()
                        .delay(this.delay + this.duration/2)
                        .duration(this.duration/2)
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


                svg.select(".content")
                    .append("text")
                    .text(xField)
                    .attr("x", width / 2)
                    .attr("y", Math.min(baseY[baseY.length - 1] + 3 * textSize, height))
                    .attr("font-size", textSize)
                    .attr('text-anchor', 'middle')
                    .attr("fill-opacity", 0)
                    .transition()
                    .delay(this.delay + this.duration/2)
                    .duration(this.duration)
                    .attr("fill-opacity", 1)


                svg.select(".content")
                    .append("text")
                    .text(yField)
                    .attr("x", baseX[0] - radius - 2 * textpadding - 3.5 * textSize)
                    .attr("y", height / 2)
                    .attr("font-size", textSize)
                    .attr('text-anchor', 'middle')
                    .attr("transform", `rotate(-90, ${baseX[0] - radius - 2 * textpadding - 3.5 * textSize}, ${height / 2})`)
                    .attr('text-anchor', 'middle')
                    .attr("fill-opacity", 0)
                    .transition()
                    .delay(this.delay + this.duration/2)
                    .duration(this.duration/2)
                    .attr("fill-opacity", 1)
            }
        }
        else if (!this.x) {

            let margin = {
                left: width / 20,
                right: width / 20
            }
            let textSize = 14;

            let breakdownField = this.y.field;

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

            let length = Math.ceil(30 / bar) < 5 ? Math.ceil(30 / bar) : 5

            let wradius = d3.min([width - margin.left - margin.right,0.8*width])/ Math.ceil(maxCount / length) / 2;
            let hradius = height * 0.8 /bar/(Math.ceil( length)+1)/ 2;
            
            let radius = 0.9*Math.min(wradius, hradius);
            let s=(0.9*height-2*(bar)*length*radius)/(radius)/(bar+3)/2<1?0.2:Math.floor((0.9*height-2*(bar)*length*radius)/(radius)/(bar+3)/2)                 
            let padding = (0.9* height -bar*length*2*radius-(bar-1)*s*2*radius ) / 2
            let baseY = d3.range(padding , height-padding-(2*length-1)*radius+1,(height-padding-(2*length-1)*radius-padding)/(bar-1));
            let rowTotalWidth = d3.min([Math.ceil(maxCount / length) * 2 * radius, width * 0.8])
            let baseX = (0.9 * width - rowTotalWidth) / 2 + 4 * textSize + radius

            let visibleUnits = this.units.filter(d => d.visible() === "1");


            let units = [];
            for (let i = 0; i < bar; i++) {
                let barUnits = visibleUnits.filter(d => d[breakdownField] === breakdownValue[i]);
                units.push(barUnits);
            }


            // setTimeout(()=>{svg.select(".content").selectAll("text").remove()},5000);

            svg.select(".content").selectAll("text")
            .transition()
            .delay(this.delay)
            .duration(this.duration/2)
            .attr("fill-opacity", 0)

            units.forEach((bar, iBar) => {
                svg.select(".content")
                    .append("text")
                    .text(breakdownValue[iBar])
                    .attr("x", baseX - radius - 2 * textSize)
                    // .attr("x", baseX[iBar] + radius*6)
                    .attr("y", baseY[iBar] + (length - 3) * radius)
                    .attr("font-size", textSize)
                    .attr("text-anchor", "middle")
                    // .attr("transform", "translate("+baseX[iBar]-radius+length*radius+","+baseY+radius+textSize+") rotate(-45)")
                    .attr("transform", `rotate(-45, ${baseX[iBar] - radius + length * radius}, ${baseY + radius + textSize})`)
                    .attr("fill-opacity", 0)
                    .transition()
                    .delay(this.delay)
                    .duration(this.delay + this.duration/2)
                    .attr("fill-opacity", 1)

                bar.forEach((d, i) => {
                    let col = Math.floor(i / length);
                    let row = i % length;
                    d.x(baseX + 2 * radius * col);
                    d.y(baseY[iBar] + 2 * radius * row);
                    d.radius(radius);
                    d.opacity(1);
                    d.unitgroup('x', breakdownField);
                })

                svg.select(".content").append("text")
                    .text(breakdownField)
                    .attr("x", Math.min(baseX - radius - 4 * textSize, width))
                    .attr("y", height / 2)
                    .attr("font-size", textSize)
                    .attr("transform", `rotate(-90, ${Math.min(baseX - radius - 4 * textSize, width)}, ${height / 2})`)
                    .attr('text-anchor', 'middle')
                    .attr("fill-opacity", 0)
                    .transition()
                    .delay(this.delay + this.duration/2)
                    .duration(this.duration/2)
                    .attr("fill-opacity", 1)

            });

        }
        else if (this.x && this.size) {
            let textSize = 14;
            let xField = this.units[0].unitgroup().x;
            let yField = this.y.field;
            let sizeField = this.units[0].unitgroup().size

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

            let radiusa = maxR / Math.sqrt(averageradius) * ratio;
            let rowTotalWidth;

            if (column % 2 === 0) {
                rowTotalWidth = 2.1 * maxR * column;//2.4
            } else {
                rowTotalWidth = 2.1 * maxR * (column + 1);
            }
            let strlen = yValueFreq.map(d => d['key'].length)
            let strmax = d3.max(strlen)

            let twosideleft = 30
            let Minleftpadding = 2 * maxR + 3 * textSize + twosideleft
            rowTotalWidth = d3.min([rowTotalWidth, width * 0.8])
            let centernodex = xValueFreq.map(function (d, i) {

                if (0.9 * width - rowTotalWidth - 2 * twosideleft - 2 * Minleftpadding > 0) {
                    let leftpadding = (0.9 * width - rowTotalWidth - 2 * twosideleft - 2 * Minleftpadding) / 2 + 2 * twosideleft +  Minleftpadding
                    let paddingMaxR
                    if(column>5)
                        paddingMaxR = 3.3
                    else
                        paddingMaxR = 1

                    return leftpadding + (rowTotalWidth - paddingMaxR * maxR) / (column - 1) * (Math.floor(i % column));
                }
                else if (0.9 * width - rowTotalWidth - 2 * twosideleft - 2 * Minleftpadding < 0) {
                    let leftpadding = Minleftpadding
                    let paddingMaxR = 1;
                    return leftpadding + (rowTotalWidth - paddingMaxR * maxR) / (column - 1) * (Math.floor(i % column));
                }


                if (column === 1) {
                    if (xValueFreq.length === 2) {//异常处理
                        return i === 0 ? radiusa : 3.1 * maxR + radiusa
                    }
                    return (width - radiusa) / 2
                }
                else if (column > 4 && row > 2) {
                    rowTotalWidth = d3.min([rowTotalWidth, width])
                    return 10 + 1.0 * Minleftpadding + rowTotalWidth / (column - 1) * (i);
                }
                else {
                    rowTotalWidth = d3.min([rowTotalWidth, width * 0.9])
                    return 10 + 1.0 * Minleftpadding + rowTotalWidth / (column - 1) * (i)

                }
            })

            let columnTotalHeight;
            if (row % 2 === 0) {
                columnTotalHeight = 2 * maxR * row;//2.4
            } else {
                columnTotalHeight = 2 * maxR * (row + 1);
            }

            let centernodey = yValueFreq.map(function (d, i) {
                if (row > 2) {
                    columnTotalHeight = d3.min([columnTotalHeight, height * 0.8])
                    let topPadding = (0.8 * height - columnTotalHeight) / 2 + 2 * maxR;
                    return topPadding + d3.min([(height - 6 * maxR) / (row - 1), 4 * maxR]) * (i);
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
                }
                else {
                    this.units[index].visible("0")
                }

                this.units[index].opacity("1")
            }

            // setTimeout(()=>{svg.select(".content").selectAll("text").remove()},5000);
            svg.select(".content").selectAll("text")
            .transition()
            .delay(this.delay)
            .duration(this.duration/2)
            .attr("fill-opacity", 0)

            xValueFreq.forEach((bar, iBar) => {
                svg.select(".content")
                    .append("text")
                    .text(xValue[iBar])
                    .attr("x", centernodex[iBar])
                    .attr("y", centernodey[centernodey.length - 1] + 2 * maxR)
                    .attr("font-size", textSize * 0.8)
                    .attr("text-anchor", "middle")
                    .attr("transform", "translate(" + centernodex[iBar] + "," + centernodey + ") rotate(-45)")
                    .attr("fill-opacity", 0)
                    .transition()
                    .delay(this.delay + this.duration/2)
                    .duration(this.duration/2)
                    .attr("fill-opacity", 1)

            })

            yValueFreq.forEach((bar, iBar) => {
                svg.select(".content")
                    .append("text")
                    .text(yValue[iBar])
                    .attr("x", centernodex[0] - 2 * maxR)
                    .attr("y", centernodey[iBar])
                    .attr("font-size", textSize * 0.8)
                    .attr("text-anchor", "end")
                    .attr("transform", "translate(" + centernodex[iBar] + "," + centernodey + ") rotate(-45)")
                    .attr("fill-opacity", 0)
                    .transition()
                    .delay(this.delay + this.duration/2)
                    .duration(this.duration/2)
                    .attr("fill-opacity", 1)

            })


            svg.select(".content").append("text")
                .text(xField)
                .attr("x", width / 2)
                .attr("y", Math.min(centernodey[centernodey.length - 1] + 2 * maxR + 3 * textSize, height))
                .attr("font-size", textSize * 0.9)
                .attr('text-anchor', 'middle')
                .attr("fill-opacity", 0)
                .transition()
                .delay(this.delay + this.duration/2)
                .duration(this.duration/2)
                .attr("fill-opacity", 1)

            svg.select(".content").append("text")
                .text(yField)
                .attr("x", centernodex[0] - 2 * maxR - 3 * textSize)
                .attr("y", height / 2)
                .attr("font-size", textSize * 0.9)
                .attr('text-anchor', 'middle')
                .attr("transform", `rotate(-90, ${centernodex[0] - 2 * maxR - 3 * textSize}, ${height / 2})`)
                .attr("fill-opacity", 0)
                .transition()
                .delay(this.delay + this.duration/2)
                .duration(this.duration/2)
                .attr("fill-opacity", 1)

    }
    }


    encodeColor() {
        if (this.color) {
            let svg = this.svg()
            let colorField = this.color.field;
            let colorFreqValue = d3.nest().key(function (d) { return d[colorField] }).rollup(function (v) { return v.length; }).entries(this.processedData())
            let colorValue = colorFreqValue.map(d => d['key']);

            let units = [];
            for (let i = 0; i < colorFreqValue.length; i++) {
                let colorUnits = this.units.filter(d => d[colorField] === colorValue[i]);
                units.push(colorUnits);
            }

            units.forEach((color, iColor) => {

                color.forEach((d) => {
                    d.color(Color().CATEGORICAL[iColor % 8]);
                    d.unitgroup('color', colorField);
                })
            })
        }
    }


    encodeSize() {
        let svg = this.svg();
        let width = this.width(),
            height = this.height();


            

        if (this.x && this.y && this.size) {
            let textSize = 14;

            let xField = this.units[0].unitgroup().x;
            let yField = this.units[0].unitgroup().y;
            let sizeField = this.size.field


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
            let radiusa = maxR / Math.sqrt(averageradius) * ratio;
            let rowTotalWidth;

            rowTotalWidth=2.1*maxR*(column)

            function textSizef(fontSize,fontFamily,text){
                var span = document.createElement("span");
                var result = {};
                result.width = span.offsetWidth;
                result.height = span.offsetHeight;
                span.style.visibility = "hidden";
                span.style.fontSize = fontSize;
                span.style.fontFamily = fontFamily;
                span.style.display = "inline-block";
                document.body.appendChild(span);
                if(typeof span.textContent != "undefined"){
                  span.textContent = text;
                }else{
                  span.innerText = text;
                }
                result.width = parseFloat(window.getComputedStyle(span).width) - result.width;
                result.height = parseFloat(window.getComputedStyle(span).height) - result.height;
                return result;
              }


            let strlen = yValueFreq.map(d => textSizef(textSize,'Arial',d['key']).width)
            let strmax = d3.max(strlen)
            
            let Minleftpadding =  2*maxR +2*textSize+textSizef(textSize,'Arial',yField).height+strmax
            rowTotalWidth = d3.min([rowTotalWidth, width * 0.8])

            let centernodex = xValueFreq.map(function (d, i) {
                if (column === 1) {
                    if (xValueFreq.length === 2) {//异常处理
                        return i === 0 ? radiusa : 3.1 * maxR + radiusa
                    }
                    return (width - radiusa) / 2
                }
                else {
                    
                    if (0.9 * width - rowTotalWidth - 2 * Minleftpadding > 0) {
                        let rowTotalWidth1=0.9 * width - 2 * Minleftpadding 
                        let leftpadding = (1 * width - rowTotalWidth1  - 2 * Minleftpadding) / 2 + Minleftpadding
                        let rightpadding=(column<=6)?0.5* leftpadding:d3.min([2*maxR,0.5*leftpadding+maxR])
                        return leftpadding + (width-leftpadding -rightpadding) / (column - 1) * (Math.floor(i % column))
                        
                    }
                    else if (0.9 * width - rowTotalWidth  - 2 * Minleftpadding <=0) {
                        let leftpadding = 1*Minleftpadding
                        let rightpadding=(column<=6)?0.5* leftpadding:d3.min([2*maxR,0.5*leftpadding+maxR])
                        return leftpadding + (width-leftpadding -rightpadding) / (column - 1) * (Math.floor(i % column))

                        
                    }
                }
            })

            let columnTotalHeight;
            if (row % 2 === 0) {
                columnTotalHeight = 2 * maxR * row;//2.4
            } else {
                columnTotalHeight = 2 * maxR * (row + 1);
            }

            let centernodey = yValueFreq.map(function (d, i) {
                if (row > 2) {
                    columnTotalHeight = d3.min([columnTotalHeight, height * 0.8])
                    let topPadding = (0.8 * height - columnTotalHeight) / 2 + 2 * maxR;
                    return topPadding + d3.min([(height - 6 * maxR) / (row - 1), 4 * maxR]) * (i);
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
                    this.units[f.id].unitgroup('size',sizeField)
                }
                else {
                    this.units[index].visible("0")
                }

                this.units[index].opacity("1")
            }

            // setTimeout(()=>{svg.select(".content").selectAll("text").remove()},5000);
            svg.select(".content").selectAll("text")
            .transition()
            .delay(this.delay)
            .duration(this.duration/2)
            .attr("fill-opacity", 0)

            xValueFreq.forEach((bar, iBar) => {
                svg.select(".content")
                    .append("text")
                    .text(xValue[iBar])
                    .attr("x", centernodex[iBar])
                    .attr("y", centernodey[centernodey.length - 1] + 2 * maxR)
                    .attr("font-size", textSize * 0.8)
                    .attr("text-anchor", "middle")
                    .attr("transform", "translate(" + centernodex[iBar] + "," + centernodey + ") rotate(-45)")
                    .attr("fill-opacity", 0)
                    .transition()
                    .delay(this.delay + this.duration/2)
                    .duration(this.duration/2)
                    .attr("fill-opacity", 1)

            })

            yValueFreq.forEach((bar, iBar) => {
                svg.select(".content")
                    .append("text")
                    .text(yValue[iBar])
                    .attr("x", centernodex[0] - 2 * maxR)
                    .attr("y", centernodey[iBar])
                    .attr("font-size", textSize * 0.8)
                    .attr("text-anchor", "end")
                    .attr("transform", "translate(" + centernodex[iBar] + "," + centernodey + ") rotate(-45)")
                    .attr("fill-opacity", 0)
                    .transition()
                    .delay(this.delay + this.duration/2)
                    .duration(this.duration/2)
                    .attr("fill-opacity", 1)
            })


            svg.select(".content").append("text")
                .text(xField)
                .attr("x", width / 2)
                .attr("y", Math.min(centernodey[centernodey.length - 1] + 2 * maxR + 3 * textSize, height))

                .attr("font-size", textSize * 0.9)
                .attr('text-anchor', 'middle')
                .attr("fill-opacity", 0)
                .transition()
                .delay(this.delay + this.duration/2)
                .duration(this.duration/2)
                .attr("fill-opacity", 1)


            svg.select(".content").append("text")
                .text(yField)
                .attr("x", centernodex[0] - 2 * maxR - 3 * textSize)
                .attr("y", height / 2)
                .attr("font-size", textSize * 0.9)
                .attr('text-anchor', 'middle')
                .attr("transform", `rotate(-90, ${centernodex[0] - 2 * maxR - 3 * textSize}, ${height / 2})`)
                .attr("fill-opacity", 0)
                .transition()
                .delay(this.delay + this.duration/2)
                .duration(this.duration/2)
                .attr("fill-opacity", 1)
    }
        else if (this.x && this.size) {
            let xField = this.units[0].unitgroup().x;

            let sizeField = this.size.field;

            let xValueFreq = d3.nest().key(function (d) { return d[xField] }).rollup(function (v) { return v.length; }).entries(this.processedData())


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

            let ratio = 1.8;
            let radiusa = maxR / Math.sqrt(averageradius) * ratio;

            let rowTotalWidth;
            if (categories.length % 2 === 0) {
                rowTotalWidth = 2.5 * maxR * column;//2.4
            } else {
                rowTotalWidth = 2.5 * maxR * (column + 1);
            }

            rowTotalWidth = d3.min([rowTotalWidth, width * 0.9])


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
                    let leftPadding = (width - (rowTotalWidth - paddingMaxR * maxR)) / 2;
                    return leftPadding + (rowTotalWidth - paddingMaxR * maxR) / (column - 1) * (Math.floor(i % column));
                }
            })

            let centernodey = xValueFreq.map(function (d, i) {
                let startPoint = ((height - 3.6 * maxR - 5 * radiusa) / (row - 1) <= 3 * maxR ? 1.8 * maxR : (height - 3 * maxR * (row - 1) - 5 * radiusa) / 1.4);
                return startPoint + d3.min([(height - 3.6 * maxR) / (row - 1), 3 * maxR]) * (Math.floor(i / column));
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
                    this.units[f.id].unitgroup('size',sizeField)

                }
                else {
                    this.units[index].visible("0")
                }

                this.units[index].opacity("1")
            }
            
            // setTimeout(()=>{svg.select(".content").selectAll("text").remove()},5000);
            svg.select(".content").selectAll("text")
            .transition()
            .delay(this.delay)
            .duration(this.duration/2)
            .attr("fill-opacity", 0)

            xValueFreq.forEach((bar, iBar) => {
                svg.select(".content").append("text")
                    .text(xValue[iBar])
                    .attr("x", centernodex[iBar])
                    .attr("y", centernodey[0] + 2 * radiusa + 1 * maxR)
                    .attr("font-size", 14)
                    .attr("text-anchor", "middle")
                    .attr("transform", "translate(" + centernodex[iBar] + "," + centernodey + ") rotate(-45)")
                    // .attr("transform", `rotate(-45, ${baseX[iBar] - radius + length * radius}, ${baseY + radius + textSize})`)
                    .attr("fill-opacity", 0)
                    .transition()
                    .delay(this.delay + this.duration/2)
                    .duration(this.duration/2)
                    .attr("fill-opacity", 1)
            })

            svg.select(".content").append("text")
                .text(xField)
                .attr("x", width / 2)
                .attr("y", Math.min(centernodey[0] + 2 * radiusa + 2 * maxR, height))
                .attr("font-size", 14)
                .attr('text-anchor', 'middle')
                .attr("fill-opacity", 0)
                .transition()
                .delay(this.delay + this.duration/2)
                .duration(this.duration/2)
                .attr("fill-opacity", 1)
        }
        else {
            let units = this.units.filter(d => d.visible() === "1");
            let sizeField = this.size.field

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
                nodesradius[index].radius = Math.sqrt(nodesScale(nodesradius[index].value));
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
                    units[f.id].unitgroup('size',sizeField)

                }
                else {
                    units[index].visible("0")
                }

                units[index].opacity("1")
            }

        }

    }


    encodeShape() {

    }

    addEncoding(channel, field) {
        if (!this[channel]) {
            this[channel] = field;

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
                    .delay(this.delay)
                    .duration(this.colorduration)
                    .attr("fill", d => d.color());
            }

            if (changesize) {
                this.svg().select(".content")
                    .selectAll("circle")
                    .transition("change size")
                    .delay(this.delay)
                    .duration(this.sizeduration)
                    .attr("r", d => d.radius());
            }

            if (changelayout) {
                this.svg().select(".content")
                    .selectAll("circle")
                    .transition("change layout")
                    .delay(this.delay)
                    .duration(this.duration)
                    .attr("cx", d => d.x())
                    .attr("cy", d => d.y())
                    .attr("r", d => d.radius())
                    .style("opacity", d => d.opacity());
            }
            this.delay += (changecolor? this.colorduration: 0) + (changesize? this.sizeduration: 0) + (changelayout? this.duration: 0)




        }

    }


    modifyEncoding(channel, field) {
        if (this[channel]) {
            this[channel] = field;

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
                    .delay(this.delay)
                    .duration(this.colorduration)
                    .attr("fill", d => d.color());
            }

            if (changesize) {
                this.svg().select(".content")
                    .selectAll("circle")
                    .transition("change size")
                    .delay(this.delay)
                    .duration(this.sizeduration)
                    .attr("r", d => d.radius());
            }

            if (changelayout) {
                this.svg().select(".content")
                    .selectAll("circle")
                    .transition("change layout")
                    .delay(this.delay)
                    .duration(this.duration)
                    .attr("cx", d => d.x())
                    .attr("cy", d => d.y())
                    .attr("r", d => d.radius())
                    .style("opacity", d => d.opacity());
            }

            this.delay += (changecolor? this.colorduration: 0) + (changesize? this.sizeduration: 0) + (changelayout? this.duration: 0)
        }
    }

    removeEncoding(channel) {
        this[channel] = null;

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
                .delay(this.delay)
                .duration(this.colorduration)
                .attr("fill", d => d.color());
        }

        if (changesize) {
            this.svg().select(".content")
                .selectAll("circle")
                .transition("change size")
                .delay(this.delay)
                .duration(this.sizeduration)
                .attr("r", d => d.radius());
        }

        if (changelayout) {
            this.svg().select(".content")
                .selectAll("circle")
                .transition("change layout")
                .delay(this.delay)
                .duration(this.duration)
                .attr("cx", d => d.x())
                .attr("cy", d => d.y())
                .attr("r", d => d.radius())
                .style("opacity", d => d.opacity());
        }
        this.delay += (changecolor? this.colorduration: 0) + (changesize? this.sizeduration: 0) + (changelayout? this.duration: 0)

    }

}

export default Unitvis;