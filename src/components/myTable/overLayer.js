import {stylePrefix} from '@/components/myTable/config.js';
import ElementOperator from '@/components/myTable/elementOperator';
import Cells from '@/components/myTable/cells';

const defaultData = { // 只是为了方便开发使用的
  rows: {},
  cols: {},
  rowHeight: 25,
  colWidth: 100,
  headerWidth: 50,
  headerHeight: 26,
  style: {
    bgColor: '#FFF',
    color: '#333',
    align: 'left',
    valign: 'middle',
    textWrap: false,
    bold: false,
    italic: false,
    fontFamily: 'Roboto',
    fontSize: 10,
    underline: false,
    strikethrough: false,
    border: {}
  },
  styles: [],
  borders: [],
  merges: [],
  cells: [],
};

export default class OverLayer {
  data;
  viewport;
  tableWidth;
  tableHeight;
  selectedCell;// 这里放选中的那个单元格的元素
  activeCells = [];// 这里放所有激活状态的体表元素，也就是淡蓝色的
  activeHeaders = [];// 这里放所有激活状态的头表元素，淡蓝色的
  headOverLayerElement = [];
  bodyOverLayerElement = []; // 这里的overLayer元素按照象限来划分，第一个是右上角的冻结部分，接着是左上角的冻结，最后是右下角部分是数据的部分

  constructor(container, table, width, height) {
    let {data, scrollBar} = table;
    this.tableWidth = table.width;
    this.tableHeight = table.height;
    let tableWidth = table.width;
    let tableHeight = table.height;
    this.data = data;
    this.viewport = scrollBar.getViewport();
    let {freeze} = defaultData;
    let element;
    element = this.newHeadOverLayerElement();
    ElementOperator.setPosition(element, 'absolute');
    ElementOperator.setWidth(element, tableWidth - data.headerWidth);
    ElementOperator.setHeight(element, data.headerHeight);
    ElementOperator.setLeft(element, data.headerWidth);
    ElementOperator.setTop(element, 0);
    ElementOperator.setPointerEvents(element, 'none');
    this.headOverLayerElement.push(element);

    element = this.newHeadOverLayerElement();
    ElementOperator.setPosition(element, 'absolute');
    ElementOperator.setWidth(element, data.headerWidth);
    ElementOperator.setHeight(element, data.headerHeight);
    ElementOperator.setLeft(element, 0);
    ElementOperator.setTop(element, 0);
    ElementOperator.setPointerEvents(element, 'none');
    this.headOverLayerElement.push(element);

    element = this.newHeadOverLayerElement();
    ElementOperator.setPosition(element, 'absolute');
    ElementOperator.setWidth(element, data.headerWidth);
    ElementOperator.setHeight(element, tableHeight - data.headerHeight);
    ElementOperator.setLeft(element, 0);
    ElementOperator.setTop(element, data.headerHeight);
    ElementOperator.setPointerEvents(element, 'none');
    this.headOverLayerElement.push(element);
    this.headOverLayerElement.push(this.newHeadOverLayerElement());

    this.bodyOverLayerElement.push(this.newBodyOverLayerElement());
    this.bodyOverLayerElement.push(this.newBodyOverLayerElement());
    this.bodyOverLayerElement.push(this.newBodyOverLayerElement());
    element = this.newBodyOverLayerElement();
    if (freeze != null) {

    } else {
      let xOffset = data.headerWidth;
      let yOffset = data.headerHeight;
      ElementOperator.setPosition(element, 'absolute');
      ElementOperator.setWidth(element, width - xOffset);
      ElementOperator.setHeight(element, height - yOffset);
      ElementOperator.setLeft(element, xOffset);
      ElementOperator.setTop(element, yOffset);
      ElementOperator.setPointerEvents(element, 'none');
    }
    this.bodyOverLayerElement.push(element);
    this.headOverLayerElement.forEach(i => {
      container.append(i);
    });
    this.bodyOverLayerElement.forEach(i => {
      container.append(i);
    });
  }

  setData(data) {
    this.data = data;
  }

  newHeadOverLayerElement() {
    let element = document.createElement('div');
    ElementOperator.setClass(element, `${stylePrefix}--OverLayer--head`);
    return element;
  }

  newBodyOverLayerElement() {
    let element = document.createElement('div');
    ElementOperator.setClass(element, `${stylePrefix}--OverLayer--body`);
    return element;
  }

  selectCells(cellPosition) { // 暂时只处理单次选择
    this.initSelect();
    if (cellPosition.placement === 'body') {
      let isMerged = Cells.isCellMerge(this.data, cellPosition.x, cellPosition.y);
      let drawInfo = {
        leftValue: 0,
        topValue: 0,
        widthValue: 0,
        heightValue: 0
      };
      if (isMerged) {
        drawInfo = this.getXYOffsetWidthHeightByIndexRange(isMerged.sx, isMerged.sy, isMerged.ex, isMerged.ey);
      } else {
        drawInfo = this.getXYOffsetWidthHeightByCell(cellPosition);
      }
      // console.log(drawInfo);
      this.drawFocus(drawInfo.leftValue, drawInfo.topValue, drawInfo.widthValue, drawInfo.heightValue);
      // this.drawActive(leftValue, topValue, widthValue, heightValue);
    }
    if (cellPosition.placement === 'col-header') {
      //这里要生成div到两个地方，一个是header，一个是body
      // console.log(cellPosition);
      let {leftValue, widthValue} = this.getXYOffsetWidthHeightByCell(cellPosition);
      this.drawHeaderActive('col-header', leftValue, 0, widthValue, this.data.headerHeight);
      this.drawHeaderActive('row-header', 0, 0, this.data.headerWidth, this.tableHeight - this.data.headerHeight);
      this.drawCellsActive(leftValue, 0, widthValue, this.tableHeight - this.data.headerHeight);
    }
    if (cellPosition.placement === 'row-header') {
      let {topValue, heightValue} = this.getXYOffsetWidthHeightByCell(cellPosition);
      this.drawHeaderActive('col-header', 0, 0, this.tableWidth - this.data.headerWidth, this.data.headerHeight);
      this.drawHeaderActive('row-header', 0, topValue, this.data.headerWidth, heightValue);
      this.drawCellsActive(0, topValue, this.tableWidth - this.data.headerWidth, this.data.headerHeight);
    }
  }

  getXYOffsetWidthHeightByCell(cellPosition) {
    // let element = this.bodyOverLayerElement[3];
    // let overLayerWidth = parseInt(window.getComputedStyle(element).getPropertyValue('width'));
    // let overLayerHeight = parseInt(window.getComputedStyle(element).getPropertyValue('height'));
    let leftValue = 0;
    let topValue = 0;
    let widthValue = 0;
    let heightValue = 0;
    let widthCount = 0;
    let heightCount = 0;
    let x = this.viewport[0];
    let y = this.viewport[1];
    while (this.tableWidth - widthCount >= 0) {
      let cellWidth = 0;
      if (this.data.cols[x]) {
        cellWidth = this.data.cols[x];
      } else {
        cellWidth = this.data.colWidth;
      }
      if (x === cellPosition.x) {
        leftValue = widthCount;
        widthValue = cellWidth;
        break;
      }
      widthCount = widthCount + cellWidth;
      x++;
    }
    while (this.tableHeight - heightCount >= 0) {
      let cellHeight = 0;
      if (this.data.rows[y]) {
        cellHeight = this.data.rows[y];
      } else {
        cellHeight = this.data.rowHeight;
      }
      if (y === cellPosition.y) {
        topValue = heightCount;
        heightValue = cellHeight;
        break;
      }
      heightCount = heightCount + cellHeight;
      y++;
    }
    // console.log(leftValue, topValue, widthValue, heightValue);
    return {leftValue, topValue, widthValue, heightValue};
  }

  getXYOffsetWidthHeightByIndexRange(sx, sy, ex, ey) {
    // console.log(sx,sy,ex,ey)
    let leftValue = 0;
    let topValue = 0;
    let widthValue = 0;
    let heightValue = 0;
    let widthCount = 0;
    let heightCount = 0;
    let x = this.viewport[0];
    let y = this.viewport[1];
    while (this.tableWidth - widthCount >= 0) {
      let cellWidth = 0;
      if (this.data.cols[x]) {
        cellWidth = this.data.cols[x];
      } else {
        cellWidth = this.data.colWidth;
      }
      if (x < sx) {
        leftValue = leftValue + cellWidth;
      }
      if (x >= sx) {
        widthValue = widthValue + cellWidth;
      }
      if (x >= ex) {
        break;
      }
      widthCount = widthCount + cellWidth;
      x++;
    }
    while (this.tableHeight - heightCount >= 0) {
      let cellHeight = 0;
      if (this.data.rows[y]) {
        cellHeight = this.data.rows[y];
      } else {
        cellHeight = this.data.rowHeight;
      }
      if (y < sy) {
        topValue = topValue + cellHeight;
      }
      if (y >= sy) {
        heightValue = heightValue + cellHeight;
      }
      if (y >= ey) {
        break;
      }
      heightCount = heightCount + cellHeight;
      y++;
    }
    // console.log(leftValue, topValue, widthValue, heightValue);
    return {leftValue, topValue, widthValue, heightValue};
  }

  initSelect() {
    let overLayer = this.selectedCell;
    if (overLayer != null) {
      overLayer.remove();
    }
    if (this.activeCells) {
      this.activeCells.forEach(i => {
        i.remove();
      });
    }
    if (this.activeHeaders) {
      this.activeHeaders.forEach(i => {
        i.remove();
      });
    }

  }

  drawFocus(left, top, width, height) {
    let element = this.bodyOverLayerElement[3];
    let overLayer = document.createElement('div');
    ElementOperator.setWidth(overLayer, width - 2);// 这里的magic number 是为了渲染边框的时候位置正确
    ElementOperator.setHeight(overLayer, height - 2);
    ElementOperator.setLeft(overLayer, left - 1);
    ElementOperator.setTop(overLayer, top - 1);
    ElementOperator.setPosition(overLayer, 'absolute');
    ElementOperator.setBlockDisplay(overLayer);
    ElementOperator.setPointerEvents(overLayer, 'none');
    overLayer.style.setProperty('background', 'transparent');
    overLayer.style.setProperty('border', '2px solid #4b89ff');
    element.append(overLayer);
    this.selectedCell = overLayer;
  }

  drawCellsActive(left, top, width, height) {
    this.activeCells = [];// 这里之后会处理选中的那个框的空白的 这里先制作点击表头后表表身高亮的情况
    let element = this.bodyOverLayerElement[3];
    let overLayer = document.createElement('div');
    ElementOperator.setWidth(overLayer, width);
    ElementOperator.setHeight(overLayer, height);
    ElementOperator.setLeft(overLayer, left);
    ElementOperator.setTop(overLayer, top);
    ElementOperator.setPosition(overLayer, 'absolute');
    ElementOperator.setBlockDisplay(overLayer);
    ElementOperator.setPointerEvents(overLayer, 'none');
    overLayer.style.setProperty('background', 'rgba(67,148,241,0.2)');
    element.append(overLayer);
    this.activeCells.push(overLayer);
  }

  drawHeaderActive(position, left, top, width, height) {
    let colElement = this.headOverLayerElement[0];
    let rowElement = this.headOverLayerElement[2];
    if (position === "col-header") {
      let overLayer = document.createElement('div');
      ElementOperator.setWidth(overLayer, width);
      ElementOperator.setHeight(overLayer, height);
      ElementOperator.setLeft(overLayer, left);
      ElementOperator.setPosition(overLayer, 'absolute');
      ElementOperator.setBlockDisplay(overLayer);
      ElementOperator.setPointerEvents(overLayer, 'none');
      overLayer.style.setProperty('background', 'rgba(67,148,241,0.2)');
      colElement.append(overLayer);
      this.activeHeaders.push(overLayer);
    }
    if (position === "row-header") {
      let overLayer = document.createElement('div');
      ElementOperator.setWidth(overLayer, width);
      ElementOperator.setHeight(overLayer, height);
      ElementOperator.setTop(overLayer, top);
      ElementOperator.setPosition(overLayer, 'absolute');
      ElementOperator.setBlockDisplay(overLayer);
      ElementOperator.setPointerEvents(overLayer, 'none');
      overLayer.style.setProperty('background', 'rgba(67,148,241,0.2)');
      rowElement.append(overLayer);
      this.activeHeaders.push(overLayer);
    }
  }
};