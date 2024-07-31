import {stylePrefix} from '@/components/myTable/config.js';
import ElementOperator from '@/components/myTable/elementOperator';

const defaultData = { // 只是为了方便开发使用的
  rows: {},
  cols: {},
  rowHeight: 25,
  colWidth: 100,
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

const headerWidth = 50;
const headerHeight = 26;

export default class OverLayer {
  headOverLayerElement = [];
  bodyOverLayerElement = []; // 这里的overLayer元素按照象限来划分，第一个是右上角的冻结部分，接着是左上角的冻结，最后是右下角部分是数据的部分

  constructor(container,data,width,height) {
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
      let xOffset = headerWidth;
      let yOffset = headerHeight;
      ElementOperator.setPosition(element,'absolute');
      ElementOperator.setWidth(element, `${width - xOffset}px`);
      ElementOperator.setHeight(element, `${height - yOffset}px`);
      ElementOperator.setLeft(element, `${xOffset}px`);
      ElementOperator.setTop(element, `${yOffset}px`);
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
};