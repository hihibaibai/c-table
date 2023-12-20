import {stylePrefix} from "../../table/config";
import {h} from "../../table/element";

const icon =
    '<svg width="18" height="18" style="display: block;margin: auto">' +
    '  <path fill="#000000" fill-rule="evenodd" d="M3,6 L1,6 L1,2 L8,2 L8,4 L3,4 L3,6 Z M10,4 L10,2 L17,2 L17,6 L15,6 L15,4 L10,4 Z M10,14 L15,14 L15,12 L17,12 L17,16 L10,16 L10,14 Z M1,12 L3,12 L3,14 L8,14 L8,16 L1,16 L1,12 Z M1,8 L5,8 L5,6 L8,9 L5,12 L5,10 L1,10 L1,8 Z M10,9 L13,6 L13,8 L17,8 L17,10 L13,10 L13,12 L10,9 Z"/>\n' +
    '</svg>';

export default class Merge {
  constructor(toolbar) {
    this.toolbar = toolbar;
    this.tag = 'Merge';
    this.active = false;
    this.el = this.element();
  }

  element() {
    const {tip} = this;
    const placeholder = document.createElement("div");
    placeholder.innerHTML = icon;
    const node = placeholder.firstElementChild;
    return h('div', `${stylePrefix}-toolbar-btn`)
        .on('click', (event) => {
          this.toolbar.mergeCell();
        })
        .css({
          width: '20px',
          height: '20px',
          backgroundColor: '#000',
          margin: '6px'
        })
        .append(node)
  }

}