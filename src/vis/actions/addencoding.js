import Action from './action';

class AddEncoding extends Action {
    constructor(spec) {
        super(spec);
        this.channel = spec.channel;
        this.data = spec.data
    }

    operate(vis) {
        
        let chart = vis.chart();
        switch (this.channel) {
            case "x":
                chart.x = this.data
                chart.encodeXY()
                break;

            case "y":
                chart.y = this.data
                chart.encodeXY()
                break;

            case "color":
                chart.color = this.data
                chart.encodeColor()
                break;

            case "size":
                chart.size = this.data
                chart.encodeSize()
                break;

            case "shape":
                chart.shape = this.data
                chart.encodeShape()
                break;
        
            default:
                break;
        }
    }
}

export default AddEncoding;