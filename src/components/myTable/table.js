import {stylePrefix} from './config';
import OverLayer from '@/components/myTable/overLayer';
import ElementOperator from '@/components/myTable/elementOperator';
import Renderer from '@/components/myTable/Renderer';

const defaultData = {
  rows: {
    len: 100,
  },
  cols: {
    len: 26,
  },
  rowHeight: 25,
  colWidth: 100,
  scroll: [0, 0, 0, 0],
  style: {
    bgcolor: '#FFF',
    color: '#333',
    align: 'left',
    valign: 'middle',
    textwrap: false,
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

export default class Table {
  width = '';
  height = '';
  data = {};
  canvas = {};
  canvasContext = {};
  overLayer = {};

  constructor(element, width, height, options) {
    this.width = width;
    this.height = height;
    this.data = null;
    this.canvas = {};
    this.canvasContext = {};
    let getElement = (element)=>{
      if (typeof element === 'string'){
        return document.querySelector(element)
      }
      if (typeof element === 'object' && (element instanceof Element || element instanceof HTMLDocument)){
        return element
      }
      console.warn("未找到对应div元素");
    }
    // 设置最外面的容器
    const container = getElement(element);
    ElementOperator.setClass(container, stylePrefix + '--container');
    ElementOperator.setWidth(container, `${width}px`);
    ElementOperator.setHeight(container, `${height}px`);
    console.log(container);

    // 初始化数据
    this.data = JSON.parse(JSON.stringify(defaultData));

    // 初始化画布
    this.canvas = document.createElement('canvas');
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    const dpr = window.devicePixelRatio;
    this.canvas.width = Math.floor(width * dpr);
    this.canvas.height = Math.floor(height * dpr);
    this.canvasContext = this.canvas.getContext('2d');
    this.canvasContext.scale(dpr, dpr);
    container.append(this.canvas);
    //初始化渲染器
    this.renderer = new Renderer(this.canvasContext, width, height);

    // 在画布上放多个重叠的透明元素，这个元素负责点击事件之类的，在单元框被点击的时候，这些透明元素会变色来显示选中
    this.overLayer = new OverLayer(container);

  }

  setData(data){
    this.data = data;
    return this;
  }

  getData(){
    return this.data;
  }

  /**
   * 渲染表单
   */
  render(){
    this.renderer.render();
    return this;
  }

  static create(element, width, height, options) {
    return new Table(element, width, height, options);
  }

}