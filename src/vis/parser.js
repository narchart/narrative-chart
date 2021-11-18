import Pipeline from './pipeline';
import {AddAnnotation, AddChart} from './actions';

class Parser {
    constructor() {
        this._parsedData = []
    }

    parse(spec) {
        let dataspec = spec.data ? spec.data : {};
        let factspec = spec.fact ? spec.fact : {};
        let focus_target = 'focus' in factspec ? factspec['focus'] : []
        let actionspecs = spec.actions ? spec.actions : [];
        let pipeline = new Pipeline()
        if (actionspecs.length > 0) {
            for (const actionspec of actionspecs) {
                // TODO: deal with actionspec
                let actions_to_add = []
                if ('add' in actionspec) {
                    switch (actionspec['add']) {
                        case 'chart':
                            let action = new AddChart(actionspec);
                            actions_to_add.push(action);
                            break;
                        case 'annotation':
                            if (!('target' in actionspec)) {
                                actionspec['target'] = focus_target // default is focus
                            }
                            if (('method' in actionspec) && Array.isArray(actionspec['method'])) {
                                for (const submethod of actionspec['method']) {
                                    let subactionspec = {...actionspec}; // copy a dict
                                    subactionspec['method'] = submethod
                                    let action = new AddAnnotation(subactionspec);
                                    actions_to_add.push(action);
                                }
                            } else {
                                let action = new AddAnnotation(actionspec);
                                actions_to_add.push(action);
                            }
                            break;
                    
                        default:
                            break;
                    }
                    
                }
                for (const action of actions_to_add) {
                    pipeline.add(action)
                }
            }
        }
        return {dataspec, factspec, pipeline};
    }
}

export default Parser;