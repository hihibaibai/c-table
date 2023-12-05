import { equals } from '../helper';
export function addStyle(t, value) {
    if (!t.styles)
        t.styles = [];
    if (value) {
        for (let i = 0; i < t.styles.length; i += 1) {
            const it = t.styles[i];
            if (equals(it, value)) {
                return i;
            }
        }
    }
    return t.styles.push(value) - 1;
}
export function getStyle(t, index, withDefault = true) {
    const style = t.styles[index];
    if (withDefault) {
        return Object.assign({}, t.style, t.styles[index] || {});
    }
    return style;
}
export function clearStyles(t) {
    t.styles.length = 0;
}
