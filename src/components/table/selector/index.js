import { Range } from '../../table-renderer';
import { stylePrefix, borderWidth } from '../config';
import { h } from '../element';
class SelectArea {
    constructor(classNameSuffix, show = false) {
        this._rect = null;
        this._target = null;
        this._ = h('div', `${stylePrefix}-${classNameSuffix}`);
        if (show)
            this.show();
    }
    append(child) {
        this._.append(child);
        return this;
    }
    offset() {
        if (this._rect && this._target) {
            const offset = this._target.offset();
            const { x, y, width, height } = this._rect;
            return { x: x + offset.x, y: y + offset.y, width, height };
        }
        return null;
    }
    rect(value) {
        this._rect = value;
        this._.css({
            left: value.x,
            top: value.y,
            width: value.width,
            height: value.height,
        });
        return this;
    }
    target(value, autoAppend = true) {
        if (autoAppend)
            value.append(this._);
        this._target = value;
        return this;
    }
    show() {
        this._.show();
        return this;
    }
    clear() {
        const { _target, _ } = this;
        if (_target) {
            _target.remove(_);
            this._target = null;
        }
    }
}
export default class Selector {
    constructor(editable) {
        this._placement = 'body';
        this._editable = false;
        this._ranges = [];
        this._rowHeaderRanges = [];
        this._colHeaderRanges = [];
        this._areas = [];
        this._focus = [0, 0];
        // _focusBodyRange: Range | null = null;
        this._focusRange = null;
        this._focusArea = null;
        // for move
        this._move = [0, 0];
        this._copyRange = null;
        this._copyAreas = [];
        this._autofillRange = null;
        this._autofillAreas = [];
        this._autofillTrigger = (evt) => { };
        this._editable = editable;
    }
    get currentRange() {
      console.log(this._ranges);
        return this._ranges.at(-1);
    }
    placement(value) {
        this._placement = value;
        return this;
    }
    focus(row, col, range) {
        this._focus = [row, col];
        this._focusRange = range;
        this._move = [row, col];
        return this;
    }
    move(row, col) {
        this._move = [row, col];
        return this;
    }
    autofillRange(range) {
        this._autofillRange = range;
        return this;
    }
    autofillTrigger(trigger) {
        this._autofillTrigger = trigger;
        return this;
    }
    addRange(range, clear = true) {
        if (clear) {
            this._ranges.length = 0;
            this.clear();
        }
        this._ranges.push(range);
        updateHeaderRanges(this);
        return this;
    }
    updateLastRange(unionRange) {
        const { _focusRange } = this;
        if (_focusRange) {
            this._ranges.splice(-1, 1, unionRange(_focusRange));
            updateHeaderRanges(this);
        }
    }
    addAreaOutline(rect, target) {
        const outline = new SelectArea(`selector`, true)
            .rect(rect2outlineRect(rect, borderWidth))
            .target(target);
        if (this._placement === 'body') {
            outline.append(h('div', 'corner')
                .attr('draggable', 'false')
                .on('mousedown', this._autofillTrigger));
        }
        this._areas.push(outline);
    }
    addArea(rect, target) {
        this._areas.push(new SelectArea(`selector-area`, true).rect(rect).target(target));
        return this;
    }
    addRowHeaderArea(rect, target) {
        this._areas.push(new SelectArea(`selector-area row-header`, true).rect(rect).target(target));
        return this;
    }
    addColHeaderArea(rect, target) {
        this._areas.push(new SelectArea(`selector-area col-header`, true).rect(rect).target(target));
        return this;
    }
    addCopyArea(rect, target) {
        this._copyAreas.push(new SelectArea(`selector-copy`, true)
            .rect(rect2outlineRect(rect, borderWidth))
            .target(target));
        return this;
    }
    addAutofillArea(rect, target) {
        this._autofillAreas.push(new SelectArea(`selector-autofill`, true)
            .rect(rect2outlineRect(rect, borderWidth))
            .target(target));
        return this;
    }
    setFocusArea(rect, target) {
        this._focusArea = new SelectArea('', true).rect(rect).target(target, false);
        return this;
    }
    showCopy() {
        this._copyRange = this.currentRange;
    }
    clearCopy() {
        this._copyRange = null;
        this._copyAreas.forEach((it) => {
            it.clear();
        });
        this._copyAreas.length = 0;
    }
    clear() {
        [this._areas, this._autofillAreas, this._copyAreas].forEach((it) => {
            it.forEach((it1) => it1.clear());
            it.length = 0;
        });
    }
}
function mergedRanges(ranges, sort, intersects) {
    ranges.sort(sort);
    let current = ranges[0];
    const nRanges = [];
    if (ranges.length === 1)
        nRanges.push(current);
    for (let i = 1; i < ranges.length; i += 1) {
        const r = ranges[i];
        if (intersects(current, r)) {
            current = current.union(r);
        }
        else {
            nRanges.push(current);
            current = r;
        }
    }
    if (ranges.length > 1)
        nRanges.push(current);
    return nRanges;
}
function updateHeaderRanges(s) {
    const rowHeaderRanges = [];
    const colHeaderRanges = [];
    for (let range of s._ranges) {
        if (range) {
            const { startRow, startCol, endRow, endCol } = range;
            if (startRow >= 0 || endRow >= 0) {
                rowHeaderRanges.push(Range.create(startRow, 0, endRow, 0));
            }
            if (startCol >= 0 || endCol >= 0) {
                colHeaderRanges.push(Range.create(0, startCol, 0, endCol));
            }
        }
    }
    s._rowHeaderRanges = mergedRanges(rowHeaderRanges, (a, b) => a.startRow - b.startRow, (a, b) => a.intersectsRow(b.startRow, b.endRow));
    s._colHeaderRanges = mergedRanges(colHeaderRanges, (a, b) => a.startCol - b.startCol, (a, b) => a.intersectsCol(b.startCol, b.endCol));
}
function rect2outlineRect(rect, borderWidth) {
    return {
        x: rect.x - borderWidth / 2,
        y: rect.y - borderWidth / 2,
        width: rect.width - borderWidth,
        height: rect.height - borderWidth,
    };
}
