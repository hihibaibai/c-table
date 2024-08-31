import ElementOperator from "@/components/myTable/elementOperator";
import Cells from "@/components/myTable/cells";

export default class Editor {
  table;
  selector;
  overLayer;
  editorElement;
  inputElement;

  constructor(table) { // 默认文字编辑
    this.table = table;
    this.selector = table.selector;
    this.overLayer = table.overLayer;

    let editor = document.createElement('div');
    ElementOperator.setPosition(editor, 'absolute');
    ElementOperator.setPointerEvents(editor, 'auto');
    editor.style.setProperty('border', '2px solid #4b89ff');
    editor.style.setProperty('background-color', '#fff');
    editor.style.setProperty('line-height', '0');
    editor.style.setProperty('z-index', '12');
    ElementOperator.setClass(editor, 'editor');
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
    ElementOperator.setClass(editorInput, 'editor-input');
    editor.append(editorInput);
    this.editorElement = editor;
    this.inputElement = editorInput;
    const inputHandler = (event) => {
      // console.log(event.target.value);
      let {x,y} = this.selector.currentCell;
      let cell = Cells.getCell(this.table.data, x, y);
      cell.value = event.target.value;
      Cells.setCell(this.table.data, x, y, cell);
      this.table.render();
    };
    editorInput.addEventListener('input', inputHandler);
  }

  hideEditor(){
    ElementOperator.hideElement(this.editorElement);
  }

  renderEditor(){
    let parentElement = this.overLayer.getSelectedCellParentElement();
    let selectorElement = this.overLayer.selectedCell;
    if (parentElement && selectorElement) {
      let {x,y} = this.selector.currentCell;
      let cell = Cells.getCell(this.table.data, x, y);
      ElementOperator.setLeft(this.editorElement, ElementOperator.getLeft(selectorElement));
      ElementOperator.setTop(this.editorElement, ElementOperator.getTop(selectorElement));
      ElementOperator.setWidth(this.editorElement, ElementOperator.getWidth(selectorElement));
      ElementOperator.setHeight(this.editorElement, ElementOperator.getHeight(selectorElement));
      parentElement.append(this.editorElement);
      ElementOperator.showElement(this.editorElement);
      this.inputElement.value = cell.value;
      this.inputElement.focus();
    }
  }
};