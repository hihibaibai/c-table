import {stylePrefix} from "../../table/config";
import {h} from "../../table/element";
import colorPlatte from "./colorPlatte";

const icon =
    '      <svg width="18" height="18" style="display: block;margin: auto">\n' +
    '        <rect fill="#FFF" stroke="black" stroke-width="1" width="16" height="16"></rect>\n' +
    '      </svg>';

export default class Bgcolor {
  constructor(toolbar) {
    this.toolbar = toolbar;
    this.tag = 'bgcolor';
    this.value = toolbar.style.bgcolor;
    this.active = false;
    this.el = this.element();
    this.colorPlatte = new colorPlatte(this);
    this.colorPlatte.el.css({display: 'none'});
    this.el.element().append(this.colorPlatte.el.element());
    // console.log(this.el._)
    this.el.element().setAttribute('tabindex', '-1')
    this.el.on('blur', (evt) => {
      this.inactiveElementCss();
    })
    this.change = (colorString) => {
      console.log(colorString);
      this.el._.getElementsByTagName('rect')[0].setAttribute('fill', colorString);
      toolbar.style.bgcolor = colorString;
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
    let colorString = '#FFF'
    if (style.bgcolor){
      colorString = style.bgcolor;
    }
    this.value = colorString;
    this.change(this.value);
  }

  activeElementCss() {
    // console.log('active')
    this.active = !this.active;
    this.el.css('background-color', 'rgba(0,0,0,0.08)');
    this.colorPlatte.el.css({display: 'block'});
  }

  inactiveElementCss() {
    // console.log('inactive')
    this.active = !this.active;
    this.el.css('background-color', 'rgba(0,0,0,0)');
    this.colorPlatte.el.css({display: 'none'});
  }

  changeColor(colorString) {
    this.toolbar.style.bgcolor = colorString;
    this.toolbar.styleChanged();
    this.el._.getElementsByTagName('rect')[0].setAttribute('fill', colorString);
  }
}