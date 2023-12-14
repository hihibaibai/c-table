import { stringAt, expr2xy, xy2expr, expr2expr } from './alphabet';
import Canvas from './canvas';
import Range, { eachRanges, findRanges } from './range';
import { render } from './render';
import Viewport from './viewport';
import Area from './area';
/**
 * ----------------------------------------------------------------
 * |            | column header                                   |
 * ----------------------------------------------------------------
 * |            |                                                 |
 * | row header |              body                               |
 * |            |                                                 |
 * ----------------------------------------------------------------
 * row { height, hide, autoFit }
 * col { width, hide, autoFit }
 * cell {
 *   value,
 *   style: {
 *     border, fontSize, fontName,
 *     bold, italic, color, bgcolor,
 *     align, valign, underline, strike,
 *     rotate, textwrap, padding,
 *   },
 *   type: text | button | link | checkbox | radio | list | progress | image | imageButton | date
 * }
 */
export default class TableRenderer {
    constructor(container, width, height) {
        this._bgcolor = '#ffffff';
        // table width
        this._width = 0;
        // table height
        this._height = 0;
        this._scale = 1;
        // the count of rows
        this._rows = 100;
        // the count of cols;
        this._cols = 26;
        // the row height (px)
        this._rowHeight = 22;
        // the column width (px)
        this._colWidth = 100;
        // row of the start position in table
        this._startRow = 0;
        // col of the start position in table
        this._startCol = 0;
        // count of rows scrolled
        this._scrollRows = 0;
        // count of cols scrolled
        this._scrollCols = 0;
        /**
         * get row given rowIndex
         * @param {int} rowIndex
         * @returns Row | undefined
         */
        this._row = () => undefined;
        /**
         * get col given colIndex
         * @param {int} coIndex
         * @returns Row | undefined
         */
        this._col = () => undefined;
        /**
         * get cell given rowIndex, colIndex
         * @param {int} rowIndex
         * @param {int} colIndex
         * @returns Cell | string
         */
        this._cell = () => undefined;
        this._cellRenderer = () => true;
        this._formatter = (v) => v;
        this._merges = [];
        this._borders = [];
        this._styles = [];
        this._gridline = {
            width: 1,
            color: '#e6e6e6',
        };
        this._style = {
            align: 'left',
            valign: 'middle',
            textwrap: false,
            underline: false,
            strikethrough: false,
            color: '#0a0a0a',
            bold: false,
            italic: false,
            rotate: 0,
            fontSize: 10,
            fontFamily: 'Source Sans Pro',
        };
        // row header
        this._rowHeader = {
            width: 60,
            cols: 1,
            cell(rowIndex, colIndex) {
                return rowIndex + 1;
            },
        };
        // column header
        this._colHeader = {
            height: 24,
            rows: 1,
            cell(rowIndex, colIndex) {
                return stringAt(colIndex);
            },
        };
        this._headerGridline = {
            width: 1,
            color: '#e6e6e6',
        };
        this._headerStyle = {
            bgcolor: '#f4f5f8cc',
            align: 'center',
            valign: 'middle',
            textwrap: true,
            underline: false,
            strikethrough: false,
            color: '#585757',
            bold: false,
            italic: false,
            rotate: 0,
            fontSize: 10,
            fontFamily: 'Source Sans Pro',
        };
        // freezed [row, col]
        this._freeze = [0, 0];
        this._freezeGridline = {
            width: 2,
            color: '#d8d8d8',
        };
        // it can be used after rendering
        this._viewport = null;
        // const target = document.createElement('canvas');
        const target = typeof container === 'string'
            ? document.querySelector(container)
            : container;
        if (!target)
            throw new Error('target error');
        this._target = target;
        this._width = width;
        this._height = height;
    }
    render() {
        this._viewport = new Viewport(this);
        render(this);
        return this;
    }
    bgcolor(value) {
        this._bgcolor = value;
        return this;
    }
    width(value) {
        this._width = value;
        return this;
    }
    height(value) {
        this._height = value;
        return this;
    }
    scale(value) {
        this._scale = value;
        return this;
    }
    rows(value) {
        this._rows = value;
        return this;
    }
    cols(value) {
        this._cols = value;
        return this;
    }
    rowHeight(value) {
        this._rowHeight = value;
        return this;
    }
    colWidth(value) {
        this._colWidth = value;
        return this;
    }
    startRow(value) {
        this._startRow = value;
        return this;
    }
    startCol(value) {
        this._startCol = value;
        return this;
    }
    scrollRows(value) {
        this._scrollRows = value;
        return this;
    }
    scrollCols(value) {
        this._scrollCols = value;
        return this;
    }
    row(value) {
        this._row = value;
        return this;
    }
    col(value) {
        this._col = value;
        return this;
    }
    cell(value) {
        this._cell = value;
        return this;
    }
    cellRenderer(value) {
        this._cellRenderer = value;
        return this;
    }
    formatter(value) {
        this._formatter = value;
        return this;
    }
    merges(value) {
        this._merges = value;
        return this;
    }
    styles(value) {
        this._styles = value;
        // this._bgcolor = value.bgcolor?;
        return this;
    }
    borders(value) {
        this._borders = value;
        return this;
    }
    gridline(value) {
        if (value)
            Object.assign(this._gridline, value);
        return this;
    }
    style(value) {
        if (value)
            Object.assign(this._style, value);
        return this;
    }
    rowHeader(value) {
        if (value)
            Object.assign(this._rowHeader, value);
        return this;
    }
    colHeader(value) {
        if (value)
            Object.assign(this._colHeader, value);
        return this;
    }
    headerGridline(value) {
        if (value)
            Object.assign(this._headerGridline, value);
        return this;
    }
    headerStyle(value) {
        if (value)
            Object.assign(this._headerStyle, value);
        return this;
    }
    freeze(ref) {
        if (ref)
            this._freeze = expr2xy(ref).reverse();
        return this;
    }
    freezeGridline(value) {
        if (value)
            Object.assign(this._freezeGridline, value);
        return this;
    }
    // get methods ---- start ------
    rowHeightAt(index) {
        const { _row } = this;
        if (_row) {
            const r = _row(index);
            if (r)
                return r.hide === true ? 0 : r.height;
        }
        return this._rowHeight;
    }
    colWidthAt(index) {
        const { _col } = this;
        if (_col) {
            const c = _col(index);
            if (c)
                return c.hide === true ? 0 : c.width;
        }
        return this._colWidth;
    }
    get viewport() {
        return this._viewport;
    }
    // get methods ---- end -------
    static create(container, width, height) {
        return new TableRenderer(container, width, height);
    }
}
export { expr2xy, xy2expr, expr2expr, stringAt, Canvas, Range, Viewport, Area, eachRanges, findRanges, };
try {
    if (window) {
        window.wolf || (window.wolf = {});
        window.wolf.table_renderer = TableRenderer.create;
    }
}
catch (e) { }
