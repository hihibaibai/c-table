import {stylePrefix} from "../../table/config";
import {h} from "../../table/element";
import colorPlatte from "./colorPlatte";

const icon =
		'      <svg width="18" height="18" style="display: block;margin: auto">\n' +
		'        <path fill="#000000" fill-rule="evenodd" d="M7,1.5 L5,1.5 L0.5,13.5 L2.5,13.5 L3.62,10.5 L8.37,10.5 L9.49,13.5 L11.49,13.5 L7,1.5 L7,1.5 Z M4.38,8.5 L6,3.17 L7.62,8.5 L4.38,8.5 L4.38,8.5 Z" transform="translate(2 1)"/>\n' +
		'      </svg>';


export default class TextColor {
	constructor(toolbar) {
		this.toolbar = toolbar;
		this.tag = 'textColor';
		this.value = toolbar.style.color;
		this.active = false;
		this.el = this.element();
		this.colorPlatte = new colorPlatte(this);
		this.colorPlatte.el.css({display:'none'});
		this.el._.append(this.colorPlatte.el._);
		console.log(this.el._)
		this.el._.setAttribute('tabindex','-1')
		this.el.on('blur',(evt)=>{
			this.inactiveElementCss();
		})
		this.change = (colorString) => {
			this.el._.getElementsByTagName('path')[0].setAttribute('fill', colorString);
			toolbar.style.color = colorString;
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
		let colorString = '#FFF'
		if (style.color){
			colorString = style.color;
		}
		this.value = colorString;
		this.change(this.value);
	}

	activeElementCss() {
		// console.log('active')
		this.active = !this.active;
		this.el.css('background-color', 'rgba(0,0,0,0.08)');
		this.colorPlatte.el.css({display:'block'});
	}

	inactiveElementCss() {
		// console.log('inactive')
		this.active = !this.active;
		this.el.css('background-color', 'rgba(0,0,0,0)');
		this.colorPlatte.el.css({display:'none'});
	}

	changeColor(colorString){
		this.toolbar.style.color = colorString;
		this.toolbar.styleChanged();
		this.el._.getElementsByTagName('path')[0].setAttribute('fill', colorString);
	}
}