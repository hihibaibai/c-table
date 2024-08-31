export function eventInit(table) {
  let {canvas} = table;// 这里能在canvas配置点击事件的要求是元素前方的元素有pointerEvents属性为none才行
  canvas.addEventListener('mousedown', (event) => handleMousedown(table, event));
  canvas.addEventListener('mousemove', (event) => handleMouseMove(table, event));
  canvas.addEventListener('dblclick', (event) => handleDbClick(table, event));
}

function handleMousedown(table, event) {// 这个函数处理单元格的选择
  table.selector.selectCell(event.offsetX, event.offsetY);
  event.stopPropagation();
}

function handleMouseMove(table, event){
  let cellPosition = table.scrollBar.getCellIndexByXYOffset(event.offsetX,
    event.offsetY);
  const { buttons } = event;
  if (buttons === 0) {
    if (cellPosition.placement === "row-header" || cellPosition.placement === "col-header") {
      table.resizer.show(cellPosition);
    }
    else {
      table.resizer.hideRowResizer();
      table.resizer.hideColResizer();
    }
  }
}

function handleDbClick(table, event) {
  // console.log(event);
  table.selector.selectCell(event.offsetX, event.offsetY);
  table.editor.renderEditor();
  event.preventDefault();
}