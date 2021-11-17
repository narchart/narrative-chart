class Pipeline {
    constructor() {
        this._actions = []
    }

    add(action) {
        this._actions.push(action);
    }

    actions() {
        return this._actions;
    }

    operate(vis) {
        this.actions().forEach(action => {
            action.operate(vis);
        });
    }
}

export default Pipeline;