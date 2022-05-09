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

        // d3.select("svg").style("background", "url(" + this.style()['background-image'] + ") center ").style("background-size", "cover")
                
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
        let dataTemp=[]
        this.arcs.forEach((d,i)=>{
            dataTemp.push({
            startAngle: d.angleStart(),
            endAngle: d.angleEnd(),
            innerRadius: d.radiusInner(),
            outerRadius: d.radiusOuter(),
            color: COLOR.DEFAULT,            
            })
        })

        this.dataTemp=dataTemp

        // init arcs
        let arcs = content.selectAll(".marks")
            .data(this.dataTemp)
            .enter()
            .append("g")
            .attr("class","marks")
            .attr("transform", "translate(" + (chartbackgroundsize.width-this.margin().left-this.margin().right) / 2  + "," + chartbackgroundsize.height / 2 + ")");

        let arcFun = d3.arc()
            .padAngle(5)
            .padRadius(3)
        
        arcs.append("path")
            .attr("class","arcs")
            .attr("fill",  COLOR.DEFAULT)
            .attr("d", (d, i) => arcFun(d))
            .attr("opacity", 0)

        //init text-label
        arcs.append("text")        
            .attr('class','arcText')
            .attr('text-anchor', 'middle')
            .attr("font-size", "16px")
            .attr("font-weight", "500")
            .attr("fill", COLOR.TEXT)
            .attr("opacity", 0)
        }
    /**
     * @description Draw Arcs for pie chart with theta encoding.
     *
     * @return {void}
     */
    encodeTheta(animation = {}) {
        if(this.theta && this.color){
            const processedData = this.processedData();
            const thetaEncoding = this.theta,
                colorEncoding = this.color;
            let pie = d3.pie()
                .value(d => d[thetaEncoding]);
            let pieData = pie(processedData);
            let width = this.width();
       
            let innerRadius = this.style()['innerRadius'] ? this.style()['innerRadius'] : 3;
            let outerRadius = this.style()['outerRadius'] ? this.style()['outerRadius'] : width/3;
            let textRadius = this.style()['textRadius'] ? this.style()['textRadius'] : width/3+50;
            let cornerRadius = this.style()['cornerRadius'] ? this.style()['cornerRadius'] : 0;

            this.arcs.forEach((d,i)=>{
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
            })

            let arcFun = d3.arc()
                .padAngle(5)
                .padRadius(3)
                .cornerRadius(cornerRadius)

            d3.selectAll(".arcs")
                .attr("d", (d, i) => arcFun(this.dataTemp[i]))

            d3.selectAll(".arcText")
                .attr('transform',(d, i)=> {
                    let midangle = Math.atan2(arcFun.centroid(this.dataTemp[i])[1] , arcFun.centroid(this.dataTemp[i])[0])
                    let xlable = Math.cos(midangle) * textRadius
                    let sign= xlable > 0 ? 1 :-1
                    let x=xlable + 5 * sign
                    let y = Math.sin(midangle)*textRadius
                    return 'translate(' + x + ', ' + y + ')';
                })
                .text((d,i) =>{
                    let percent = Number(this.arcs[i][thetaEncoding]) / d3.sum(pieData, function (d) {
                        return d.value;
                    }) * 100;
                    let text_temp = this.arcs[i][colorEncoding] + ":" + percent.toFixed(1) + '%';
                    this.arcs[i].text(text_temp)
                    // return  percent.toFixed(1) + '%';
                    return text_temp;
                });
        }
    }

    /**
     * @description Coloring arcs with color encoding and mark the corresponding text.
     *
     * @return {void}
     */
     encodeColor(animation = {}) {
        if(this.color) {
            let color = this.color
            let categories = Array.from(new Set(this.arcs.map(d => d[color])))
            this.arcs.forEach((d) =>{
                let i = categories.indexOf(d[color]);
                let arcColor = COLOR.CATEGORICAL[i % 8];
                d.color(arcColor)
            })
            // d3.selectAll(".arcs")
            //     .attr("fill",  (d, i) => COLOR.CATEGORICAL[i % 8])
            // d3.selectAll(".arcText")
            //     .attr("opacity","1")
        }else{
            this.arcs.forEach((d) => {
                d.color(COLOR.DEFAULT)
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
            if (this.theta && this.color) this.encodeTheta();
            if (this.color) this.encodeColor();

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
                    .selectAll(".arcs")
                    .attr("fill",(d,i)=>this.arcs[i].color())
                    .attr("opacity",1)
                this.svg().select('.content')
                    .selectAll(".arcText")
                    .attr("fill",(d,i)=>this.arcs[i].textColor())
                    .attr("opacity",1)
                
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
            if (this.theta && this.color) this.encodeTheta();
            if (this.color) this.encodeColor();

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
                    .selectAll(".arcs")
                    .attr("fill",(d,i)=>this.arcs[i].color())
                    .attr("opacity",1)
                this.svg().select('.content')
                    .selectAll(".arcText")
                    .attr("fill",(d,i)=>this.arcs[i].textColor())
                    .attr("opacity",1)
                
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
        if (this.theta && this.color) this.encodeTheta();
        if (this.color) this.encodeColor();

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
                .selectAll(".arcs")
                .attr("fill",(d,i)=>this.arcs[i].color())
                .attr("opacity",1)
            this.svg().select('.content')
                .selectAll(".arcText")
                .attr("fill",(d,i)=>this.arcs[i].textColor())
                .attr("opacity",1)
            
        }
    }

}
export default PieChart;

