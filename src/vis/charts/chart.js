import * as d3 from 'd3';
import Size from '../visualization/size';

class Chart {
    constructor() {
        this._container = document.createElement("div");
        this._svg = d3.select(this._container).append("svg")
        this._size = Size.LARGE;
        this._width = 0;
        this._height = 0;
        this._data = [];
        this._factdata = [];
        this._subspace = [];
        this._measure = [];
        this._breakdown = [];
        this._focus = [];
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

    size(value) {
        if (!value) {
            return this._size;
        }
        this._size = value;
    }

    width(value) {
        if (!value) {
            if (this._width !== 0 && this._width !== '') {
                return this._width;
            } else {
                switch (this.size()) {
                    case Size.LARGE:
                        return 640;
                    case Size.WIDE:
                        return 560;
                    case Size.MIDDLE:
                        return 360;
                    case Size.SMALL:
                        return 235;
                    default:
                        return 640;
                }
            }
        }
        this._width = value;
    }

    height(value) {
        if (!value) {
            if (this._height !== 0 && this._height !== '') {
                return this._height;
            } else {
                switch (this.size()) {
                    case Size.LARGE:
                        return 640;
                    case Size.WIDE:
                        return 220;
                    case Size.MIDDLE:
                        return 200;
                    case Size.SMALL:
                        return 150;
                    default:
                        return 640;
                }
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

    visualize() {}

    drawAxis() {}

    encodeXY() {}

    encodeColor() {}

    encodeSize() {}

    encodeShape() {}

}

export default Chart;