import { max, min, sum, ascending, descending } from 'd3';
import Action from './action';

/**
 * @description An action for processing data given the spec.
 * 
 * @class
 * @extends Action
 */
class DataProcess extends Action {
    constructor(spec) {
        super(spec);
        this._select = [];
        this._groupby = [];
        this._filter = [];
        this._orderby = [];
        if ('select' in spec) {
            this._select = spec['select'];
        }
        if ('groupby' in spec) {
            this._groupby = spec['groupby'];
        }
        if ('filter' in spec) {
            this._filter = spec['filter'];
        }
        if ('orderby' in spec) {
            this._orderby = spec['orderby'];
        }
    }

    /**
     * @description Perform the data action listed in the spec.
     * 
     * @param {Visualization} vis src/vis/visualization.js
     * 
     * @return {void}
     */
    operate(vis) {
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
        // aggregate(selected numerical columns) by groupby
        // if the spec specifies:
        // ... both `agg` and `groupby` ==> groupby all the related records for aggregate(e.g. min/max/...)
        // ... neither `agg` nor `groupby` ==> filter then return
        // ... only `agg` but no `groupby` ==> aggregate on the whole dataset
        // ... no `agg` but `groupby` ==> return the first value of matching records
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
        // Step 4: Orderby
        try {
            // prepare ascending and descending operations
            processedData.sort((a, b) => {
                let sorting;
                this._orderby.forEach(function(req) {
                    if (!('field' in req)) return;
                    if ('sort' in req && req.sort === 'ASC') {
                        sorting = sorting || ascending(a[req.field], b[req.field]);
                    } else { // DESC as default
                        sorting = sorting || descending(a[req.field], b[req.field]);
                    }
                })
                return sorting;
            })
        } catch (error) {
            console.error('Data Processing: Error In Orderby:\n' + Error);
        }

        // Step 5: Store
        // store the processed data in `vis` object
        vis.processedData(processedData);
    }

    /**
     * @description Aggregate data specified in 'select'.
     * 
     * @param {Array} data 
     * @param {Array} selects selected cols
     * @param {Object} groupbys aggregate with groupby
     * @returns {Array} aggregated data
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
     * @description Aggregate a column with different agg function.
     * 
     * @param {Array} colData column data to be aggregated
     * @param {string} aggFunc aggregate function eg min/max/sum/avg/mean/count/...
     * @returns {Array} aggregated data
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
