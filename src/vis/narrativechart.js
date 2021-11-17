import DataLoader from './dataloader';
import Fact from './fact';
import Visualization from './visualization';
import Parser from './parser';
import Sentencer from './sentencer';

class NarrativeChart {
    constructor() {
        this._container = document.createElement("div");
        this._paragraph = document.createElement("p");
        this._loader = new DataLoader();
        this._fact = new Fact();
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

    paragraph(value) {
        if (!value) {
            return this._paragraph;
        }
        this._paragraph = value;
    }

    load(spec) {
        this._spec = spec;
    }

    shouldShowCaption(value) {
        if (!value) {
            return this._shouldShowCaption;
        }
        this._shouldShowCaption = value;
    }

    generate() {
        // STEP 0: parse specification
        let spec = this._spec;
        let { dataspec, factspec, pipeline } = this.parser.parse(spec);

        // STEP 1: data
        this._loader.load(dataspec)
            .then((loaded) => {
                // STEP 2: fact
                this._fact.data(loaded.data());
                this._fact.schema(loaded.schema());
                return this._fact.process(factspec);
            })
            .then((fact) => {
                // STEP 3: generate caption and setup visualization
                this._vis.container(this.container());
                this._vis.data(fact.data());
                this._vis.fact(fact.fact());
                this._vis.factdata(fact.factdata());
                // TODO: deal with actions
                try {
                    let caption = Sentencer(fact.fact());
                    this._vis.caption(caption);
                    // console.log("Caption: "+caption);
                } catch (error) {
                    console.log(error);
                }
                this._vis.run(pipeline)
                // this._vis.visualize(chartspec);
            })
            .catch((reason) => {
                console.log(reason);
            })
    }
}

export default NarrativeChart;