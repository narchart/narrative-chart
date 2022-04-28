import Color from '../visualization/color';
import Action from './action';

class Configure extends Action {

    constructor(spec) {
        super(spec);
        this._mode = "light";
        this._emotion = "none";
        this._background_image = "";
        if ('mode' in spec) { this._mode = spec.mode; }
        if ('emotion' in spec) { this._emotion = spec.emotion; }
        if ('background_image' in spec) { this._background_image = spec.background_image; }
    }

    operate(vis) {
        const color = new Color();
        color.setColor(this._mode, this._emotion);
    }

}

export default Configure