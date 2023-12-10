import {stylePrefix} from "@/components/table/config";
import {h} from "@/components/table/element";

export default class Bold{
	constructor(value) {
		this.tag = 'bold';
		this.value = value;
		this.el = this.element();
		this.change = () => {};
	}

	element() {
		const { tip } = this;
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
					border:'1px solid #000'
				})
				// .on('mouseenter', (evt) => {
				// 	tooltip(tip, evt.target);
				// })
				// .attr('data-tooltip', tip);
	}

	activeElementCss(){
		this.el.css('background-color','#727272');
	}

	deactiveElementCss(){
		this.el.css('background-color','#ffffff');

	}
}