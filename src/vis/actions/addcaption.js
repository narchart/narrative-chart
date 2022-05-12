import Action from './action'
import {Caption} from './caption'

class AddCaption extends Action {
    constructor(spec) {
        super(spec);
        this._style = {}
        if ('style' in spec) {
            this._style = spec.style;
        }
        if ('text' in spec) {
            this._style["text"] = spec.text;
        }
        if ('animation' in spec) {
            this._animation = spec.animation
            if (!this._animation.delay)
                this._animation.delay = 0;

            if (!this._animation.duration)
                this._animation.duration = -1;
        } else {
            this._animation = { "delay": 0, "duration": -1 }
        }
    }

    operate(vis) {
        let Captioner = new Caption()
        let style = this._style;
        let animation = this._animation;
        Captioner.makecaption(vis, style, animation);
    }

}

export default AddCaption;