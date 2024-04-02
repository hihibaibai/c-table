import {h} from "../../table/element";
import {stylePrefix} from "../../table/config";

const alignLeft = { type:"left",icon:
    '<svg width="18" height="18" style="display: block;margin: auto">' +
    '  <path fill="#000000" fill-rule="evenodd" d="M0,14 L10,14 L10,12 L0,12 L0,14 Z M10,4 L0,4 L0,6 L10,6 L10,4 Z M0,0 L0,2 L14,2 L14,0 L0,0 Z M0,10 L14,10 L14,8 L0,8 L0,10 Z" transform="translate(2 2)"/>\n' +
    '</svg>'
};

const alignCenter = { type:"center",icon:
    '<svg width="18" height="18" style="display: block;margin: auto">' +
    '  <path fill="#000000" fill-rule="evenodd" d="M0,14 L10,14 L10,12 L0,12 L0,14 Z M10,4 L0,4 L0,6 L10,6 L10,4 Z M0,0 L0,2 L14,2 L14,0 L0,0 Z M0,10 L14,10 L14,8 L0,8 L0,10 Z" transform="translate(2 2)"/>\n' +
    '</svg>'
}

const alignRight = { type:"right",icon:
    '<svg width="18" height="18" style="display: block;margin: auto">' +
    '  <path fill="#000000" fill-rule="evenodd" d="M0,14 L10,14 L10,12 L0,12 L0,14 Z M10,4 L0,4 L0,6 L10,6 L10,4 Z M0,0 L0,2 L14,2 L14,0 L0,0 Z M0,10 L14,10 L14,8 L0,8 L0,10 Z" transform="translate(2 2)"/>\n' +
    '</svg>'
}

export default class AlignOptions {
  constructor(icon) {
    let that = this;
    this.icon = icon;

    this.el = h('div', `${stylePrefix}-align-options`).css({
      'top': 0,
      'left': 0,
      'display': 'block',
      'position': 'relative',
      'background-color': 'wheat',
      'z-index': '999',
      'width': 'fit-content'
    });
    this.table = h('table', '').css({'z-index': 'auto'});
    let tbody = document.createElement('tbody');
    let tr = document.createElement('tr');
    let array = [alignLeft,alignCenter,alignRight]
    for (let alignPlaceIcon of array) {
      let td = document.createElement('td');
      let div = document.createElement('div');
      div.setAttribute('style', `width:16px; height:16px; margin:2px;`);
      div.innerHTML = alignPlaceIcon.icon;
      td.append(div);
      td.addEventListener('click', (evt) => {
        this.icon.changeAlign(alignPlaceIcon.type);
        // console.log('clicked')
      });
      tr.append(td);
    }
    tbody.append(tr);
    this.table.element().append(tbody);
    this.el.element().append(this.table._);
    return this;
  }
}
