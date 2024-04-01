import {stylePrefix} from "../../table/config";
import {h} from "../../table/element";
import {xy2expr} from "../..//table-renderer";

const icon =
    '    <svg width="18" height="18" style="display: block;margin: auto">\n' +
    '     <path fill="#000000" fill-rule="evenodd" d="M7,3 L9,2 L15,5 L15,13 L9,16 L3,13 L3,5 L6,3.5 Z M4,5.5 L9,8 L14,5.5 M9,8 L9,12 M9,13 L9,15"/>\n' +
    '    </svg>';

export default class Freeze {
  constructor(toolbar) {
    this.tag = 'freeze';
    this.value = toolbar;
    this.active = false;
    this.el = this.element();
    this.change = (value) => {
      toolbar.style.freeze = value;
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
          console.log(this.value.table._selector)
          if (this.value.table._selector._placement=="row-header"){
            let array = this.value.table._selector._focus;
            let expr = xy2expr(array[1],array[0]+1);
            // console.log(expr);
            this.value.table.freeze(expr).render();
          }
          if (this.value.table._selector._placement=="col-header"){
            let array = this.value.table._selector._focus;
            let expr = xy2expr(array[1]+1,array[0]);
            this.value.table.freeze(expr).render();
          }
          if (this.value.table._selector._placement == "all") {
            let expr = xy2expr(0,0);
            this.value.table.freeze(expr).render();
          }
          // if (this.value.table.selector.)
          // this.value.table.selector;
          // if (this.active) {
          //   this.deactiveElementCss();
          // }
          // else {
          //   this.activeElementCss();
          // }
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

  // activeElementCss() {
  //   this.active = !this.active;
  //   this.el.css('background-color', 'rgba(0,0,0,0.08)');
  //   this.change(true);
  // }

  // deactiveElementCss() {
  //   this.active = !this.active;
  //   this.el.css('background-color', 'rgba(0,0,0,0)');
  //   this.change(false);
  // }
}