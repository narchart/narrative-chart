import Action from './action';

class ModifyEncoding extends Action {
    constructor(spec) {
        super(spec);
        this.channel = spec.channel;
        this.field = spec.field
    }

    operate(vis) {
        vis.chart().modifyEncoding(this.channel, this.field);
    }
}

export default ModifyEncoding;