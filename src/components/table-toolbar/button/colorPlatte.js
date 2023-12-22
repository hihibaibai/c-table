import {h} from "../../table/element";
import {stylePrefix} from "../../table/config";
import {changeColor} from '../toolbar'

const colorGrid = [
	['#ffffff', '#000100', '#e7e5e6', '#445569', '#5b9cd6', '#ed7d31', '#a5a5a5', '#ffc001', '#4371c6', '#71ae47'],
	['#f2f2f2', '#7f7f7f', '#d0cecf', '#d5dce4', '#deeaf6', '#fce5d5', '#ededed', '#fff2cd', '#d9e2f3', '#e3efd9'],
	['#d8d8d8', '#595959', '#afabac', '#adb8ca', '#bdd7ee', '#f7ccac', '#dbdbdb', '#ffe59a', '#b3c6e7', '#c5e0b3'],
	['#bfbfbf', '#3f3f3f', '#756f6f', '#8596b0', '#9cc2e6', '#f4b184', '#c9c9c9', '#fed964', '#8eaada', '#a7d08c'],
	['#a5a5a5', '#262626', '#3a3839', '#333f4f', '#2e75b5', '#c45a10', '#7b7b7b', '#bf8e01', '#2f5596', '#538136'],
	['#7f7f7f', '#0c0c0c', '#171516', '#222a35', '#1f4e7a', '#843c0a', '#525252', '#7e6000', '#203864', '#365624'],
]

export default class ColorPlatte {
	constructor(icon) {
		let that = this;
		this.icon = icon;
		this.color = icon.value ? icon.value : '#000';
		this.el = h('div', `${stylePrefix}-color-palette`).css({
			'top': 0,
			'left': 0,
			'display': 'block',
			'position': 'relative',
			'background-color': 'wheat',
			'z-index': '999',
			'width': 'fit-content'
		});
		this.table = h('table', '').css({'z-index': 'auto'});
		// console.log(this.table)
		// 这里两个for循环拼装table
		let tbody = document.createElement('tbody');
		for (let i = 0; i < colorGrid.length; i++) {
			let tr = document.createElement('tr');
			for (let j = 0; j < colorGrid[i].length; j++) {
				let td = document.createElement('td');
				let div = document.createElement('div');
				div.setAttribute('style', `width:16px; height:16px; margin:2px; background-color:${colorGrid[i][j]}`);
				td.append(div);
				td.addEventListener('click', (evt) => {
					that.color = colorGrid[i][j];
					this.icon.changeColor(that.color);
          this.icon.inactiveElementCss();
					evt.stopPropagation();
					// console.log('clicked')
				});
				tr.append(td);
			}
			tbody.append(tr);
		}
		this.table.element().append(tbody);
		this.el.element().append(this.table._);
		return this;
	}
}