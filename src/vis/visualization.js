import MarkType from './visualization/marktype';
import Size from './visualization/size';

class Visualization {
    constructor() {
        this._container = "";
        this._data = [];
        this._processedData = [];
        this._size = Size.LARGE;
        this._width = 0;
        this._height = 0;
        this._mark = MarkType.POINT;
        this._chart = {};
        this._caption = "";
        this._pipeline = null;
    }

    container(value) {
        if (!value) {
            return this._container;
        }
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
        this._processedData = value;
    }

    processedData(value) {
        if (!value) {
            return this._processedData;
        }
        this._processedData = value;
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

    pipeline(value) {
        if (!value) {
            return this._pipeline;
        }
        this._pipeline = value;
    }

    run() {
        this.pipeline().operate(this);
    }

    stop() {
        if (this.pipeline()) {
            this.pipeline().stop();
        }
    }
}

export default Visualization;