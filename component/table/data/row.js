import { sum } from '../helper';
export function row(data, index, value) {
    const oldValue = data.rows[index] || { height: data.rowHeight };
    if (value) {
        return (data.rows[index] = Object.assign(oldValue, value));
    }
    else {
        return oldValue;
    }
}
export function rowHeight(data, index, value) {
    if (value) {
        const { rows } = data;
        if (rows[index])
            rows[index].height = value;
        else
            rows[index] = { height: value };
    }
    else {
        const r = row(data, index);
        return r.hide ? 0 : r.height;
    }
}
export function rowsHeight(data, min, max) {
    const { rows } = data;
    if (arguments.length === 1) {
        let total = rows.len * data.rowHeight;
        for (let key in rows) {
            if (key !== 'len') {
                const h = rowHeight(data, parseInt(key, 10));
                if (h > 0) {
                    total += h;
                    total -= data.rowHeight;
                }
            }
        }
        return total;
    }
    return sum(min !== undefined ? min : 0, max !== undefined ? max : rows.len, (i) => rowHeight(data, i));
}
export function isLastRow(data, index) {
    return data.rows.len - 1 === index;
}
export function stepRowIndex(data, index, step) {
    for (;;) {
        const r = row(data, index);
        if (r.hide)
            index += step;
        else
            return index;
    }
}
