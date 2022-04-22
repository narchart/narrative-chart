import MarkType from '../visualization/marktype';
import Action from './action';
import { BarChart, LineChart, Scatterplot, Unitvis } from '../charts';

class AddChart extends Action {
    // mark represents chart type, leave_space represents if needs to reserve space for titles or captions in charts
    constructor(spec) {
        super(spec);
        this._mark = spec.mark;
        this._leave_space = spec.leave_space
    }

    operate(vis) {

        vis._mark = this._mark;
        vis.chart(this._mark2chart(this._mark));
        // let chart = this._type2chart(spec.type);
        let chart = vis.chart();
        chart.height(vis._height);
        chart.width(vis._width);
        chart.margin(this._leave_space ? 
            {
                "top": 70,
                "right": 20,
                "bottom": 90,
                "left": 60
            }:{
            "top": 10,
            "right": 10,
            "bottom": 50,
            "left": 50
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
            case MarkType.LINE:
                return new LineChart();
            case MarkType.UNIT:
                return new Unitvis();
            default:
                return new Scatterplot();
        }
    }
}

export default AddChart;