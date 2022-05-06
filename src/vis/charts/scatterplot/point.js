import Color from "../../visualization/color";
import Mark from '../mark';

const COLOR = new Color();

class Point extends Mark {
    constructor() {
        super();
        this._x = 0;
        this._y = 0;
        this._size = 0;
        this._color = COLOR.DEFAULT;
        this._opacity = 1;
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

    size(value) {
        if (!value) {
            return this._size;
        }
        this._size = value;
    }

    color(value) {
        if (!value) {
            return this._color;
        }
        this._color = value;
    }

    opacity(value) {
        if (!value) {
            return this._opacity;
        }
        this._opacity = value;
    }
}

export default Point;