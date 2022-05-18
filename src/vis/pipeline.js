import { AddAnnotation } from './actions';

/**
 * @description A pipeline to excute actions
 * 
 * @class
 */
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

    /**
     * @description Operate visualization with a sequence of actions.
     * @param {Visualization} visualization object
     * @returns {void}
     */
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

    /**
     * @description Stop animation.
     * @param {void}
     * @returns {void}
     */
    stop() {
        for (var i = 0; i < this._timeouts.length; i++) {
            clearTimeout(this._timeouts[i]);
        }
    }
}

export default Pipeline;