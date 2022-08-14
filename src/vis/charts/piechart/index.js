import * as d3 from 'd3';
import Chart from '../chart';
import Color from '../../visualization/color';
import Arc from './arc';
import Background from '../../visualization/background';

const COLOR = new Color();
const background = new Background();


/**
 * @description A pie chart is a chart type.
 * 
 * @class
 * @extends Chart
 */
class PieChart extends Chart {

    /**
     * @description Main function of drawing pie chart.
     *
     * @return {function} It represents the canvas that has been created, on which subsequent charts, titles, and other content expand.
     */
    visualize() {
        let margin = this.margin()
        this.arcs = [];
        this.dataTemp = [];

        this.initTheta = false;
        this.initColor = false;

        this.Hscaleratio = this.height()/640
        this.Wscaleratio = this.width()/640

        this.width(this.width() - margin.left - margin.right);
        this.height(this.height() - margin.top - margin.bottom);

        this.drawBackground();
        this.data();
        this.initvis();
        return this.svg();       
    }

    /**
     * @description Draw Background for pie chart.
     *
     * @return {void}
     */
    drawBackground() {
        let margin = this.margin()
    
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

        let top_temp= margin.top>40*this.Wscaleratio ? (margin.top-40*this.Wscaleratio) : margin.top
        this._svg = d3.select(container)
                    .select("svg")
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + top_temp + ")");

                
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
    }

    /**
     * @description assigning identity and data information for each point mark
     *      * 
     * @return {void}
     */
    data() {
        let processedData = this.processedData();
        processedData.forEach((d, i) => {
            let arc = new Arc();
            arc.id(i);
            arc.data(d);
            arc.angleStart(0);
            arc.angleEnd(0);
            arc.radiusInner(0);
            arc.radiusOuter(0);
            this.arcs.push(arc);
        })
        return this;
    }
   
     /**
     * @description The initial status of piechart vis
     *      * 
     * @return {void}
    */
    initvis() {
        let svg = this.svg();
        let chartbackgroundsize = {
            width: 600*this.Wscaleratio,
            height: 600*this.Hscaleratio
        }
        let width = this.width(),
            height = this.height();

        let content = svg.append("g")
            .attr("class", "content")
            .attr("chartWidth", width)
            .attr("chartHeight", height);   

        let stroke = this.markStyle()['stroke'] ? this.markStyle()['stroke'] : "none";
        let strokeWidth = this.markStyle()['stroke-width'] || this.markStyle()['stroke-width']===0 ? this.markStyle()['stroke-width'] : 1;
        let strokeOpacity = this.markStyle()['stroke-opacity'] || this.markStyle()['stroke-opacity'] ===0? this.markStyle()['stroke-opacity'] : 1;

        if(this.style()["mask-image"]&& !this.markStyle()["background-image"] ){
            let defs = this._svg.append('svg:defs');
            let outerRadius = this.markStyle()['outer-radius'] ? this.markStyle()['outer-radius'] : width/3;

            defs.append("svg:pattern")
                .attr("id", "chart-mask-image")
                .attr("width",outerRadius*2)
                .attr("height", outerRadius*2)
                .attr("patternUnits", "userSpaceOnUse")
                .append("svg:image")
                .attr("xlink:href", this.style()["mask-image"])
                .attr("preserveAspectRatio", "xMidYMid slice")
                .attr("calss","maskBackground")
                .attr("width", outerRadius*2)
                .attr("height",outerRadius*2)
                .attr("x", 0)
                .attr("y", 0);

        }
        if(this.markStyle()["background-image"]){

            this.arcs.forEach((d,i)=>{
                let defs = this._svg.append('svg:defs');
                defs.append("svg:pattern")
                    .attr("id", `mark-background-image${i}`)
                    .attr("class","mark-background-pattern")
                    .attr("width", 200)
                    .attr("height", 200)
                    .attr("patternUnits", "userSpaceOnUse")
                    .append("svg:image")
                    .attr("xlink:href", this.markStyle()["background-image"])
                    .attr("preserveAspectRatio", "xMidYMid slice")
                    .attr("class","markBackground")
                    .attr("width", 200)
                    .attr("height", 200)
                    .attr("x", 0)
                    .attr("y", 0);
            })
        }
        // init arcs
        let arcs = content.selectAll("g")
            .data(this.arcs)
            .enter()
            .append("g")
            .attr("transform", "translate(" + (chartbackgroundsize.width-this.margin().left-this.margin().right) / 2  + "," + chartbackgroundsize.height / 2 + ")");

        
        let arcFun = d3.arc()
            .padAngle(5*Math.min(this.Wscaleratio,this.Hscaleratio))
            .padRadius(3*Math.min(this.Wscaleratio,this.Hscaleratio))

        
        arcs.append("path")
            .attr("class","mark")
            .attr("fill", (d)=> d.color())
            .attr("d", (d, i) => arcFun(d))
            .attr("opacity", (d, i) => d.opacity())
            .attr("stroke",stroke)
            .attr("stroke-width",strokeWidth)
            .attr("stroke-opacity",strokeOpacity);

        }
    /**
     * @description Draw Arcs for pie chart with theta encoding.
     *
     * @return {void}
     */
    encodeTheta(animation = {}, modify = false) {
        let width = this.width();
        let chartbackgroundsize = {
            width: 600*this.Wscaleratio,
            height: 600*this.Hscaleratio
        }
        let innerRadius = this.markStyle()['inner-radius'] ? this.markStyle()['inner-radius'] : 3;
        let outerRadius = this.markStyle()['outer-radius'] ? this.markStyle()['outer-radius'] : width/3;
        let textRadius = this.markStyle()['text-radius'] ? this.markStyle()['text-radius'] : width/3+50;
        let cornerRadius = this.markStyle()['corner-radius'] ? this.markStyle()['corner-radius'] : 0;

        let arcFun = d3.arc()
            .padAngle(5*Math.min(this.Wscaleratio,this.Hscaleratio))
            .padRadius(3*Math.min(this.Wscaleratio,this.Hscaleratio))
            .cornerRadius(cornerRadius)
        const processedData = this.processedData();
        const thetaEncoding = this.theta,
            colorEncoding = this.color;
        if(this.theta){
            let pie = d3.pie()
                .value(d => d[thetaEncoding]);
            let pieData = pie(processedData);
            this.dataTemp=[];
            let thetaDelta=outerRadius;
            this.arcs.forEach((d,i)=>{
                let thateDelta_temp= (pieData[i].endAngle - pieData[i].startAngle)*outerRadius
                if(thateDelta_temp>thetaDelta) thetaDelta= thateDelta_temp
                d.angleEnd(pieData[i].endAngle);
                d.angleStart(pieData[i].startAngle);
                d.radiusInner(innerRadius);
                d.radiusOuter(outerRadius);
                this.dataTemp[i]={
                    startAngle: pieData[i].startAngle,
                    endAngle: pieData[i].endAngle,
                    innerRadius: d.radiusInner(),
                    outerRadius: d.radiusOuter(),
                    color: COLOR.DEFAULT,                   
                    }

                let midangle = Math.atan2(arcFun.centroid(this.dataTemp[i])[1] , arcFun.centroid(this.dataTemp[i])[0]);
                let xlable = Math.cos(midangle) * textRadius;
                let ylable = Math.sin(midangle) * textRadius
                let sign_x= xlable > 0 ? 1 : -1;
                let sign_y= ylable > 0 ? 1 : -0.3;
                let x = xlable + 2 * sign_x  + (chartbackgroundsize.width-this.margin().left-this.margin().right) / 2;
                let y = ylable + 15 * sign_y + chartbackgroundsize.height / 2;
                let coreX = (chartbackgroundsize.width-this.margin().left-this.margin().right) / 2
                let coreY = chartbackgroundsize.height / 2
                d.centroidX(arcFun.centroid(this.dataTemp[i])[0] + (chartbackgroundsize.width-this.margin().left-this.margin().right) / 2)
                d.centroidY(arcFun.centroid(this.dataTemp[i])[1] + chartbackgroundsize.height / 2)
                d.coreX(coreX)
                d.coreY(coreY)
                d.textX(x);
                d.textY(y);
                let percent = Number(d[thetaEncoding]) / d3.sum(pieData, function (x) {
                    return x.value;
                }) * 100;
                let text_temp = percent.toFixed(1) + '%'
                d.text(text_temp)
            })

            if(this.style()["mask-image"] && !this.markStyle()["background-image"]){
                this.svg().selectAll("#chart-mask-image")
                .attr("x",outerRadius)
                .attr("y",outerRadius)
                
            }

            if (!modify) {
                this.svg().selectAll(".mark")
                        .attr("d", (d, i) => {return arcFun(this.dataTemp[i])})
                        .property("_dataTemp", (d, i) => this.dataTemp[i]);

            } else {
                const this_dataTemp = this.dataTemp;
                this.svg().selectAll(".mark")
                        .transition("theta")
                        .duration('duration' in animation ? animation['duration']: 0)
                        .attrTween("d", function(d, i) {
                            let _old_dataTemp = d3.select(this).property("_dataTemp");
                            var interp = d3.interpolate(_old_dataTemp, this_dataTemp[i]);
                            return function(t) {
                                return arcFun(interp(t));
                            }
                        })
                        .on("end", function(d, i) { 
                            d3.select(this)
                                .property("_dataTemp", this_dataTemp[i]);                  
                        });
            }
            
            
            if(this.markStyle()["background-image"]){
               this.svg().selectAll(".mark-background-pattern")
                .attr("x",(d,i)=>arcFun.centroid(this.dataTemp[i])[0]+thetaDelta/2)
                .attr("y",(d,i)=>arcFun.centroid(this.dataTemp[i])[1]+thetaDelta/2)
                .attr("width", thetaDelta)
                .attr("height",thetaDelta)

               this.svg().selectAll(".markBackground")
                .attr("width", thetaDelta)
                .attr("height",thetaDelta)
            }

        }else{
            let arcCount = this.arcs.length;
            let avgTheta = (2 * Math.PI )/arcCount;
            let notheta_dataTemp=[]
            this.arcs.forEach((d,i)=>{
                // let thateDelta_temp= (pieData[i].endAngle - pieData[i].startAngle)*outerRadius
                // if(thateDelta_temp>thetaDelta) thetaDelta= thateDelta_temp
                d.angleEnd((i+1)*avgTheta);
                d.angleStart(i*avgTheta);
                d.radiusInner(innerRadius);
                d.radiusOuter(outerRadius);
                notheta_dataTemp[i]={
                    startAngle: i*avgTheta,
                    endAngle: (i+1)*avgTheta,
                    innerRadius: d.radiusInner(),
                    outerRadius: d.radiusOuter(),
                    color: COLOR.DEFAULT,                   
                    }

                let midangle = Math.atan2(arcFun.centroid(notheta_dataTemp[i])[1] , arcFun.centroid(notheta_dataTemp[i])[0]);
                let xlable = Math.cos(midangle) * textRadius;
                let ylable = Math.sin(midangle) * textRadius
                let sign_x= xlable > 0 ? 1 : -1;
                let sign_y= ylable > 0 ? 1 : -0.3;
                let x = xlable + 2 * sign_x  + (chartbackgroundsize.width-this.margin().left-this.margin().right) / 2;
                let y = ylable + 15 * sign_y + chartbackgroundsize.height / 2;
                let coreX = (chartbackgroundsize.width-this.margin().left-this.margin().right) / 2
                let coreY = chartbackgroundsize.height / 2
                d.centroidX(arcFun.centroid(notheta_dataTemp[i])[0] + (chartbackgroundsize.width-this.margin().left-this.margin().right) / 2)
                d.centroidY(arcFun.centroid(notheta_dataTemp[i])[1] + chartbackgroundsize.height / 2)
                d.coreX(coreX)
                d.coreY(coreY)
                d.textX(x);
                d.textY(y);
                d.text(colorEncoding ? processedData[i][colorEncoding] : "")
            })

            if (!modify) {
                this.svg().selectAll(".mark")
                        .attr("d", (d,i)=>arcFun(notheta_dataTemp[i]))
                        .property("_dataTemp", (d, i) => notheta_dataTemp[i]);
            } else {
                this.svg().selectAll(".mark")
                        .transition("theta")
                        .duration('duration' in animation ? animation['duration']: 0)
                        .attrTween("d", function(d, i) {
                            let _old_dataTemp = d3.select(this).property("_dataTemp");
                            var interp = d3.interpolate(_old_dataTemp, notheta_dataTemp[i]);
                            return function(t) {
                                return arcFun(interp(t));
                            }
                        })
                        .on("end", function(d, i) { 
                            d3.select(this)
                                .property("_dataTemp", notheta_dataTemp[i]);
                        });
            }

            
        }
    }

    /**
     * @description Coloring arcs with color encoding and mark the corresponding text.
     *
     * @return {void}
     */
    encodeColor(animation = {}, mode = 'add') {
        let fill = this.markStyle()["fill"] ? this.markStyle()["fill"] :(this.style()["mask-image"] ? "url(#chart-mask-image)" : COLOR.DEFAULT);
        let fillOpacity= (this.markStyle()['fill-opacity']||this.markStyle()['fill-opacity']===0) ? this.markStyle()['fill-opacity'] : 1;

        if(this.color) {
            let color = this.color
            let categories = Array.from(new Set(this.arcs.map(d => d[color])))
            this.arcs.forEach((d) =>{
                let i = categories.indexOf(d[color]);
                let arcColor = COLOR.CATEGORICAL[i % 8];
                d.color(arcColor);
                d.opacity(fillOpacity);
            })
        }
        else{
            this.arcs.forEach((d,i) => {
                d.color( this.markStyle()["background-image"] ? `url(#mark-background-image${i})`:fill);
                d.opacity(fillOpacity);
            })
        }

        // special transition when image involved
        if ((mode === 'remove' && this.markStyle()["background-image"])
           || (mode === 'add' && this.initColor && this.markStyle()["background-image"])
           || (((mode === 'remove') || (mode === 'add' && this.initColor)) && this.style()['mask-image'])) { 
            // remove color and have background-image => fade out color and fade in image
            // or add color (not the first time) and now shows background-image => fade out image and fade in image
            // or remove color to show mask-image or add color from mask image
            this.svg().select('.content')
            .selectAll(".mark")
            .transition("color1")
            .duration('duration' in animation ? animation['duration']/2: 0)
            .attr("opacity", 0)
            .on("end", function(d, i) {
                d3.select(this)
                .attr("fill",(d,i)=>d.color())
                .transition("color2")
                .duration('duration' in animation ? animation['duration']/2: 0)
                .attr("opacity",(d)=>d.opacity());
            })
            
        } else {
            this.svg().select('.content')
                    .selectAll(".mark")
                    .transition("color")
                    .duration('duration' in animation ? animation['duration']: 0)
                    .attr("fill",(d,i)=>d.color())
                    .attr("opacity",(d)=>d.opacity());
        }
        
    }
    /**
     * @description Add encoding and redraw arcs.
     *
     * @return {void}
     */
    addEncoding(channel, field, animation = {}) {
        if(!this[channel]) {
            this[channel] = field;
            let changeTheta = false;
            let changeColor = false;

            switch(channel){
                case 'theta':
                    changeTheta = true                   
                    break;
                case 'color':
                    changeColor=true
                    break;
                default:
                    console.log("no channel select")
                    break;
            }

            if(changeTheta){
                if (!this.initTheta) {
                    // if not initTheta, means the canvas has no slices
                    // using wipe animiation to enter
                    this.encodeTheta();
                    this.animationWipe(animation);
                    this.initTheta = true;
                } else {
                    // else transiting between old angle to new angle
                    this.encodeTheta(animation, true);
                }
            
            }
            if(changeColor){
                // if specify color encoding
                // using fade in animation
                this.encodeColor(animation);
            } else {
                // else directly show default slice style
                this.encodeColor();
            }
            this.initColor = true;

        }
    }

    /**
     * @description Modify encoding and redraw arcs.
     *
     * @return {void}
     */
    modifyEncoding(channel, field, animation = {}) {
        if (this[channel]) {
            this[channel] = field;
            let changeTheta = false;
            let changeColor = false;

            switch(channel){
                case 'theta':
                    changeTheta = true                   
                    break;
                case 'color':
                    changeColor=true
                    break;
                default:
                    console.log("no channel select")
                    break;
            }
            
            if (changeTheta) {
                // since in `modify`, change slice with interpolation 
                this.encodeTheta(animation, true);
            }

            if (changeColor){
                // since in `modify`, change color with transition 
                this.encodeColor(animation, "modify");
            }
        }
    }

    /**
     * @description Remove encoding and redraw arcs.
     *
     * @return {void}
     */
    removeEncoding(channel, animation = {}) {
        this[channel] = null;
        let changeTheta = false;
        let changeColor = false;

        switch(channel){
            case 'theta':
                changeTheta = true                   
                break;
            case 'color':
                changeColor=true
                break;
            default:
                console.log("no channel select")
                break;
        }

        if(changeColor){
            // since in `remove`, set slice style back to default
            this.encodeColor(animation, 'remove');
        }
        if(changeTheta){
            // since in `remove`, change slice angle with interpolation(present same angle range)
            this.encodeTheta(animation, true);
        }
    } 

    /**
     * @description wipe animation for first-time theta encoding.
     *
     * @return {void}
     */
    animationWipe(animation) {
        if (!('duration' in animation) || animation['duration'] === 0 || this.svg().select(".content").selectAll("path").empty()) {
            return;
        }
        const uid = Date.now().toString() + Math.random().toString(36).substring(2);

        const svg = this.svg();
        const content = svg.select(".content");
        content.attr("clip-path", `url(#${uid})`);
        let outerRadius, cx, cy;
        content.select("path")
            .each(d => {
                outerRadius = d._outerRadius;
                cx = d._coreX;
                cy = d._coreY;
            })
        let strokeWidth = this.markStyle()['stroke-width'] || this.markStyle()['stroke-width']===0 ? this.markStyle()['stroke-width'] : 1;

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(strokeWidth + outerRadius);
        let circle_data = {
                "x": cx,
                "y": cy,
                "startAngle": 0,
                "endAngle": 2 * Math.PI
            };
  
        content.append("defs")
                .append("clipPath")
                .attr("id", uid)
                .append("path")
                .attr("transform", "translate(" + cx + "," + cy + ")")
                .datum(circle_data)
                .attr("d", arc)
                .transition("wipe")
                .duration(animation['duration'])
                .ease(d3.easeLinear)
                .attrTween('d', function (d) {
                    var i = d3.interpolate(d.startAngle, d.endAngle);
                    return function (t) {
                        d.endAngle = i(t);
                        return arc(d);
                    }
                });
    }

}
export default PieChart;

