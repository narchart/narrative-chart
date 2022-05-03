import FactType from "./visualization/facttype";
import MarkType from "./visualization/marktype";
import FieldType from "./visualization/fieldtype";
import AnnotationType from './visualization/annotationtype';
import Color from "./visualization/color";
import { getTitle } from "./sentencer/index"
import getCaption from "./sentencer/index"

/**
 * @description A translator for parsing visuaization specifications (https://github.com/sdq/narrative-charts#visualization-specification)
 * 
 * @class
 */
class Translator {

    /**
     * @description Fact-to-Actions translation
     * @param {Object} factspec Fact specification (type, subspace, measure, breakdown, focus).
     * @param {Object} schemaspec Data schema specification.
     * @returns {Array} actionspecs Actions specification,
     */
     translate(factspec, schemaspec) {
        let actionspecs = []
        let animationDuration = 1000;

        /* Step1: measure, breakdown, subspace => Data processing */
        let selectspec = [];
        let groupbyspec = factspec.breakdown;
        let filterspec = factspec.subspace;
        selectspec = groupbyspec.concat(factspec.measure);
        
        let dataprespec = {
            "select": selectspec,
            "groupby": groupbyspec,
            "filter": filterspec
        };
        actionspecs.push(dataprespec);

        /* Step2: type, measure, breakdown => Chart type */
        let breakdown = factspec.breakdown;
        let measure = factspec.measure;
        let type = factspec.type;
        let breakdownSchema = schemaspec.filter(s => s.field === breakdown[0].field)
        let chartTypes;
        let rules = this.fact2visRules;
        chartTypes = rules.filter(x => x.fact === type);
        chartTypes = chartTypes.filter(x => x.measureLen <= measure.length);
        chartTypes = chartTypes.filter(x => {
            if(x.breakdownType.length === 0) {
                return true
            }
            else{
                if (breakdown){
                    return x.breakdownType.indexOf(breakdownSchema[0].type) !== -1
                }
                else {
                    return false;
                }
            }
        })
        let chioce = chartTypes[this.getChoice(chartTypes.length)]
        let chart = chioce.chart;

        /* Step3: fact => Title, Caption */
        let titlespec;
        let titleText;
        titleText = getTitle(factspec);
        titlespec = {
            "add": "title",
            "style": {
                "text": titleText
            }
        }
        
        let captionspec;
        let captionText;
        if(chart === MarkType.LINE){
            factspec.breakdown[0] = {
                "field": factspec.breakdown[0].field,
                "type": FieldType.TEMPORAL
            }
        }
        captionText = getCaption(factspec);
        captionspec = {
            "add": "caption",
            "style": {
                "text": captionText
            }
        }
        
        /* Step4: Chart, measure, breakdown => Visual encodings */
        let chartMark;
        let markspec;
        let encodingspec;
        switch(chart) {
            case MarkType.POINT:
                chartMark = "point";
                markspec = {
                    "add": "chart",
                    "mark": chartMark
                }
                actionspecs.push(markspec);
                actionspecs.push(titlespec);
                actionspecs.push(captionspec);
                encodingspec = this.getScatterplotSpec(schemaspec, breakdown, measure)
                for(let i=0; i<encodingspec.length; i++){
                    actionspecs.push(encodingspec[i]);
                }
                break;
            case MarkType.BAR:
                chartMark = "bar";
                markspec = {
                    "add": "chart",
                    "mark": chartMark
                }
                actionspecs.push(markspec);
                actionspecs.push(titlespec);
                actionspecs.push(captionspec);
                encodingspec = this.getBarChartSpec(schemaspec, breakdown, measure, type)
                for(let i=0; i<encodingspec.length; i++){
                    actionspecs.push(encodingspec[i]);
                }
                break;
            case MarkType.LINE:
                chartMark = "line";
                markspec = {
                    "add": "chart",
                    "mark": chartMark
                }
                actionspecs.push(markspec);
                actionspecs.push(titlespec);
                actionspecs.push(captionspec);
                encodingspec = this.getLineChartSpec(schemaspec, breakdown, measure)
                for(let i=0; i<encodingspec.length; i++){
                    actionspecs.push(encodingspec[i]);
                }
                break;
            default:
                console.log("wrong ChartType")
                break
        }

        /* Step5: type, focus => Annotation */
        let focus = factspec.focus
        let needFocus = chioce.needFocus;
        if((focus.length !==0) || (!needFocus)){
            let annoTypeRule;
            annoTypeRule = rules.filter(x => x.fact === type);
            annoTypeRule = annoTypeRule.filter(x => x.chart === chart);
            let annoTypes = annoTypeRule[0].annotationType;
            let annotation;
            let annoMethod;
            let annospec;
            const COLOR = new Color();
            let fillColor
            if (type === FactType.Difference){
                fillColor = COLOR.DEFAULT;
            }
            else{
                fillColor = COLOR.ANNOTATION;
            }
            for(let i=0; i<annoTypes.length; i++){
                annotation = annoTypes[i];
                switch(annotation){
                    case AnnotationType.ARROW:
                    case AnnotationType.CIRCLE:
                    case AnnotationType.CONTOUR:
                    case AnnotationType.GLOW:
                        annoMethod = annotation;
                        for(let j=0; j<focus.length; j++){
                            annospec = {
                                "add": "annotation",
                                "method": annoMethod,
                                "target": [focus[j]],
                                "style": {
                                    "color": COLOR.ANNOTATION
                                },
                                "animation": {
                                    "duration": animationDuration
                                }
                            }
                            actionspecs.push(annospec);
                        }
                        break;
                    case AnnotationType.FILL:
                        annoMethod = annotation;
                        for(let j=0; j<focus.length; j++){
                            annospec = {
                                "add": "annotation",
                                "method": annoMethod,
                                "target": [focus[j]],
                                "style": {
                                    "color": fillColor
                                },
                                "animation": {
                                    "duration": animationDuration
                                }
                            }
                            actionspecs.push(annospec);
                        }
                        break;
                    case AnnotationType.REFERENCE:
                        annoMethod = annotation;
                        if(focus.length === 2){
                            annospec = {
                                "add": "annotation",
                                "method": annoMethod,
                                "target": [focus[0]],
                                "animation": {
                                    "duration": animationDuration
                                }
                            }
                            actionspecs.push(annospec);
                            annospec = {
                                "add": "annotation",
                                "method": annoMethod,
                                "target": [focus[1]],
                                "animation": {
                                    "duration": animationDuration
                                }
                            }
                            actionspecs.push(annospec);
                        }
                        else{
                            console.log("Lack focus")
                        }
                        break;
                    case AnnotationType.DESATURATE:
                    case AnnotationType.FADE:
                    case AnnotationType.DISTRIBUTION:
                        annoMethod = annotation;
                        annospec = {
                            "add": "annotation",
                            "method": annoMethod,
                            "target": [],
                            "animation": {
                                "duration": animationDuration
                            }
                        }
                        actionspecs.push(annospec);
                        break;
                    case AnnotationType.REGRESSION:
                        annoMethod = annotation;
                        annospec = {
                            "add": "annotation",
                            "method": annoMethod,
                            "target": [],
                            "style": {
                                "color": COLOR.ANNOTATION
                            },
                            "animation": {
                                "duration": animationDuration
                            }
                        }
                        actionspecs.push(annospec);
                        break;
                    default:
                        console.log("wrong annotation type")
                        break;
                }
            }
        }

        return actionspecs;
    }

    /**
     * @description Get action specification for scatterplot
     * @param {Object} schema Data schema specification.
     * @param {Object} breakdown Breakdown field in fact specification.
     * @param {Object} measure Measure field in fact specification.
     * @returns {Array} encodingspec Encoding specification in actions specification,
     */
     getScatterplotSpec(schema, breakdown, measure) {
        let measureNum = measure.length;
        let encodingspec = [];
        let animationDuration = 1000;

        if (measureNum >= 2){
            let measureSchemaFst = schema.filter(s => s.field === measure[0].field)
            let measureSchemaSnd = schema.filter(s => s.field === measure[1].field)
            if (measureSchemaFst[0].type !== FieldType.NUMERICAL || measureSchemaSnd[0].type !== FieldType.NUMERICAL){
                console.log("Scatterpolt wrong measure type")
                return;
            }
            //the first element in measure => encodingX（numeriacl）
            let encodingX = {
                "add": "encoding",
                "channel": "x",
                "field": measure[0].field,
                "animation": {
                    "duration": animationDuration
                }
            }
            encodingspec.push(encodingX);
            //the second element in measure => encodingY（numeriacl）
            let encodingY = {
                "add": "encoding",
                "channel": "y",
                "field": measure[1].field,
                "animation": {
                    "duration": animationDuration
                }
            }
            encodingspec.push(encodingY);
            return encodingspec;
        }
        else{
            console.log("Scatterpolt measure lacks")
            return;
        }
     }

    /**
     * @description Get action specification for barchart
     * @param {Object} schema Data schema specification.
     * @param {Object} breakdown Breakdown field in fact specification.
     * @param {Object} measure Measure field in fact specification.
     * @param {Object} facttype Type field in fact specification.
     * @returns {Array} encodingspec Encoding specification in actions specification,
     */
    getBarChartSpec(schema, breakdown, measure, facttype) {
        let breakdownSchema = schema.filter(s => s.field === breakdown[0].field)
        let measureNum = measure.length;
        let breakdownNum = breakdown.length;
        let encodingspec = [];
        let animationDuration = 1000;

        //the first element in breakdown => encodingX（categorical）
        if(breakdownNum > 0 && breakdownSchema[0].type === FieldType.CATEGORICAL){
            let encodingX = {
                "add": "encoding",
                "channel": "x",
                "field": breakdown[0].field,
                "animation": {
                    "duration": animationDuration
                }
            }
            encodingspec.push(encodingX);
            if (measureNum > 0 || facttype !== FactType.Categorization){
                let measureSchema = schema.filter(s => s.field === measure[0].field);
                if(measureSchema[0].type !== FieldType.NUMERICAL){
                    console.log("VerticalBarChart wrong measure type")
                    return;
                }
                //the first element in measure => encodingY（numeriacl）
                let encodingY = {
                    "add": "encoding",
                    "channel": "y",
                    "field": measure[0].field,
                    "animation": {
                        "duration": animationDuration
                    }
                }
                encodingspec.push(encodingY)

            }
            else if(measureNum === 0) {
                console.log("VerticalBartChart measure lacks")
                return encodingspec;
            }
            //the second element in breakdown => colorEncoding（categorical）
            if (breakdownNum > 1){
                let breakdownSndSchema = schema.filter(s => s.field === breakdown[1].field)
                if(breakdownSndSchema[0].type === FieldType.CATEGORICAL){
                    let encodingColor = {
                        "add": "encoding",
                        "channel": "color",
                        "field": breakdown[1].field,
                        "animation": {
                            "duration": animationDuration
                        }
                    }
                    encodingspec.push(encodingColor)
                }
            }
            return encodingspec;
        }
        else{
            console.log("VerticalBartChart breakdown lacks")
            return;
        }
    }
    
    /**
     * @description Get action specification for linechart
     * @param {Object} schema Data schema specification.
     * @param {Object} breakdown Breakdown field in fact specification.
     * @param {Object} measure Measure field in fact specification.
     * @returns {Array} encodingspec Encoding specification in actions specification,
     */
    getLineChartSpec(schema, breakdown, measure){
        let breakdownSchema = schema.filter(s => s.field === breakdown[0].field)
        let measureNum = measure.length;
        let breakdownNum = breakdown.length;
        let encodingspec = [];
        let animationDuration = 1000;

        //the first element in breakdown => encodingX（temporal）
        if (breakdownNum > 0 && breakdownSchema[0].type === FieldType.TEMPORAL){
            let encodingX = {
                "add": "encoding",
                "channel": "x",
                "field": breakdown[0].field,
                "animation": {
                    "duration": animationDuration
                }
            }
            encodingspec.push(encodingX);
            if (measureNum > 0) {
                let measureSchema = schema.filter(s => s.field === measure[0].field);
                if(measureSchema[0].type !== FieldType.NUMERICAL){
                    console.log("LineChart wrong measure type")
                    return;
                }
                //the first element in measure => encodingY（numeriacl）
                let encodingY = {
                    "add": "encoding",
                    "channel": "y",
                    "field": measure[0].field,
                    "animation": {
                        "duration": animationDuration
                    }
                }
                encodingspec.push(encodingY)
            
                //the second element in breakdown => colorEncoding（categorical）
                if (breakdownNum > 1){
                    let breakdownSndSchema = schema.filter(s => s.field === breakdown[1].field)
                    if(breakdownSndSchema[0].type === FieldType.CATEGORICAL){
                        let encodingColor = {
                            "add": "encoding",
                            "channel": "color",
                            "field": breakdown[1].field,
                            "animation": {
                                "duration": animationDuration
                            }
                        }
                        encodingspec.push(encodingColor)
                    }
                }

                return encodingspec;
            }
            else{
                console.log("LineChart measure lacks")
                return;
            }
        }
        else{
            console.log("LineChart breakdown lacks")
            return;
        }
    }

    /**
     * @description Rules of Fact-to-Actions translation
     */
    fact2visRules = [
        //assocation
        {
            "fact": FactType.Association,
            "chart": MarkType.POINT,
            "measureLen": 2,
            "breakdownType": [],
            "needFocus": false,
            "annotationType": [AnnotationType.REGRESSION]
        },
        //outlier
        {
            "fact": FactType.Outlier,
            "chart": MarkType.BAR,
            "measureLen": 1,
            "breakdownType": [FieldType.CATEGORICAL],
            "needFocus": true,
            "annotationType": [AnnotationType.DESATURATE, AnnotationType.FILL]
        },
        {
            "fact": FactType.Outlier,
            "chart": MarkType.LINE,
            "measureLen": 1,
            "breakdownType": [FieldType.TEMPORAL],
            "needFocus": true,
            "annotationType": [AnnotationType.DESATURATE, AnnotationType.FILL]
        },
        //extreme
        {
            "fact": FactType.Extreme,
            "chart": MarkType.BAR,
            "measureLen": 1,
            "breakdownType": [FieldType.CATEGORICAL],
            "needFocus": true,
            "annotationType": [AnnotationType.FILL]
        },
        {
            "fact": FactType.Extreme,
            "chart": MarkType.LINE,
            "measureLen": 1,
            "breakdownType": [FieldType.TEMPORAL],
            "needFocus": true,
            "annotationType": [AnnotationType.FILL]
        },
        //rank
        {
            "fact": FactType.Rank,
            "chart": MarkType.BAR,
            "measureLen": 1,
            "breakdownType": [FieldType.CATEGORICAL],
            "needFocus": true,
            "annotationType": [AnnotationType.FILL]
        },
        //distribution
        {
            "fact": FactType.Distribution,
            "chart": MarkType.BAR,
            "measureLen": 1,
            "breakdownType": [FieldType.CATEGORICAL],
            "needFocus": false,
            "annotationType": [AnnotationType.DISTRIBUTION]
        },
        //difference
        {
            "fact": FactType.Difference,
            "chart": MarkType.BAR,
            "measureLen": 1,
            "breakdownType": [FieldType.CATEGORICAL],
            "needFocus": true,
            "annotationType": [AnnotationType.FADE, AnnotationType.FILL, AnnotationType.REFERENCE]
        },
        //categorization
        {
            "fact": FactType.Categorization,
            "chart": MarkType.BAR,
            "measureLen": 0,
            "breakdownType": [FieldType.CATEGORICAL],
            "needFocus": true,
            "annotationType": []
        },
        //trend
        {
            "fact": FactType.Trend,
            "chart": MarkType.LINE,
            "measureLen": 1,
            "breakdownType": [FieldType.TEMPORAL],
            "needFocus": false,
            "annotationType": [AnnotationType.REGRESSION]
        }
    ];

    /**
     * @description Choose a number randomly
     * @param {Object} length The range of numbers selected
     * @returns {Array} choice The number selected
     */
    getChoice(length){
        let choice = Math.round(Math.random() * (length - 1));
        return choice;
    }
}

export default Translator;