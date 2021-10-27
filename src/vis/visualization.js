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
        pipeline.actions().forEach(action => {
            action.operate(this);
        });
        // for (const action in pipeline.actions()) {
        //     console.log(action)
        //     action.operate(this.chart());
        // }
    }

    // visualize(spec) {
    //     this._mark = spec.mark;
    //     let factdata = this.factdata();
    //     let fact = this.fact();
    //     this.chart(this._mark2chart(spec.mark));
    //     // let chart = this._type2chart(spec.type);
    //     let chart = this.chart();
    //     chart.size(this._size);
    //     chart.height(this._height);
    //     chart.width(this._width);
    //     chart.data(this._data);
    //     chart.factdata(factdata);
    //     chart.subspace(fact.subspace);
    //     chart.measure(fact.measure);
    //     chart.breakdown(fact.breakdown);
    //     chart.focus(fact.focus);
    //     chart.container(this._container);
    //     chart.visualize();
    // }

    // _mark2chart(type) {
    //     switch (type) {
    //         case MarkType.POINT:
    //             return new Scatterplot();
    //         case MarkType.BAR:
    //             return new BarChart();
    //         case MarkType.LINE:
    //             return new LineChart();
    //         default:
    //             return new Scatterplot();
    //     }
    // }
}

export default Visualization;