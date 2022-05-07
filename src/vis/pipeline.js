import { AddAnnotation } from './actions';

class Pipeline {
    constructor() {
        this._actions = []
        this._timeouts = []
    }

    add(action) {
        this._actions.push(action);
    }

    actions() {
        return this._actions;
    }

    operate(vis) {
        let delayTime = 0;
        this.actions().forEach(action => {
            if ('delay' in action.animation()) {
                delayTime = action.animation()['delay']
            } else {
                delayTime = 0
            }
            if (action instanceof AddAnnotation) { 
                delayTime += 100 // TODO: add a small time period for waiting movement of marks (fix in the future)
            }
            this._timeouts.push(setTimeout(function(){
                // Code to run after the pause
                action.operate(vis);
            }, delayTime));
        });
    }

    stop() {
        for (var i = 0; i < this._timeouts.length; i++) {
            clearTimeout(this._timeouts[i]);
        }
    }
}

export default Pipeline;