import Canvas from './canvas';
import { cellRender, cellBorderRender } from './cell-render';
import { eachRanges } from './range';
import { borderRanges } from './border';
function renderLines(canvas, { width, color }, cb) {
  if (width > 0) {
    canvas
      .save()
      .beginPath()
      .prop({ lineWidth: width - 0.5, strokeStyle: color });
    cb();
    canvas.restore();
  }
}
function renderCellGridline(canvas, gridline, { x, y, width, height }) {
  renderLines(canvas, gridline, () => {
    canvas
      .translate(x, y)
      .line(width, 0, width, height)
      .line(0, height, width, height);
  });
}
function renderBorder(canvas, area, range, borderRect, type, lineStyle, color, autoAlign) {
  const borderLineStyle = [lineStyle, color];
  // if type === 'none', you can delete borders in ref(range)
  if (type === 'outside' || type === 'all') {
    cellBorderRender(canvas, borderRect, borderLineStyle, true);
  }
  else if (type === 'left') {
    cellBorderRender(canvas, borderRect, { left: borderLineStyle }, autoAlign);
  }
  else if (type === 'top') {
    cellBorderRender(canvas, borderRect, { top: borderLineStyle }, autoAlign);
  }
  else if (type === 'right') {
    cellBorderRender(canvas, borderRect, { right: borderLineStyle }, autoAlign);
  }
  else if (type === 'bottom') {
    cellBorderRender(canvas, borderRect, { bottom: borderLineStyle }, autoAlign);
  }
  if (type === 'all' ||
    type === 'inside' ||
    type === 'horizontal' ||
    type === 'vertical') {
    if (type !== 'horizontal') {
      range.eachCol((index) => {
        if (index < range.endCol) {
          const r1 = range.clone();
          r1.endCol = r1.startCol = index;
          if (r1.intersects(area.range)) {
            cellBorderRender(canvas, area.rect(r1), { right: borderLineStyle }, autoAlign);
          }
        }
      });
    }
    if (type !== 'vertical') {
      range.eachRow((index) => {
        if (index < range.endRow) {
          const r1 = range.clone();
          r1.endRow = r1.startRow = index;
          if (r1.intersects(area.range)) {
            cellBorderRender(canvas, area.rect(r1), { bottom: borderLineStyle }, autoAlign);
          }
        }
      });
    }
  }
}
function renderBorders(canvas, area, borders, areaMerges) {
  // render borders
  if (borders && borders.length > 0) {
    console.log(borders)
    borders.forEach((border) => {
      const [, , borderStyle, lineColor] = border;
      let borderNeedsRender = borderRanges(area, border, areaMerges);
      borderNeedsRender.forEach((borderEntry) => {
        const range = borderEntry[0];
        const rect = borderEntry[1];
        const type = borderEntry[2];
        renderBorder(canvas, area, range, rect, type, borderStyle, lineColor);
      });
    });
  }
}
function renderArea(type, canvas, area, renderer) {
  if (!area)
    return;
  let cell;
  let cellRenderer;
  let formatter = (v) => v;
  let style = renderer._headerStyle;
  let gridline = renderer._headerGridline;
  let styles = renderer._styles;
  let merges;
  let borders;
  let row;
  let col;
  const { _rowHeader, _colHeader } = renderer;
  if (type === 'row-header') {
    if (_rowHeader.width <= 0)
      return;
    ({ cell, merges, cellRenderer } = _rowHeader);
  }
  else if (type === 'col-header') {
    if (_colHeader.height <= 0)
      return;
    ({ cell, merges, cellRenderer } = _colHeader);
  }
  else {
    // console.log(renderer)
    cell = renderer._cell;
    cellRenderer = renderer._cellRenderer;
    formatter = renderer._formatter;
    style = renderer._style;
    gridline = renderer._gridline;
    styles = renderer._styles;
    merges = renderer._merges;// 大概格式是['A1:A2','B3:D3']
    borders = renderer._borders;
    row = renderer._row;
    col = renderer._col;
  }
  canvas
    .save()
    .translate(area.x, area.y)
    .prop('fillStyle', style.bgcolor? style.bgcolor: renderer._bgcolor)
    .rect(0, 0, area.width, area.height)
    .fill()
    .clip();
  const mergeCellStyle = (r, c, cell) => {
    const cstyle = Object.assign({}, style);
    if (row) {
      const r1 = row(r);
      if (r1 && r1.style !== undefined)
        Object.assign(cstyle, styles[r1.style]);
    }
    if (col) {
      const c1 = col(c);
      if (c1 && c1.style !== undefined)
        Object.assign(cstyle, styles[c1.style]);
    }
    if (cell instanceof Object && cell[2].style !== undefined) {
      Object.assign(cstyle, styles[cell[2].style]);
    }
    return cstyle;
  };
  const areaMerges = [];
  const areaMergeRenderParams = [];
  const cellMerges = new Set();
  if (merges) { // 如果有merge的情况下 在这里准备merge的单元格的格式 areaMergeRenderParams放的是所有的需要merge的格式的变量，第一个放单元格的值，之后是格式，最后一个是画的方格的大小
    eachRanges(merges, (it) => {
      if (it.intersects(area.range)) {
        const cellv = cell(it.startRow, it.startCol);
        const cellStyle = mergeCellStyle(it.startRow, it.startCol, cellv);
        const cellRect = area.rect(it);
        areaMergeRenderParams.push([cellv, cellRect, cellStyle]);
        areaMerges.push(it);
        it.each((r, c) => {
          cellMerges.add(`${r}_${c}`);
        });
      }
    });
  }
  const _render = (cell, rect, cstyle) => { // 这个函数好像是专门为merge的单元格服务的
    if (type === 'body') {
      renderCellGridline(canvas, gridline, rect);
      cellRender(canvas, cell, rect, cstyle, cellRenderer, formatter);
    }
    else {
      cellRender(canvas, cell, rect, cstyle, cellRenderer, formatter);
      renderCellGridline(canvas, gridline, rect);
    }
  };
  // render cells
  area.each((r, c, rect) => {
    if (!cellMerges.has(`${r}_${c}`)) { // 之前记录过所有的合并的单元格，这里跳过需要合并渲染的单元格
      const cellv = cell(r, c);
      // _render(cellv, rect, mergeCellStyle(r, c, cellv));
      if (type === 'body') {
        renderCellGridline(canvas, gridline, rect);
        cellRender(canvas, cellv, rect, mergeCellStyle(r, c, cellv), cellRenderer, formatter);
      }
      else {
        cellRender(canvas, cellv, rect, mergeCellStyle(r, c, cellv), cellRenderer, formatter);
        renderCellGridline(canvas, gridline, rect);
      }
    }
  });
  // render merges
  console.log(areaMergeRenderParams);
  areaMergeRenderParams.forEach((it) => _render(...it));
  // render borders
  renderBorders(canvas, area, borders, areaMerges);
  canvas.restore();
}
export function render(renderer) {
  const { _width, _height, _target, _scale, _viewport, _freeze, _rowHeader, _colHeader, } = renderer;
  if (_viewport) {
    const canvas = new Canvas(_target, _scale);
    canvas.size(_width, _height);
    const [area1, area2, area3, area4] = _viewport.areas;
    const [headerArea1, headerArea21, headerArea23, headerArea3] = _viewport.headerAreas;
    // render-4
    renderArea('body', canvas, area4, renderer);
    // render-1
    renderArea('body', canvas, area1, renderer);
    renderArea('col-header', canvas, headerArea1, renderer);
    // render-3
    renderArea('body', canvas, area3, renderer);
    renderArea('row-header', canvas, headerArea3, renderer);
    // render 2
    renderArea('body', canvas, area2, renderer);
    renderArea('col-header', canvas, headerArea21, renderer);
    renderArea('row-header', canvas, headerArea23, renderer);
    // render freeze
    const [row, col] = _freeze;
    if (col > 0 || row > 0) {
      renderLines(canvas, renderer._freezeGridline, () => {
        if (col > 0)
          canvas.line(0, area4.y, _width, area4.y);
        if (row > 0)
          canvas.line(area4.x, 0, area4.x, _height);
      });
    }
    // render left-top
    const { x, y } = area2;
    if (x > 0 && y > 0) {
      const { height } = _colHeader;
      const { width } = _rowHeader;
      const { bgcolor } = renderer._headerStyle;
      if (bgcolor)
        canvas
          .save()
          .prop({ fillStyle: bgcolor })
          .rect(0, 0, width, height)
          .fill()
          .restore();
      renderLines(canvas, renderer._headerGridline, () => {
        canvas.line(0, height, width, height).line(width, 0, width, height);
      });
    }
  }
}
