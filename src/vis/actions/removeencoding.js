import Action from './action';

class RemoveEncoding extends Action {
    constructor(spec) {
        super(spec);
        this.channel = spec.channel;
    }

    operate(vis) {
        
        // let chart = vis.chart();
        // switch (this.channel) {
        //     case "x":
                
        //         break;

        //     case "y":
                
        //         break;

        //     case "color":
                
        //         break;

        //     case "size":
                
        //         break;

        //     case "shape":
                
        //         break;
        
        //     default:
        //         break;
        // }
    }
}

export default RemoveEncoding;