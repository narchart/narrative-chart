import * as d3 from 'd3';

class Chart {
    constructor() {
        this._container = document.createElement("div");
        this._svg = d3.select(this._container).append("svg")
        this._width = 0;
        this._height = 0;
        this._data = [];
        this._processedData = [];
        this._margin = {};

        // this._factdata = [];
        // this._subspace = [];
        // this._measure = [];
        // this._breakdown = [];
        // this._focus = [];
    }

    container(value) {
        if (!value) {
            d3.select(this._container).selectAll("*").remove();
            return this._container;
        }
        this._container = value;
    }

    svg() {
        return this._svg;
    }

    margin(value) {
        if (!value) {
            if (this._margin !== 0 && this._margin !== '') {
                return this._margin;
            } else {
                return {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                };
            }
        }
        this._margin = value;
    }


    width(value) {
        if (!value) {
            if (this._width !== 0 && this._width !== '') {
                return this._width;
            } else {
                return 640;
            }
        }
        this._width = value;
    }

    height(value) {
        if (!value) {
            if (this._height !== 0 && this._height !== '') {
                return this._height;
            } else {
                return 640;
            }
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

    processedData(value) {
        if (!value && !this._processedData) {
            return this._data;
        }
        if (!value) {
            return this._processedData;
        }
        this._processedData = value;
    }

    subspace(value) {
        if (!value) {
            return this._subspace;
        }
        this._subspace = value;
    }

    measure(value) {
        if (!value) {
            return this._measure;
        }
        this._measure = value;
    }

    breakdown(value) {
        if (!value) {
            return this._breakdown;
        }
        this._breakdown = value;
    }

    focus(value) {
        if (!value) {
            return this._focus;
        }
        this._focus = value
    }


    visualize() { }

    drawAxis() { }

    encodeXY(animation = {}) { }

    encodeColor(animation = {}) { }

    encodeSize(animation = {}) { }

    encodeShape(animation = {}) { }

    addEncoding(channel, field, animation = {}) { }

    modifyEncoding(channel, field, animation = {}) { }

    removeEncoding(channel, field, animation = {}) { }

}

export default Chart;