import Pipeline from './pipeline';
import {AddAnnotation, AddChart} from './actions';

class Parser {
    constructor() {
        this._parsedData = []
    }

    parse(spec) {
        let dataspec = spec.data ? spec.data : {};
        let factspec = spec.fact ? spec.fact : {};
        let actionspecs = spec.actions ? spec.actions : [];
        let pipeline = new Pipeline()
        if (actionspecs.length > 0) {
            for (const actionspec of actionspecs) {
                // TODO: deal with actionspec
                let action = {}
                if ('add' in actionspec) {
                    switch (actionspec['add']) {
                        case 'chart':
                            action = new AddChart(actionspec);
                            break;
                        case 'annotation':
                            action = new AddAnnotation(actionspec);
                            break;
                    
                        default:
                            break;
                    }
                    
                }
                pipeline.add(action)
            }
        }
        return {dataspec, factspec, pipeline};
    }
}

export default Parser;