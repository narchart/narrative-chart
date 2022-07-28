import Color from '../visualization/color';
import Background from '../visualization/background';
import Action from './action';

class Configure extends Action {

    constructor(spec) {
        super(spec);
        this._mode = "light";
        this._emotion = "none";
        this._background_image = "";
        this._width = 640;
        this._height = 640;
        this._margin = {};
        if ('mode' in spec) { this._mode = spec.mode; }
        if ('emotion' in spec) { this._emotion = spec.emotion; }
        if ('background-image' in spec) { this._background_image = spec["background-image"]; }
        if ('background-color' in spec) { this._background_color = spec["background-color"]; }
        if ('width' in spec) { this._width = spec["width"]; }
        if ('height' in spec) { this._height = spec["height"]; }
        if ('margin' in spec) { this._margin = spec["margin"]; }
    }

    operate(vis) {
        const color = new Color();
        color.setColor(this._mode, this._emotion);

        const background = new Background();

        background.setBackgroundColor(this._background_color)

        background.setBackgroundImage(this._background_image)

        if (this._width) { vis.width(this._width) }
        if (this._height) { vis.height(this._height) }
        if (this._margin) { vis.margin(this._margin) }
    }

}

export default Configure