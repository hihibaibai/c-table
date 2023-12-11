import {stylePrefix} from "../../table/config";
import {h} from "../../table/element";

const icon =
		'      <svg width="18" height="18" style="display: block;margin: auto">\n' +
  '        <rect fill="#000000" stroke="black" stroke-width="1" width="16" height="16"></rect>\n' +
  '      </svg>';

export default class Bgcolor{
	constructor(value) {
		this.tag = 'bgcolor';
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
					this.value = !this.value;
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
		this.el.css('background-color','rgba(0,0,0,0.08)');
	}

	deactiveElementCss(){
		this.el.css('background-color','rgba(0,0,0,0)');

	}
}