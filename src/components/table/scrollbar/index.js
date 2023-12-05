import { stylePrefix } from '../config';
import { h } from '../element';
const typeCssKeys = { vertical: 'height', horizontal: 'width' };
export default class Scrollbar {
    constructor(type, target) {
        this._value = 0;
        this._maxValue = 0;
        this._lastOffset = 0;
        this._change = null;
        this._type = type;
        this._content = h('div', 'content');
        this._ = h('div', `${stylePrefix}-scrollbar ${type}`)
            .append(this._content)
            .on('scroll.stop', (evt) => {
            const { scrollTop, scrollLeft } = evt.target;
            if (this._change) {
                const nvalue = type === 'vertical' ? scrollTop : scrollLeft;
                const direction = nvalue > this._value ? '+' : '-';
                this._change(direction, nvalue, evt);
                this._value = nvalue;
            }
        });
        target.append(this._);
    }
    get value() {
        return this._value;
    }
    change(value) {
        this._change = value;
        return this;
    }
    scrollBy(value) {
        if (value) {
            this.scroll(this._value + value);
        }
        return this;
    }
    scrollToStart() {
        this.scroll(0);
        return this;
    }
    scrollToEnd() {
        this.scroll(this._maxValue);
        return this;
    }
    scroll(value) {
        const { _, _type, _maxValue } = this;
        if (value !== undefined) {
            if (value < 0)
                value = 0;
            else if (value > _maxValue)
                value = _maxValue;
            if (_type === 'vertical') {
                _.scrolly(value);
            }
            else {
                _.scrollx(value);
            }
            return this;
        }
        return _type === 'vertical' ? _.scrolly() : _.scrollx();
    }
    // update this size
    resize(value, contentValue) {
        if (contentValue > value - 1) {
            const cssKey = typeCssKeys[this._type];
            this._content.css(cssKey, `${contentValue}px`);
            this._.css(cssKey, `${value}px`).show();
            this._maxValue = contentValue - value;
        }
        else {
            this._.hide();
        }
        return this;
    }
}
