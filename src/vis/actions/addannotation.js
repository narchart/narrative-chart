import Action from './action';
import AnnotationType from '../visualization/annotationtype';
import {Label, Fill, Desaturate} from './annotations'

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
            case AnnotationType.LABEL:
                return new Label();
            case AnnotationType.FILL:
                return new Fill();
            case AnnotationType.DESATURATE:
                return new Desaturate()

            default:
                return new Fill();
        }
    }
}

export default AddAnnotation;