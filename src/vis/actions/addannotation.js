import Action from './action';
import AnnotationType from '../visualization/annotationtype';
import {Label, Fill} from './annotations'

class AddAnnotation extends Action {
    constructor(spec) {
        super(spec);
        this._method = spec.method;
        this._target = spec.target;
    }

    operate(vis) {
        let annotator = this._type2annotator(this._method)
        let chart = vis.chart();
        let target = this._target;
        annotator.annotate(chart, target);
    }

    _type2annotator(type) {
        switch (type) {
            case AnnotationType.Label:
                return new Label();
            case AnnotationType.Fill:
                return new Fill();

            default:
                return new Fill();
        }
    }
}

export default AddAnnotation;