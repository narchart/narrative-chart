class Action {
    constructor(spec) {
        this._target = []
        this._style = {}
        this._animation = {}
    }

    target(value) {
        if (!value) {
            return this._target;
        }
        this._target = value;
    }

    style(value) {
        if (!value) {
            return this._style;
        }
        this._style = value;
    }

    animation(value) {
        if (!value) {
            return this._animation;
        }
        this._animation = value;
    }

    operate(vis) {
        
    }
}

export default Action;