import Pipeline from './pipeline';
import Translator from './translator';
import { Configure, AddAnnotation, AddChart, AddEncoding, ModifyEncoding, RemoveEncoding, DataProcess, AddTitle, AddCaption, AddImage, SaveChart} from './actions';

/**
 * @description A parser for parsing visuaization specifications
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
            let schemaspec = dataspec.schema;
            actionspecs = this.T.translate(factspec, schemaspec);
        }
        let pipeline = new Pipeline()
        let delay = 0;
        if (actionspecs.length > 0) {

            this.title_caption_in_actions = actionspecs.some(v => v.add === 'title' || v.add === 'caption')
            let config_in_actions = actionspecs.some(v => v.add === 'config')
            if(!config_in_actions){
                let action = new Configure({})
                pipeline.add(action)
            }
            for (const actionspec of actionspecs) {
                let actions_to_add = [];
                
                if (actionspec['add'] === 'group') {
                    let duration = 0;
                    let sync = false;
                    if ('animation' in actionspec) {
                        if ('duration' in actionspec['animation']) {
                            duration = actionspec['animation']['duration']
                        }
                        if ('sync' in actionspec['animation']) {
                            sync = actionspec['animation']['sync'];
                        }
                    }
                    let actions = this.parse_group(actionspec)
                    if (sync) {
                        for (let index = 0; index < actions.length; index++) {
                            let action = actions[index];
                            action.delay(delay);
                            action.duration(duration/actions.length);
                            actions_to_add.push(action);
                            delay += duration/actions.length;
                        }
                    } else {
                        for (const action of actions) {
                            action.delay(delay);
                            action.duration(duration);
                            actions_to_add.push(action);
                        }
                        delay += duration;
                    }
                    
                } else {
                    let action = this.parse_action(actionspec);
                    if (action) {
                        action.delay(delay);
                        actions_to_add.push(action);
                        delay += action.duration();
                    } 
                }
                for (const action of actions_to_add) {
                    pipeline.add(action)
                }
            }
        }
        return { dataspec, pipeline };
    }

    parse_action(actionspec) {
        let action;
        if ('add' in actionspec) {
            switch (actionspec['add']) {
                case 'config':
                    action = new Configure(actionspec);
                    break;
                case 'chart':
                    action = new AddChart(actionspec, this.title_caption_in_actions);
                    break;
                case 'annotation':
                    action = new AddAnnotation(actionspec);
                    break;
                case 'encoding':
                    action = new AddEncoding(actionspec);
                    break;
                case 'title':
                    action = new AddTitle(actionspec);
                    break;   
                case 'caption':
                    action = new AddCaption(actionspec);
                    break;
                case 'image':
                    action = new AddImage(actionspec);
                    break;
                default:
                    break;
            }
        } else if ('modify' in actionspec) {
            action = new ModifyEncoding(actionspec);
        } else if ('remove' in actionspec) {
            action = new RemoveEncoding(actionspec);
        } else if ('select' in actionspec || 'groupby' in actionspec || 'filter' in actionspec) {
            // data processing
            action = new DataProcess(actionspec);
        } else if ('save' in actionspec) {
            // save chart image
            action = new SaveChart(actionspec);
        }
        return action;
    }

    parse_group(spec) {
        let actions = [];
        let actionspecs = spec['actions'];
        for (const actionspec of actionspecs) {
            if (actionspec['add'] === 'group') {
                let group_actions = this.parse_group(actionspec);
                for (const action of group_actions) {
                    actions.push(action);
                }
            } else {
                let action = this.parse_action(actionspec);
                actions.push(action)
            }
        }
        return actions
    }
}

export default Parser;