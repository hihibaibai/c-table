import {stylePrefix} from '@/components/myTable/config.js';
import ElementOperator from '@/components/myTable/elementOperator';

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

    }
    else {

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

  removeSelectedCell(){
    if (this.selectedCell) {
      this.selectedCell.remove();
    }
  }

  removeActiveCells() {
    for (let activeCell of this.activeCells) {
      activeCell.remove();
    }
    for (let activeHeader of this.activeHeaders) {
      activeHeader.remove();
    }
  }

  clearActive() {
    this.removeSelectedCell();
    this.removeActiveCells();
  }

  drawFocus(left, top, width, height) {
    this.removeSelectedCell();
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
    if (this.activeCells) {
      this.activeCells.forEach(i => {
        i.remove();
      });
    }
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

  getSelectedCellParentElement() {
    if (this.selectedCell) {
      return this.selectedCell.parentNode;
    }
    return null;
  }
};