import {h} from "../../table/element";
import {stylePrefix} from "../../table/config";

const alignTop = { type:"top",icon:
      '<svg width="18" height="18" style="display: block;margin: auto">' +
      '  <path fill="#000000" fill-rule="evenodd" d="M0,0 L0,2 L12,2 L12,0 L0,0 L0,0 Z M2.5,7 L5,7 L5,14 L7,14 L7,7 L9.5,7 L6,3.5 L2.5,7 L2.5,7 Z" transform="translate(3 2)"/>\n' +
      '</svg>'
};

const alignMiddle = { type:"middle",icon:
      '<svg width="18" height="18" style="display: block;margin: auto">' +
      '  <path fill="#000000" fill-rule="evenodd" d="M9.5,3 L7,3 L7,0 L5,0 L5,3 L2.5,3 L6,6.5 L9.5,3 L9.5,3 Z M0,8 L0,10 L12,10 L12,8 L0,8 L0,8 Z M2.5,15 L5,15 L5,18 L7,18 L7,15 L9.5,15 L6,11.5 L2.5,15 L2.5,15 Z" transform="translate(3)"/>\n' +
      '</svg>'
};

const alignBottom = { type:"bottom",icon:
      '<svg width="18" height="18" style="display: block;margin: auto">' +
      '  <path fill="#000000" fill-rule="evenodd" d="M9.5,7 L7,7 L7,0 L5,0 L5,7 L2.5,7 L6,10.5 L9.5,7 L9.5,7 Z M0,12 L0,14 L12,14 L12,12 L0,12 L0,12 Z" transform="translate(3 2)"/>\n' +
      '</svg>'
};

export default class ValignOptions{
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
    let array = [alignTop,alignMiddle,alignBottom]
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
