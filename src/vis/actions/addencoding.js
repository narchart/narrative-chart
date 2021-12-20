import Action from './action';

class AddEncoding extends Action {
    constructor(spec) {
        super(spec);
        this.channel = spec.channel;
        this.field = spec.field
    }

    operate(vis) {
      
    }
}

export default AddEncoding;