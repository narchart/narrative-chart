class Mark {
    constructor() {
        this._id = 0;
    }

    id(value) {
        if (!value) {
            return this._id;
        }
        this._id = value;
    }

    data(value) {
        if (!value) {
            return this._dataItem;
        }
        Object.entries(value).forEach(
            ([key, value]) => this[key] = value
        )
    }
}

export default Mark;