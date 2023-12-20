import {stylePrefix} from "../../table/config";
import {h} from "../../table/element";

const icon =
  '    <svg width="18" height="18" style="display: block;margin: auto">\n' +
  '      <path fill="#000000" fill-rule="evenodd" d="M14,0 L0,0 L0,2 L14,2 L14,0 Z M0,12 L4,12 L4,10 L0,10 L0,12 Z M11.5,5 L0,5 L0,7 L11.75,7 C12.58,7 13.25,7.67 13.25,8.5 C13.25,9.33 12.58,10 11.75,10 L9,10 L9,8 L6,11 L9,14 L9,12 L11.5,12 C13.43,12 15,10.43 15,8.5 C15,6.57 13.43,5 11.5,5 Z" transform="translate(2 3)"/>\n' +
  '    </svg>';

export default class Textwrap {
  constructor(toolbar) {
    this.tag = 'textwrap';
    this.value = toolbar.style.textwrap;
    this.active = false;
    this.el = this.element();
    this.change = (value) => {
      toolbar.style.textwrap = value;
      toolbar.styleChanged();
    };
  }

  element() {
    const {tip} = this;
    const placeholder = document.createElement("div");
    placeholder.innerHTML = icon;
    const node = placeholder.firstElementChild;
    return h('div', `${stylePrefix}-toolbar-btn`)
      .on('click', (event) => {
        if (this.active) {
          this.deactiveElementCss();
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
    this.value = style.textwrap;
    if (this.value){
      this.active = true;
      this.el.css('background-color', 'rgba(0,0,0,0.08)');
    }
    else {
      this.active = false;
      this.el.css('background-color', 'rgba(0,0,0,0)');
    }
  }

  activeElementCss() {
    this.active = !this.active;
    this.el.css('background-color', 'rgba(0,0,0,0.08)');
    this.change(true);
  }

  deactiveElementCss() {
    this.active = !this.active;
    this.el.css('background-color', 'rgba(0,0,0,0)');
    this.change(false);
  }
}