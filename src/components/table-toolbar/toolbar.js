import {h} from '../table/element';
import {stylePrefix} from "../table/config";
import Bold from "../table-toolbar/button/bold";
import Italic from "@views/report/tableComponent/table-toolbar/button/italic";
import StrikeThrough from "@views/report/tableComponent/table-toolbar/button/strikeThrough";
import Underline from "@views/report/tableComponent/table-toolbar/button/underline";
import TextColor from "@views/report/tableComponent/table-toolbar/button/textColor";
import Bgcolor from "@views/report/tableComponent/table-toolbar/button/bgcolor";
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
      console.info('未获取到元素')
			throw new Error('未获取到元素');
		}
		// 先把外框画出来
		let width = table._width;
		console.log(width())
		this.container = h(container,`${stylePrefix}-toolbar`).css({
			width: width(),
      // color:'#f6f6f6',
      border:'1px solid #FFF',
      'background-color':'#FFF',
      display: 'flex',
			// height:'50px'
		});
		// 接着把按钮一个个塞进来
		// 这里放所有的按钮
		this.buttons =[];

    // 粗体
		let bold = new Bold(this.style.bold);
		this.container.append(bold.el);
		this.buttons.push(bold);

    // 斜体
    let italic = new Italic(this.style.italic);
    this.container.append(italic.el);
    this.buttons.push(italic);

    // 下划线
    let underline = new Underline(this.style.underline);
    this.container.append(underline.el);
    this.buttons.push(underline);

    // 划线
    let strikeThrough = new StrikeThrough(this.style.strikethrough);
    this.container.append(strikeThrough.el);
    this.buttons.push(strikeThrough);

    // 字体颜色
    let textColor = new TextColor(this.style.textColor);
    this.container.append(textColor.el);
    this.buttons.push(textColor);

    // 背景颜色
    let bgcolor = new Bgcolor(this.style.bgcolor);
    this.container.append(bgcolor.el);
    this.buttons.push(bgcolor);

	};

	getCurrentStyle(){
		return this.style;
	}

	static create(elementString, table) {
		return new toolbar(elementString, table);
	}
}

