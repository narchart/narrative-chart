import MarkType from './visualization/marktype';
import Size from './visualization/size';

class Visualization {
    constructor() {
        this._container = "";
        this._data = [];
        this._fact = {};
        this._factdata = [];
        this._size = Size.LARGE;
        this._width = 0;
        this._height = 0;
        this._mark = MarkType.POINT;
        this._chart = {};
        this._caption = "";
    }

    container(value) {
        this._container = value;
    }

    size(value) {
        if (!value) {
            return this._size;
        }
        this._size = value;
    }

    width(value) {
        if (!value) {
            return this._width;
        }
        this._width = value;
    }

    height(value) {
        if (!value) {
            return this._height;
        }
        this._height = value;
    }

    data(value) {
        if (!value) {
            return this._data;
        }
        this._data = value;
    }

    factdata(value) {
        if (!value) {
            return this._factdata;
        }
        this._factdata = value;
    }

    fact(value) {
        if (!value) {
            return this._fact;
        }
        this._fact = value;
    }

    chart(value) {
        if (!value) {
            return this._chart;
        }
        this._chart = value;
    }

    caption(value) {
        if (!value) {
            return this._caption;
        }
        this._caption = value;
    }

    run(pipeline) {
        pipeline.operate(this);
    }
}

export default Visualization;