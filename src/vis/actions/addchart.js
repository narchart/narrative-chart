import MarkType from '../visualization/marktype';
import Action from './action';
import { BarChart, LineChart, Scatterplot, Unitvis } from '../charts';

class AddChart extends Action {
    constructor(spec) {
        super(spec);
        this._mark = spec.mark;
    }

    operate(vis) {
        
        vis._mark = this._mark;
        let factdata = vis.factdata();
        let fact = vis.fact();
        vis.chart(this._mark2chart(this._mark));
        // let chart = this._type2chart(spec.type);
        let chart = vis.chart();
        chart.height(vis._height);
        chart.width(vis._width);
        chart.data(vis._data);
        chart.factdata(factdata);
        chart.processedData(vis._processedData)
        chart.subspace(fact.subspace);
        chart.measure(fact.measure);
        chart.breakdown(fact.breakdown);
        chart.focus(fact.focus);
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