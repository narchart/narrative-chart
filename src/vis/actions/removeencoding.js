import Action from './action';

class RemoveEncoding extends Action {
    constructor(spec) {
        super(spec);
        this.channel = spec.channel;
        if ('animation' in spec) { this.animation = spec.animation }
        else {
            this.animation = { "delay": 0, "duration": 0 }
        }
    }

    operate(vis) {
        vis.chart().removeEncoding(this.channel, this.animation);
    }
}

export default RemoveEncoding;