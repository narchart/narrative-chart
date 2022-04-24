import Pipeline from './pipeline';
import Translator from './translator';
import { Configure, AddAnnotation, AddChart, AddEncoding, ModifyEncoding, RemoveEncoding, DataProcess, AddAggregation, AddTitle, AddCaption} from './actions';

/**
 * @description A parser for parsing visuaization specifications (https://github.com/sdq/narrative-charts#visualization-specification)
 * 
 * @class
 */
class Parser {
    constructor() {
        this._parsedData = [];
        this.T = new Translator();
    }

    /**
     * @description Parse visualization spoecification into a data spec and a pipeline pf actions.
     * @param {Object} spec The input visualization specification.
     * @returns {{ dataspec: Object, pipeline: Pipeline }}
     */
    parse(spec) {
        let dataspec = spec.data ? spec.data : {};
        let actionspecs = spec.actions ? spec.actions : [];
        if ('fact' in spec) {
            let factspec = spec.fact;
            actionspecs = this.T.translate(factspec);
        }
        let pipeline = new Pipeline()
        if (actionspecs.length > 0) {

            let title_caption_in_actions = actionspecs.some(v => v.add === 'title' || v.add === 'caption')
            for (const actionspec of actionspecs) {
                let actions_to_add = [];
                if ('add' in actionspec) {
                    switch (actionspec['add']) {
                        case 'config':
                            actions_to_add.push(new Configure(actionspec));
                            break;

                        case 'chart':
                        // If we needs to add titles or captions to the charts, reserve enough place when initialize the charts. 
                            actionspec.leave_space = title_caption_in_actions
                            actions_to_add.push(new AddChart(actionspec));
                            break;
                        case 'annotation':
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
        return { dataspec, pipeline };
    }
}

export default Parser;