import Canvas from "../table-renderer/canvas";

const a4Size = {
  width: 794-40,
  height: 1122-40,
}

import {cellBorderRender, cellRender} from '../table-renderer/cell-render'
import canvas from '../table-renderer/canvas'
// todo: 这个是给打印模块用的
export function print(table){
  // 先根据数据量，确定总宽度和高度，用来制作一个巨大的canvas
  // 先通过数据获取最大的行和列索引
  console.log(table.data());
  let dataList = table.data().cells;
  let maxRowIndex = 0;
  let maxColIndex = 0;
  dataList.forEach(cell => {
    if (cell[0] > maxRowIndex) {
      maxRowIndex = cell[0];
    }
    if (cell[1] > maxColIndex) {
      maxColIndex = cell[1];
    }
  })

  console.log(maxRowIndex,maxColIndex);
  console.log(table._renderer);
  let colWidthAt = (index) => table._renderer.colWidthAt(index);
  // 计算最大需要的宽和高
  let maxWidth = 0;
  let maxHeight = 0;
  for (let i = 0; i <= maxColIndex; i++) {
    maxWidth = maxWidth + table._renderer.colWidthAt(i);
  }
  for (let i = 0; i <= maxRowIndex; i++) {
    maxHeight = maxHeight + table._renderer.rowHeightAt(i);
  }

  // 如果不足一页A4的，那么就把宽和高设置为A4大小
  if (maxWidth < a4Size.width) {
    maxWidth = a4Size.width;
  }
  if (maxHeight < a4Size.height) {
    maxHeight = a4Size.height;
  }

  let canvasElement = document.createElement('canvas');
  // let canvasElement = document.getElementById('canvas');
  canvasElement.setAttribute('width',maxWidth.toString());
  canvasElement.setAttribute('height',maxHeight.toString());
  let canvas = new Canvas(canvasElement,1);
  let canvasContext = canvasElement.getContext('2d');
  canvasContext.save();
  // canvasContext.fillStyle = 'black';
  // canvasContext.fillRect(0,0,100,100);

  // 复制 renderArea函数，根据数据绘制不带框线的展示
  // 这里和renderArea的思路一样，先把所有的merge取出来，最后单独渲染
  let xOffset = 0;
  let yOffset = 0;
  for (let i = 0; i <= maxRowIndex; i++) {
    let rowIndex = i;
    let cellHeight = table._renderer.rowHeightAt(rowIndex);
    for (let j = 0; j <= maxColIndex; j++) {
      let colIndex = j;
      let cell = table.getCell(rowIndex,colIndex);
      let cellText = cell[2].value?cell[2].value:'';
      let cellStyle = cell[2].style!=null?table.style(cell[2].style):table._data.style;
      let cellBorder = cell[2].border!=null?table.border(cell[2].border):null;
      let cellWidth = table._renderer.colWidthAt(colIndex);
      const formatter = (v)=>{return v}
      cellRender(canvas,cell,{x:xOffset,y:yOffset,width:cellWidth,height: cellHeight},cellStyle,undefined,formatter);
      if (cellBorder){
        cellBorderRender(canvas,{x:xOffset,y:yOffset,width:cellWidth,height: cellHeight},cellBorder);
      }
      // canvasContext.save();
      // canvasContext.beginPath();
      // //设置初始位置
      // canvasContext.translate(xOffset,yOffset);
      // //画背景
      // canvasContext.fillStyle=cellStyle.bgcolor;
      // canvasContext.rect(0,0,cellWidth,cellHeight);
      // canvasContext.fill();
      // canvasContext.stroke();
      // canvasContext.beginPath();
      // canvasContext.fillStyle='black';
      // canvasContext.fillText(cellText,0,cellHeight-5);
      // canvasContext.restore();
      // // console.log(cell,cellStyle,cellBorder);

      xOffset = xOffset + cellWidth;
    }
    yOffset = yOffset + cellHeight;
    xOffset = 0;
  }

  console.log(canvasElement.toDataURL());
  return canvasElement.toDataURL();
  // 再历遍所有的单元格，跳过merge的单元格，这个时候就直接把格式，边框，和单元格内容渲染出来
  // 再渲染merge的单元格

  // 根据之前设置的宽高，使用canvas2dContext.drawImage()进行剪切成对应的块。用toDataUrl输出Base64的图片。

  // 返回带有多张图片的List
}