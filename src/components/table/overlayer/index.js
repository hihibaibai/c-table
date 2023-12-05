import { stylePrefix } from '../config';
import { h } from '../element';
function hOverlayer() {
    return h('div', `${stylePrefix}-overlayer-area`);
}
export default class Overlayer {
    constructor(target) {
        this._areaRects = [];
        this._areas = [hOverlayer(), hOverlayer(), hOverlayer(), hOverlayer()];
        this._headerAreas = [
            hOverlayer(),
            hOverlayer(),
            hOverlayer(),
            hOverlayer(),
        ];
        target.append(...this._areas, ...this._headerAreas);
    }
    area(index, rect) {
        if (rect) {
            this._areaRects[index] = rect;
            const { x, y, height, width } = rect;
            this._areas[index].css({ left: x, top: y, width, height });
            return this;
        }
        return this._areas[index];
    }
    headerArea(index, rect) {
        if (rect) {
            const { x, y, height, width } = rect;
            this._headerAreas[index].css({ left: x, top: y, width, height });
        }
        return this._headerAreas[index];
    }
    inAreas({ x, y, height, width }) {
        const x1 = x + width;
        const y1 = y + height;
        for (let it of this._areaRects) {
            if (x >= 0 && x1 <= it.width && y >= 0 && y1 <= it.height) {
                return true;
            }
        }
        return false;
    }
}
