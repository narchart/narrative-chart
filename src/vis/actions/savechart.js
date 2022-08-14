import Action from './action';
import { saveSvgAsPng } from "save-svg-as-png";

class SaveChart extends Action {
    constructor(spec) {
        super(spec);
        this._name = 'name' in spec ? spec.name : 'chart'
        this._format = 'format' in spec ? spec.format : 'png'
    }

    operate(vis) {
        new Promise(async () => {
            try {
                let chart = vis.chart();
                let node = chart.svg().node()
                const filename = this._name+'.'+this._format;
                await saveSvgAsPng(node, filename);
            } catch (error) {
                console.log(error)
            }
        })
    }
}

export default SaveChart;