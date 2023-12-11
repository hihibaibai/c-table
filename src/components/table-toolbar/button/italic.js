import {stylePrefix} from "../../table/config";
import {h} from "../../table/element";

const icon =
    '    <svg width="18" height="18" style="display: block;margin: auto">\n' +
    '      <polygon fill="#000000" fill-rule="evenodd" points="4 0 4 2 6.58 2 2.92 10 0 10 0 12 8 12 8 10 5.42 10 9.08 2 12 2 12 0" transform="translate(3 3)"/>\n' +
    '    </svg>';

export default class Italic {
  constructor(style) {
    this.tag = 'italic';
    this.value = style.italic;
    this.active = false;
    this.el = this.element();
    this.change = (value) => {
      style.italic = value;
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