import * as d3 from 'd3';
import Chart from '../chart';
import Color from '../../visualization/color';
import Background from '../../visualization/background';


const COLOR = new Color();
const background = new Background();
const offset = 65;


/**
 * @description A bar chart is a chart type.
 *
 * @class
 * @extends Chart
 */
class TreeMap extends Chart {


  /**
   * @description Main function of drawing progress bar.
   *
   * @return {function} It represents the canvas that has been created, on which subsequent charts, titles, and other content expand.
   */
  visualize() {
    let margin = this.margin()

    this.Hscaleratio = this.height() / 640
    this.Wscaleratio = this.width() / 640

    this.width(this.width() - margin.left - margin.right);
    this.height(this.height() - margin.top - margin.bottom);

    this.cornerRadius = this.markStyle()['corner-radius'] ? this.markStyle()['corner-radius'] : 0;
    this.stroke = this.markStyle()['stroke'] ? this.markStyle()['stroke'] : COLOR.DEFAULT;
    this.strokeWidth = this.markStyle()['stroke-width'] ? this.markStyle()['stroke-width'] : 0;
    this.strokeOpacity = this.markStyle()['stroke-opacity'] ? this.markStyle()['stroke-opacity'] : 1;
    this.fillOpacity = this.markStyle()['fill-opacity'] ? this.markStyle()['fill-opacity'] : 1;

    this.drawBackground();

    let svg = this.svg();

    if (this.markStyle()["fill"]) {
      this.fill = this.markStyle()["fill"]
    } else if (this.markStyle()["background-image"]) {
      this.checkImgSize(this.markStyle()["background-image"], (imgWidth, imgHeight) => {
        const ratio = Math.max(this.width() / imgWidth, this.height() / imgHeight)
        let margin = this.margin()
        let chartbackgroundsize = {
          width: imgWidth * ratio,
          height: imgHeight * ratio
        }
        let defs = svg.append('svg:defs');
        defs.append("svg:pattern")
          .attr("id", "chart-background-image")
          .attr("width", chartbackgroundsize.width)
          .attr("height", margin.top === 130 * this.Hscaleratio ? 480 * this.Hscaleratio : chartbackgroundsize.height)
          .attr("patternUnits", "userSpaceOnUse")
          .append("svg:image")
          .attr("xlink:href", this.markStyle()["background-image"])
          .attr("width", chartbackgroundsize.width)
          .attr("height", margin.top === 130 * this.Hscaleratio ? 480 * this.Hscaleratio : chartbackgroundsize.height)
          .attr("x", 0)
          .attr("y", 0);
      })
      this.fill = "url(#chart-background-image)"
    } else if (this.style()["mask-image"]) {
      this.checkImgSize(this.style()["mask-image"], (imgWidth, imgHeight) => {
        const ratio = Math.max(this.width() / imgWidth, this.height() / imgHeight)
        let margin = this.margin()
        let chartmasksize = {
          width: imgWidth * ratio,
          height: imgHeight * ratio
        }
        let defs = svg.append('svg:defs');
        defs.append("svg:pattern")
          .attr("id", "chart-mask-image")
          .attr("width", chartmasksize.width)
          .attr("height", margin.top === 130 * this.Hscaleratio ? 480 * this.Hscaleratio : chartmasksize.height)
          .attr("patternUnits", "userSpaceOnUse")
          .append("svg:image")
          .attr("xlink:href", this.style()["mask-image"])
          .attr("preserveAspectRatio", "xMidYMid slice")
          .attr("width", chartmasksize.width)
          .attr("height", margin.top === 130 * this.Hscaleratio ? 480 * this.Hscaleratio : chartmasksize.height)
          .attr("x", -2)
          .attr("y", 0);
      })
      this.fill = "url(#chart-mask-image)"
    } else {
      this.fill = COLOR.DEFAULT
    }


    this.content = svg.append("g")
      .attr("class", "content")
      .attr("chartWidth", this.width())
      .attr("chartHeight", this.height())

    return this.svg();
  }

  /**
   * @description Draw Background for progress bar.
   *
   * @return {void}
   */
  drawBackground() {
    let margin = this.margin()

    let chartbackgroundsize = {
      width: 600 * this.Wscaleratio,
      height: 615 * this.Hscaleratio
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

    let backHeight = margin.top === 130 * this.Hscaleratio ? 505 * this.Hscaleratio : chartbackgroundsize.height
    let backWidth = chartbackgroundsize.width
    d3.select(container)
      .select("svg")
      .append("g")
      .attr("id", "treeMapBackGrnd")
      .append("rect")
      .attr("width", backWidth)
      .attr("height", backHeight)
      .attr("transform", "translate(" + (20 * this.Wscaleratio) + "," + margin.top + ")");

    let centerTrans = (margin.left + margin.right) / 2
    this._svg = d3.select(container)
      .select("svg")
      .append("g")
      .attr("transform", "translate(" + centerTrans + "," + margin.top + ")");


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
    } else if (background.Background_Color) {
      d3.select("#svgBackGrnd").attr("fill", background.Background_Color.color ?? "white").attr("fill-opacity", background.Background_Color.opacity ?? 1)
    }
    else {
      d3.select("#svgBackGrnd").remove()
    }

    if (this.style()['background-color']) {
      d3.select("#treeMapBackGrnd").attr("fill", this.style()['background-color'].color ?? "white").attr("fill-opacity", this.style()['background-color'].opacity ?? 1)
    }
    else if (this.style()['background-image']) {
      let defs = d3.select(container).select("svg").append('svg:defs');
      defs.append("svg:pattern")
        .attr("id", "chart-backgroundimage")
        .attr("width", chartbackgroundsize.width)
        .attr("height", margin.top === 130 * this.Hscaleratio ? 505 * this.Hscaleratio : chartbackgroundsize.height)
        .attr("patternUnits", "userSpaceOnUse")
        .append("svg:image")
        .attr("xlink:href", this.style()["background-image"].url)
        .attr("preserveAspectRatio", "xMidYMid slice")
        .attr("opacity", this.style()["background-image"].opacity ?? 1)
        .attr("filter", this.style()["background-image"].grayscale ? "grayscale(" + this.style()["background-image"].grayscale + "%)" : "grayscale(0%)")
        .attr("width", chartbackgroundsize.width)
        .attr("height", margin.top === 130 * this.Hscaleratio ? 505 * this.Hscaleratio : chartbackgroundsize.height)
        .attr("x", 0)
        .attr("y", 0);
      d3.select("#treeMapBackGrnd").attr("fill", "url(#chart-backgroundimage)")
    }
    else {
      d3.select("#treeMapBackGrnd").attr("fill-opacity", 0)
    }

  }


  /**
  * @description Using X-axis to encode a data field.
  *
  * @return {void}
  */
  encodeX() {
    if (this.x) {
      let width = this.width(),
        height = this.height() - offset;
      let content = d3.select(".content");
      let xEncoding = this.x

      const processedData = this.processedData()
      let mapData = {}
      mapData.name = xEncoding
      mapData.children = processedData

      let treemap=d3.treemap()
        .tile(d3.treemapResquarify)
        .size([width,height])
        .round(true)
        .paddingInner(10);
      
      var root = d3.hierarchy(mapData).sum(function (d) { return d[xEncoding] })
      .sort(function(a,b){return b.value-a.value;});
      
      treemap(root)
   
      // use this information to add rectangles:
      content.append("g")
            .attr("class", "rects")
            .selectAll("rect")
            .data(root.leaves())
            .enter()
            .append("rect")
            .attr("class","mark")
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .attr("fill", "#D9D9D9");
      
      // and to add the text labels
      // content
      //       .selectAll("text")
      //       .data(root.leaves())
      //       .enter()
      //       .append("text")
      //         .attr("x", function(d){ return d.x0+10})    // +10 to adjust position (more right)
      //         .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
      //         .text(function(d){ return d.data['Brand']})
      //         .attr("font-size", "15px")
      //         .attr("fill", "black")
    }
  }


  /**
   * @description Coloring bars with color encoding.
   *
   * @return {void}
   */
  encodeColor(animation = {}) {
    // if colorEncoding, clear and redraw
    if (this.color) {
      let width = this.width(),
        height = this.height() - offset;
      const xEncoding = this.x
      const colorEncoding = this.color;
      let content = d3.select(".content");

      /** clear rects */
      d3.selectAll(".rects").remove();
      
      /** process data */
      const processedData = this.processedData()
      let categories = Array.from(new Set(processedData.map(d => d[colorEncoding])))
      processedData.forEach((d) =>{
          let i = categories.indexOf(d[colorEncoding]);
          let color = COLOR.CATEGORICAL[i % 8];
          d.color = color;
      })

      let mapData = {}
      mapData.name = xEncoding
      mapData.children = processedData

      let treemap=d3.treemap()
        .tile(d3.treemapResquarify)
        .size([width,height])
        .round(true)
        .paddingInner(10);
      
      var root = d3.hierarchy(mapData).sum(function (d) { return d[xEncoding] })
      .sort(function(a,b){return b.value-a.value;});
      
      treemap(root)
   
      // use this information to add rectangles:
      content.append("g")
            .attr("class", "rects")
            .selectAll("rect")
            .data(root.leaves())
            .enter()
            .append("rect")
            .attr("class","mark")
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .attr("fill", function (d) { return d.data.color; });
    }
  }

  /**
   * @description Add encoding and redraw bars.
   *
   * @return {void}
   */
  addEncoding(channel, field, animation = {}, axis = {}) {
    if (!this[channel]) {
      this[channel] = field;

      switch (channel) {
        case "x":
          this.encodeX();
          break;
        case "color":
          this.encodeColor(animation)
          break;
        default:
          console.log("no channel select");
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
          this.encodeX();
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
    console.log('remove')
    if (channel === 'x') {
      new Promise((resolve, reject) => {
        this.content.selectAll(".mark")
          .transition()
          .duration('duration' in animation ? animation['duration'] : 0)
          .style('opacity', 0)
          .on("end", resolve)
      })
        .then(() => {
          this.svg().selectAll(".rects").remove();
        })
    }
    if (channel === 'color') {
      this.content.selectAll(".mark")
        .transition()
        .duration('duration' in animation ? animation['duration'] : 0)
        .attr("fill", COLOR.DEFAULT)
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
export default TreeMap;
