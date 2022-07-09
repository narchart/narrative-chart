import MarkType from './visualization/marktype';

/**
 * @description A visuaization class
 *
 * @class
 */
class Visualization {
    constructor() {
        this._container = "";
        this._data = [];
        this._processedData = [];
        this._width = 0;
        this._height = 0;
        this._mark = MarkType.POINT;
        this._chart = {};
        this._pipeline = null;
        this._margin = {};
    }

    container(value) {
        if (!value) {
            return this._container;
        }
        this._container = value;
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

    margin(value) {
        if (!value) {
            return this._margin;
        }
        this._margin = value;
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