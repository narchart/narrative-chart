import Color from '../../visualization/color';
import Mark from '../mark';

const COLOR = new Color();

class Bubble extends Mark {
    constructor() {
        super();
        this._x = 0;
        this._y = 0;
        this._radius = 0;
        this._color = COLOR.DEFAULT;
        this._visible = "1";
        this._opacity = 1;
        this._unitgroup = {};
    }

    unitgroup(key, value) {
        if (!value && !key) {
            return this._unitgroup;
        }
        this._unitgroup[key] = value;
    }


    x(value) {
        if (!value) {
            return this._x;
        }
        this._x = value;
    }


    y(value) {
        if (!value) {
            return this._y;
        }
        this._y = value;
    }

    radius(value) {
        if (!value) {
            return this._radius;
        }
        this._radius = value;
    }

    color(value) {
        if (!value) {
            return this._color;
        }
        this._color = value;
    }

    visible(value) {
        if (!value) {
            return this._visible;
        }
        this._visible = value;
    }

    opacity(value) {
        if (!value) {
            return this._opacity;
        }
        this._opacity = value;
    }
}

export default Bubble;
