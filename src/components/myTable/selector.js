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

  constructor(table) {
    this.table = table;
    this.scrollBar = table.scrollBar;
    this.overLayer = table.overLayer;

  }

  selectCell(offsetX,offsetY) { // 暂时只处理单次选择
    this.initSelect();
    let cellPosition = this.table.scrollBar.getCellIndexByXYOffset(offsetX, offsetY);
    if (cellPosition.placement === 'body') {
      this.currentCell = {x:cellPosition.x, y: cellPosition.y};
    }
    if (cellPosition.placement === 'col-header') {
      this.selectedRange = {sx: cellPosition.x, ex: cellPosition.x};
    }
    if (cellPosition.placement === 'row-header') {
      this.selectedRange = {sy: cellPosition.y, ey: cellPosition.y};
    }
    this.renderSelect();
  }

  selectCells() {
    
  }

  initSelect(){

    this.currentCell = {};
    this.selectedRange = {};
    this.renderSelect();
  }

  renderSelect(){
    if (this.selectedRange !== {}) {
      let isMerged = Cells.isCellMerge(this.table.data, this.currentCell.x, this.currentCell.y);
      let drawInfo = {
        leftValue: 0,
        topValue: 0,
        widthValue: 0,
        heightValue: 0
      };
      if (isMerged) {
        drawInfo = this.table.scrollBar.getXYOffsetWidthHeightByIndexRange(isMerged.sx, isMerged.sy, isMerged.ex, isMerged.ey);
      } else {
        drawInfo = this.table.scrollBar.getXYOffsetWidthHeightByCell(this.currentCell.x, this.currentCell.y);
      }
      if (drawInfo) {
        this.table.overLayer.drawFocus(drawInfo.leftValue, drawInfo.topValue, drawInfo.widthValue, drawInfo.heightValue);
      }
      else {
        this.table.overLayer.removeSelectedCell();
      }
    }
    else {
      if (this.selectedRange.sx) {
        let {leftValue, widthValue} = this.table.scrollBar.getXYOffsetWidthHeightByCell(this.selectedRange.sx, 0);
        this.table.overLayer.drawHeaderActive('col-header', leftValue, 0, widthValue, this.table.data.headerHeight);
        this.table.overLayer.drawHeaderActive('row-header', 0, 0, this.table.data.headerWidth, this.table.height - this.table.data.headerHeight);
        this.table.overLayer.drawCellsActive(leftValue, 0, widthValue, this.table.height - this.table.data.headerHeight);
      }
      if (this.selectedRange.sy) {
        let {topValue, heightValue} = this.table.scrollBar.getXYOffsetWidthHeightByCell(0, this.selectedRange.sy);
        this.table.overLayer.drawHeaderActive('col-header', 0, 0, this.table.width - this.table.data.headerWidth, this.table.data.headerHeight);
        this.table.overLayer.drawHeaderActive('row-header', 0, topValue, this.table.data.headerWidth, heightValue);
        this.table.overLayer.drawCellsActive(0, topValue, this.table.width - this.table.data.headerWidth, this.table.data.headerHeight);
      }
    }
  }
};