import {stylePrefix} from "../../table/config";
import {h} from "../../table/element";
import ValignOptions from "./valignOptions";

const icon =
    '<svg width="18" height="18" style="display: block;margin: auto">' +
    '  <path fill="#000000" fill-rule="evenodd" d="M0,0 L0,2 L12,2 L12,0 L0,0 L0,0 Z M2.5,7 L5,7 L5,14 L7,14 L7,7 L9.5,7 L6,3.5 L2.5,7 L2.5,7 Z" transform="translate(3 2)"/>\n' +
    '</svg>'

export default class Valign {
  constructor(toolbar) {
    this.toolbar = toolbar;
    this.tag = 'valign';
    this.value = toolbar.style.valign;
    this.active = false;
    this.el = this.element();
    this.valignOptions = new ValignOptions(this);
    this.valignOptions.el.css({display: 'none'});
    // this.colorPlatte = new colorPlatte(this);
    // this.colorPlatte.el.css({display: 'none'});
    this.el.element().append(this.valignOptions.el.element());
    // console.log(this.el._)
    this.el.element().setAttribute('tabindex', '-1')
    this.el.on('blur', (evt) => {
      this.inactiveElementCss();
    })
    this.change = (string) => {
      console.log(string);
      // this.el._.getElementsByTagName('rect')[0].setAttribute('fill', colorString);
      toolbar.style.valign = string;
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
    if (style.valign){
      // colorString = style.bgcolor;
    }
    // this.value = colorString;
    // this.change(this.value);
  }

  activeElementCss() {
    // console.log('active')
    this.active = true;
    this.el.css('background-color', 'rgba(0,0,0,0.08)');
    this.valignOptions.el.css({display: 'block'});
  }

  inactiveElementCss() {
    // console.log('inactive')
    this.active = false;
    this.el.css('background-color', 'rgba(0,0,0,0)');
    this.valignOptions.el.css({display: 'none'});
  }

  changeAlign(alignPlace) {
    this.toolbar.style.valign = alignPlace;
    this.toolbar.styleChanged();
  }
}