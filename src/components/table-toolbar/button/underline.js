import {stylePrefix} from "../../table/config";
import {h} from "../../table/element";

const icon =
		'    <svg width="18" height="18" style="display: block;margin: auto">\n' +
  '      <path fill="#000000" d="M6,12 C8.76,12 11,9.76 11,7 L11,0 L9,0 L9,7 C9,8.75029916 7.49912807,10 6,10 C4.50087193,10 3,8.75837486 3,7 L3,0 L1,0 L1,7 C1,9.76 3.24,12 6,12 Z M0,13 L0,15 L12,15 L12,13 L0,13 Z" transform="translate(3 3)"/>\n' +
  '    </svg>';

export default class Underline{
	constructor(value) {
		this.tag = 'underline';
		this.value = value;
		this.el = this.element();
		this.change = () => {};
	}

	element() {
		const { tip } = this;
    const placeholder = document.createElement("div");
    placeholder.innerHTML = icon;
    const node = placeholder.firstElementChild;
		return h('div', `${stylePrefix}-toolbar-btn`)
				.on('click',(event) =>{
					if (this.value){
						this.activeElementCss();
					}
					else {
						this.deactiveElementCss();
					}
				})
				.css({
					width:'20px',
					height:'20px',
					backgroundColor:'#000',
          margin:'6px'
				})
				.append(node)
				// .on('mouseenter', (evt) => {
				// 	tooltip(tip, evt.target);
				// })
				// .attr('data-tooltip', tip);
	}

  activeElementCss(){
    this.value = !this.value;
    this.el.css('background-color','rgba(0,0,0,0.08)');
  }

  deactiveElementCss(){
    this.value = !this.value;
    this.el.css('background-color','rgba(0,0,0,0)');

  }
}