import Action from './action';
import {Title} from './title'

class AddTitle extends Action {
    constructor(spec) {
        super(spec);
        this._style = {};
        if ('style' in spec) {
            this._style = spec.style;
        }
        if ('text' in spec) {
            this._style["text"] = spec.text;
        }

        if ('animation' in spec) {
            this._animation = spec.animation;
            if (!this._animation.delay)
                this._animation.delay = 0;

            if (!this._animation.duration)
                this._animation.duration = -1;
        } else {
            this._animation = { "delay": 0, "duration": -1 }
        }
    }

    operate(vis) {
        let titler = new Title()
        let style = this._style;
        let animation = this._animation;
        titler.maketitle(vis, style, animation);
    }

}

export default AddTitle;