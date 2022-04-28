import Color from '../../visualization/color';

const COLOR = new Color();

class Unit {
    constructor() {
        this._id = 0;
        this._x = 0;
        this._y = 0;
        this._radius = 0;
        this._color = COLOR.DEFAULT;
        this._visible = "1";
        this._opacity = 1;
        this._unitgroup = {};
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

export default Unit;