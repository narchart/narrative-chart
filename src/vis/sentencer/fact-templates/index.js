import FactType from '../../visualization/facttype';
import association from './association';
import categorization from './categorization';
import difference from './difference';
import distribution from './distribution';
import extreme from './extreme';
import outlier from './outlier';
import proportion from './proportion';
import rank from './rank';
import trend from './trend';
import value from './value';

const templateCount = 3;

const pickFactTemplate = function (fact, id = -1) {
    // pick randomly when id == -1
    let templates = []
    switch (fact.type) {
        case FactType.Association:
            templates = association;
            break;

        case FactType.Categorization:
            templates = categorization;
            break;

        case FactType.Difference:
            templates = difference;
            break;

        case FactType.Distribution:
            templates = distribution;
            break;

        case FactType.Extreme:
            templates = extreme;
            break;

        case FactType.Outlier:
            templates = outlier;
            break;

        case FactType.Proportion:
            templates = proportion;
            break;

        case FactType.Rank:
            templates = rank;
            break;

        case FactType.Trend:
            templates = trend;
            break;

        case FactType.Value:
            templates = value;
            break;

        default:
            break;
    }
    if (id === -1) {
        id = Math.floor(Math.random() * 10) % templateCount
    }
    if (fact.breakdown.length >= 2 && (fact.type === FactType.Trend || fact.type === FactType.Rank))
        id = 3
    let sentence = '';
    try {
        sentence = templates[id].template;
    }
    catch (error) {
        console.error(error);
        console.log('wrong id:' + id)
    }
    return sentence;
}

export default pickFactTemplate;