export function eventInit(table) {
  let {canvas} = table;// 这里能在canvas配置点击事件的要求是元素前方的元素有pointerEvents属性为none才行
  canvas.addEventListener('mousedown',
      (event) => handleMousedown(table, event));
}

function handleMousedown(table, event) {
  console.log(event.offsetX,event.offsetY);
  console.log(event.target);
  let cellPosition = table.scrollBar.getCellIndexByXYOffset(event.offsetX,
      event.offsetY);
  console.log(cellPosition);
  event.stopPropagation();
}