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
            width: 600,
            height: 600
        }
        
        d3.select(this.container())
            .append("svg")
            .attr("width", this.width() + margin.left + margin.right)
            .attr("height", this.height() + margin.top + margin.bottom)
            .style("background-color", COLOR.BACKGROUND)

        d3.select("svg")
            .append("g")
            .attr("id","chartBackGrnd")
            .append("rect")
            .attr("width", chartbackgroundsize.width)
            .attr("height", margin.top === 130? 490: chartbackgroundsize.height)
            .attr("transform", "translate(" + 20 + "," + margin.top + ")");

        let top_temp= margin.top>40 ? (margin.top-40) : margin.top
        this._svg = d3.select("svg")
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + top_temp + ")");

                
        if(background.Background_Image){
            d3.select("svg").style("background", "url(" + background.Background_Image + ") center ").style("background-size", "cover")
        }

        if(background.Background_Color){
            d3.select("svg").style("background", background.Background_Color + " center ").style("background-size", "cover")
        }

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
            width: 600,
            height: 600
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
            .padAngle(5)
            .padRadius(3)

        
        arcs.append("path")
            .attr("class","mark")
            .attr("fill", (d)=> d.color())
            .attr("d", (d, i) => arcFun(d))
            .attr("opacity", (d, i) => d.opacity())
            .attr("stroke",stroke)
            .attr("stroke-width",strokeWidth)
            .attr("stroke-opacity",strokeOpacity)

        }
    /**
     * @description Draw Arcs for pie chart with theta encoding.
     *
     * @return {void}
     */
    encodeTheta(animation = {}) {
        let width = this.width();
        let chartbackgroundsize = {
            width: 600,
            height: 600
        }
        let innerRadius = this.markStyle()['inner-radius'] ? this.markStyle()['inner-radius'] : 3;
        let outerRadius = this.markStyle()['outer-radius'] ? this.markStyle()['outer-radius'] : width/3;
        let textRadius = this.markStyle()['text-radius'] ? this.markStyle()['text-radius'] : width/3+50;
        let cornerRadius = this.markStyle()['corner-radius'] ? this.markStyle()['corner-radius'] : 0;

        let arcFun = d3.arc()
            .padAngle(5)
            .padRadius(3)
            .cornerRadius(cornerRadius)

        if(this.theta){
            const processedData = this.processedData();
            const thetaEncoding = this.theta,
                colorEncoding = this.color;
            let pie = d3.pie()
                .value(d => d[thetaEncoding]);
            let pieData = pie(processedData);
            
            this.dataTemp=[]
            let thetaDelta=outerRadius;
            this.arcs.forEach((d,i)=>{
                let thateDelta_temp= (pieData[i].endAngle - pieData[i].startAngle)*outerRadius
                if(thateDelta_temp>thetaDelta) thetaDelta= thateDelta_temp
                d.angleEnd(pieData[i].endAngle);
                d.angleStart(pieData[i].startAngle);
                d.radiusInner(innerRadius);
                d.radiusOuter(outerRadius);
                this.dataTemp[i]={
                    startAngle: d.angleStart(),
                    endAngle: d.angleEnd(),
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
                let text_temp = d[colorEncoding]?(d[colorEncoding] + ": " + percent.toFixed(1) + '%') : (percent.toFixed(1) + '%');
                d.text(text_temp)
            })

            if(this.style()["mask-image"] && !this.markStyle()["background-image"]){
                d3.selectAll("#chart-mask-image")
                .attr("x",outerRadius)
                .attr("y",outerRadius)
                
            }
            d3.selectAll(".mark")
                .attr("d", (d, i) => arcFun(this.dataTemp[i]))
            
            if(this.markStyle()["background-image"]){
                d3.selectAll(".mark-background-pattern")
                .attr("x",(d,i)=>arcFun.centroid(this.dataTemp[i])[0]+thetaDelta/2)
                .attr("y",(d,i)=>arcFun.centroid(this.dataTemp[i])[1]+thetaDelta/2)
                .attr("width", thetaDelta)
                .attr("height",thetaDelta)

                d3.selectAll(".markBackground")
                .attr("width", thetaDelta)
                .attr("height",thetaDelta)
                
            }

        }else{
            let circleAll={startAngle:0,endAngle:2*Math.PI, innerRadius: innerRadius, outerRadius: outerRadius}
            d3.select(".mark")
                .attr("d", arcFun(circleAll)) 
            
        }
    }

    /**
     * @description Coloring arcs with color encoding and mark the corresponding text.
     *
     * @return {void}
     */
     encodeColor(animation = {}) {

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
            this.encodeTheta();
            this.encodeColor();

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

            if(changeTheta||changeColor){
                this.svg().select('.content')
                    .selectAll(".mark")
                    .attr("fill",(d,i)=>d.color())
                    .attr("opacity",(d)=>d.opacity())
            }
        }
    }

    /**
     * @description Modify encoding and redraw arcs.
     *
     * @return {void}
     */
    modifyEncoding(channel, field) {
        if (this[channel]) {
            this[channel] = field;
            let changeTheta = false;
            let changeColor = false;
            this.encodeTheta();
            this.encodeColor();

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

            if(changeTheta||changeColor){
                this.svg().select('.content')
                    .selectAll(".mark")
                    .attr("fill",(d,i)=>d.color())
                    .attr("opacity",(d)=>d.opacity())
            }
        }
    }

    /**
     * @description Remove encoding and redraw arcs.
     *
     * @return {void}
     */
    removeEncoding(channel) {
        this[channel] = null;
        let changeTheta = false;
        let changeColor = false;
        this.encodeTheta();
        this.encodeColor();

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

        if(changeTheta||changeColor){
            this.svg().select('.content')
                .selectAll(".mark")
                .attr("fill",(d,i)=>d.color())
                .attr("opacity",(d)=>d.opacity())
        }
    }

}
export default PieChart;

