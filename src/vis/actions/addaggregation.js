import Action from './action';

class AddAggregation extends Action {
    constructor(spec) {
        super(spec);

        if ('field' in spec) {
            this._field = spec.field;
        }
        if ('operator' in spec) {
            this._operator = spec.operator;
        }

        if ('style' in spec) {
            this._style = spec.style;
        }
        if ('animation' in spec) {
            this._animation = spec.animation;
        }
    }

    operate(vis) {
        vis.chart().addAggregation(this._field, this._operator, this._style, this._animation);
    }
}

export default AddAggregation;