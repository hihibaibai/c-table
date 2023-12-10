import {h} from '../table/element';
import {stylePrefix} from "@/components/table/config";
import Bold from "@/components/table-toolbar/button/bold";
export default class toolbar{
	constructor(elementString,table) {
		// 初始化格式
		this.style={
			bold:false,
			italic:false,
			size:12,
			align:'center',
			valign:'middle',
			underline:false,
			strikethrough:false,
			color:'#000',
			bgcolor:'#f0f0f0',
			border:{//这个是单元格边框的格式
				top:["thin","#000"],//第一个字符串表示线的粗细 可选为thin medium thick dashed dotted。第二个字符串表示线的颜色，使用16进制颜色表示
				left:["thin","#000"],//同上
				right:["thin","#000"],//同上
				bottom:["thin","#000"]//同上
			},
		};

		this.container = null;
		// 接着画界面,
		const container = typeof elementString === 'string' ? document.querySelector(elementString) : elementString;
		if (container === null){
			throw new Error('未获取到元素');
		}
		// 先把外框画出来
		let width = table._width;
		console.log(width())
		this.container = h(container,`${stylePrefix}-toolbar`).css({
			width: width(),
			// height:'50px'
		});
		// 接着把按钮一个个塞进来
		// 这里放所有的按钮
		this.buttons =[];

		let bold = new Bold(this.style.bold)
		this.container.append(bold.el);
		this.buttons.push(bold);



	};

	getCurrentStyle(){
		return this.style;
	}

	static create(elementString, table) {
		return new toolbar(elementString, table);
	}
}

