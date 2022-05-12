import pickFactTemplate from './fact-templates';
import FactType from '../visualization/facttype';
import AggregationType from '../visualization/aggtype';

const irregularPluralsJSON = require('./irregular-plurals.json');
const irregularPlurals = new Map(Object.entries(irregularPluralsJSON));

const plur = function (word, plural, count) {
    if (typeof plural === 'number') {
        count = plural;
    }
    if (irregularPlurals.has(word.toLowerCase())) {
        plural = irregularPlurals.get(word.toLowerCase());

        const firstLetter = word.charAt(0);
        const isFirstLetterUpperCase = firstLetter === firstLetter.toUpperCase();
        if (isFirstLetterUpperCase) {
            plural = firstLetter.toUpperCase() + plural.slice(1);
        }

        const isWholeWordUpperCase = word === word.toUpperCase();
        if (isWholeWordUpperCase) {
            plural = plural.toUpperCase();
        }
    } else if (typeof plural !== 'string') {
        plural = (word.replace(/(?:s|x|z|ch|sh)$/i, '$&e').replace(/([^aeiou])y$/i, '$1ie') + 's')
            .replace(/i?e?s$/i, match => {
                const isTailLowerCase = word.slice(-1) === word.slice(-1).toLowerCase();
                return isTailLowerCase ? match.toLowerCase() : match.toUpperCase();
            });
    }

    return Math.abs(count) === 1 ? word : plural;
};

const convertAggregation = function (aggType) {
    switch (aggType) {
        case AggregationType.SUM:
            return 'total'

        case AggregationType.MAX:
            return 'maximum'

        case AggregationType.MIN:
            return 'minimum'

        case AggregationType.AVG:
            return 'average'

        case AggregationType.COUNT:
            return 'count'

        case AggregationType.NONE:
            return ''

        default:
            return 'total'
        // break;
    }
}

const convertMeasure = function (measure) {
    if (measure === "COUNT" || !measure) return ""
    else return measure.toLowerCase()
}

const convertGroupby = function (groupby, param = 'single') {
    let gb = groupby[0].field;
    if (param === 'single')
        return gb.toLowerCase();
    else if (param === 'plural') {
        if (gb.indexOf(' of ') !== -1) {
            let gbWords = gb.split(" ")
            let gbWordIndex = gbWords.indexOf("of") - 1
            if (gbWordIndex > -1) {
                let plurWord = plur(gbWords[gbWordIndex], 2)
                return gb.replace(gbWords[gbWordIndex], plurWord)
            }
        } else
            return plur(gb, 2).toLowerCase()
    }
}

// for value/difference/categorization
const formatNum = function (num) {
    num = (num || 0).toString();
    let number = 0,
        floatNum = '',
        intNum = '';
    if (num.indexOf('.') > 0) {
        number = num.indexOf('.');
        floatNum = num.substr(number);
        intNum = num.substring(0, number);
    } else {
        intNum = num;
    }
    let result = [],
        counter = 0;
    intNum = intNum.split('');

    for (let i = intNum.length - 1; i >= 0; i--) {
        counter++;
        result.unshift(intNum[i]);
        if (!(counter % 3) && i !== 0) { result.unshift(','); }
    }
    return result.join('') + floatNum || '';
}

const genFactSubspace = function (fact, template) {
    let subspace = '';
    if (fact.subspace.length) {
        fact.subspace.map((key, i) => { return subspace += `${i === 0 ? '' : ' and '}the ${key.field} is ${key.value}` })
        template = template.replace("{{subspace}}", subspace);
    } else {
        template = template.replace(", when {{subspace}}", '');
        template = template.replace(" when {{subspace}}", '');
        template = template.replace(" in case of {{subspace}}", '');
        template = template.replace(" given {{subspace}}", '');
        template = template.replace("When {{subspace}}, ", '');
        template = template.replace("Given {{subspace}}, ", '');
        template = template.replace("In case of {{subspace}}, ", '');
    }
    return template
}

export default function (fact) {
    let template = pickFactTemplate(fact);
    let aggregate = AggregationType.NONE;
    if (fact.measure.length > 0) {
        aggregate = fact.measure[0].aggregate;
    }
    switch (fact.type) {
        case FactType.Association:
            template = template.replace("{{measure1}}", convertMeasure(fact.measure[0].field));
            template = template.replace("{{measure2}}", convertMeasure(fact.measure[1].field));
            template = template.replace("{{agg1}}", convertAggregation(fact.measure[0].aggregate));
            template = template.replace("{{agg2}}", convertAggregation(fact.measure[1].aggregate));
            template = genFactSubspace(fact, template)
            if (fact.parameter !== '') {
                template = template.replace("{{parameter}}", formatNum(fact.parameter.toFixed(3)));
            }
            break;

        case FactType.Categorization:
            template = template.replace("{{groupby}}s", convertGroupby(fact.breakdown, 'plural'));
            template = template.replace("{{groupby}}s", convertGroupby(fact.breakdown, 'plural'));
            template = genFactSubspace(fact, template)
            if (fact.parameter.length) {
                template = template.replace("{{parameter}}", formatNum(fact.parameter.length));
                let parameterList = ''
                fact.parameter.forEach((d, i) => {
                    parameterList += `${i === 0 ? '' : ','} ${d}`
                });
                template = template.replace(" {{no.1}}, {{no.2}}, {{no.3}}", parameterList);
            }
            if (fact.focus.length) {
                if (template.indexOf(". {{focus}}") > -1) {
                    let focusValue = fact.focus[0].value.slice(0, 1).toUpperCase() + fact.focus[0].value.slice(1)
                    template = template.replace("{{focus}}", focusValue);
                } else {
                    template = template.replace("{{focus}}", fact.focus[0].value);
                }
            } else {
                template = template.replace(", and {{focus}} needs to pay attention", "");
                template = template.replace(", among which {{focus}} needs to pay attention", "");
                template = template.replace(". {{focus}} needs to pay attention", "");
            }
            break;

        case FactType.Difference:
            template = template.replace("{{measure}}", convertMeasure(fact.measure[0].field));
            template = template.replace("{{agg}}", convertAggregation(aggregate));
            if (fact.focus.length >= 2) {
                template = template.replace("{{focus1}}", fact.focus[0].value);
                template = template.replace("{{focus2}}", fact.focus[1].value);
            }
            template = genFactSubspace(fact, template)
            if (fact.parameter !== '') template = template.replace("{{parameter}}", formatNum(fact.parameter));
            break;

        case FactType.Distribution:
            template = template.replace("{{measure}}", convertMeasure(fact.measure[0].field));
            template = template.replace("{{measure}}", convertMeasure(fact.measure[0].field));
            template = template.replace("{{agg}}", convertAggregation(aggregate));
            template = template.replace("{{groupby}}s", convertGroupby(fact.breakdown, 'plural'));
            template = template.replace("{{groupby}}", convertGroupby(fact.breakdown));
            template = genFactSubspace(fact, template)
            if (fact.focus.length) {
                template = template.replace("{{focus}}", fact.focus[0].value);
            } else {
                template = template.replace(" and {{focus}} needs to pay attention", "");
            }
            break;

        case FactType.Extreme:
            template = template.replace("{{measure}}", convertMeasure(fact.measure[0].field));
            template = template.replace("{{agg}}", convertAggregation(aggregate));
            template = template.replace("{{groupby}}s", convertGroupby(fact.breakdown, 'plural'));
            template = template.replace("{{groupby}}", convertGroupby(fact.breakdown));
            template = template.replace("{{groupby}}", convertGroupby(fact.breakdown));
            template = genFactSubspace(fact, template)

            if (fact.parameter.length) {
                template = template.replace("{{parameter[0]}}", fact.focus[0].value);
                template = template.replace("{{parameter[1]}}", formatNum(fact.parameter[1]));
                template = template.replace("{{focus}}", fact.parameter[2]);
            }
            break;

        case FactType.Outlier:
            template = template.replace("{{measure}}", convertMeasure(fact.measure[0].field));
            template = template.replace("{{measure}}", convertMeasure(fact.measure[0].field));
            template = template.replace("{{groupby}}s", convertGroupby(fact.breakdown, 'plural'));
            template = template.replace("{{agg}}", convertAggregation(aggregate));
            template = genFactSubspace(fact, template)
            if (fact.focus.length) template = template.replace("{{focus}}", fact.focus[0].value);
            break;

        case FactType.Proportion:
            template = template.replace("{{measure}}", convertMeasure(fact.measure[0].field));
            template = template.replace("{{agg}}", convertAggregation(aggregate));
            template = template.replace("{{measure}}", convertMeasure(fact.measure[0].field));
            template = template.replace("{{agg}}", convertAggregation(aggregate));
            template = genFactSubspace(fact, template)
            if (fact.focus.length) template = template.replace("{{focus}}", fact.focus[0].value);
            if (fact.parameter) template = template.replace("{{parameter}}", fact.parameter);
            break;

        case FactType.Rank:
            template = template.replace("{{measure}}", convertMeasure(fact.measure[0].field));
            template = template.replace("{{agg}}", convertAggregation(aggregate));
            template = template.replace("{{groupby}}s", convertGroupby([fact.breakdown[fact.breakdown.length - 1]], 'plural'));
            template = template.replace("{{groupby}}s", convertGroupby(fact.breakdown, 'plural'));
            template = genFactSubspace(fact, template)
            if (fact.parameter.length >= 3) {
                template = template.replace("{{parameter}}", formatNum(fact.parameter.length));
                template = template.replace("{{no.1}}", fact.parameter[0]);
                template = template.replace("{{no.2}}", fact.parameter[1]);
                if (fact.parameter.length === 3) {
                    template = template.replace("{{no.3}}", fact.parameter[2]);
                } else if (fact.parameter.length > 3) {
                    template = template.replace("{{no.3}}", fact.parameter[2]);
                } else if (fact.parameter.length === 2) {
                    template = template.replace(", {{no.3}}", '');
                }
            } else {
                template = ''
            }
            break;

        case FactType.Trend:
            let temporalBreakdown = fact.breakdown.find(d => d.type === 'temporal')
            template = template.replace("{{measure}}", convertMeasure(fact.measure[0].field));
            template = template.replace("{{agg}}", convertAggregation(aggregate));
            template = template.replace("{{groupby}}s", convertGroupby([temporalBreakdown], 'plural'));
            template = genFactSubspace(fact, template)
            if (fact.parameter) {
                template = template.replace("{{parameter}}", fact.parameter);
                if (fact.parameter === 'increasing') {
                    template = template.replace("a/an", 'an');
                } else {
                    template = template.replace("a/an", 'a');
                }
            }
            if (fact.focus.length) {
                template = template.replace("{{focus}}", fact.focus[0].value);
            } else {
                template = template.replace(" and the value of {{focus}} needs to pay attention", "");
            }
            break;

        case FactType.Value:
            template = template.replace("{{measure}}", convertMeasure(fact.measure[0].field));
            template = template.replace("{{agg}}", convertAggregation(aggregate));
            template = genFactSubspace(fact, template)
            if (fact.focus.length) template = template.replace("{{focus}}", fact.focus[0].value);
            if (fact.parameter !== '') template = template.replace("{{parameter}}", formatNum(fact.parameter));
            break;

        default:
            break;
    }
    template = template.slice(0, 1).toUpperCase() + template.slice(1)
    return template;
}

export const getTitle = function (fact) {
    let title;
    // if (!isValid(fact))
    //     return ''

    title = 'The ' + fact.type
    switch (fact.type) {
        case FactType.Association:
            title += ' of ' + fact.measure[0].field + ' and ' + fact.measure[1].field
            break;
        case FactType.Categorization:
            // title += ' of ' + fact.groupby[0]
            title = fact.breakdown[0].field
            break;

        case FactType.Difference:
            title += ' between ' + fact.focus[0].value + ' and ' + fact.focus[1].value
            break;
        case FactType.Distribution:
            title += ' of ' + fact.measure[0].field
            break;
        case FactType.Extreme:
            title += ' of ' + fact.measure[0].field
            break;
        case FactType.Outlier:
            title += ' of ' + fact.measure[0].field
            break;
        case FactType.Proportion:
            title += ' of ' + fact.focus[0].value
            break;
        case FactType.Rank:
            title += ' of ' + fact.measure[0].field
            break;
        case FactType.Trend:
            title += ' of ' + fact.measure[0].field
            break;
        case FactType.Value:
            title = 'The ' + convertAggregation(fact.measure[0].aggregate) + ' ' + fact.measure[0].field
            break;
        default:
            break;
    }
    if (fact.subspace.length) {
        let subspace = '';
        fact.subspace.map((key, i) => { return subspace += ` in ${key.value}` })
        title += subspace;
    }

    return title;
}