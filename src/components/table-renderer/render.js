import Canvas from './canvas';
import { cellRender, cellBorderRender } from './cell-render';
import { eachRanges } from './range';
import { borderRanges } from './border';
function renderLines(canvas, { width, color }, callbackFn) {
  if (width > 0) {
    canvas
        .save()
        .beginPath()
        .prop({ lineWidth: width - 0.5, strokeStyle: color });
    callbackFn();
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
    if (_rowHeader.width <= 0){
      return;
    }
    else {
      cell = _rowHeader.cell;
      merges = _rowHeader.merges;
      cellRenderer = _rowHeader.cellRenderer;
    }
  }
  else if (type === 'col-header') {
    if (_colHeader.height <= 0){
      return;
    }
    else {
      cell = _colHeader.cell;
      merges = _colHeader.merges;
      cellRenderer = _colHeader.cellRenderer;
    }
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
    borders = renderer._borders;// 一定要在这里注入,不然会渲染到索引上面去.
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
    // console.log(cell)
    // console.log( cell[2].style !== undefined)
    if (cell instanceof Object && cell[2].style !== undefined) {
      Object.assign(cstyle, styles[cell[2].style]);
    }
    return cstyle;
  };
  const mergeCellBorder = (cellv) => {
    let border = [];
    if (cellv instanceof Object && cellv[2].border !== undefined) {
      Object.assign(border, borders[cellv[2].border]);
    }
    return border;
  }
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
  // render cell border line
  area.each((r, c, rect) => {
    if (!cellMerges.has(`${r}_${c}`)) {
      renderCellGridline(canvas, gridline, rect);
    }
  });
  // render merges
  // console.log(areaMergeRenderParams);
  areaMergeRenderParams.forEach((item) => {
    let cellv = item[0];
    let rect = item[1];
    let cellStyle = item[2];
    cellRender(canvas, cellv, rect, cellStyle, cellRenderer, formatter);
    renderCellGridline(canvas, gridline, rect);
  });
  // render cell's defined borders
  area.each((r, c, rect) => {
    if (type === 'body'){
      if (!cellMerges.has(`${r}_${c}`)) { //这里要跳过合并的单元格，合并的单元格要单独渲染边框
        const cellv = cell(r, c);
        cellBorderRender(canvas,rect,mergeCellBorder(cellv));
      }
    }
  });
  // render merges border
  areaMergeRenderParams.forEach((item) => {
    let cellv = item[0];
    let rect = item[1];
    cellBorderRender(canvas,rect,mergeCellBorder(cellv));
  });
  // render printPreviewLine
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
    // render freeze 上面这些渲染的有重复就是为了实现冻结功能
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

    // render printPreviewLine
    renderPrintPreview(canvas,area4,renderer);

  }
}
function renderPrintPreview(canvas,area,renderer){
  // 准备画布，只在第四象限画。
  canvas
      .save()
      .translate(area.x, area.y)

  // need to konw where to draw the line in A4
  let margin = 20;
  const printPreviewWidth = 794-(margin*2);
  const printPreviewHeight = 1122-(margin*2);

  let xOffset = area.xOffset%printPreviewWidth;
  let printPreviewXToLeft = printPreviewWidth-xOffset;
  let xPreviewLinePosition = [];
  if (printPreviewXToLeft>0){//if smaller than 0, there will be no previewLine
    xPreviewLinePosition.push(printPreviewXToLeft);
    let xLoopSize = Math.floor((area.width - printPreviewXToLeft)/printPreviewWidth);
    for (let i = 0; i < xLoopSize; i++){
      xPreviewLinePosition.push(printPreviewXToLeft+printPreviewWidth);
    }
  }

  xPreviewLinePosition.forEach((xPosition)=>{
    canvas
        .beginPath()
        .prop({ lineWidth: 0.5, strokeStyle: 'green' })
        .setLineDash([5,3])
        .line(xPosition,0,xPosition,area.height)
        .closePath()
  });

  let yOffset = area.yOffset%printPreviewHeight;
  let printPreviewYToTop = printPreviewHeight-yOffset;
  let yPreviewLinePosition = [];
  if (printPreviewYToTop>0){//if smaller than 0, there will be no previewLine
    yPreviewLinePosition.push(printPreviewYToTop);
    let xLoopSize = Math.floor((area.width - printPreviewYToTop)/printPreviewHeight);
    for (let i = 0; i < xLoopSize; i++){
      yPreviewLinePosition.push(printPreviewYToTop+printPreviewHeight);
    }
  }

  yPreviewLinePosition.forEach((yPosition)=>{
    canvas
        .beginPath()
        .prop({ lineWidth: 0.5, strokeStyle: 'green' })
        .setLineDash([5,3])
        .line(0,yPosition,area.width,yPosition)
        .closePath()
  });
  canvas.restore();
}
