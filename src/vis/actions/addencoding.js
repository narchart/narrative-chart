import Action from './action';

class AddEncoding extends Action {
    constructor(spec) {
        super(spec);
        this.channel = spec.channel;
        this.field = spec.field
    }

    operate(vis) {
        vis.chart().addEncoding(this.channel, this.field);
    }
}

export default AddEncoding;