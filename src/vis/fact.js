import * as d3 from 'd3';
import FactType from './visualization/facttype';
import AggregationType from './visualization/aggtype';

class Fact {
    constructor() {
        // data, factspec
        this._data = [];
        this._schema = [];
        this._factdata = [];
        this._type = "";
        this._measure = [];
        this._subspace = [];
        this._breakdown = [];
        this._parameter = "";
        this._focus = [];
    }

    data(value) {
        if (!value) {
            return this._data;
        }
        this._data = value;
        this._factdata = value;
    }

    schema(value) {
        this._schema = value;
    }

    factdata() {
        return this._factdata;
    }

    fact() {
        return {
            type: this._type,
            measure: this._measure,
            subspace: this._subspace,
            breakdown: this._breakdown,
            focus: this._focus,
            parameter: this._parameter
        }
    }

    process(spec) {
        this._type = spec.type ? spec.type : FactType.Distribution;
        this._measure = spec.measure ? spec.measure : [];
        if (this._measure.length === 0) {
            this._measure = [{ 'aggregate': 'count' }];
        }
        this._subspace = spec.subspace ? spec.subspace : [];
        this._breakdown = spec.breakdown ? spec.breakdown : [];
        this._focus = spec.focus ? spec.focus : [];

        let schemaDict = {};
        for (const column of this._schema) {
            schemaDict[column.field] = {};
            schemaDict[column.field]['subtype'] = column.subtype;
            schemaDict[column.field]['pictype'] = column.pictype;
            schemaDict[column.field]['type'] = column.type;
            schemaDict[column.field]['values'] = column.values;
            schemaDict[column.field]['isPostCode'] = column.isPostCode;
        }
        this._measure = this._measure.map(x => {
            if ('field' in x) {
                x['type'] = schemaDict[x.field]['type'];
                if (schemaDict[x.field]['subtype']) {
                    x['subtype'] = schemaDict[x.field]['subtype'];
                }
                if (schemaDict[x.field]['pictype']) {
                    x['pictype'] = schemaDict[x.field]['pictype'];
                }
            }
            return x;
        });
        this._subspace = this._subspace.map(x => {
            x['type'] = schemaDict[x.field]['type'];
            if (schemaDict[x.field]['subtype']) {
                x['subtype'] = schemaDict[x.field]['subtype'];
            }
            if (schemaDict[x.field]['pictype']) {
                x['pictype'] = schemaDict[x.field]['pictype'];
            }
            if (schemaDict[x.field]['isPostCode']) {
                x['isPostCode'] = schemaDict[x.field]['isPostCode'];
            }
            return x;
        });
        this._breakdown = this._breakdown.map(x => {
            x['type'] = schemaDict[x.field]['type'];
            if (schemaDict[x.field]['subtype']) {
                x['subtype'] = schemaDict[x.field]['subtype'];
            }
            if (schemaDict[x.field]['pictype']) {
                x['pictype'] = schemaDict[x.field]['pictype'];
            }
            if (schemaDict[x.field]['values']) {
                x['values'] = schemaDict[x.field]['values'];
            }
            if (schemaDict[x.field]['isPostCode']) {
                x['isPostCode'] = schemaDict[x.field]['isPostCode'];
            }
            return x;
        });
        this._focus = this._focus.map(x => {
            x['type'] = schemaDict[x.field]['type'];
            if (schemaDict[x.field]['subtype']) {
                x['subtype'] = schemaDict[x.field]['subtype'];
            }
            if (schemaDict[x.field]['pictype']) {
                x['pictype'] = schemaDict[x.field]['pictype'];
            }
            return x;
        });

        /** subspace **/
        if (this._subspace.length > 0) {
            this._factdata = this.filter(this.factdata(), this._subspace);
        }
        /** aggregate **/
        if (this._measure.length > 0) {
            let measure = this._measure;
            let breakdown = this._breakdown;
            this._factdata = this.aggregate(this._factdata, measure, breakdown);
        }

        /** parameter **/
        try {
            this._parameter = this.parameter()
        } catch (error) {
            console.log('parameter is wrong')
        }
        
        return new Promise((resolve, reject) => {
            resolve(this);
        });
    }

    parameter() {
        let data = this.factdata();
        let fact = this.fact();
        let breakdown = fact.breakdown;
        let focus = fact.focus;
        let measure = fact.measure;

        switch (fact.type) {
            case FactType.Association:
                function pearson(items, k1, k2) {
                    var x = 0,
                        xx = 0,
                        y = 0,
                        yy = 0,
                        xy = 0;

                    items.forEach(item => {
                        xx += item[k1] * item[k1];
                        x += item[k1];

                        yy += item[k2] * item[k2];
                        y += item[k2]

                        xy += item[k1] * item[k2];
                    });

                    var Lxx = xx - ((x * x) / items.length),
                        Lyy = yy - ((y * y) / items.length),
                        Lxy = xy - ((x * y) / items.length);

                    if (Lxx === 0 || Lyy === 0)
                        return 0;

                    return Lxy / Math.sqrt(Lxx * Lyy);
                }
                const x = "measure0:" + (measure[0].aggregate === "count" ? "COUNT" : measure[0].field),
                    y = "measure1:" + (measure[1].aggregate === "count" ? "COUNT" : measure[1].field);
                let pearsons = pearson(data, x, y)
                return pearsons;

            case FactType.Categorization:
                let categories = data.map((d) => {
                    return d[breakdown[0].field]
                })
                return Array.from(new Set(categories));

            case FactType.Rank:
                let rankList = data.sort((a, b) => b['Recovered'] - a['Recovered'])
                let rankCaetgories = rankList.map((d) => {
                    return d[breakdown[0].field]
                })
                return rankCaetgories;

            case FactType.Proportion:
                let focusItem = data.find(d => d[focus[0].field] === focus[0].value),
                    restItems = data.filter(d => d[focus[0].field] !== focus[0].value);
                let yEncoding = measure[0].field;
                let seriesData = [focusItem[yEncoding], d3.sum(restItems, d => d[yEncoding])];
                let pieData = d3.pie().sort(null)(seriesData);
                let percent = pieData[0].value / d3.sum(pieData, d => d.value);
                let percentText = (percent * 100).toFixed(1) + "%";
                return percentText;

            case FactType.Value:
                return data[0][measure[0].field];

            case FactType.Trend:
                const getLeastSquares = (X, Y) => {
                    let ret = {}

                    let sumX = 0
                    let sumY = 0
                    let sumXY = 0
                    let sumXSq = 0
                    let N = X.length

                    for (let i = 0; i < N; ++i) {
                        sumX += X[i]
                        sumY += Y[i]
                        sumXY += X[i] * Y[i]
                        sumXSq += X[i] * X[i]
                    }

                    ret.m = ((sumXY - sumX * sumY / N)) / (sumXSq - sumX * sumX / N)
                    ret.b = sumY / N - ret.m * sumX / N

                    return ret;
                }

                let arr = Array.apply(null, { length: data.length }).map((item, index) => {
                    return index
                })

                let ret = getLeastSquares(arr, data.map(d => d[measure[0].field]))

                if (ret.m > 0) return 'increasing'
                if (ret.m < 0) return 'decreasing'
                return 'flat'

            case FactType.Difference:
                let filteredData = []
                for (const fs of focus) {
                    data.filter((x) => x[fs.field] === fs.value)[0] && filteredData.push(data.filter((x) => x[fs.field] === fs.value)[0])
                }
                let differenceValue = Math.abs(Number(filteredData[0][measure[0].field]) - Number(filteredData[1] ? filteredData[1][measure[0].field] : 0));
                return differenceValue;

            case FactType.Extreme:
                let extremeItem = data.find(d => d[focus[0].field] === focus[0].value)
                let maxValue = d3.max(data, d => d[measure[0].field])
                let minValue = d3.min(data, d => d[measure[0].field])
                extremeItem.extremeFocus = ''
                if(extremeItem[measure[0].field] === minValue) extremeItem.extremeFocus = "minimum" 
                if(extremeItem[measure[0].field] === maxValue) extremeItem.extremeFocus = "maximum" 
                return Object.values(extremeItem);

            default:
                return "";
        }
    }

    filter(data, subspace) {
        let filteredData = data;
        //只有subspace有数据才会进入到该函数
        //先提取出subspace中的第一个内容，观察是否有"operator"选项
        //如果有"operator":那么按照新的过滤方式处理
        //如果没有"operator":那么遵循原来的过滤方式
        let wayFlag=subspace[0].hasOwnProperty("operator");
        if(wayFlag){
            //多个subspace
            //一个subspace对应多个value
            //要根据operator选项判断清楚进行何种操作
            subspace.forEach((item)=>{
                let operator=item["operator"];
                switch (operator) {
                    case "EQ":
                        //表示==某个值，这里的值仅为某个数值类型的值
                        filteredData= filteredData.filter((x) => {
                            //比较浮点数的大小
                            return Math.abs(x[item.field]-parseFloat(item.value[0]))<1e-2;
                        });
                        break;
                    case "IN":
                        //表示==某个值
                        filteredData= filteredData.filter((x) => {
                            return item.value.includes(x[item.field]);
                        });
                        break;
                    case "RANGE":
                        //表示在某个值的范围内，value中会有两个值
                        //需要将两个值都取出来,转化为数值形式
                        let value1=parseFloat(item.value[0]);
                        let value2=parseFloat(item.value[1]);
                        let max=value1;
                        let min=value2;
                        // 比较大小，确定边界范围
                        if(value1<value2) {
                            max=value2;
                            min=value1;
                        }
                        filteredData= filteredData.filter((x) => {
                            return x[item.field]>=min &&x[item.field]<=max;
                        });
                        break;
                    case "NOT RANGE":
                        //表示在某个值的范围内，value中会有两个值
                        //需要将两个值都取出来,转化为数值形式
                        let valueNoRange1=parseFloat(item.value[0]);
                        let valueNoRange2=parseFloat(item.value[1]);
                        let max1=valueNoRange1;
                        let min1=valueNoRange2;
                        // 比较大小，确定边界范围
                        if(valueNoRange1<valueNoRange2) {
                            max1=valueNoRange2;
                            min1=valueNoRange1;
                        }
                        filteredData= filteredData.filter((x) => {
                            return x[item.field]<min1 || x[item.field]>max1;
                        });
                        break;
                    case "GT":
                        //表示大于某个值，所以这里的值仅有一个
                        //需要将其进行转化为数值形式
                        filteredData= filteredData.filter((x) => {
                            return x[item.field]>parseFloat(item.value[0]);
                        });
                        break;
                    case "LT":
                        //表示小于某个值，所以这里的值仅有一个
                        //需要将其进行转化为数值形式
                        filteredData= filteredData.filter((x) => {
                            return x[item.field]<parseFloat(item.value[0]);
                        });
                        break;
                    default:
                        console.log("operator error!not in [GT,IN,LT,NOT RANGE,RANGE,EQ]");

                }
            });
            return  filteredData;

        }else{

            /** filter rows **/
            for (const sub of subspace) {
                filteredData = filteredData.filter((x) => {
                    // console.log(x);
                    return x[sub.field] === sub.value})
            }
            return filteredData
        }
    }

    aggregate(data, measures, breakdowns) {
        let aggdata = [];
        if (measures.length < 1) {
            aggdata = data;
        } else if (measures.length === 1) {
            let measure = measures[0];
            aggdata = this.agg(data, measure, breakdowns);

        } else if (measures.length === 2) {
            // over one measure
            let aggdata1 = [];
            let aggdata2 = [];
            if (breakdowns.length > 0) {
                aggdata1 = this.agg(data, measures[0], breakdowns);
                aggdata2 = this.agg(data, measures[1], breakdowns);
            } else {
                aggdata1 = JSON.parse(JSON.stringify(data));
                aggdata2 = JSON.parse(JSON.stringify(data));
            }
            let breakdownfields = breakdowns.map(x => x.field)
            for (let index = 0; index < aggdata1.length; index++) {
                const element1 = aggdata1[index];
                for (const key in element1) {
                    if (!breakdownfields.includes(key)) {
                        element1["measure0:" + key] = element1[key];
                        delete element1[key];
                    }
                }
                const element2 = aggdata2[index];
                for (const key in element2) {
                    if (!breakdownfields.includes(key)) {
                        element2["measure1:" + key] = element2[key];
                        delete element2[key];
                    }
                }
                aggdata.push(Object.assign(element1, element2));
            }
        }
        return aggdata;
    }

    agg(data, measure, breakdowns) {
        let aggdata = {};
        /**
         * filter columns
         */
        let columns = [];
        columns = columns.concat(breakdowns.map(x => x.field));
        if (measure.aggregate !== "count") {
            columns.push(measure.field);
        }
        aggdata = data.map(x => {
            let y = {};
            for (const column of columns) {
                y[column] = x[column];
            }
            return y;
        });
        switch (measure.aggregate) {
            case AggregationType.SUM:
                aggdata = this.sum(aggdata, measure, breakdowns);
                break;
            case AggregationType.AVG:
                aggdata = this.avg(aggdata, measure, breakdowns);
                break;
            case AggregationType.MAX:
                aggdata = this.max(aggdata, measure, breakdowns);
                break;
            case AggregationType.MIN:
                aggdata = this.min(aggdata, measure, breakdowns);
                break;
            case AggregationType.COUNT:
                aggdata = this.count(aggdata, measure, breakdowns)
                break;

            default:
                aggdata = this.max(aggdata, measure, breakdowns);
                break;
        }
        return aggdata;
    }

    sum(data, measure, breakdowns) {
        let factdata = [];
        if (breakdowns.length > 1) {
            /** has series **/
            let seriesData = d3.nest().key(d => d[breakdowns[1].field]).entries(data);
            for (const series of seriesData) {
                let calculateData = d3.nest().key(d => d[breakdowns[0].field]).entries(series.values);
                let sumData = new Array(calculateData.length).fill(0);
                let categoryData = calculateData.map(function (d, i) {
                    d.values.forEach(d => {
                        sumData[i] += d[measure.field]
                    })
                    let sumRows = Object.assign({}, d.values[0])
                    sumRows[measure.field] = sumData[i]
                    return sumRows
                });
                factdata = factdata.concat(categoryData);
            }

        } else if (breakdowns.length === 1) {
            /** no series **/
            let calculateData = d3.nest().key(d => d[breakdowns[0].field]).entries(data);
            let sumData = new Array(calculateData.length).fill(0);
            factdata = calculateData.map(function (d, i) {
                d.values.forEach(d => {
                    sumData[i] += d[measure.field]
                })
                let sumRows = Object.assign({}, d.values[0])
                sumRows[measure.field] = sumData[i]
                return sumRows
            });
        } else {
            /** no breakdown **/
            let agg = {};
            agg[measure.field] = 0;
            for (let index = 0; index < data.length; index++) {
                agg[measure.field] += data[index][measure.field];
            }
            factdata.push(agg);
        }
        return factdata;
    }

    avg(data, measure, breakdowns) {
        let factdata = [];
        if (breakdowns.length > 1) {
            /** has series **/
            let seriesData = d3.nest().key(d => d[breakdowns[1].field]).entries(data);
            for (const series of seriesData) {
                let calculateData = d3.nest().key(d => d[breakdowns[0].field]).entries(series.values);
                let sumData = new Array(calculateData.length).fill(0);
                let categoryData = calculateData.map(function (d, i) {
                    d.values.forEach(d => {
                        sumData[i] += d[measure.field]
                    })
                    let sumRows = Object.assign({}, d.values[0])
                    sumRows[measure.field] = sumData[i] / d.values.length;
                    return sumRows;
                });
                factdata = factdata.concat(categoryData);
            }

        } else if (breakdowns.length === 1) {
            /** no series **/
            let calculateData = d3.nest().key(d => d[breakdowns[0].field]).entries(data);
            let sumData = new Array(calculateData.length).fill(0);
            factdata = calculateData.map(function (d, i) {
                d.values.forEach(d => {
                    sumData[i] += d[measure.field]
                })
                let sumRows = Object.assign({}, d.values[0])
                sumRows[measure.field] = sumData[i] / d.values.length;
                return sumRows;
            });
        } else {
            /** no breakdown **/
            let agg = {};
            agg[measure.field] = 0;
            for (let index = 0; index < data.length; index++) {
                agg[measure.field] += data[index][measure.field];
            }
            agg[measure.field] /= data.length;
            factdata.push(agg);
        }
        return factdata;
    }

    max(data, measure, breakdowns) {
        let factdata = [];
        if (breakdowns.length > 1) {
            /** has series **/
            let seriesData = d3.nest().key(d => d[breakdowns[1].field]).entries(data);
            for (const series of seriesData) {
                let calculateData = d3.nest().key(d => d[breakdowns[0].field]).entries(series.values);
                let categoryData = calculateData.map(function (d, i) {
                    let index = d3.scan(d.values, function (a, b) {
                        if (a[measure.field] && b[measure.field])
                            return b[measure.field] - a[measure.field];
                    });
                    if (index >= 0) {
                        return d.values[index]
                    } else {
                        return d.values[0];
                    }
                });
                factdata = factdata.concat(categoryData);
            }

        } else if (breakdowns.length === 1) {
            /** no series **/
            let calculateData = d3.nest().key(d => d[breakdowns[0].field]).entries(data);
            factdata = calculateData.map(function (d, i) {
                let index = d3.scan(d.values, function (a, b) {
                    if (a[measure.field] && b[measure.field])
                        return b[measure.field] - a[measure.field];
                });
                if (index >= 0) {
                    return d.values[index]
                } else {
                    return d.values[0];
                }
            });
        } else {
            /** no breakdown **/
            let agg = {};
            agg[measure.field] = data[0][measure.field];
            for (let index = 0; index < data.length; index++) {
                if (agg[measure.field] < data[index][measure.field]) {
                    agg[measure.field] = data[index][measure.field];
                }
            }
            factdata.push(agg);
        }
        return factdata;
    }

    min(data, measure, breakdowns) {
        let factdata = [];
        if (breakdowns.length > 1) {
            /** has series **/
            let seriesData = d3.nest().key(d => d[breakdowns[1].field]).entries(data);
            for (const series of seriesData) {
                let calculateData = d3.nest().key(d => d[breakdowns[0].field]).entries(series.values);
                let categoryData = calculateData.map(function (d) {
                    let index = d3.scan(d.values, function (a, b) {
                        if (a[measure.field] && b[measure.field])
                            return a[measure.field] - b[measure.field];
                    });
                    if (index >= 0) {
                        return d.values[index]
                    } else {
                        return d.values[0]
                    }
                });
                factdata = factdata.concat(categoryData);
            }

        } else if (breakdowns.length === 1) {
            /** no series **/
            let calculateData = d3.nest().key(d => d[breakdowns[0].field]).entries(data);
            factdata = calculateData.map(function (d) {
                let index = d3.scan(d.values, function (a, b) {
                    if (a[measure.field] && b[measure.field])
                        return a[measure.field] - b[measure.field];
                });
                if (index >= 0) {
                    return d.values[index]
                } else {
                    return d.values[0]
                }
            });
        } else {
            /** no breakdown **/
            let agg = {};
            agg[measure.field] = data[0][measure.field];
            for (let index = 0; index < data.length; index++) {
                if (agg[measure.field] > data[index][measure.field]) {
                    agg[measure.field] = data[index][measure.field];
                }
            }
            factdata.push(agg);
        }
        return factdata;
    }

    count(data, measure, breakdowns) {
        let factdata = [];
        if (breakdowns.length > 1) {
            /** has series **/
            let seriesData = d3.nest().key(d => d[breakdowns[1].field]).entries(data);
            for (const series of seriesData) {
                let calculateData = d3.nest().key(d => d[breakdowns[0].field]).entries(series.values);
                let countData = new Array(calculateData.length).fill(0);
                let categoryData = calculateData.map(function (d, i) {
                    d.values.forEach(() => {
                        countData[i] += 1;
                    })
                    let countRows = d.values[0];
                    countRows['COUNT'] = countData[i];
                    return countRows;
                });
                factdata = factdata.concat(categoryData);
            }

        } else if (breakdowns.length === 1) {
            /** no series **/
            let calculateData = d3.nest().key(d => d[breakdowns[0].field]).entries(data);
            let countData = new Array(calculateData.length).fill(0);
            factdata = calculateData.map(function (d, i) {
                d.values.forEach(() => {
                    countData[i] += 1
                })
                let countRows = d.values[0];
                countRows['COUNT'] = countData[i];
                return countRows;
            });
        } else {
            /** no breakdown **/
            let agg = { 'COUNT': data.length };
            factdata.push(agg);
        }
        return factdata;
    }
}

export default Fact;
