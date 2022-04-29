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

    delay(value) {
        if (!value) {
            if ('delay' in this._animation) {
                return this._animation['delay']
            } else {
                return 0
            }
        }
        this._animation['delay'] = value
    }

    duration(value) {
        if (!value) {
            if ('duration' in this._animation) {
                return this._animation['duration']
            } else {
                return 0
            }
        }
        this._animation['duration'] = value
    }

    operate(vis) {
        
    }
}

export default Action;