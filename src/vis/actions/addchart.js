import MarkType from '../visualization/marktype';
import Action from './action';
import { BarChart, LineChart, Scatterplot, Unitvis, PieChart, AreaChart, HBarChart,TreeMap } from '../charts';


class AddChart extends Action {
    // mark represents chart type, leave_space represents if needs to reserve space for titles or captions in charts
    constructor(spec, leave_space) {
        super(spec);
        let mark = spec.mark
        this._mark = mark['type'];
        this._mark_animation = {};
        if ('animation' in mark) { this._mark_animation = mark.animation; }
        this._mark_style = {};
        if ('style' in mark) { this._mark_style = mark.style; }
        this._animation = {};
        if ('animation' in spec) { this._animation = spec.animation; }
        this._style = {};
        if ('style' in spec) { this._style = spec.style; }
        this._leave_space = leave_space
    }

    operate(vis) {

        vis._mark = this._mark;
        vis.chart(this._mark2chart(this._mark));
        // let chart = this._type2chart(spec.type);
        let chart = vis.chart();
        chart.height(vis._height);
        chart.width(vis._width);
        chart.margin(vis._margin);
        chart.markAnimation(this._mark_animation);
        chart.markStyle(this._mark_style);
        chart.animation(this._animation);
        chart.style(this._style);

        let Hscaleratio
        let Wscaleratio

        if (vis._mark === "unit") {
            Hscaleratio = Math.min(vis._height / 640, vis._width / 640)
            Wscaleratio = Math.min(vis._height / 640, vis._width / 640)
        } else {
            Hscaleratio = vis._height / 640
            Wscaleratio = vis._width / 640
        }


        chart.margin(this._leave_space ?
            {
                "top": vis._margin.top ? vis._margin.top : 130 * Hscaleratio,
                "right": vis._margin.right ? vis._margin.right : 20 * Wscaleratio,
                "bottom": vis._margin.bottom ? vis._margin.bottom : 30 * Hscaleratio,
                "left": vis._margin.left ? vis._margin.left : 60 * Wscaleratio
            } : {
                "top": vis._margin.top ? vis._margin.top : 20 * Hscaleratio,
                "right": vis._margin.right ? vis._margin.right : 10 * Wscaleratio,
                "bottom": vis._margin.bottom ? vis._margin.bottom : 30 * Hscaleratio,
                "left": vis._margin.left ? vis._margin.left : 50 * Wscaleratio
            })

        chart.data(vis._data);
        chart.processedData(vis._processedData)
        chart.container(vis._container);
        chart.visualize();
    }

    _mark2chart(type) {
        switch (type) {
            case MarkType.POINT:
                return new Scatterplot();
            case MarkType.BAR:
                return new BarChart();
            case MarkType.HBAR:
                return new HBarChart();
            case MarkType.LINE:
                return new LineChart();
            case MarkType.UNIT:
                return new Unitvis();
            case MarkType.ARC:
                return new PieChart();
            case MarkType.AREA:
                return new AreaChart();
            case MarkType.TREE:
                return new TreeMap();
            default:
                return new Scatterplot();
        }
    }
}

export default AddChart;