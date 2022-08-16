import Action from './action';

class RemoveEncoding extends Action {
    constructor(spec) {
        super(spec);
        this.channel = spec.channel;
        if ('animation' in spec) { this._animation = spec.animation }
        else {
            this._animation = { "duration": 0 }
        }
    }

    operate(vis) {
        vis.chart().removeEncoding(this.channel, this._animation);
    }
}

export default RemoveEncoding;