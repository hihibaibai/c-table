export default class Cells {
    constructor() {
        this.cellData = [];
        this._indexes = new Map();
        this._formulas = [];
        this._formulaParser = (v) => v;
        this._formatter = (v) => v;
    }
    formulaParser(v) {
        this._formulaParser = v;
        return this;
    }
    formatter(v) {
        this._formatter = v;
        return this;
    }
    load({ cells }) {
        if (cells) {
            this.cellData = cells;
            this.resetIndexes();
        }
    }
    get(row, col) {
        const { _indexes } = this;
        if (_indexes.has(row)) {
            const index = _indexes.get(row).get(col);
            if (index !== undefined) {
                return this.cellData[index];
            }
            return null;
        }
        return null;
    }
    remove(row, col) {
        const { _indexes } = this;
        if (_indexes.has(row)) {
            const rowIndexes = _indexes.get(row);
            const index = rowIndexes.get(col);
            if (index !== undefined) {
                this.cellData.splice(index, 1);
                rowIndexes.delete(col);
            }
        }
        return this;
    }
    set(row, col, cell) {
        let oldData = this.get(row, col);
        if (oldData === null) {
            if (cell !== null && cell !== undefined) {
                const index = this.cellData.push([row, col, cell]) - 1;
                this.updateIndex(row, col, index);
                this.addFormula(cell, index);
            }
        }
        else {
            const old = oldData[2];
            const ovalStr = cellValueString(old);
            const nvalStr = cellValueString(cell);
            if (nvalStr === '') {
                // delete
                if (old instanceof Object && Object.keys(old).length > 1) {
                    delete old.value;
                }
                else {
                    this.remove(row, col);
                }
                this.resetFormulas();
            }
            else {
                // update
                if (old instanceof Object) {
                    Object.assign(old, cell instanceof Object ? cell : { value: cell });
                }
                else {
                    oldData[2] = cell;
                }
                if (nvalStr !== ovalStr) {
                    this.resetFormulas();
                }
            }
        }
    }
    resetIndexes() {
        const { cellData } = this;
        for (let i = 0; i < cellData.length; i += 1) {
            const [r, c, cell] = cellData[i];
            this.updateIndex(r, c, i);
            this.addFormula(cell, i);
        }
    }
    updateIndex(row, col, index) {
        const { _indexes } = this;
        if (!_indexes.has(row)) {
            _indexes.set(row, new Map());
        }
        _indexes.get(row).set(col, index);
    }
    addFormula(cell, index) {
        if (cell instanceof Object && cell.formula) {
            cell.value = this._formulaParser(cell.formula);
            this._formulas.push(index);
        }
    }
    resetFormulas() {
        this._formulas.forEach((index) => {
            const [, , cell] = this.cellData[index];
            if (cell instanceof Object && cell.formula) {
                cell.value = this._formulaParser(cell.formula);
            }
        });
    }
}
export function cellValue(cell) {
    return cell instanceof Object ? cell.value : cell;
}
export function cellValueString(cell) {
    const v = cellValue(cell);
    return `${v !== null && v !== undefined ? v : ''}`;
}
