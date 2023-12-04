function createFragment(...nodes) {
    const fragment = document.createDocumentFragment();
    nodes.forEach((node) => {
        let nnode;
        if (node instanceof HElement)
            nnode = node._;
        else if (typeof node === 'string')
            nnode = document.createTextNode(node);
        else
            nnode = node;
        fragment.appendChild(nnode);
    });
    return fragment;
}
export default class HElement {
    constructor(tag, className) {
        this._data = new Map();
        this._ =
            tag instanceof Node ? tag : document.createElement(tag);
        if (className) {
            if (typeof className === 'string') {
                this._.className = className;
            }
            else if (Array.isArray(className)) {
                this._.className = className.join(' ');
            }
            else {
                for (let [key, value] of Object.entries(className)) {
                    if (value)
                        this._.classList.add(key);
                }
            }
        }
    }
    element() {
        return this._;
    }
    data(key, value) {
        if (value) {
            this._data.set(key, value);
            return this;
        }
        else {
            return this._data.get(key);
        }
    }
    on(eventName, handler) {
        const [evtName, ...prop] = eventName.split('.');
        this._.addEventListener(evtName, (evt) => {
            handler(evt);
            for (let i = 0; i < prop.length; i += 1) {
                if (prop[i] === 'stop') {
                    evt.stopPropagation();
                }
                if (prop[i] === 'prevent') {
                    evt.preventDefault();
                }
            }
        });
        return this;
    }
    focus() {
        this._.focus();
        return this;
    }
    value(v) {
        if (v !== undefined) {
            this._.value = v;
            return this;
        }
        return this._.value;
    }
    textContent(v) {
        this._.textContent = v;
        return this;
    }
    html(v) {
        this._.innerHTML = v;
        return this;
    }
    attr(key, value) {
        if (value) {
            this._.setAttribute(key, value);
            return this;
        }
        return this._.getAttribute(key);
    }
    css(key, value) {
        const { style } = this._;
        if (value) {
            style.setProperty(key, value);
            return this;
        }
        if (typeof key === 'string') {
            return style.getPropertyValue(key);
        }
        Object.keys(key).forEach((k) => {
            let v = key[k];
            if (typeof v === 'number')
                v = `${v}px`;
            style.setProperty(k, v);
        });
        return this;
    }
    rect() {
        return this._.getBoundingClientRect();
    }
    offset() {
        const { _ } = this;
        return {
            x: _.offsetLeft,
            y: _.offsetTop,
            width: _.offsetWidth,
            height: _.offsetHeight,
        };
    }
    computedStyle() {
        return window.getComputedStyle(this._);
    }
    show(flag = true) {
        this.css('display', flag ? 'block' : 'none');
        return this;
    }
    hide() {
        this.css('display', 'none');
        return this;
    }
    scrollx(value) {
        const { _ } = this;
        if (value !== undefined) {
            _.scrollLeft = value;
            return this;
        }
        return _.scrollLeft;
    }
    scrolly(value) {
        const { _ } = this;
        if (value !== undefined) {
            _.scrollTop = value;
            return this;
        }
        return _.scrollTop;
    }
    after(...nodes) {
        this._.after(createFragment(...nodes));
        return this;
    }
    before(...nodes) {
        this._.before(createFragment(...nodes));
        return this;
    }
    append(...nodes) {
        this._.append(createFragment(...nodes));
        return this;
    }
    remove(...nodes) {
        nodes.forEach((node) => {
            this._.removeChild(node instanceof HElement ? node._ : node);
        });
    }
    cloneNode() {
        return this._.cloneNode(true);
    }
    get firstChild() {
        const first = this._.firstChild;
        return first ? new HElement(first) : null;
    }
}
export function h(tag, className) {
    return new HElement(tag, className);
}
export function textWidth(text, fontSize, fontFamily) {
    const el = document.createElement('span');
    el.style.display = 'inline-block';
    el.style.position = 'absolute';
    el.style.zIndex = '-900';
    el.style.whiteSpace = 'nowrap';
    el.style.fontSize = fontSize;
    el.style.fontFamily = fontFamily;
    el.textContent = text;
    document.body.appendChild(el);
    const width = el.clientWidth;
    document.body.removeChild(el);
    return width;
}
