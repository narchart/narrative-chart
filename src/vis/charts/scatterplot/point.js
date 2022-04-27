import Color from "../../visualization/color";

class Point {
    constructor() {
        this._id = 0;
        this._x = 0;
        this._y = 0;
        this._size = 0;
        this._color = Color().DEFAULT;
        this._opacity = 1;
    }

    id(value) {
        if (!value) {
            return this._id;
        }
        this._id = value;
    }

    data(value) {
        if (!value) {
            return this._dataItem;
        }
        Object.entries(value).forEach(
            ([key, value]) => this[key] = value
        )
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