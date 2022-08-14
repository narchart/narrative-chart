import * as d3 from 'd3';
import Axis from './axis';

/**
 * @description The parent class for charts
 * 
 * @class
 */
class Chart {
    constructor() {
        this._container = document.createElement("div");
        this._svg = d3.select(this._container).append("svg")
        this._width = 0;
        this._height = 0;
        this._margin = {};
        this._axis = null;
        this._data = [];
        this._processedData = [];
        this._mark_animation = {};
        this._mark_style = {};
        this._animation = {};
        this._style = {};
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

    axis() {
        if (this._axis === null) {
            this._svg.append("g").attr("class", "axis");
            this._axis = new Axis(this._svg.select(".axis"))
        }
        return this._axis;
    }

    background() {
        //TODO: background image
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

    markStyle(value) {
        if (!value) {
            return this._mark_style;
        }
        this._mark_style = value;
    }

    markAnimation(value) {
        if (!value) {
            return this._mark_animation;
        }
        this._mark_animation = value;
    }

    style(value) {
        if (!value) {
            return this._style;
        }
        this._style = value;
    }

    animation(value) {
        if (!value) {
            return this._animation;
        }
        this._animation = value;
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

    visualize() { }

    encodeXY(animation = {}) { }

    encodeTheta(animation = {}) { }

    encodeColor(animation = {}) { }

    encodeSize(animation = {}) { }

    encodeShape(animation = {}) { }

    addEncoding(channel, field, animation = {}, axisStyle = {}) { }

    modifyEncoding(channel, field, animation = {}) { }

    removeEncoding(channel, field, animation = {}) { }
    
}

export default Chart;