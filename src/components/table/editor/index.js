import { h } from '../element';
import { borderWidth } from '../config';
/**
 * new -> cellIndex -> rect -> target -> hide
 */
export default class Editor {
    constructor(cssClass) {
        this._target = null;
        this._rect = null;
        this._visible = false;
        this._moveChanger = () => { };
        this._changer = () => { };
        this._ = h('div', cssClass);
    }
    get visible() {
        return this._visible;
    }
    target(target) {
        target.append(this._);
        this._target = target;
        return this;
    }
    cellIndex(r, c) {
        return this;
    }
    value(v) {
        this._value = v;
        return this;
    }
    changed() {
        // this._changer(this._value);
        this.hide();
    }
    rect(rect) {
        if (rect) {
            this._visible = true;
            this._rect = rect;
            const { x, y, width, height } = rect;
            this._.css({
                left: x - borderWidth / 2,
                top: y - borderWidth / 2,
                width: width - borderWidth,
                height: height - borderWidth,
            }).show();
        }
        return this;
    }
    show() {
        this._.show();
        return this;
    }
    hide() {
        this._visible = false;
        this.value('');
        this._.hide();
        return this;
    }
    moveChanger(value) {
        this._moveChanger = value;
        return this;
    }
    changer(value) {
        this._changer = value;
        return this;
    }
}
