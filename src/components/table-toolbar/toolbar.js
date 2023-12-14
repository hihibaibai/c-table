import {h} from '../table/element';
import {stylePrefix} from "../table/config";
import Bold from "../table-toolbar/button/bold";
import Italic from "../table-toolbar/button/italic";
import StrikeThrough from "../table-toolbar/button/strikeThrough";
import Underline from "../table-toolbar/button/underline";
import TextColor from "../table-toolbar/button/textColor";
import Bgcolor from "../table-toolbar/button/bgcolor";
import {map} from "core-js/internals/array-iteration";

export default class toolbar {
  constructor(elementString, table) {
    // 初始化格式
    this.style = {
      bold: false,
      italic: false,
      fontSize: 10,
      align: 'left',//center,left,right
      valign: 'middle',
      underline: false,
      strikethrough: false,
      color: '#0a0a0a',
      bgcolor: '#FFF',
      // border:{//这个是单元格边框的格式
      // 	top:["thin","#000"],//第一个字符串表示线的粗细 可选为thin medium thick dashed dotted。第二个字符串表示线的颜色，使用16进制颜色表示
      // 	left:["thin","#000"],//同上
      // 	right:["thin","#000"],//同上
      // 	bottom:["thin","#000"]//同上
      // },
    };
    this._table = table

    this.container = null;
    // 接着画界面,
    const container = typeof elementString === 'string' ? document.querySelector(elementString) : elementString;
    if (container === null) {
      console.info('未获取到元素')
      throw new Error('未获取到元素');
    }
    // 先把外框画出来
    let width = table._width;
    console.log(width())
    this.container = h(container, `${stylePrefix}-toolbar`).css({
      width: width(),
      // color:'#f6f6f6',
      border: '1px solid #FFF',
      'background-color': '#FFF',
      display: 'flex',
      // height:'50px'
    });
    // 接着把按钮一个个塞进来
    // 这里放所有的按钮
    this.buttons = new Map();

    // 粗体
    let bold = new Bold(this);
    this.container.append(bold.el);
    this.buttons.set("bold", bold);

    // 斜体
    let italic = new Italic(this);
    this.container.append(italic.el);
    this.buttons.set("italic", italic);

    // 下划线
    let underline = new Underline(this);
    this.container.append(underline.el);
    this.buttons.set("underline", underline);

    // 划线
    let strikeThrough = new StrikeThrough(this);
    this.container.append(strikeThrough.el);
    this.buttons.set("strikeThrough", strikeThrough);

    // 字体颜色
    let color = new TextColor(this);
    this.container.append(color.el);
    this.buttons.set("color", color);

    // 背景颜色
    let bgcolor = new Bgcolor(this);
    this.container.append(bgcolor.el);
    this.buttons.set("bgcolor", bgcolor);

    // 在table组件内注入格式，这样在输入字符的时候就有格式可用了。
    table.toolbarStyle = this;
  };

  getCurrentStyle() {
    return this.style;
  }

  setStyle(style) {
    this.style = style;
    const styleList = Object.keys(style);
    for (let stringName of styleList) {
      if (this.buttons.has(stringName)){
        this.buttons.get(stringName).updateValue(style);
      }
    }
    console.log(style);
  }

  // 下面这个函数是用来监听内部的按钮是不是被按的，这样的话就能够根据选择的单元格更改他的格式了
  styleChanged() {
    const focusRange = this._table._selector._ranges[this._table._selector._ranges.length-1];
    const startCol = focusRange.startCol;
    const endCol = focusRange.endCol;
    const startRow = focusRange.startRow;
    const endRow = focusRange.endRow;
    // 这边是批量更改，而且要考虑到startCol会比endCol小
    // 先把所有单元格都找出来吧
    let row = [];
    let col = [];
    if (startCol>endCol){
      col[0] = endCol;
      col[1] = startCol;
    }
    else {
      col[0] = startCol;
      col[1] = endCol;
    }
    if (startRow>endRow){
      row[0] = endRow;
      row[1] = startRow;
    }
    else {
      row[0] = startRow;
      row[1] = endRow;
    }
    let cellList = [];
    for (let i = row[0]; i <= row[1]; i++){
      for (let j = col[0]; j <= col[1]; j++){
        let cell = this._table.getCell(i,j);
        let styleIndex = this._table.addStyle(this.style);
        // 因为这里改的是对象里面的变量，所以不需要额外再设置了，直接渲染就有效果
        cell[2].style = styleIndex;
        // this._table.setCell(i,j,cell);
        // console.log(cell)
      }
    }
    this._table.render();
  }

  static create(elementString, table) {
    return new toolbar(elementString, table);
  }
}

