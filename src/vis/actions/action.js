class Action {
    constructor(spec) {
        this._target = null
    }

    target(value) {
        if (!value) {
            return this._target;
        }
        this._target = value;
    }

    operate(chart) {

    }
}

export default Action;