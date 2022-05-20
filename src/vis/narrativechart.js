import DataLoader from './dataloader';
import Visualization from './visualization';
import Parser from './parser';

/**
 * @description main class for narrative chart
 * 
 * @class
 */
class NarrativeChart {
    constructor() {
        this._container = document.createElement("div");
        this._loader = new DataLoader();
        this._vis = new Visualization();
        this._spec = {};
        this._shouldShowCaption = false;
        this.parser = new Parser();
    }

    container(value) {
        if (!value) {
            return this._container;
        }
        this._container = value;
    }

    load(spec) {
        this._spec = spec;
    }

    generate() {
        // STEP 0: parse specification
        let spec = this._spec;
        let { dataspec, pipeline } = this.parser.parse(spec);

        
        this._loader.load(dataspec) // STEP 1: data
            .then((loaded) => { // STEP 2: generate visualization
                this._vis.container(this.container());
                this._vis.data(loaded.data());
                this._vis.pipeline(pipeline);
                this._vis.run();
                // this._vis.visualize(chartspec);
            })
            .catch((reason) => {
                console.log(reason);
            })
    }

    stop() {
        this._vis.stop();
    }
}

export default NarrativeChart;