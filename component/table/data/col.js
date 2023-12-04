import { sum } from '../helper';
export function col(data, index, value) {
    const oldValue = data.cols[index] || { width: data.colWidth };
    if (value) {
        return (data.cols[index] = Object.assign(oldValue, value));
    }
    else {
        return oldValue;
    }
}
export function colWidth(data, index, value) {
    if (value) {
        const { cols } = data;
        if (cols[index])
            cols[index].width = value;
        else
            cols[index] = { width: value };
    }
    else {
        const c = col(data, index);
        return c.hide ? 0 : c.width;
    }
}
export function colsWidth(data, min, max) {
    const { cols } = data;
    if (arguments.length === 1) {
        let total = cols.len * data.colWidth;
        for (let key in cols) {
            if (key !== 'len') {
                const h = colWidth(data, parseInt(key, 10));
                if (h > 0) {
                    total += h;
                    total -= data.colWidth;
                }
            }
        }
        return total;
    }
    return sum(min !== undefined ? min : 0, max !== undefined ? max : cols.len, (i) => colWidth(data, i));
}
export function isLastCol(data, index) {
    return data.cols.len - 1 === index;
}
export function stepColIndex(data, index, step) {
    for (;;) {
        const r = col(data, index);
        if (r.hide)
            index += step;
        else
            return index;
    }
}
