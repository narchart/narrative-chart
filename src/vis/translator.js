import FactType from "./visualization/facttype";
import MarkType from "./visualization/marktype";
import FieldType from "./visualization/fieldtype";
import AnnotationType from './visualization/annotationtype';
import Color from "./visualization/color";
import { getTitle } from "./sentencer/index"
import getCaption from "./sentencer/index"

/**
 * @description A translator for parsing visuaization specifications
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
        //let animationDuration = 1000;

        /* Step1: emotion => Config */
        let hasEmotion = false;
        if ("emotion" in factspec){
            hasEmotion = true;
            let emotion = factspec.emotion;
            let emotionspec = {
                "add": "config",
                "mode": emotion.mode ? emotion.mode : "light",
                "emotion": emotion.emotion
            }
            actionspecs.push(emotionspec)
        }

        /* Step1: measure, breakdown, subspace => Data processing */
        let selectspec = [];
        let groupbyspec = [];
        let filterspec = factspec.subspace;
        if (factspec.type === FactType.Categorization){
            groupbyspec = [{"field": "dataid"}]
            selectspec = groupbyspec.concat(factspec.breakdown);
        }
        else {
            groupbyspec = factspec.breakdown;
            selectspec = groupbyspec.concat(factspec.measure);
        }
        
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
            "text": titleText,
            "style": {}
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
            "text": captionText,
            "style": {}
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
                    "mark": {
                        "type": chartMark
                    }
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
                    "mark": {
                        "type": chartMark
                    }
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
                    "mark": {
                        "type": chartMark
                    }
                }
                actionspecs.push(markspec);
                actionspecs.push(titlespec);
                actionspecs.push(captionspec);
                encodingspec = this.getLineChartSpec(schemaspec, breakdown, measure)
                for(let i=0; i<encodingspec.length; i++){
                    actionspecs.push(encodingspec[i]);
                }
                break;
            case MarkType.UNIT:
                chartMark = "unit";
                markspec = {
                    "add": "chart",
                    "mark": {
                        "type": chartMark
                    }
                }
                actionspecs.push(markspec);
                actionspecs.push(titlespec);
                actionspecs.push(captionspec);
                encodingspec = this.getUnitVisSpec(schemaspec, breakdown, measure,type)
                for(let i=0; i<encodingspec.length; i++){
                    actionspecs.push(encodingspec[i]);
                }
                break;
            case MarkType.ARC:
                chartMark = "arc";
                markspec = {
                    "add": "chart",
                    "mark": {
                        "type": chartMark
                    }
                }
                actionspecs.push(markspec);
                actionspecs.push(titlespec);
                actionspecs.push(captionspec);
                encodingspec = this.getPieChartSpec(schemaspec, breakdown, measure,type)
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
            for(let i=0; i<annoTypes.length; i++){
                annotation = annoTypes[i];
                switch(annotation){
                    case AnnotationType.ARROW:
                    case AnnotationType.CIRCLE:
                    case AnnotationType.GLOW:
                        annoMethod = annotation;
                        for(let j=0; j<focus.length; j++){
                            annospec = {
                                "add": "annotation",
                                "method": annoMethod,
                                "target": [focus[j]]
                                // "animation": {
                                //     "duration": animationDuration
                                // }
                            }
                            actionspecs.push(annospec);
                        }
                        break;
                        case AnnotationType.CONTOUR:
                            annoMethod = annotation;
                            for(let j=0; j<focus.length; j++){
                                annospec = {
                                    "add": "annotation",
                                    "method": annoMethod,
                                    "target": [focus[j]],
                                    "style": {
                                        "color": COLOR.DEFAULT
                                    }
                                    // "animation": {
                                    //     "duration": animationDuration
                                    // }
                                }
                                actionspecs.push(annospec);
                            }
                            break;
                    case AnnotationType.FILL:
                        annoMethod = annotation;
                        for(let j=0; j<focus.length; j++){
                            if((type === FactType.Outlier) && (!hasEmotion)) {
                                annospec = {
                                    "add": "annotation",
                                    "method": annoMethod,
                                    "target": [focus[j]],
                                    "style": {
                                        "color": "#F12E2E"
                                    },
                                    // "animation": {
                                    //     "duration": animationDuration
                                    // }
                                }
                                actionspecs.push(annospec);
                            }
                            else if((type === FactType.Difference) && (!hasEmotion)) {
                                annospec = {
                                    "add": "annotation",
                                    "method": annoMethod,
                                    "target": [focus[j]],
                                    "style": {
                                        "color": COLOR.DEFAULT
                                    }
                                    // "animation": {
                                    //     "duration": animationDuration
                                    // }
                                }
                                actionspecs.push(annospec);
                            }
                            else{
                                annospec = {
                                    "add": "annotation",
                                    "method": annoMethod,
                                    "target": [focus[j]]
                                    // "animation": {
                                    //     "duration": animationDuration
                                    // }
                                }
                                actionspecs.push(annospec);
                            }
                        }
                        break;
                    case AnnotationType.REFERENCE:
                        annoMethod = annotation;
                        if(focus.length === 2){
                            annospec = {
                                "add": "annotation",
                                "method": annoMethod,
                                "target": [focus[0]],
                                // "animation": {
                                //     "duration": animationDuration
                                // }
                            }
                            actionspecs.push(annospec);
                            annospec = {
                                "add": "annotation",
                                "method": annoMethod,
                                "target": [focus[1]],
                                // "animation": {
                                //     "duration": animationDuration
                                // }
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
                            // "animation": {
                            //     "duration": animationDuration
                            // }
                        }
                        actionspecs.push(annospec);
                        break;
                    case AnnotationType.REGRESSION:
                        annoMethod = annotation;
                        annospec = {
                            "add": "annotation",
                            "method": annoMethod,
                            "target": []
                            // "animation": {
                            //     "duration": animationDuration
                            // }
                        }
                        actionspecs.push(annospec);
                        break;
                        case AnnotationType.SYMBOL:
                            annoMethod = annotation;
                            if(type === FactType.Rank && focus.length === 3) {
                                annospec = {
                                    "add": "annotation",
                                    "method": annoMethod,
                                    "target": [focus[0]],
                                    "style": {
                                        "icon-url": "http://localhost:3000/icon/rank-1.png"
                                    }
                                    // "animation": {
                                    //     "duration": animationDuration
                                    // }
                                }
                                actionspecs.push(annospec);
                                annospec = {
                                    "add": "annotation",
                                    "method": annoMethod,
                                    "target": [focus[1]],
                                    "style": {
                                        "icon-url": "http://localhost:3000/icon/rank-2.png"
                                    }
                                    // "animation": {
                                    //     "duration": animationDuration
                                    // }
                                }
                                actionspecs.push(annospec);
                                annospec = {
                                    "add": "annotation",
                                    "method": annoMethod,
                                    "target": [focus[2]],
                                    "style": {
                                        "icon-url": "http://localhost:3000/icon/rank-3.png"
                                    }
                                    // "animation": {
                                    //     "duration": animationDuration
                                    // }
                                }
                                actionspecs.push(annospec);
                            }
                            else if(type === FactType.Extreme && focus.length === 1) {
                                annospec = {
                                    "add": "annotation",
                                    "method": annoMethod,
                                    "target": [focus[0]],
                                    "style": {
                                        "icon-url": "http://localhost:3000/icon/max.png"
                                    }
                                    // "animation": {
                                    //     "duration": animationDuration
                                    // }
                                }
                                actionspecs.push(annospec);
                            }
                            else if(type === FactType.Outlier && focus.length === 1) {
                                annospec = {
                                    "add": "annotation",
                                    "method": annoMethod,
                                    "target": [focus[0]],
                                    "style": {
                                        "icon-url": "http://localhost:3000/icon/outlier.png"
                                    }
                                    // "animation": {
                                    //     "duration": animationDuration
                                    // }
                                }
                                actionspecs.push(annospec);
                            }
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
        //let animationDuration = 1000;

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
                // "animation": {
                //     "duration": animationDuration
                // }
            }
            encodingspec.push(encodingX);
            //the second element in measure => encodingY（numeriacl）
            let encodingY = {
                "add": "encoding",
                "channel": "y",
                "field": measure[1].field,
                // "animation": {
                //     "duration": animationDuration
                // }
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
        //let animationDuration = 1000;

        //the first element in breakdown => encodingX（categorical）
        if(breakdownNum > 0 && breakdownSchema[0].type === FieldType.CATEGORICAL){
            let encodingX = {
                "add": "encoding",
                "channel": "x",
                "field": breakdown[0].field,
                // "animation": {
                //     "duration": animationDuration
                // }
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
                    // "animation": {
                    //     "duration": animationDuration
                    // }
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
                        // "animation": {
                        //     "duration": animationDuration
                        // }
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
        //let animationDuration = 1000;

        //the first element in breakdown => encodingX（temporal）
        if (breakdownNum > 0 && breakdownSchema[0].type === FieldType.TEMPORAL){
            let encodingX = {
                "add": "encoding",
                "channel": "x",
                "field": breakdown[0].field,
                // "animation": {
                //     "duration": animationDuration
                // }
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
                    // "animation": {
                    //     "duration": animationDuration
                    // }
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
                            // "animation": {
                            //     "duration": animationDuration
                            // }
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
     * @description Get action specification for unitvis
     * @param {Object} schema Data schema specification.
     * @param {Object} breakdown Breakdown field in fact specification.
     * @param {Object} measure Measure field in fact specification.
     * @param facttype Type field in fact specification.
     * @returns {Array} encodingspec Encoding specification in actions specification,
     */
     getUnitVisSpec(schema, breakdown, measure, facttype){
        let breakdownNum = breakdown.length;
        let encodingspec = [];
        //let animationDuration = 1000;

        if(facttype === FactType.Proportion) {
            encodingspec = [];
            return encodingspec;
        }
        else if(facttype === FactType.Categorization) {
            let breakdownSchema = schema.filter(s => s.field === breakdown[0].field)
            if (breakdownNum > 0 && breakdownSchema[0].type === FieldType.CATEGORICAL){
                let encodingX = {
                    "add": "encoding",
                    "channel": "x",
                    "field": breakdown[0].field,
                    // "animation": {
                    //     "duration": animationDuration
                    // }
                }
                encodingspec.push(encodingX);
                let encodingColor = {
                    "add": "encoding",
                    "channel": "color",
                    "field": breakdown[0].field,
                    // "animation": {
                    //     "duration": animationDuration
                    // }
                }
                encodingspec.push(encodingColor);
                return encodingspec;
            }
        }
        else {
            console.log("Unitvis encoding lacks")
            encodingspec = [];
            return encodingspec;
        }
    }

    /**
     * @description Get action specification for piechart
     * @param {Object} schema Data schema specification.
     * @param {Object} breakdown Breakdown field in fact specification.
     * @param {Object} measure Measure field in fact specification.
     * @param {Object} facttype Type field in fact specification.
     * @returns {Array} encodingspec Encoding specification in actions specification,
     */
     getPieChartSpec(schema, breakdown, measure, facttype) {
        let breakdownSchema = schema.filter(s => s.field === breakdown[0].field)
        let measureNum = measure.length;
        let breakdownNum = breakdown.length;
        let encodingspec = [];
        //let animationDuration = 1000;

        //the first element in breakdown => encodingcolor（categorical）
        if(breakdownNum > 0 && breakdownSchema[0].type === FieldType.CATEGORICAL){
            let encodingColor = {
                "add": "encoding",
                "channel": "color",
                "field": breakdown[0].field,
                // "animation": {
                //     "duration": animationDuration
                // }
            }
            encodingspec.push(encodingColor);
            if (measureNum > 0 || facttype !== FactType.Categorization){
                let measureSchema = schema.filter(s => s.field === measure[0].field);
                if(measureSchema[0].type !== FieldType.NUMERICAL){
                    console.log("VerticalBarChart wrong measure type")
                    return;
                }
                //the first element in measure => encodingtheta（numeriacl）
                let encodingTheta = {
                    "add": "encoding",
                    "channel": "theta",
                    "field": measure[0].field,
                    // "animation": {
                    //     "duration": animationDuration
                    // }
                }
                encodingspec.push(encodingTheta)

            }
            else if(measureNum === 0) {
                console.log("PieChart measure lacks")
                return encodingspec;
            }
            return encodingspec;
        }
        else{
            console.log("PieChart breakdown lacks")
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
            "annotationType": [AnnotationType.DESATURATE, AnnotationType.FILL, AnnotationType.SYMBOL]
        },
        {
            "fact": FactType.Outlier,
            "chart": MarkType.LINE,
            "measureLen": 1,
            "breakdownType": [FieldType.TEMPORAL],
            "needFocus": true,
            "annotationType": [AnnotationType.DESATURATE, AnnotationType.FILL, AnnotationType.SYMBOL]
        },
        //extreme
        {
            "fact": FactType.Extreme,
            "chart": MarkType.BAR,
            "measureLen": 1,
            "breakdownType": [FieldType.CATEGORICAL],
            "needFocus": true,
            "annotationType": [AnnotationType.FILL, AnnotationType.SYMBOL]
        },
        {
            "fact": FactType.Extreme,
            "chart": MarkType.LINE,
            "measureLen": 1,
            "breakdownType": [FieldType.TEMPORAL],
            "needFocus": true,
            "annotationType": [AnnotationType.FILL, AnnotationType.SYMBOL]
        },
        //rank
        {
            "fact": FactType.Rank,
            "chart": MarkType.BAR,
            "measureLen": 1,
            "breakdownType": [FieldType.CATEGORICAL],
            "needFocus": true,
            "annotationType": [AnnotationType.FILL, AnnotationType.SYMBOL]
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
            "chart": MarkType.UNIT,
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
        },
        //proportion
        {
            "fact": FactType.Proportion,
            "chart": MarkType.ARC,
            "measureLen": 0,
            "breakdownType": [FieldType.CATEGORICAL],
            "needFocus": true,
            "annotationType": [AnnotationType.FADE, AnnotationType.CONTOUR]
        },
        // {
        //     "fact": FactType.Proportion,
        //     "chart": MarkType.UNIT,
        //     "measureLen": 0,
        //     "breakdownType": [FieldType.CATEGORICAL],
        //     "needFocus": true,
        //     "annotationType": [AnnotationType.FILL]
        // },
        //value
        {
            "fact": FactType.Value,
            "chart": MarkType.BAR,
            "measureLen": 0,
            "breakdownType": [],
            "needFocus": true,
            "annotationType": []
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