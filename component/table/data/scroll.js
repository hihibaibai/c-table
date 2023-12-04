import { expr2xy } from '../../table-renderer';
import { col, row } from '.';
function scrollTo(data, direction, value, type, getValue) {
    const { scroll } = data;
    const scrollIndex = type === 'row' ? 0 : 1;
    const valueIndex = type === 'row' ? 3 : 2;
    let newValue = scroll[valueIndex];
    let changed = false;
    let start = scroll[scrollIndex];
    let freezeOffset = 0;
    const { freeze } = data;
    if (freeze) {
        freezeOffset = expr2xy(freeze)[type === 'row' ? 1 : 0];
    }
    if (value > 0) {
        if (direction === '+') {
            for (let i = start;; i += 1) {
                if (newValue >= value)
                    break;
                const v = getValue(freezeOffset + i);
                newValue += v;
                data.scroll[scrollIndex] = i + 1;
                changed = true;
            }
        }
        else {
            for (let i = start;; i -= 1) {
                if (newValue <= value)
                    break;
                const v = getValue(freezeOffset + i - 1);
                newValue -= v;
                data.scroll[scrollIndex] = i - 1;
                changed = true;
                if (v > 0)
                    break;
            }
        }
    }
    else {
        data.scroll[scrollIndex] = 0;
        newValue = 0;
        changed = true;
    }
    scroll[valueIndex] = newValue;
    return changed;
}
export function scrollx(data, direction, n) {
    if (direction && n !== undefined) {
        return scrollTo(data, direction, n, 'col', (i) => col(data, i).width);
    }
    return data.scroll[2];
}
export function scrolly(data, direction, n) {
    if (direction && n !== undefined) {
        return scrollTo(data, direction, n, 'row', (i) => row(data, i).height);
    }
    return data.scroll[3];
}
export function scrollResetRows(data) {
    data.scroll[0] = 0;
    data.scroll[3] = 0;
}
export function scrollResetCols(data) {
    data.scroll[1] = 0;
    data.scroll[2] = 0;
}
