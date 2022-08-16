import * as d3 from 'd3';
import { AddAnnotation } from './actions';

/**
 * @description A pipeline to excute actions
 * 
 * @class
 */
class Pipeline {
    constructor() {
        this._actions = []
        this._timers = []
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
            }
            if (action instanceof AddAnnotation) { 
                delayTime += 200 // waiting 0.2 second before showing annotation movement of marks (fix in the future)
            }
            this._timers.push(d3.timeout(function(){
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
        for (var i = 0; i < this._timers.length; i++) {
            // clearTimeout(this._timers[i]);
            this._timers[i].stop();
        }
    }
}

export default Pipeline;