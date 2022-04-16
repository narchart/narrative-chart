import Action from './action';

class ModifyEncoding extends Action {
    constructor(spec) {
        super(spec);
        this.channel = spec.channel;
        this.field = spec.field;
        if ('animation' in spec) { this.animation = spec.animation }
        else {
            this.animation = { "delay": 0, "duration": 0 }
        }
    }

    operate(vis) {
        vis.chart().modifyEncoding(this.channel, this.field, this.animation);
    }
}

export default ModifyEncoding;