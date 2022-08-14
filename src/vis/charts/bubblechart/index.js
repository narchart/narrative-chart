import * as d3 from 'd3';
import Chart from '../chart';
import Color from '../../visualization/color';
import Background from '../../visualization/background';
import Bubble from './bubble';


const COLOR = new Color();
const background = new Background();

/**
 * @description bubble visualization
 *
 * @class
 * @extends Chart
 */
class Bubblechart extends Chart {

    /**
     * @description generating the bubble visualization
     *      *
     * @return {void}
     */

    visualize() {

        let margin = this.margin()

        let Hscaleratio = this.height() / 640

        let Wscaleratio = this.width() / 640


        let minHeightWidth = Math.min(this.width(), this.height())

        this.scaleratio = minHeightWidth / 640

        let chartbackgroundsize = {
            width: 600 * this.scaleratio,
            height: 600 * this.scaleratio
        }

        let container = this.container()

        d3.select(container)
            .append("svg")
            .attr("width", this.width())
            .attr("height", this.height())
            .style("background-color", COLOR.BACKGROUND);

        // Make sure the chart is a square
        this.width(minHeightWidth - margin.left - margin.right);
        this.height(minHeightWidth - margin.top - margin.bottom);
        this.bubbles = []

        d3.select(container)
            .select("svg")
            .append("g")
            .attr("id", "svgBackGrnd")
            .append("rect")
            .attr("width", Wscaleratio * 640)
            .attr("height", Hscaleratio * 640)


        d3.select(container)
            .select("svg")
            .append("g")
            .attr("id", "chartBackGrnd")
            .append("rect")
            .attr("width", chartbackgroundsize.width)
            .attr("height", margin.top === 130 * this.scaleratio ? 490 * this.scaleratio : chartbackgroundsize.height)
            .attr("transform", "translate(" + (20 * this.scaleratio) + "," + margin.top + ")");

        this._svg = d3.select(container)
            .select("svg")
            .append("g")
            .attr("transform", margin.top === 130 * this.scaleratio ? "translate(" + (margin.left * this.scaleratio) + "," + margin.top + ")" : "translate(" + margin.left * this.scaleratio + "," + margin.top + ")");
        // .attr("transform", "translate(50%,50%)");


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
                .attr("width", Wscaleratio * 640)
                .attr("height", Hscaleratio * 640)
                .attr("x", 0)
                .attr("y", 0);
            d3.select("#svgBackGrnd").attr("fill", "url(#svg-backgroundimage)")
        } else if (background.Background_Color) {
            d3.select("#svgBackGrnd").attr("fill", background.Background_Color.color ?? "white").attr("fill-opacity", background.Background_Color.opacity ?? 1)
        } else {
            d3.select("#svgBackGrnd").remove()
        }


        if (this.style()['background-color']) {
            d3.select("#chartBackGrnd").attr("fill", this.style()['background-color'].color ?? "white").attr("fill-opacity", this.style()['background-color'].opacity ?? 1)
        } else if (this.style()['background-image']) {
            let defs = d3.select(container).select("svg").append('svg:defs');
            defs.append("svg:pattern")
                .attr("id", "chart-backgroundimage")
                .attr("width", 1)
                .attr("height", 1)
                .attr("patternUnits", "objectBoundingBox")
                .append("svg:image")
                .attr("xlink:href", this.style()["background-image"].url)
                .attr("preserveAspectRatio", "xMidYMid slice")
                .attr("opacity", this.style()["background-image"].opacity ?? 1)
                .attr("filter", this.style()["background-image"].grayscale ? "grayscale(" + this.style()["background-image"].grayscale + "%)" : "grayscale(0%)")
                .attr("width", chartbackgroundsize.width)
                .attr("height", margin.top === 130 * this.scaleratio ? 490 * this.scaleratio : chartbackgroundsize.height)
                .attr("x", 0)
                .attr("y", 0);
            d3.select("#chartBackGrnd").attr("fill", "url(#chart-backgroundimage)")
        }else {
            d3.select("#chartBackGrnd").remove()
        }


        this.radiusMultiplier = 1

        this.data()
        this.initvis()

        this.axis = {}


        return this.svg();
    }

    /**
     * @description assigning identity and data information for each bubble mark
     *      *
     * @return {void}
     */


    data() {
        let processedData = this.processedData();

        processedData.forEach((d, i) => {
            let bubble = new Bubble();
            bubble.id(i);
            bubble.data(d)
            this.bubbles.push(bubble);
        })

        return this;
    }

    /**
     * @description calculating the length of text
     *      *
     * @return {void}
     */

    textSizef(fontSize, fontFamily, text) {
        var span = document.createElement("span");
        var result = {};
        result.width = span.offsetWidth;
        result.height = span.offsetHeight;
        span.style.visibility = "hidden";
        span.style.fontSize = fontSize;
        span.style.fontFamily = fontFamily;
        span.style.display = "inline-block";
        document.body.appendChild(span);
        if (typeof span.textContent != "undefined") {
            span.textContent = text;
        } else {
            span.innerText = text;
        }
        result.width = parseFloat(window.getComputedStyle(span).width) - result.width;
        result.height = parseFloat(window.getComputedStyle(span).height) - result.height;
        return result;
    }


    /**
     * @description adding the mark background
     *      *
     * @return {void}
     */

    AddMarkBackGrnd(svg) {
        let Hscaleratio = this.height() / 640
        svg.select(".content").selectAll("circle")
            .transition()
            .duration(this.duration / 2)
            .attr("fill", (d, i) => {
                if (this.markStyle()['background-image']) {
                    let defs = this.svg().select(".content").append('svg:defs');
                    defs.append("svg:pattern")
                        .attr("id", "mark-background-image-" + i)
                        .attr("width", 1)
                        .attr("height", 1)
                        .attr("patternUnits", "objectBoundingBox")
                        .append("svg:image")
                        .attr("xlink:href", this.markStyle()["background-image"])
                        .attr("preserveAspectRatio", "none")
                        .attr("width", 2 * d.radius())
                        .attr("height", 2 * d.radius())
                        .attr("x", 0)
                        .attr("y", 0);
                    return "url(#mark-background-image-" + i + ")"
                } else if(this.style()["mask-image"]) {
                    this.checkImgSize(this.style()["mask-image"], (imgWidth, imgHeight) => {
                        const ratio = Math.max(this.width() / imgWidth, this.height() / imgHeight)
                        let margin = this.margin()
                        let chartmasksize = {
                            width: imgWidth * ratio,
                            height: imgHeight * ratio
                        }
                        let defs = this._svg.append('svg:defs');
                        defs.append("svg:pattern")
                            .attr("id", "chart-mask-image")
                            .attr("width", chartmasksize.width)
                            .attr("height", margin.top === 130*Hscaleratio? 480*Hscaleratio: chartmasksize.height)
                            .attr("patternUnits", "userSpaceOnUse")
                            .append("svg:image")
                            .attr("xlink:href", this.style()["mask-image"])
                            .attr("preserveAspectRatio", "xMidYMid slice")
                            .attr("width", chartmasksize.width)
                            .attr("height", margin.top === 130*Hscaleratio? 480*Hscaleratio: chartmasksize.height)
                            .attr("x", -2)
                            .attr("y", 0);
                    })
                    return "url(#chart-mask-image)"
                }else if (this.markStyle()['fill']) {
                    return this.markStyle()['fill']
                } else {
                    return d.color()
                }
            })

    }


    /**
     * @description The initial status of bubble vis (square layout)
     *      *
     * @return {void}
     */

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
        let radius = this.radiusMultiplier * Math.min(((vwidth - margin.left - margin.right) / (maxColumn * (setLength + 1) - 1)), 6);
        let row = Math.floor(Math.sqrt(processedData.length));
        let column = Math.ceil(processedData.length / row); // row 3 col 4
        let initX = vwidth / 1.9 - column * radius;
        let initY = vwidth / 2 - row * radius;

        let units = this.bubbles.filter(d => d.visible() === "1");
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

        let defs = this.svg().select(".content").append('svg:defs');
        defs.append("svg:pattern")
            .attr("id", "mark-background-image-")
            .attr("width", 1)
            .attr("height", 1)
            .attr("patternUnits", "objectBoundingBox")
            .append("svg:image")
            .attr("xlink:href", this.style()["mask-image"])
            .attr("preserveAspectRatio", "none")
            .attr("width", width)
            .attr("height", height)
            .attr("x", 0)
            .attr("y", 0);
        this.fill = "url(#mark-background-image-)";

        let content = svg.append("g")
            .attr("class", "content")
            .attr("chartWidth", width)
            .attr("chartHeight", height);


        content.append("g")
            .attr("class", "circleGroup")
            .selectAll("circle")
            .data(this.bubbles)
            .enter().append("circle")
            .attr("class", "mark")
            .attr("r", d => {
                return d.radius()
            })
            .attr("stroke", this.markStyle()["stroke-color"] ?? "#FFF")
            .attr("stroke-width", this.markStyle()["stroke-width"] ?? 0)
            .attr("stroke-opacity", this.markStyle()["stroke-opacity"] ?? 1)
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
                        .attr("preserveAspectRatio", "none")
                        .attr("width", 2 * d.radius())
                        .attr("height", 2 * d.radius())
                        .attr("x", 0)
                        .attr("y", 0);
                    return "url(#mark-background-image-" + i + ")"
                } else if (this.markStyle()['fill']) {
                    return this.markStyle()['fill']
                } else {
                    return d.color()
                }
            })
            .attr("opacity", this.markStyle()["fill-opacity"] ?? 1)
            .attr("cx", d => d.x())
            .attr("cy", d => d.y());


    }

    /**
     * @description Using mark color to encode a data field
     *      *
     * @return {void}
     */

    //  add color to the bubble circle
    encodeColor() {
        // situation 1
        if (this.color) {
            let colorField = this.color;
            let colorFreqValue = d3.nest().key(function (d) {
                return d[colorField]
            }).rollup(function (v) {
                return v.length;
            }).entries(this.processedData())
            let colorValue = colorFreqValue.map(d => d['key']);

            let units = [];
            for (let i = 0; i < colorFreqValue.length; i++) {
                let colorUnits = this.bubbles.filter(d => d[colorField] === colorValue[i]);
                units.push(colorUnits);
            }

            units.forEach((color, iColor) => {

                color.forEach((d) => {
                    d.color(COLOR.CATEGORICAL[iColor % 8]);
                    d.unitgroup('color', colorField);
                })
            })
        }

    }

    /**
     * @description Using mark size to encode a data field
     *      *
     * @return {void}
     */

    //  add size to the bubble circle
    encodeSize() {
        let svg = this.svg();
        let width = this.width(),
            height = this.height();

        let units = this.bubbles.filter(d => d.visible() === "1");
        let sizeField = this.size

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
        let nodesScale = d3.pack().size([width, height]).padding(1.5)
        (d3.hierarchy({children: units}).sum(i => {
            return i[sizeField]
        }));

        d3.forceSimulation(nodesScale.children)
            .force('charge', d3.forceManyBody().strength(-1))
            .force("collide", d3.forceCollide().radius((d, i) => d.radius + 0.5).iterations(2))
            .force('center', d3.forceCenter(allcenter.xcenter, allcenter.ycenter))
            .tick(400);

        for (let index in units) {
            let f = nodesradius.find(item => item.id == index) //eslint-disable-line
            if (f) {
                units[f.id].x(nodesScale.children[index].x);
                units[f.id].y(nodesScale.children[index].y);
                units[f.id].visible("1")
                units[f.id].radius(nodesScale.children[index].r)
                units[f.id].unitgroup('size', sizeField)
            } else {
                units[index].visible("0")
            }

            units[index].opacity("1")
        }


        svg.select(".content").selectAll("defs").transition().duration(this.duration / 2).remove()

        this.AddMarkBackGrnd(svg)

    }


    /**
     * @description Using the shape of mark to encode a data field
     *      *
     * @return {void}
     */

    encodeShape() {

    }

    /**
     * @description allocating the encoding actions based on spec and then update the chart.
     *
     * @param {string} channel A encoding channel
     * @param {string} field A data field
     * @param {{delay: number, duration: number}} animation Animation parameters of the add encoding.
     *
     * @return {void}
     */

    addEncoding(channel, field, animation = {}) {
        if (!this[channel]) {
            this[channel] = field;
            this.delay = animation.delay
            this.duration = animation.duration
            let changesize = false;
            let changecolor = false;
            let changelayout = false;
            switch (channel) {
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
                    // console.log('no channel select')
                    break;
            }

            if (changecolor) {
                this.svg().select(".content")
                    .selectAll("circle")
                    .transition("change color")
                    .duration(this.duration)
                    .attr("fill", d => d.color());
            }

            if (changesize) {

                this.svg().select(".content")
                    .selectAll("circle")
                    .transition("change size")
                    .duration(this.duration)
                    .attr("r", d => d.radius());
            }

            if (changelayout) {
                this.svg().select(".content")
                    .selectAll("circle")
                    .transition("change layout")
                    .duration(this.duration)
                    .attr("cx", d => d.x())
                    .attr("cy", d => d.y())
                    .attr("r", d => d.radius())
            }


        }

    }

    /**
     * @description Modifying a current encoding channel and then update the chart.
     *
     * @param {string} channel A encoding channel
     * @param {string} field A data field
     * @param {{delay: number, duration: number}} animation Animation parameters of modifying encoding.
     *
     * @return {void}
     */

    modifyEncoding(channel, field, animation) {
        if (this[channel]) {
            this[channel] = field;
            this.delay = animation.delay
            this.duration = animation.duration
            let changesize = false;
            let changecolor = false;
            let changelayout = false;

            switch (channel) {

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
                    // console.log('no channel select')
                    break;
            }

            if (changecolor) {
                this.svg().select(".content")
                    .selectAll("circle")
                    .transition("change color")
                    .duration(this.duration)
                    .attr("fill", d => d.color());
            }

            if (changesize) {
                this.svg().select(".content")
                    .selectAll("circle")
                    .transition("change size")
                    .duration(this.duration)
                    .attr("r", d => d.radius());
            }

            if (changelayout) {
                this.svg().select(".content")
                    .selectAll("circle")
                    .transition("change layout")
                    .duration(this.duration)
                    .attr("cx", d => d.x())
                    .attr("cy", d => d.y())
                    .attr("r", d => d.radius())
            }

        }
    }

    /**
     * @description Removing an existing encoding action and update the chart
     *
     * @param {string} channel A encoding channel
     * @param {string} field A data field
     * @param {{delay: number, duration: number}} animation Animation parameters of removing encoding.
     *
     * @return {void}
     */

    removeEncoding(channel, animation) {
        this[channel] = null;
        this.delay = animation.delay
        this.duration = animation.duration

        let changesize = false;
        let changecolor = false;
        let changelayout = false;


        if (this.size) {
            this.encodeSize();
            changesize = true
        }

        if (this.color) {
            this.encodeColor();
            changecolor = true
        }

        if (changecolor) {
            this.svg().select(".content")
                .selectAll("circle")
                .transition("change color")
                .duration(this.duration)
                .attr("fill", d => d.color());
        }

        if (changesize) {
            this.svg().select(".content")
                .selectAll("circle")
                .transition("change size")
                .duration(this.duration)
                .attr("r", d => d.radius());
        }

        if (changelayout) {
            this.svg().select(".content")
                .selectAll("circle")
                .transition("change layout")
                .duration(this.duration)
                .attr("cx", d => d.x())
                .attr("cy", d => d.y())
                .attr("r", d => d.radius())
        }

    }
    /**
     * @description get image size
     * @param {string} fileUrl url of image
     * @param {function} callback a callback to get imgWidth & imgHeight
     * @return {function}
     */
    checkImgSize = (fileUrl, callback) => {
        if (fileUrl) {
            const img = new Image();
            img.src = fileUrl;
            img.onload = () => {
                callback(img.width, img.height)
            };
        }
    };
}

export default Bubblechart;
