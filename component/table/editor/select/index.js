var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Editor from '..';
import { stylePrefix } from '../../config';
import { h } from '../../element';
export default class SelectEditor extends Editor {
    constructor() {
        super(`${stylePrefix}-select`);
        this._width = 300;
        this._height = 320;
        this._position = 'bottom-right';
        this._options = null;
        this._searchInput = h('input').on('input', ({ target }) => this.query(target.value));
        this._content = h('ul', `${stylePrefix}-select-content`);
        this._.append(h('div', `${stylePrefix}-select-input`).append(this._searchInput), this._content);
    }
    query(q) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._options === null)
                return;
            this._content.html('');
            yield this._options(q).then((data) => {
                if (data && Array.isArray(data)) {
                    this._content.append(...data.map((it) => {
                        let li = h('li', 'item').on('click', () => {
                            this._changer(Array.isArray(it) ? { key: it[0], value: it[1] } : it);
                            this.hide();
                        });
                        if (typeof it === 'string') {
                            li.append(it);
                        }
                        else if (Array.isArray(it)) {
                            const [key, text, label] = it;
                            li.append(text, it.length > 2 ? h('label').append(label) : '');
                        }
                        return li;
                    }));
                }
            });
        });
    }
    options(v) {
        this._options = v;
        return this;
    }
    position(v) {
        this._position = v;
        return this;
    }
    rect(rect) {
        if (rect) {
            const { _position } = this;
            this._rect = rect;
            this._visible = true;
            const { x, y, width, height } = rect;
            let left = x, top = y + height;
            if (_position === 'top-right' || _position === 'bottom-right') {
                left += width - this._width;
            }
            if (_position === 'top-right' || _position === 'top-left') {
                top -= this._height;
            }
            this._.css({
                left,
                top,
                width: this._width,
                height: this._height,
            });
        }
        return this;
    }
    show() {
        this.query('');
        super.show();
        return this;
    }
}
