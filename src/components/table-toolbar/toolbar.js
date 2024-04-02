import {h} from '../table/element';
import {stylePrefix} from "../table/config";
import { expr2xy, xy2expr } from '../table-renderer/alphabet';
import Bold from "../table-toolbar/button/bold";
import Italic from "../table-toolbar/button/italic";
import StrikeThrough from "../table-toolbar/button/strikeThrough";
import Underline from "../table-toolbar/button/underline";
import TextColor from "../table-toolbar/button/textColor";
import Bgcolor from "../table-toolbar/button/bgcolor";
import Textwrap from "../table-toolbar/button/textwrap";
import Merge from "../table-toolbar/button/merge";
import Border from "../table-toolbar/button/border"
import Freeze from "../table-toolbar/button/freeze";
import Align from "../table-toolbar/button/align";
import Valign from "../table-toolbar/button/valign";

export default class toolbar {
  constructor(elementString, table) {
    // 初始化格式
    this.style = {
      bold: false,
      italic: false,
      fontSize: 10,
      align: 'left',// align: left | center | right
      valign: 'middle',// valign: top | middle | bottom
      underline: false,
      strikethrough: false,
      color: '#0a0a0a',
      bgcolor: '#FFF',
      border:{//这个是单元格边框的格式
      	// top:["thin","#000"],//第一个字符串表示线的粗细 可选为thin medium thick dashed dotted。第二个字符串表示线的颜色，使用16进制颜色表示
      	// left:["thin","#000"],//同上
      	// right:["thin","#000"],//同上
      	// bottom:["thin","#000"]//同上
      },
    };
    this.border = [];//'A1:B2', 'all', 'medium', '#21ba45' 这个array里面的第一个是用selector算出来的，剩下的是设置里面确定的
    // 第二个变量有10个可选值
    //'outside','all','left','top','right','bottom','inside','horizontal','vertical','none'
    this.merge = true;
    this.table = table

    this.container = null;
    // 接着画界面
    const container = typeof elementString === 'string' ? document.querySelector(elementString) : elementString;
    if (container === null) {
      console.info('未获取到元素')
      throw new Error('未获取到元素');
    }
    // 先把外框画出来
    let width = table._width;
    // console.log(width())
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

    // 自动换行
    let textwrap = new Textwrap(this);
    this.container.append(textwrap.el);
    this.buttons.set("textwrap", textwrap);

    // 合并
    let merge = new Merge(this);
    this.container.append(merge.el);
    this.buttons.set("merge",merge);

    // 边框
    let border = new Border(this);
    this.container.append(border.el);
    this.buttons.set("border",border);

    // 冻结按钮
    let freeze = new Freeze(this);
    this.container.append(freeze.el);
    this.buttons.set("freeze",freeze);

    // 水平居中设置
    let align = new Align(this);
    this.container.append(align.el);
    this.buttons.set("align", align);

    // 垂直居中设置
    let valign = new Valign(this);
    this.container.append(valign.el);
    this.buttons.set("valign", valign);

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
  }

  //todo: merge的点击后提示要做成excel一样的，但是selector的刷新事件还没有，需要再看一下。
  setIsMerge(selector){
    if (selector.currentRange){
      let mergeRangeExpression = `${xy2expr(selector.currentRange.startCol,selector.currentRange.startRow)}:${xy2expr(selector.currentRange.endCol,selector.currentRange.endRow)}`
    }
  }

  // 下面这个函数是用来监听内部的按钮是不是被按的，这样的话就能够根据选择的单元格更改他的格式了
  styleChanged() {
    if (this.table._selector.currentRange){
      const focusRange = this.table._selector.currentRange;
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
      for (let i = row[0]; i <= row[1]; i++){
        for (let j = col[0]; j <= col[1]; j++){
          let cell = this.table.getCell(i,j);
          console.log(cell);
          let styleIndex = this.table.addStyle(Object.assign({},this.style));
          let cellValue = Object.assign({},cell[2]);// 这里一定要新建对象，不然会导致更新出问题。
          cellValue.style = styleIndex;
          this.table.setCell(i,j,cellValue);
          // console.log(cell)
        }
      }
      // 这里要处理比较特殊的merge和表格边框
      this.table.render();
    }
  }

  // border:{//这个是单元格边框的格式
    // top:["thin","#000"],//第一个字符串表示线的粗细 可选为thin medium thick dashed dotted。第二个字符串表示线的颜色，使用16进制颜色表示
    // left:["thin","#000"],//同上
    // right:["thin","#000"],//同上
    // bottom:["thin","#000"]//同上
  // },
  addBorderToCell(type){
    console.log(this.table._selector.currentRange)
    console.log(type);
    let cell2DArray = [];
    if (this.table._selector.currentRange){
      this.table._selector.currentRange.eachRow((rowIndex)=>{
        let colCellArray = [];
        this.table._selector.currentRange.eachCol((colIndex)=>{
          colCellArray.push(this.table.getCell(rowIndex,colIndex));
        });
        cell2DArray.push(colCellArray);
      })
    }
    console.log(cell2DArray);
    let border = {};
    let borderIndex = null;
    switch (type){
      case 'all':
        border = {
          top:["thin","#000"],
          left:["thin","#000"],
          right:["thin","#000"],
          bottom:["thin","#000"]
        }
        borderIndex = this.table.addBorder(border);
        cell2DArray.forEach(row => {
          row.forEach(cell =>{
            cell[2].border = borderIndex;
            this.table.setCell(cell[0],cell[1],cell[2])
          });
        });
        break;
      case 'inside':
        for (let i = 0; i < cell2DArray.length; i++) {
          border = {};
          if (!!cell2DArray[i]){
            if (!!cell2DArray[i+1]){
              border.bottom=["thin","#000"];
            }
            for (let j = 0; j < cell2DArray[i].length; j++) {
              border = Object.assign({},border);
              delete border.right;
              if (!!cell2DArray[i][j]){
                let cell = cell2DArray[i][j];
                if (!!cell2DArray[i][j+1]){
                  border.right=["thin","#000"];
                }
                borderIndex = this.table.addBorder(border);
                cell[2].border = borderIndex;
                this.table.setCell(cell[0],cell[1],cell[2]);
              }
            }
          }
        }
        break;
      case 'horizontal':
        for (let i = 0; i < cell2DArray.length; i++) {
          border = {};
          if (!!cell2DArray[i]) {
            if (!!cell2DArray[i + 1]) {
              border.bottom = ["thin", "#000"];
            }
          }
          for (let j = 0; j < cell2DArray[i].length; j++) {
            if (!!cell2DArray[i][j]){
              let cell = cell2DArray[i][j];
              borderIndex = this.table.addBorder(border);
              cell[2].border = borderIndex;
              this.table.setCell(cell[0],cell[1],cell[2]);
            }
          }
        }
        break;
      case 'vertical':
        for (let i = 0; i < cell2DArray.length; i++) {
          for (let j = 0; j < cell2DArray[i].length; j++) {
            if (!!cell2DArray[i][j]){
              if (!!cell2DArray[i][j]){
                border = {};
                let cell = cell2DArray[i][j];
                if (!!cell2DArray[i][j+1]){
                  border.right=["thin","#000"];
                }
                borderIndex = this.table.addBorder(border);
                cell[2].border = borderIndex;
                this.table.setCell(cell[0],cell[1],cell[2]);
              }
            }
          }
        }
        break;
      case 'outside':
        for (let i = 0; i < cell2DArray.length; i++) {
          border = {};
          if (!!cell2DArray[i]){
            if (!cell2DArray[i-1]){
              border.top=["thin","#000"];
            }
            if (!cell2DArray[i+1]){
              border.bottom=["thin","#000"];
            }
            for (let j = 0; j < cell2DArray[i].length; j++) {
              border = Object.assign({},border);
              delete border.left;
              delete border.right;
              if (!!cell2DArray[i][j]){
                let cell = cell2DArray[i][j];
                if (!cell2DArray[i][j-1]){
                  border.left=["thin","#000"];
                }
                if (!cell2DArray[i][j+1]){
                  border.right=["thin","#000"];
                }
                borderIndex = this.table.addBorder(border);
                cell[2].border = borderIndex;
                this.table.setCell(cell[0],cell[1],cell[2]);
              }
            }
          }
        }
        break;
      case 'left':
        for (let i = 0; i < cell2DArray.length; i++) {
          border = {};
          if (!!cell2DArray[i]){
            for (let j = 0; j < cell2DArray[i].length; j++) {
              border = Object.assign({},border);
              delete border.left;
              delete border.right;
              if (!!cell2DArray[i][j]){
                let cell = cell2DArray[i][j];
                if (!cell2DArray[i][j-1]){
                  border.left=["thin","#000"];
                }
                borderIndex = this.table.addBorder(border);
                cell[2].border = borderIndex;
                this.table.setCell(cell[0],cell[1],cell[2]);
              }
            }
          }
        }
        break;
      case 'top':
        for (let i = 0; i < cell2DArray.length; i++) {
          border = {};
          if (!!cell2DArray[i]){
            if (!cell2DArray[i-1]){
              border.top=["thin","#000"];
            }
            for (let j = 0; j < cell2DArray[i].length; j++) {
              border = Object.assign({},border);
              delete border.left;
              delete border.right;
              if (!!cell2DArray[i][j]){
                let cell = cell2DArray[i][j];
                borderIndex = this.table.addBorder(border);
                cell[2].border = borderIndex;
                this.table.setCell(cell[0],cell[1],cell[2]);
              }
            }
          }
        }
        break;
      case 'right':
        for (let i = 0; i < cell2DArray.length; i++) {
          border = {};
          if (!!cell2DArray[i]){
            for (let j = 0; j < cell2DArray[i].length; j++) {
              border = Object.assign({},border);
              delete border.left;
              delete border.right;
              if (!!cell2DArray[i][j]){
                let cell = cell2DArray[i][j];
                if (!cell2DArray[i][j+1]){
                  border.right=["thin","#000"];
                }
                borderIndex = this.table.addBorder(border);
                cell[2].border = borderIndex;
                this.table.setCell(cell[0],cell[1],cell[2]);
              }
            }
          }
        }
        break;
      case 'bottom':
        for (let i = 0; i < cell2DArray.length; i++) {
          border = {};
          if (!!cell2DArray[i]){
            if (!cell2DArray[i+1]){
              border.bottom=["thin","#000"];
            }
            for (let j = 0; j < cell2DArray[i].length; j++) {
              border = Object.assign({},border);
              delete border.left;
              delete border.right;
              if (!!cell2DArray[i][j]){
                let cell = cell2DArray[i][j];
                borderIndex = this.table.addBorder(border);
                cell[2].border = borderIndex;
                this.table.setCell(cell[0],cell[1],cell[2]);
              }
            }
          }
        }
        break;
      case 'none':
        cell2DArray.forEach(row => {
          row.forEach(cell =>{
            delete cell[2].border;
            this.table.setCell(cell[0],cell[1],cell[2])
          });
        });
        break;
      default:
        break;
    }

    this.table.render();
  }

  // 下面这个函数是用来设置单元格合并的
  mergeCell(){
    if (this.table._selector.currentRange){
      const focusRange = this.table._selector.currentRange;
      const startCol = focusRange.startCol;
      const endCol = focusRange.endCol;
      const startRow = focusRange.startRow;
      const endRow = focusRange.endRow;
      console.log(focusRange);
      console.log(xy2expr(startCol,startRow))
      let mergeRangeExpression = `${xy2expr(startCol,startRow)}:${xy2expr(endCol,endRow)}`
      console.log(this.table.isMerged(mergeRangeExpression));
      if (this.table.isMerged(mergeRangeExpression)){
        this.table.unmerge(mergeRangeExpression);
      }
      else {
        this.table.merge(mergeRangeExpression);
      }
      this.table.render();
    }
  }

  static create(elementString, table) {
    return new toolbar(elementString, table);
  }
}

