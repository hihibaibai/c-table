import ElementOperator from "@/components/myTable/elementOperator";

export default class Resizer {
  colResizer = {};
  colHover = {};
  colLine = {};
  rowResizer = {};
  rowHover = {};
  rowLine = {};
  data = {};
  table = {};
  cellPosition = {};

  constructor(container, width, height, table) {
    this.setData(table.data);
    this.table = table;
    let rowResizer = document.createElement('div');
    ElementOperator.setClass(rowResizer, 'row-resizer');
    ElementOperator.setPosition(rowResizer, 'absolute');
    ElementOperator.setLeft(rowResizer, 0);
    ElementOperator.setBlockDisplay(rowResizer);
    this.rowResizer = rowResizer;

    let lineElement = document.createElement('div');// 这个element是用作移动的预览用的
    ElementOperator.setPosition(lineElement, 'absolute');
    ElementOperator.setWidth(lineElement, width);
    ElementOperator.setLeft(lineElement, 0);
    ElementOperator.setBottom(lineElement, 0);
    ElementOperator.setPointerEvents(lineElement, 'none');
    ElementOperator.hideElement(lineElement);
    lineElement.style.setProperty('border-bottom', '2px dashed #4b89ff');
    this.rowLine = lineElement;

    let hoverElement = document.createElement('div');// 这个element控制横移的小滑块
    ElementOperator.setBlockDisplay(hoverElement);
    ElementOperator.setHeight(hoverElement, 5);
    ElementOperator.setPosition(hoverElement, 'absolute');
    hoverElement.style.setProperty('cursor', 'row-resize');
    hoverElement.style.setProperty('background-color', 'rgba(75, 137, 255, 0.25)');
    hoverElement.addEventListener('mousedown',(event) => {
      mousedownHandler(event, rowResizer, this.rowLine, 'row', this);
    });
    this.rowHover = hoverElement;

    rowResizer.append(hoverElement, lineElement);

    let colResizer = document.createElement('div');
    ElementOperator.setClass(colResizer, 'col-resizer');
    ElementOperator.setPosition(colResizer, 'absolute');
    ElementOperator.setTop(colResizer, 0);
    ElementOperator.setBlockDisplay(colResizer);
    this.colResizer = colResizer;

    lineElement = document.createElement('div');// 这个element是用作移动的预览用的
    ElementOperator.setPosition(lineElement, 'absolute');
    ElementOperator.setHeight(lineElement, height);
    ElementOperator.setTop(lineElement, 0);
    ElementOperator.setRight(lineElement, 0);
    ElementOperator.setPointerEvents(lineElement, 'none');
    ElementOperator.hideElement(lineElement);
    lineElement.style.setProperty('border-right', '2px dashed #4b89ff');
    this.colLine = lineElement;

    hoverElement = document.createElement('div');// 这个element控制横移的小滑块
    ElementOperator.setBlockDisplay(hoverElement);
    ElementOperator.setWidth(hoverElement, 5);
    ElementOperator.setPosition(hoverElement, 'absolute');
    hoverElement.style.setProperty('cursor', 'col-resize');
    hoverElement.style.setProperty('background-color', 'rgba(75, 137, 255, 0.25)');
    hoverElement.addEventListener('mousedown',(event) => {
      mousedownHandler(event, colResizer, this.colLine, 'col', this);
    });
    this.colHover = hoverElement;

    colResizer.append(hoverElement, lineElement);
    container.append(rowResizer, colResizer);
  }
  setData(data) {
    this.data = data;
  }
  show(cellPosition){
    this.cellPosition = cellPosition;
    let leftValue = 0;
    let topValue = 0;
    let widthValue = 0;
    let heightValue = 0;
    let widthCount = 0;
    let heightCount = 0;
    let x = 0;
    let y = 0;
    if (cellPosition.placement === "col-header") {
      while (this.table.width - widthCount >= 0) {
        let cellWidth = 0;
        if (this.table.data.cols[x]) {
          debugger;
          cellWidth = this.table.data.cols[x];
        } else {
          cellWidth = this.table.data.colWidth;
        }
        if (x === cellPosition.x) {
          leftValue = widthCount;
          widthValue = cellWidth;
          break;
        }
        widthCount = widthCount + cellWidth;
        x++;
      }
      let left = leftValue + widthValue - 5 + this.table.data.headerWidth;
      console.log(leftValue, widthValue);
      ElementOperator.setLeft(this.colResizer, left);
      ElementOperator.setWidth(this.colResizer, 5);
      ElementOperator.setHeight(this.colResizer, this.table.data.headerHeight);
      ElementOperator.setHeight(this.colHover, this.table.data.headerHeight);
      ElementOperator.setBlockDisplay(this.colResizer);
    }
    if (cellPosition.placement === "row-header") {
      debugger;
      while (this.table.height - heightCount >= 0) {
        let cellHeight = 0;
        if (this.table.data.rows[y]) {
          cellHeight = this.table.data.rows[y];
        } else {
          cellHeight = this.table.data.rowHeight;
        }
        if (y === cellPosition.y) {
          topValue = heightCount;
          heightValue = cellHeight;
          break;
        }
        heightCount = heightCount + cellHeight;
        y++;
      }
      let top = topValue + heightValue - 5 + this.table.data.headerHeight;
      console.log(topValue, heightValue);
      ElementOperator.setTop(this.rowResizer, top);
      ElementOperator.setHeight(this.rowResizer, 5);
      ElementOperator.setWidth(this.rowResizer, this.table.data.headerWidth);
      ElementOperator.setWidth(this.rowHover, this.table.data.headerWidth);
      ElementOperator.setBlockDisplay(this.rowResizer);
    }
  }

  hideRowResizer() {
    ElementOperator.hideElement(this.rowResizer);
  }

  hideColResizer() {
    ElementOperator.hideElement(this.colResizer);
  }

};

function mousedownHandler(event, resizerElement, lineElement, type, resizer) {
  ElementOperator.showElement(lineElement);
  let {cellPosition, data} = resizer;
  console.log(cellPosition);
  const mouseMove = (event) => {
    let data = resizer.table.data;
    let movement = 0;
    let height = 0;
    let width = 0;
    if (type === 'row') {
      movement = event.movementY;
      height = data.rows[cellPosition.y] ? data.rows[cellPosition.y] : data.rowHeight;
      if (movement + height >= 10) {
        let top = ElementOperator.getTop(resizerElement);
        data.rows[cellPosition.y] = height + movement;
        ElementOperator.setTop(resizerElement, top + movement);
      }
    }
    if (type === 'col') {
      movement = event.movementX;
      width = data.cols[cellPosition.x] ? data.cols[cellPosition.x] : data.colWidth;
      if (movement + width >= 10) {
        let left = ElementOperator.getLeft(resizerElement);
        data.cols[cellPosition.x] = width + movement;
        ElementOperator.setLeft(resizerElement, left + movement);
      }
    }
  };
  window.addEventListener('mousemove', mouseMove);
  window.addEventListener('mouseup', function mouseUp(event) {
    ElementOperator.hideElement(lineElement);
    resizer.table.render();
    window.removeEventListener('mousemove', mouseMove);
    window.removeEventListener('mouseup', mouseUp);
  })

}