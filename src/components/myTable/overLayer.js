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
  selectedCell;// 这里放选中的那个单元格的元素
  headOverLayerElement = [];
  bodyOverLayerElement = []; // 这里的overLayer元素按照象限来划分，第一个是右上角的冻结部分，接着是左上角的冻结，最后是右下角部分是数据的部分

  constructor(container,table,width,height) {
    let {data, scrollBar} = table;
    this.data = data;
    this.viewport = scrollBar.getViewport();
    let {freeze} = defaultData;

    let element = {};
    this.headOverLayerElement.push(this.newHeadOverLayerElement());
    this.headOverLayerElement.push(this.newHeadOverLayerElement());
    this.headOverLayerElement.push(this.newHeadOverLayerElement());
    this.headOverLayerElement.push(this.newHeadOverLayerElement());

    this.bodyOverLayerElement.push(this.newBodyOverLayerElement());
    this.bodyOverLayerElement.push(this.newBodyOverLayerElement());
    this.bodyOverLayerElement.push(this.newBodyOverLayerElement());
    element = this.newBodyOverLayerElement();
    if (freeze != null) {

    }
    else {
      let xOffset = data.headerWidth;
      let yOffset = data.headerHeight;
      ElementOperator.setPosition(element,'absolute');
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

  selectCells(cellPosition) { // 暂时只处理单个选择
    let cell;
    if (cellPosition.placement === 'body') {
      cell = Cells.getCell(this.data, cellPosition.x, cellPosition.y);
      console.log(cell);
      this.getXYWidthHeightByCell(cellPosition);
    }


  }

  getXYWidthHeightByCell(cellPosition){
    let element = this.bodyOverLayerElement[3];
    let overLayerWidth = parseInt(window.getComputedStyle(element).getPropertyValue('width'));
    let overLayerHeight = parseInt(window.getComputedStyle(element).getPropertyValue('height'));
    let leftValue = 0;
    let topValue = 0;
    let widthValue = 0;
    let heightValue = 0;
    let widthCount = 0;
    let heightCount = 0;
    let x = this.viewport[0];
    let y = this.viewport[1];
    const startX = this.viewport[0];
    const startY = this.viewport[1];
    while (overLayerWidth - widthCount >= 0) {
      let cellWidth = 0;
      if (this.data.cols[x]) {
        cellWidth = this.data.cols[x];
      }
      else {
        cellWidth = this.data.colWidth;
      }
      if (x === cellPosition.x) {
        leftValue = widthCount;
        widthValue = cellWidth;
      }
      widthCount = widthCount + cellWidth;
      x++;
    }
    while (overLayerHeight - heightCount >= 0) {
      let cellHeight = 0;
      if (this.data.rows[y]) {
        cellHeight = this.data.rows[y];
      }
      else {
        cellHeight = this.data.rowHeight;
      }
      if (y === cellPosition.y) {
        topValue = heightCount;
        heightValue = cellHeight;
      }
      heightCount = heightCount + cellHeight;
      y++;
    }
    console.log(leftValue, topValue, widthValue, heightValue);
    let overLayer = this.selectedCell;
    if (overLayer != null) {
      overLayer.remove();
    }
    overLayer = document.createElement('div');
    ElementOperator.setWidth(overLayer, widthValue-2);// 这里的magic number 是为了渲染边框的时候位置正确
    ElementOperator.setHeight(overLayer, heightValue-2);
    ElementOperator.setLeft(overLayer, leftValue-1);
    ElementOperator.setTop(overLayer, topValue-1);
    ElementOperator.setPosition(overLayer, 'absolute');
    ElementOperator.setBlockDisplay(overLayer);
    ElementOperator.setPointerEvents(overLayer, 'none');
    overLayer.style.setProperty('background', 'transparent');
    overLayer.style.setProperty('border', '2px solid #4b89ff');
    element.append(overLayer);
    this.selectedCell = overLayer;
  }
};