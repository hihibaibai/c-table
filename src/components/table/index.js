import './style.index.less';
import {stylePrefix} from './config';
import {h} from './element';
import Overlayer from './overlayer';
import TableRenderer from '../table-renderer/index';
import Range from '../table-renderer/range';
import expr2expr from "../table-renderer/alphabet";
import {
  defaultData,
  row,
  col,
  colsWidth,
  rowsHeight,
  rowHeight,
  colWidth,
  merge,
  unmerge,
  isMerged,
  cellValue,
  Cells,
  clearStyles,
  // clearBorder,
  // clearBorders,
  cellValueString,
  isLastRow,
  isLastCol,
  copy,
} from './data';
import {print} from './print';
import resizer from './index.resizer';
import scrollbar from './index.scrollbar';
import selector from './index.selector';
import {initEvents} from './index.event';
import {fromHtml, toHtml} from './index.html';
import {addStyle, getStyle,getStyleIndex} from './data/style';
import {addBorder,getBorder,getBorderIndex} from './data/border'
import {EventEmitter} from './event';
import TextEditor from './editor/text';

export default class Table {
  constructor(element, width, height, options) {
    console.log(this)
    // renderer options
    this._rendererOptions = {};
    this._copyable = false;
    this._editable = false;
    this._minRowHeight = 25;
    this._minColWidth = 60;
    // cache for rect of content
    this._contentRect = {x: 0, y: 0, width: 0, height: 0};
    this._cells = new Cells();
    // scrollbar
    this._vScrollbar = null;
    this._hScrollbar = null;
    // resizer
    this._rowResizer = null;
    this._colResizer = null;
    // editor ? extends Editor
    this._editor = null;
    this._editors = new Map();
    this._selector = null;
    // event emitter
    this._emitter = new EventEmitter();
    this._width = width;
    this._height = height;
    this.toolbarStyle = null;
    const container = typeof element === 'string' ? document.querySelector(element) : element;
    if (container === null)
      throw new Error('未获取到元素');
    this._container = h(container, `${stylePrefix}-container`).css({
      height: height(),
      width: width(),
    });
    // console.log("this._container", this._container)
    this._data = defaultData();
    // update default data
    if (options) {
      const {minColWidth, minRowHeight, renderer, data} = options;
      if (minColWidth)
        this._minColWidth = minColWidth;
      if (minRowHeight)
        this._minRowHeight = minRowHeight;
      if (renderer) {
        this._rendererOptions = renderer;
      }
      // 这一部分的data应该还是之前版本的, 因为现在的data格式改变了,所以可能不能用了.
      if (data) {
        const {cols, rows, rowHeight, colWidth} = data;
        const {_data} = this;
        if (cols)
          _data.cols.len = cols;
        if (rows)
          _data.rows.len = rows;
        if (rowHeight)
          _data.rowHeight = rowHeight;
        if (colWidth)
          _data.colWidth = colWidth;
      }
    }
    const canvasElement = document.createElement('canvas');
    // tabIndex for trigger keydown event
    this._canvas = h(canvasElement).attr('tabIndex', '1');
    // console.log("this._canvas", this._canvas)
    this._container.append(canvasElement);
    this._renderer = new TableRenderer(canvasElement, width(), height());
    this._overlayer = new Overlayer(this._container);
    // console.log("this._overlayer", this._overlayer)
    // resize rect of content
    resizeContentRect(this);
    if (options === null || options === void 0 ? void 0 : options.selectable) {
      selector.init(this);
    }
    // scroll
    if (options === null || options === void 0 ? void 0 : options.scrollable) {
      scrollbar.init(this);
    }
    if (options === null || options === void 0 ? void 0 : options.resizable) {
      resizer.init(this);
    }
    if (options === null || options === void 0 ? void 0 : options.editable) {
      this._editable = true;
    }
    this._copyable = (options === null || options === void 0 ? void 0 : options.copyable) || false;
    // set editors
    this._editors.set('text', new TextEditor());
    initEvents(this);
  }

  contentRect() {
    return this._contentRect;
  }

  container() {
    return this._container;
  }

  resize() {
    this._container.css({height: this._height(), width: this._width()});
    this.render();
  }

  freeze(ref) {
    this._data.freeze = ref;
    return this;
  }

  isMerged(ref) {
    if (ref)
      return isMerged(this._data, ref);
    else {
      const {_selector} = this;
      if (_selector) {
        return _selector._ranges.every((it) => isMerged(this._data, it.toString()));
      }
    }
    return false;
  }

  merge(ref) {
    if (ref)
      merge(this._data, ref);
    else {
      const {_selector} = this;
      if (_selector) {
        _selector._ranges.forEach((it) => merge(this._data, it.toString()));
      }
    }
    return this;
  }

  unmerge(ref) {
    if (ref)
      unmerge(this._data, ref);
    else {
      const {_selector} = this;
      if (_selector) {
        _selector._ranges.forEach((it) => unmerge(this._data, it.toString()));
      }
    }
    return this;
  }

  row(index, value) {
    if (value) {
      if (value.height) {
        this.rowHeight(index, value.height);
      }
      row(this._data, index, value);
      return this;
    }
    return row(this._data, index);
  }

  rowHeight(index, value) {
    const oldValue = rowHeight(this._data, index);
    if (value) {
      if (oldValue !== value) {
        rowHeight(this._data, index, value);
        this._contentRect.height += value - oldValue;
      }
      return this;
    }
    return oldValue;
  }

  rowsHeight(min, max) {
    return rowsHeight(this._data, min, max);
  }

  isLastRow(index) {
    return isLastRow(this._data, index);
  }

  col(index, value) {
    if (value) {
      if (value.width) {
        this.colWidth(index, value.width);
      }
      col(this._data, index, value);
      return this;
    }
    return col(this._data, index);
  }

  colWidth(index, value) {
    const oldValue = colWidth(this._data, index);
    if (value) {
      if (oldValue !== value) {
        colWidth(this._data, index, value);
        this._contentRect.width += value - oldValue;
      }
      return this;
    }
    return oldValue;
  }

  colsWidth(min, max) {
    return colsWidth(this._data, min, max);
  }

  isLastCol(index) {
    return isLastCol(this._data, index);
  }

  formulaParser(v) {
    this._cells.formulaParser(v);
    return this;
  }

  formatter(v) {
    this._cells.formatter(v);
    return this;
  }

  style(index, withDefault = true) {
    return getStyle(this._data, index, withDefault);
  }

  addStyle(value) {
    return addStyle(this._data, value);
  }

  getStyleIndex(value){
    return getStyleIndex(this._data,value);
  }

  clearStyles() {
    clearStyles(this._data);
    return this;
  }

  addBorder(value) {
    return addBorder(this._data, value);
  }

  border(index) {
    return getBorder(this._data,index);
  }

  getBorderIndex(value) {
    return getBorderIndex(this._data, value);
  }

  // clearBorder(value) {
  //   clearBorder(this._data, value);
  //   return this;
  // }

  // clearBorders() {
  //   clearBorders(this._data);
  //   return this;
  // }

  setCell(row, col, value) {
    const {_cells,_data} = this;
    this._cells.set(row, col, value);
    this._data.cells = this._cells.get(row,col);
    return this;
  }

  getCell(row, col) {
    const v = this._cells.get(row, col);
    // return v != null ? v[2] : v;
    return v != null ? v : [row,col,{value:''}];
  }

  cellValue(row, col) {
    return cellValue(this.getCell(row, col));
  }

  cellValueString(row, col) {
    return cellValueString(this.getCell(row, col));
  }

  render() {
    const {_data, _renderer, _overlayer} = this;
    for (let prop in this._rendererOptions) {
      const propValue = this._rendererOptions[prop];
      if (propValue)
        _renderer[prop](propValue);
    }
    _renderer
        .scrollRows(_data.scroll[0])
        .scrollCols(_data.scroll[1])
        .merges(_data.merges)
        .freeze(_data.freeze)
        .styles(_data.styles)
        .borders(_data.borders)
        .rows(_data.rows.len)
        .cols(_data.cols.len)
        .row((index) => row(_data, index))
        .col((index) => col(_data, index))
        .cell((r, c) => {
          return this.getCell(r, c);
        })
        .formatter(this._cells._formatter)
        .render();

    // viewport
    const {viewport} = _renderer;
    if (viewport) {
      viewport.areas.forEach((rect, index) => {
        _overlayer.area(index, rect);
      });
      viewport.headerAreas.forEach((rect, index) => {
        _overlayer.headerArea(index, rect);
      });
      scrollbar.resize(this);
    }
    return this;
  }

  data(data) {
    if (data) {
      Object.assign(this._data, data);
      this._cells.load(this._data);
      resizeContentRect(this);
      return this;
    } else {
      // 修复获取数据的时候没有单元格数据的问题
      this._data.cells = this._cells.download();
      return this._data;
    }
  }

  /**
   * copy data to ...
   * @param to
   * @param autofill
   */
  copy(to, autofill = false) {
    if (!to)
      return this;
    const toCopyData = (range, t) => {
      return {
        range: typeof range === 'string' ? Range.with(range) : range,
        cells: t._cells,
        data: t._data,
      };
    };
    const toCopyData1 = (t) => {
      const {_selector} = t;
      if (!_selector)
        return null;
      const range = _selector.currentRange;
      if (range === undefined)
        return null;
      return toCopyData(range, t);
    };
    copy(toCopyData1(this), to instanceof Table ? toCopyData1(to) : toCopyData(to, this), autofill);
    return this;
  }

  fill(data, to) {
    const {_selector} = this;
    let [startRow, startCol] = [0, 0];
    if (to) {
      [startCol, startRow] = expr2xy(to);
    } else {
      if (!_selector)
        return this;
      [startRow, startCol] = _selector._focus;
    }
    let [endRow, endCol] = [0, 0];
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i += 1) {
        const row = data[i];
        endCol = startCol + row.length - 1;
        for (let j = 0; j < row.length; j += 1) {
          this.cell(startRow + i, startCol + j, row[j]);
        }
      }
      endRow = startRow + data.length - 1;
    } else if (typeof data === 'string') {
      [endRow, endCol] = fromHtml(this, data, [startRow, startCol]);
    }
    if (endRow > 0 || endCol > 0) {
      selector.unionRange(this, endRow, endCol);
      selector.reset(this);
    }
    return this;
  }

  /**
   * @param from A1:H12
   */
  toHtml(from) {
    return toHtml(this, from);
  }

  toArrays(from) {
    const range = Range.with(from);
    const arrays = [];
    range.eachRow((r) => {
      const a = [];
      range.eachCol((c) => {
        a.push(this.cellValue(r, c));
      });
      arrays.push(a);
    });
    return arrays;
  }

  printContent(){
    return print(this);
  }

  getCellByXYPosition(offsetX,offsetY){
    const {viewport} = this._renderer;
    if (viewport) {
      let cell = viewport.cellAt(offsetX,offsetY);
      return cell;
    }
  }

  onClick(handler) {
    this._emitter.on('click', handler);
    return this;
  }

  /**
   * @param type keyof cell.type
   * @param editor
   * @returns
   */
  addEditor(type, editor) {
    this._editors.set(type, editor);
    return this;
  }

  static create(element, width, height, options) {
    return new Table(element, width, height, options);
  }
}

function resizeContentRect(t) {
  t._contentRect = {
    x: t._renderer._rowHeader.width,
    y: t._renderer._colHeader.height,
    width: colsWidth(t._data),
    height: rowsHeight(t._data),
  };
}

if (window) {
  window.wolf || (window.wolf = {});
  window.wolf.table = Table.create;
}
