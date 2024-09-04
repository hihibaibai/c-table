import Cells from "@/components/myTable/cells";

/**
 * 这个对象负责table当前选择的内容，具体的选择渲染样式交由overLayer处理
 */
export default class Selector {
  currentCell = {}; //= {x:0,y:0}
  selectedRange = {}; //= {sx: 0, sy: 0, ex: 0, ey: 0};
  table = {};
  scrollBar = {};
  overLayer = {};
  lastOffsetX;
  lastOffsetY;

  constructor(table) {
    this.table = table;
    this.scrollBar = table.scrollBar;
    this.overLayer = table.overLayer;

  }

  selectCell(offsetX, offsetY, isDrag) { // 暂时只处理单次选择
    this.initSelect();
    let cellPosition = this.table.scrollBar.getCellIndexByXYOffset(offsetX, offsetY);
    if (!isDrag) {
      this.lastOffsetX = offsetX;
      this.lastOffsetY = offsetY;
      if (cellPosition.placement === 'body') {
        let mergeCell = Cells.isCellMerge(this.table.data, cellPosition.x, cellPosition.y);
        if (!mergeCell) {
          this.currentCell = {x: cellPosition.x, y: cellPosition.y};
        }
        else {
          this.currentCell = {x: mergeCell.sx, y: mergeCell.sy};
        }
      }
      if (cellPosition.placement === 'col-header') {
        this.selectedRange = {sx: cellPosition.x, ex: cellPosition.x};
      }
      if (cellPosition.placement === 'row-header') {
        this.selectedRange = {sy: cellPosition.y, ey: cellPosition.y};
      }
    }
    else {
      // 这里放的是拖拽的逻辑
      let lastCellPosition = this.table.scrollBar.getCellIndexByXYOffset(this.lastOffsetX, this.lastOffsetY);
      let lastCellIsMerged = Cells.isCellMerge(this.table.data, lastCellPosition.x, lastCellPosition.y);
      if (lastCellIsMerged) {
        lastCellPosition.x = lastCellIsMerged.sx;
        lastCellPosition.y = lastCellIsMerged.sy;
      }
      let sx, ex, sy, ey;
      if (lastCellPosition.x <= cellPosition.x) {
        sx = lastCellPosition.x;
        ex = cellPosition.x;
      }
      else {
        sx = cellPosition.x;
        ex = lastCellPosition.x;
      }
      if (lastCellPosition.y <= cellPosition.y) {
        sy = lastCellPosition.y;
        ey = cellPosition.y;
      }
      else {
        sy = cellPosition.y;
        ey = lastCellPosition.y;
      }
      this.selectedRange = {sx: sx, sy: sy, ex: ex, ey: ey};
    }
    this.renderSelect();
  }

  initSelect() {
    // console.log(this.currentCell);
    this.currentCell = {};
    this.selectedRange = {};
    this.table.editor.hideEditor();
    this.table.overLayer.clearActive();
    this.renderSelect();
  }

  renderSelect() {
    if (this.currentCell.x != null && this.currentCell.y != null) { // 这里的判断条件要稍微改一下，因为之后会有currentCell和selectedRange同时存在的情况
      let isMerged = Cells.isCellMerge(this.table.data, this.currentCell.x, this.currentCell.y);
      let drawInfo = {
        leftValue: 0,
        topValue: 0,
        widthValue: 0,
        heightValue: 0
      };
      if (isMerged) {
        drawInfo = this.table.scrollBar.getXYOffsetWidthHeightByIndexRange(isMerged.sx, isMerged.sy, isMerged.ex, isMerged.ey);
      }
      else {
        drawInfo = this.table.scrollBar.getXYOffsetWidthHeightByCell(this.currentCell.x, this.currentCell.y);
      }
      if (drawInfo) {
        this.table.overLayer.drawFocus(drawInfo.leftValue, drawInfo.topValue, drawInfo.widthValue, drawInfo.heightValue);
        this.table.overLayer.drawHeaderActive('col-header', drawInfo.leftValue, 0, drawInfo.widthValue, this.table.data.headerHeight);
        this.table.overLayer.drawHeaderActive('row-header', 0, drawInfo.topValue, this.table.data.headerWidth, drawInfo.heightValue);
      }
      else {
        this.table.overLayer.removeSelectedCell();
      }
    }
    else {
      let {sx, sy, ex, ey} = this.selectedRange;
      if ((sx != null && sy == null) || (sx == null && sy != null)) {
        if (sx != null) {
          let {leftValue, widthValue} = this.table.scrollBar.getXYOffsetWidthHeightByCell(sx, 0);
          this.table.overLayer.drawHeaderActive('col-header', leftValue, 0, widthValue, this.table.data.headerHeight);
          this.table.overLayer.drawHeaderActive('row-header', 0, 0, this.table.data.headerWidth, this.table.height - this.table.data.headerHeight);
          this.table.overLayer.drawCellsActive(leftValue, 0, widthValue, this.table.height - this.table.data.headerHeight);
        }
        if (sy != null) {
          let {topValue, heightValue} = this.table.scrollBar.getXYOffsetWidthHeightByCell(0, sy);
          this.table.overLayer.drawHeaderActive('col-header', 0, 0, this.table.width - this.table.data.headerWidth, this.table.data.headerHeight);
          this.table.overLayer.drawHeaderActive('row-header', 0, topValue, this.table.data.headerWidth, heightValue);
          this.table.overLayer.drawCellsActive(0, topValue, this.table.width - this.table.data.headerWidth, this.table.data.headerHeight);
        }
      }
      else {
        let {
          leftValue,
          topValue,
          widthValue,
          heightValue
        } = this.table.scrollBar.getXYOffsetWidthHeightByIndexRange(sx, sy, ex, ey);
        this.table.overLayer.drawHeaderActive('col-header', leftValue, 0, widthValue, this.table.data.headerHeight);
        this.table.overLayer.drawHeaderActive('row-header', 0, topValue, this.table.data.headerWidth, heightValue);
        this.table.overLayer.drawCellsActive(leftValue, topValue, widthValue, heightValue);
      }
    }
  }
};