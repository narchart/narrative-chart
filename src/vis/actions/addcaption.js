import Action from './action'
import {Fade} from './caption'
import CaptionType from '../visualization/captiontype'

class AddCaption extends Action {
    constructor(spec) {
        super(spec);
        if ('style' in spec) {
            this._style = spec.style;
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
        let Captioner = this._type2caption('fade')
        let style = this._style;
        let animation = this._animation;
        Captioner.makecaption(vis, style, animation);
    }

    _type2caption(type) {
        switch (type) {
            case CaptionType.FADE:
                return new Fade()
            default:
                return new Fade();
        }
    }
}

export default AddCaption;