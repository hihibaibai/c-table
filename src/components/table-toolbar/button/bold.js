import {stylePrefix} from "../../table/config";
import {h} from "../../table/element";

const icon =
		'<svg width="18" height="18" style="display: block;margin: auto">' +
		'  <path fill="#000000" fill-rule="evenodd" d="M9,3.5 C9,1.57 7.43,0 5.5,0 L1.77635684e-15,0 L1.77635684e-15,12 L6.25,12 C8.04,12 9.5,10.54 9.5,8.75 C9.5,7.45 8.73,6.34 7.63,5.82 C8.46,5.24 9,4.38 9,3.5 Z M5,2 C5.82999992,2 6.5,2.67 6.5,3.5 C6.5,4.33 5.82999992,5 5,5 L3,5 L3,2 L5,2 Z M3,10 L3,7 L5.5,7 C6.32999992,7 7,7.67 7,8.5 C7,9.33 6.32999992,10 5.5,10 L3,10 Z" transform="translate(4 3)"/>\n' +
		'</svg>';

export default class Bold {
	constructor(toolbar) {
		this.toolbar = toolbar;
		this.tag = 'bold';
		this.value = toolbar.style.bold;
		this.active = false;
		this.el = this.element();
		this.change = (value) => {
			toolbar.style.bold = value;
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
		this.value = style.bold;
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