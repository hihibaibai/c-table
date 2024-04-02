import {stylePrefix} from "../../table/config";
import {h} from "../../table/element";
import AlignOptions from "./alignOptions";

const icon =
    '<svg width="18" height="18" style="display: block;margin: auto">' +
    '  <path fill="#000000" fill-rule="evenodd" d="M0,14 L10,14 L10,12 L0,12 L0,14 Z M10,4 L0,4 L0,6 L10,6 L10,4 Z M0,0 L0,2 L14,2 L14,0 L0,0 Z M0,10 L14,10 L14,8 L0,8 L0,10 Z" transform="translate(2 2)"/>\n' +
    '</svg>';

export default class Align {
  constructor(toolbar) {
    this.toolbar = toolbar;
    this.tag = 'align';
    this.value = toolbar.style.align;
    this.active = false;
    this.el = this.element();
    this.alignOptions = new AlignOptions(this);
    this.alignOptions.el.css({display: 'none'});
    // this.colorPlatte = new colorPlatte(this);
    // this.colorPlatte.el.css({display: 'none'});
    this.el.element().append(this.alignOptions.el.element());
    // console.log(this.el._)
    this.el.element().setAttribute('tabindex', '-1')
    this.el.on('blur', (evt) => {
      this.inactiveElementCss();
    })
    this.change = (string) => {
      console.log(string);
      // this.el._.getElementsByTagName('rect')[0].setAttribute('fill', colorString);
      toolbar.style.align = string;
    };
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
    // .on('mouseenter', (evt) => {
    // 	tooltip(tip, evt.target);
    // })
    // .attr('data-tooltip', tip);
  }

  // 这个函数是用来更新绑定的值与对应的状态的。
  updateValue(style){
    console.log(style)
    if (style.align){
      // colorString = style.bgcolor;
    }
    // this.value = colorString;
    // this.change(this.value);
  }

  activeElementCss() {
    // console.log('active')
    this.active = true;
    this.el.css('background-color', 'rgba(0,0,0,0.08)');
    this.alignOptions.el.css({display: 'block'});
  }

  inactiveElementCss() {
    // console.log('inactive')
    this.active = false;
    this.el.css('background-color', 'rgba(0,0,0,0)');
    this.alignOptions.el.css({display: 'none'});
  }

  changeAlign(alignPlace) {
    this.toolbar.style.align = alignPlace;
    this.toolbar.styleChanged();
  }
  // changeColor(colorString) {
  //   this.toolbar.style.bgcolor = colorString;
  //   this.toolbar.styleChanged();
  //   this.el._.getElementsByTagName('rect')[0].setAttribute('fill', colorString);
  // }
}