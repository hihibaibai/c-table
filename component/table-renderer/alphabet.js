const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function alphabet(index) {
    return alphabets.charAt(index % alphabets.length);
}
export function stringAt(index) {
    const ary = [];
    while (index >= 0) {
        ary.push(alphabet(index));
        index = parseInt(index / alphabets.length + '', 10) - 1;
    }
    return ary.reverse().join('');
}
export function indexAt(str) {
    let ret = 0;
    for (let i = 0; i < str.length; i++) {
        ret = 26 * ret + str.charCodeAt(i) - 64;
    }
    return ret - 1;
}
// B10 => x,y
export function expr2xy(expr) {
    let x = '';
    let y = '';
    for (let i = 0; i < expr.length; i += 1) {
        if (expr.charAt(i) >= '0' && expr.charAt(i) <= '9') {
            y += expr.charAt(i);
        }
        else {
            x += expr.charAt(i).toUpperCase();
        }
    }
    return [indexAt(x), parseInt(y, 10) - 1];
}
// x,y => B10
export function xy2expr(x, y) {
    return `${stringAt(x)}${y + 1}`;
}
export function expr2expr(expr, xn, yn) {
    const [x, y] = expr2xy(expr);
    return xy2expr(x + xn, y + yn);
}
export default {
    stringAt,
    indexAt,
    expr2xy,
    xy2expr,
    expr2expr,
};
