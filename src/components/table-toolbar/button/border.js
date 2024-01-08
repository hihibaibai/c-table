import {stylePrefix} from "../../table/config";
import {h} from "../../table/element";

const icon =
    '<svg width="18" height="18" style="display: block;margin: auto" >\n' +
    '  <path fill="#000000" fill-rule="evenodd" d="M0,0 L0,14 L14,14 L14,0 L0,0 L0,0 Z M6,12 L2,12 L2,8 L6,8 L6,12 L6,12 Z M6,6 L2,6 L2,2 L6,2 L6,6 L6,6 Z M12,12 L8,12 L8,8 L12,8 L12,12 L12,12 Z M12,6 L8,6 L8,2 L12,2 L12,6 L12,6 Z" transform="translate(2,3)"/>\n' +
    '</svg>';

const all =
    '<svg width="18" height="18" style="display: block;margin: auto">' +
    '   <path transform="translate(2,2)" fill="#000000" fill-rule="evenodd" d="M0,0 L0,14 L14,14 L14,0 L0,0 L0,0 Z M6,12 L2,12 L2,8 L6,8 L6,12 L6,12 Z M6,6 L2,6 L2,2 L6,2 L6,6 L6,6 Z M12,12 L8,12 L8,8 L12,8 L12,12 L12,12 Z M12,6 L8,6 L8,2 L12,2 L12,6 L12,6 Z"/>\n' +
    '</svg>';
const inside =
    '<svg width="18" height="18" style="display: block;margin: auto">' +
    '  <path transform="translate(2,2)" d="M0,14 L2,14 L2,12 L0,12 L0,14 L0,14 Z M2,3 L0,3 L0,5 L2,5 L2,3 L2,3 Z M3,14 L5,14 L5,12 L3,12 L3,14 L3,14 Z M11,0 L9,0 L9,2 L11,2 L11,0 L11,0 Z M2,0 L0,0 L0,2 L2,2 L2,0 L2,0 Z M5,0 L3,0 L3,2 L5,2 L5,0 L5,0 Z M0,11 L2,11 L2,9 L0,9 L0,11 L0,11 Z M9,14 L11,14 L11,12 L9,12 L9,14 L9,14 Z M12,0 L12,2 L14,2 L14,0 L12,0 L12,0 Z M12,5 L14,5 L14,3 L12,3 L12,5 L12,5 Z M12,14 L14,14 L14,12 L12,12 L12,14 L12,14 Z M12,11 L14,11 L14,9 L12,9 L12,11 L12,11 Z" opacity=".54"/>\n' +
    '    <polygon transform="translate(2,2)" points="8 0 6 0 6 6 0 6 0 8 6 8 6 14 8 14 8 8 14 8 14 6 8 6"/>\n' +
    '</svg>';
const horizontal =
    '<svg width="18" height="18" style="display: block;margin: auto">' +
    '  <path transform="translate(2,2)" d="M6,14 L8,14 L8,12 L6,12 L6,14 L6,14 Z M3,2 L5,2 L5,0 L3,0 L3,2 L3,2 Z M6,11 L8,11 L8,9 L6,9 L6,11 L6,11 Z M3,14 L5,14 L5,12 L3,12 L3,14 L3,14 Z M0,5 L2,5 L2,3 L0,3 L0,5 L0,5 Z M0,14 L2,14 L2,12 L0,12 L0,14 L0,14 Z M0,2 L2,2 L2,0 L0,0 L0,2 L0,2 Z M0,11 L2,11 L2,9 L0,9 L0,11 L0,11 Z M12,11 L14,11 L14,9 L12,9 L12,11 L12,11 Z M12,14 L14,14 L14,12 L12,12 L12,14 L12,14 Z M12,5 L14,5 L14,3 L12,3 L12,5 L12,5 Z M12,0 L12,2 L14,2 L14,0 L12,0 L12,0 Z M6,2 L8,2 L8,0 L6,0 L6,2 L6,2 Z M9,2 L11,2 L11,0 L9,0 L9,2 L9,2 Z M6,5 L8,5 L8,3 L6,3 L6,5 L6,5 Z M9,14 L11,14 L11,12 L9,12 L9,14 L9,14 Z" opacity=".54"/>\n' +
    '    <polygon transform="translate(2,2)" points="0 8 14 8 14 6 0 6"/>' +
    '</svg>';
const vertical =
    '<svg width="18" height="18" style="display: block;margin: auto">' +
    '  <path transform="translate(2,2)" d="M3,14 L5,14 L5,12 L3,12 L3,14 L3,14 Z M0,5 L2,5 L2,3 L0,3 L0,5 L0,5 Z M0,2 L2,2 L2,0 L0,0 L0,2 L0,2 Z M3,8 L5,8 L5,6 L3,6 L3,8 L3,8 Z M3,2 L5,2 L5,0 L3,0 L3,2 L3,2 Z M0,14 L2,14 L2,12 L0,12 L0,14 L0,14 Z M0,8 L2,8 L2,6 L0,6 L0,8 L0,8 Z M0,11 L2,11 L2,9 L0,9 L0,11 L0,11 Z M12,0 L12,2 L14,2 L14,0 L12,0 L12,0 Z M12,8 L14,8 L14,6 L12,6 L12,8 L12,8 Z M12,14 L14,14 L14,12 L12,12 L12,14 L12,14 Z M12,5 L14,5 L14,3 L12,3 L12,5 L12,5 Z M12,11 L14,11 L14,9 L12,9 L12,11 L12,11 Z M9,14 L11,14 L11,12 L9,12 L9,14 L9,14 Z M9,8 L11,8 L11,6 L9,6 L9,8 L9,8 Z M9,2 L11,2 L11,0 L9,0 L9,2 L9,2 Z" opacity=".54"/>\n' +
    '    <polygon transform="translate(2,2)" points="6 14 8 14 8 0 6 0"/>\n' +
    '</svg>';
const outside =
    '<svg width="18" height="18" style="display: block;margin: auto">' +
    '  <path transform="translate(2,2)" d="M8,3 L6,3 L6,5 L8,5 L8,3 L8,3 Z M11,6 L9,6 L9,8 L11,8 L11,6 L11,6 Z M8,6 L6,6 L6,8 L8,8 L8,6 L8,6 Z M8,9 L6,9 L6,11 L8,11 L8,9 L8,9 Z M5,6 L3,6 L3,8 L5,8 L5,6 L5,6 Z" opacity=".54"/>\n' +
    '    <path transform="translate(2,2)" d="M0,0 L14,0 L14,14 L0,14 L0,0 Z M12,12 L12,2 L2,2 L2,12 L12,12 Z"/>\n' +
    '</svg>';
const left =
    '<svg width="18" height="18" style="display: block;margin: auto">' +
    '      <path transform="translate(2,2)" d="M6,8 L8,8 L8,6 L6,6 L6,8 L6,8 Z M6,5 L8,5 L8,3 L6,3 L6,5 L6,5 Z M6,11 L8,11 L8,9 L6,9 L6,11 L6,11 Z M6,14 L8,14 L8,12 L6,12 L6,14 L6,14 Z M3,14 L5,14 L5,12 L3,12 L3,14 L3,14 Z M3,2 L5,2 L5,0 L3,0 L3,2 L3,2 Z M3,8 L5,8 L5,6 L3,6 L3,8 L3,8 Z M12,14 L14,14 L14,12 L12,12 L12,14 L12,14 Z M12,8 L14,8 L14,6 L12,6 L12,8 L12,8 Z M12,11 L14,11 L14,9 L12,9 L12,11 L12,11 Z M12,5 L14,5 L14,3 L12,3 L12,5 L12,5 Z M6,2 L8,2 L8,0 L6,0 L6,2 L6,2 Z M12,0 L12,2 L14,2 L14,0 L12,0 L12,0 Z M9,14 L11,14 L11,12 L9,12 L9,14 L9,14 Z M9,8 L11,8 L11,6 L9,6 L9,8 L9,8 Z M9,2 L11,2 L11,0 L9,0 L9,2 L9,2 Z" opacity=".54"/>\n' +
    '    <polygon transform="translate(2,2)" points="0 14 2 14 2 0 0 0"/>\n' +
    '</svg>';
const top =
    '<svg width="18" height="18" style="display: block;margin: auto">' +
    '      <path transform="translate(2,2)" d="M3,8 L5,8 L5,6 L3,6 L3,8 L3,8 Z M0,14 L2,14 L2,12 L0,12 L0,14 L0,14 Z M6,14 L8,14 L8,12 L6,12 L6,14 L6,14 Z M6,11 L8,11 L8,9 L6,9 L6,11 L6,11 Z M3,14 L5,14 L5,12 L3,12 L3,14 L3,14 Z M0,11 L2,11 L2,9 L0,9 L0,11 L0,11 Z M6,8 L8,8 L8,6 L6,6 L6,8 L6,8 Z M0,5 L2,5 L2,3 L0,3 L0,5 L0,5 Z M0,8 L2,8 L2,6 L0,6 L0,8 L0,8 Z M12,8 L14,8 L14,6 L12,6 L12,8 L12,8 Z M12,11 L14,11 L14,9 L12,9 L12,11 L12,11 Z M12,5 L14,5 L14,3 L12,3 L12,5 L12,5 Z M6,5 L8,5 L8,3 L6,3 L6,5 L6,5 Z M9,14 L11,14 L11,12 L9,12 L9,14 L9,14 Z M9,8 L11,8 L11,6 L9,6 L9,8 L9,8 Z M12,14 L14,14 L14,12 L12,12 L12,14 L12,14 Z" opacity=".54"/>\n' +
    '    <polygon transform="translate(2,2)" points="0 0 0 2 14 2 14 0"/>\n' +
    '</svg>';
const right =
    '<svg width="18" height="18" style="display: block;margin: auto">' +
    '      <path transform="translate(2,2)" d="M0,2 L2,2 L2,0 L0,0 L0,2 L0,2 Z M3,2 L5,2 L5,0 L3,0 L3,2 L3,2 Z M3,8 L5,8 L5,6 L3,6 L3,8 L3,8 Z M3,14 L5,14 L5,12 L3,12 L3,14 L3,14 Z M0,5 L2,5 L2,3 L0,3 L0,5 L0,5 Z M0,8 L2,8 L2,6 L0,6 L0,8 L0,8 Z M0,14 L2,14 L2,12 L0,12 L0,14 L0,14 Z M0,11 L2,11 L2,9 L0,9 L0,11 L0,11 Z M9,8 L11,8 L11,6 L9,6 L9,8 L9,8 Z M6,14 L8,14 L8,12 L6,12 L6,14 L6,14 Z M9,14 L11,14 L11,12 L9,12 L9,14 L9,14 Z M6,2 L8,2 L8,0 L6,0 L6,2 L6,2 Z M9,2 L11,2 L11,0 L9,0 L9,2 L9,2 Z M6,11 L8,11 L8,9 L6,9 L6,11 L6,11 Z M6,5 L8,5 L8,3 L6,3 L6,5 L6,5 Z M6,8 L8,8 L8,6 L6,6 L6,8 L6,8 Z" opacity=".54"/>\n' +
    '    <polygon transform="translate(2,2)" points="12 0 12 14 14 14 14 0"/>\n' +
    '</svg>';
const bottom =
    '<svg width="18" height="18" style="display: block;margin: auto">' +
    '      <path transform="translate(2,2)" d="M5,0 L3,0 L3,2 L5,2 L5,0 L5,0 Z M8,6 L6,6 L6,8 L8,8 L8,6 L8,6 Z M8,9 L6,9 L6,11 L8,11 L8,9 L8,9 Z M11,6 L9,6 L9,8 L11,8 L11,6 L11,6 Z M5,6 L3,6 L3,8 L5,8 L5,6 L5,6 Z M11,0 L9,0 L9,2 L11,2 L11,0 L11,0 Z M8,3 L6,3 L6,5 L8,5 L8,3 L8,3 Z M8,0 L6,0 L6,2 L8,2 L8,0 L8,0 Z M2,9 L0,9 L0,11 L2,11 L2,9 L2,9 Z M12,11 L14,11 L14,9 L12,9 L12,11 L12,11 Z M12,5 L14,5 L14,3 L12,3 L12,5 L12,5 Z M12,8 L14,8 L14,6 L12,6 L12,8 L12,8 Z M12,0 L12,2 L14,2 L14,0 L12,0 L12,0 Z M2,0 L0,0 L0,2 L2,2 L2,0 L2,0 Z M2,3 L0,3 L0,5 L2,5 L2,3 L2,3 Z M2,6 L0,6 L0,8 L2,8 L2,6 L2,6 Z" opacity=".54"/>\n' +
    '    <polygon transform="translate(2,2)" points="0 14 14 14 14 12 0 12"/>\n' +
    '</svg>';
const none =
    '<svg width="18" height="18" style="display: block;margin: auto">' +
    '  <path transform="translate(2,2)" fill="#000000" fill-rule="evenodd" d="M6,14 L8,14 L8,12 L6,12 L6,14 L6,14 Z M3,8 L5,8 L5,6 L3,6 L3,8 L3,8 Z M3,2 L5,2 L5,0 L3,0 L3,2 L3,2 Z M6,11 L8,11 L8,9 L6,9 L6,11 L6,11 Z M3,14 L5,14 L5,12 L3,12 L3,14 L3,14 Z M0,5 L2,5 L2,3 L0,3 L0,5 L0,5 Z M0,14 L2,14 L2,12 L0,12 L0,14 L0,14 Z M0,2 L2,2 L2,0 L0,0 L0,2 L0,2 Z M0,8 L2,8 L2,6 L0,6 L0,8 L0,8 Z M6,8 L8,8 L8,6 L6,6 L6,8 L6,8 Z M0,11 L2,11 L2,9 L0,9 L0,11 L0,11 Z M12,11 L14,11 L14,9 L12,9 L12,11 L12,11 Z M12,14 L14,14 L14,12 L12,12 L12,14 L12,14 Z M12,8 L14,8 L14,6 L12,6 L12,8 L12,8 Z M12,5 L14,5 L14,3 L12,3 L12,5 L12,5 Z M12,0 L12,2 L14,2 L14,0 L12,0 L12,0 Z M6,2 L8,2 L8,0 L6,0 L6,2 L6,2 Z M9,2 L11,2 L11,0 L9,0 L9,2 L9,2 Z M6,5 L8,5 L8,3 L6,3 L6,5 L6,5 Z M9,14 L11,14 L11,12 L9,12 L9,14 L9,14 Z M9,8 L11,8 L11,6 L9,6 L9,8 L9,8 Z" transform="translate(2,2)" opacity=".54"/>\n' +
    '</svg>';

export default class Border {
  constructor(toolbar) {
    this.toolbar = toolbar;
    this.tag = 'border';
    this.active = false;
    this.el = this.element();
    this.optionsContainer = h('div', `${stylePrefix}-border--options`).css({
      'top': 0,
      'left': 0,
      'display': 'none',
      'position': 'relative',
      'background-color': 'wheat',
      'z-index': '999',
      'width': 'fit-content'
    });
    let optionsContainer = this.optionsContainer;
    // 这里放所有的选项，以及对应的绑定事件
    let tr;
    let td;
    let div;
    let table = h('table').css({'z-index': 'auto'});
    // 初始化第一行
    tr = h('tr');

    // 第一个单元格
    td = h('td');
    div = h('div');
    div.on('click',()=>{this.updateBorder('all')});
    div.element().innerHTML=all;
    td.append(div.element());
    tr.append(td.element());

    // 第二个单元格
    td = h('td');
    div = h('div');
    div.on('click',()=>{this.updateBorder('inside')});
    div.element().innerHTML=inside;
    td.append(div);
    tr.append(td);

    // 第三个单元格
    td = h('td');
    div = h('div');
    div.on('click',()=>{this.updateBorder('horizontal')});
    div.element().innerHTML=horizontal;
    td.append(div);
    tr.append(td);

    // 第四个单元格
    td = h('td');
    div = h('div');
    div.on('click',()=>{this.updateBorder('vertical')});
    div.element().innerHTML=vertical;
    td.append(div);
    tr.append(td);

    // 第五个单元格
    td = h('td');
    div = h('div');
    div.on('click',()=>{this.updateBorder('outside')});
    div.element().innerHTML=outside;
    td.append(div);
    tr.append(td);

    table.append(tr.element());
    // 在第一行塞入表格后再初始化第二行
    tr = h('tr');

    // 第一个单元格
    td = h('td');
    div = h('div');
    div.on('click',()=>{this.updateBorder('left')});
    div.element().innerHTML=left;
    td.append(div.element());
    tr.append(td.element());

    // 第二个单元格
    td = h('td');
    div = h('div');
    div.on('click',()=>{this.updateBorder('top')});
    div.element().innerHTML=top;
    td.append(div);
    tr.append(td);

    // 第三个单元格
    td = h('td');
    div = h('div');
    div.on('click',()=>{this.updateBorder('right')});
    div.element().innerHTML=right;
    td.append(div);
    tr.append(td);

    // 第四个单元格
    td = h('td');
    div = h('div');
    div.on('click',()=>{this.updateBorder('bottom')});
    div.element().innerHTML=bottom;
    td.append(div);
    tr.append(td);

    // 第五个单元格
    td = h('td');
    div = h('div');
    div.on('click',()=>{this.updateBorder('none')});
    div.element().innerHTML=none;
    td.append(div);
    tr.append(td);

    table.append(tr.element());
    optionsContainer.element().append(table.element());

    this.el.element().append(optionsContainer.element());
    // this.borderIcon = new borderIcon(this);
    // this.borderIcon.el.css({display: 'none'});
    // this.el.element().append(this.borderIcon.el.element());
    // console.log(this.el._)
    this.el.element().setAttribute('tabindex', '-1')
    this.el.on('blur', (evt) => {
      this.inactiveElementCss();
    })
    // this.change = (colorString) => {
    //   // console.log(colorString);
    //   this.el._.getElementsByTagName('rect')[0].setAttribute('fill', colorString);
    //   toolbar.style.bgcolor = colorString;
    // };
  }

  element() {
    const {tip} = this;
    const placeholder = document.createElement("div");
    placeholder.innerHTML = icon;
    const node = placeholder.firstElementChild;
    return h('div', `${stylePrefix}-toolbar-btn`)
        .on('click', (event) => {
          // console.log('div Clicked')
          if (this.active) {
            this.inactiveElementCss();
          } else {
            this.activeElementCss();
          }
        })
        .css({
          width: '20px',
          height: '20px',
          backgroundColor: '#000',
          margin: '6px'
        })
        .append(node)
  }

  // 这个函数是用来更新绑定的值与对应的状态的。边框组件是不需要做任何事的
  updateValue(style){

  }

  updateBorder(type){
    this.toolbar.addBorderToCell(type);
  }

  activeElementCss() {
    // console.log('active')
    this.active = true;
    this.el.css('background-color', 'rgba(0,0,0,0.08)');
    this.optionsContainer.css({display: 'block'});
  }

  inactiveElementCss() {
    // console.log('inactive')
    this.active = false;
    this.el.css('background-color', 'rgba(0,0,0,0)');
    this.optionsContainer.css({display: 'none'});
  }

  changeColor(colorString) {
    this.toolbar.style.bgcolor = colorString;
    this.toolbar.styleChanged();
    this.el._.getElementsByTagName('rect')[0].setAttribute('fill', colorString);
  }
}