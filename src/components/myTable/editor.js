import ElementOperator from "@/components/myTable/elementOperator";
import Cells from "@/components/myTable/cells";

export default class Editor {
  table;
  overLayer;
  editorElement;
  inputElement;

  constructor(table) { // 默认文字编辑
    this.table = table;
    this.overLayer = table.overLayer;

    let editor = document.createElement('div');
    ElementOperator.setPosition(editor, 'absolute');
    editor.style.setProperty('border', '2px solid #4b89ff');
    editor.style.setProperty('background-color', '#fff');
    editor.style.setProperty('line-height', '0');
    let editorInput = document.createElement('textarea');
    editorInput.style.setProperty('width', 'calc(100% - 6px)');
    editorInput.style.setProperty('height', 'calc(100% - 6px)');
    editorInput.style.setProperty('box-sizing', 'content-box');
    editorInput.style.setProperty('border', 'none');
    editorInput.style.setProperty('padding', '3px');
    editorInput.style.setProperty('outline-width', '0');
    editorInput.style.setProperty('resize', 'none');
    editorInput.style.setProperty('text-align', 'start');
    editorInput.style.setProperty('overflow-y', 'hidden');
    editorInput.style.setProperty('color', 'inherit');
    editorInput.style.setProperty('white-space', 'normal');
    editorInput.style.setProperty('word-wrap', 'break-word');
    editorInput.style.setProperty('line-height', '1.25em');
    editorInput.style.setProperty('margin', '0');
    editor.append(editorInput);
    this.editorElement = editor;
    this.inputElement = editorInput;
    let {x, y} = this.table.selector.currentCell;
    // editorInput.addEventListener('blur', (event) => {
    //   console.log(2)
    //   let cell = Cells.getCell(this.table.data, x, y);
    //   cell.value = editorInput.value;
    //   Cells.setCell(this.table.data, x, y, cell);
    //   let parentElement = this.overLayer.getSelectedCellParentElement();
    //   // ElementOperator.hideElement(editor);
    //   if (parentElement) {
    //     parentElement.removeChild(editor);
    //   }
    //   this.table.selector.initSelect();
    // });
  }

  hideEditor(){
    ElementOperator.hideElement(this.editorElement);
  }

  renderEditor(){
    let parentElement = this.overLayer.getSelectedCellParentElement();
    let selector = this.overLayer.selectedCell;
    if (parentElement && selector) {
      ElementOperator.setLeft(this.editorElement, ElementOperator.getLeft(selector));
      ElementOperator.setTop(this.editorElement, ElementOperator.getTop(selector));
      ElementOperator.setWidth(this.editorElement, ElementOperator.getWidth(selector));
      ElementOperator.setHeight(this.editorElement, ElementOperator.getHeight(selector));
      parentElement.append(this.editorElement);
      ElementOperator.showElement(this.editorElement);
      this.inputElement.focus();
    }
  }
};