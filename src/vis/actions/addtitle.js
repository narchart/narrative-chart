import Action from './action';
import TitleType from '../visualization/titletype';
import {Fade} from './title'

class AddTitle extends Action {
    constructor(spec) {
        super(spec);

        if ('style' in spec) {
            this._style = spec.style;
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
        let titler = this._type2title('fade')
        let style = this._style;
        let animation = this._animation;
        titler.maketitle(vis, style, animation);
    }

    _type2title(type) {
        switch (type) {
            case TitleType.FADE:
                return new Fade()
            default:
                return new Fade();
        }
    }
}

export default AddTitle;