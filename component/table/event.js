export function bind(target, name, callback) {
    target.addEventListener(name, callback);
}
export function unbind(target, name, callback) {
    target.removeEventListener(name, callback);
}
export function bindMousemoveAndMouseup(target, move, up) {
    const upHandler = (evt) => {
        up(evt);
        unbind(target, 'mousemove', move);
        unbind(target, 'mouseup', upHandler);
    };
    bind(target, 'mousemove', move);
    bind(target, 'mouseup', upHandler);
}
export class EventEmitter {
    constructor() {
        this._events = new Map();
    }
    on(type, handler) {
        const { _events } = this;
        if (!_events.has(type)) {
            _events.set(type, []);
        }
        _events.get(type).push(handler);
        return this;
    }
    off(type, handler) {
        const { _events } = this;
        if (_events.has(type)) {
            const handlers = _events.get(type);
            if (handler) {
                const findIndex = handlers.findIndex(it, it === handler);
                if (findIndex !== -1) {
                    handlers.splice(findIndex, 1);
                }
            }
            else {
                handlers.length = 0;
            }
        }
        return this;
    }
    emit(type, ...args) {
        const { _events } = this;
        if (_events.has(type)) {
            _events.get(type).forEach((handler) => handler(...args));
        }
        return this;
    }
}
