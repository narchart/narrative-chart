/**
 * @description A translator for parsing visuaization specifications (https://github.com/sdq/narrative-charts#visualization-specification)
 * 
 * @class
 */
class Translator {

    /**
     * @description Fact-to-Actions translation
     * @param {Object} factspec Fact specification (type, subspace, measure, breakdown, focus).
     * @returns {Array} actionspecs Actions specification,
     */
     translate(factspec) {
        let actionspecs = []
        /* Step1: measure, breakdown, subspace => Data processing */

        /* Step2: type, measure, breakdown => Chart type */

        /* Step3: Chart, measure, breakdown => Visual encodings */

        /* Step4: type, focus => Annotation */
        
        return actionspecs
    }
}

export default Translator;