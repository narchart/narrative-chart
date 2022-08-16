import Action from './action';

class ModifyEncoding extends Action {
    constructor(spec) {
        super(spec);
        this.channel = spec.channel;
        this.field = spec.field;
        if ('animation' in spec) { this._animation = spec.animation }
        else {
            this._animation = { "duration": 0 }
        }
    }

    operate(vis) {
        vis.chart().modifyEncoding(this.channel, this.field, this._animation);
    }
}

export default ModifyEncoding;