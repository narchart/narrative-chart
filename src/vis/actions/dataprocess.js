import { max, min, sum } from 'd3';
import Action from './action';

class DataProcess extends Action {
    constructor(spec) {
        super(spec);
        this._select = [];
        this._groupby = [];
        this._filter = [];
        if ('select' in spec) {
            this._select = spec['select'];
        }
        if ('groupby' in spec) {
            this._groupby = spec['groupby'];
        }
        if ('filter' in spec) {
            this._filter = spec['filter'];
        }
    }

    operate(vis) {
        // 根据 spec 处理 data
        let data = vis.data();

        // Step 1: Filter 
        try {
            if (this._filter.length !== 0) {
                data = data.filter(row => {
                    for (const f of this._filter) {
                        if ("op" in f) {
                            switch (f.op) {
                                case "equal":
                                    if (!(f.field in row && row[f.field] === Number(f.value))) {
                                        return false;
                                    }
                                    break;
                                case "inequal":
                                    if (!(f.field in row && row[f.field] !== Number(f.value))) {
                                        return false;
                                    }
                                    break;
                                case "greater":
                                    if (!(f.field in row && row[f.field] >= Number(f.value))) {
                                        return false;
                                    }
                                    break;
                                case "less":
                                    if (!(f.field in row && row[f.field] <= Number(f.value))) {
                                        return false;
                                    }
                                    break;
                                default:
                                    console.error('Data Processing: Error In Filter By:\n' + Error);
                                    return true;
                            }
                        } else {
                            if (!(f.field in row && row[f.field] === f.value)) {
                                return false;
                            }
                        }
                    }
                    return true;
                })
            }
        } catch (error) {
            console.error('Data Processing: Error In Filtering:\n' + Error);
        }
        // Step 2: Groupby
        // aggregate(被select的数值列) by groupby
        // 如果有 agg 和 groupby ==> 根据 groupby 整理所有数值然后做 min/max/...
        // 如果没有 agg 和 groupby ==> filter 后直接返回
        // 如果有 agg 没有 groupby ==> 整张表做 agg
        // 如果没有 agg 有 groupby ==> 返回对应的首个值
        let processedData = data;
        try {
            processedData = this.aggregate(data, this._select, this._groupby);
        } catch (error) {
            console.error('Data Processing: Error In Group By:\n' + Error);
        }

        // Step 3: Select
        // select: only store cols being selected
        try {
            const selectCols = this._select.map(s => s.field);

            processedData.forEach(row => {
                for (const key in row) {
                    if (!selectCols.includes(key)) {
                        delete row[key];
                    }
                }
            });
        } catch (error) {
            console.error('Data Processing: Error In Select:\n' + Error);
        }
        // 处理完的 processedData 存进 vis 里
        vis.processedData(processedData);
    }

    /**
     * aggregating data specified in 'select'
     * @param {*} data 
     * @param {*} selects selected cols
     * @param {*} groupbys aggregate with groupby
     * @returns 
     */
    aggregate(data, selects, groupbys) {
        if (selects.length === 0 && groupbys.length === 0) {
            return data;
        }
        const groupbyCols = groupbys.map(g => g.field);
        const aggCols = selects.filter(s => 'aggregate' in s && s.aggregate !== 'None') // filter for cols needed to be aggregated
            .reduce(function (res, col) {
                res[col.field] = col.aggregate;
                return res;
            }, {});
        // restore records by groupby values
        const result = data.reduce(function (res, obj) {
            // 为了在 res 中存储每组unique 的 groupby 记录
            let recordName = groupbyCols.reduce(function (res, col) {
                return res + col + ':' + obj[col] + ';';
            }, "");

            if (!(recordName in res)) {
                let tempObj = { ...obj };
                // 把需要 agg 的 col 变成数组，方便后续统一处理 agg function
                Object.keys(aggCols).forEach(s => {
                    tempObj[s] = [tempObj[s]];
                });
                res.push(res[recordName] = tempObj);
            } else {
                Object.keys(aggCols).forEach(col => {
                    res[recordName][col].push(obj[col]);
                })
            }
            return res;
        }, []);

        // aggregate data with min/max/sum/count
        result.forEach(record => {
            Object.keys(aggCols).forEach(col => {
                if (col in record) {
                    record[col] = this.aggFuncRouter(record[col], aggCols[col]);
                }
            })
        })
        return [...result];
    }

    /**
     * aggregate a column with different agg function
     * @param {*} colData column data to be aggregated
     * @param {*} aggFunc aggregate function eg min/max/sum/avg/mean/count/...
     * @returns 
     */
    aggFuncRouter(colData, aggFunc) {
        switch (aggFunc.toLowerCase()) {
            case 'min':
                return min(colData);
            case 'max':
                return max(colData);
            case 'sum':
                return sum(colData);
            case 'count':
                return colData.length;
            case 'avg':
            case 'mean':
            default:
                return sum(colData) / colData.length;
        }

    }

}

export default DataProcess;