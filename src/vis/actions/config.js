import Color from '../visualization/color';
import Background from '../visualization/background';
import Action from './action';

class Configure extends Action {

    constructor(spec) {
        super(spec);
        this._mode = "light";
        this._emotion = "none";
        this._background_image = "";
        if ('mode' in spec) { this._mode = spec.mode; }
        if ('emotion' in spec) { this._emotion = spec.emotion; }
        if ('background-image' in spec) { this._background_image = spec["background-image"]; }
        if ('background-color' in spec) { this._background_color = spec["background-color"]; }
    }

    operate(vis) {
        const color = new Color();
        color.setColor(this._mode, this._emotion);

        const background = new Background();
        if (this._background_color){
            background.setBackgroundColor(this._background_color)
        }
        
        if (this._background_image){
            background.setBackgroundImage(this._background_image)
        }

        console.log(background.Background_Image);

    }

}

export default Configure