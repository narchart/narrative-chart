import Action from './action';

class RemoveEncoding extends Action {
    constructor(spec) {
        super(spec);
        this.channel = spec.channel;
    }

    operate(vis) {
        vis.chart().removeEncoding(this.channel);
    }
}

export default RemoveEncoding;