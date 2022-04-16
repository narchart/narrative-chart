import Pipeline from './pipeline';
import { AddAnnotation, AddChart, AddEncoding, ModifyEncoding, RemoveEncoding, DataProcess, AddAggregation, AddTitle, AddCaption} from './actions';

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
                let actions_to_add = [];
                if ('add' in actionspec) {
                    switch (actionspec['add']) {
                        case 'chart':
                            actions_to_add.push(new AddChart(actionspec));
                            break;
                        case 'annotation':
                            if (!('target' in actionspec)) {
                                actionspec['target'] = focus_target // default is focus
                            }
                            if (('method' in actionspec) && Array.isArray(actionspec['method'])) {
                                for (const submethod of actionspec['method']) {
                                    let subactionspec = { ...actionspec }; // copy a dict
                                    subactionspec['method'] = submethod
                                    let action = new AddAnnotation(subactionspec);
                                    actions_to_add.push(action);
                                }
                            } else {
                                let action = new AddAnnotation(actionspec);
                                actions_to_add.push(action);
                            }
                            break;
                        case 'encoding':
                            actions_to_add.push(new AddEncoding(actionspec));
                            break;
                        case 'aggregation':
                            actions_to_add.push(new AddAggregation(actionspec));
                            break;     
                        case 'title':
                            actions_to_add.push(new AddTitle(actionspec)); 
                            break;   
                        case 'caption':
                            actions_to_add.push(new AddCaption(actionspec)); 
                            break;              
                        default:
                            break;
                    }
                } else if ('modify' in actionspec) {
                    actions_to_add.push(new ModifyEncoding(actionspec));
                } else if ('remove' in actionspec) {
                    actions_to_add.push(new RemoveEncoding(actionspec));
                }
                else if ('select' in actionspec || 'groupby' in actionspec || 'filter' in actionspec) {
                    // data processing
                    actions_to_add.push(new DataProcess(actionspec));
                }
                for (const action of actions_to_add) {
                    pipeline.add(action)
                
                }
            }
        }
        return { dataspec, factspec, pipeline };
    }
}

export default Parser;