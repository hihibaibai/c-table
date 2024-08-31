export default class ElementOperator{
  static showElement(element) {
    element.style.display = 'block';
  }

  static hideElement(element) {
    element.style.display = 'none';
  }

  static setWidth(element, width) {
    element.style.setProperty('width',`${width}px`);
  }

  static getWidth(element) {
    return parseInt(element.style.width);
  }

  static setHeight(element, height) {
    element.style.setProperty('height', `${height}px`);
  }

  static getHeight(element) {
    return parseInt(element.style.height);
  }

  static setLeft(element, left) {
    element.style.setProperty('left', `${left}px`);
  }

  static getLeft(element) {
    return parseInt(element.style.left);
  }

  static setRight(element, right) {
    element.style.setProperty('right', `${right}px`);
  }

  static setTop(element, top) {
    element.style.setProperty('top', `${top}px`);
  }

  static getTop(element) {
    return parseInt(element.style.top);
  }

  static setBottom(element, bottom) {
    element.style.setProperty('bottom', `${bottom}px`);
  }

  static setBlockDisplay(element) {
    element.style.setProperty('display', 'block');
  }

  static setPointerEvents(element, pointerEvents) {
    element.style.setProperty('pointer-events', pointerEvents);
  }
  static setPosition(element, position) {
    element.style.setProperty('position', position);
  }

  static setOverflow(element, overflow) {
    element.style.setProperty('overflow', overflow);
  }

  static setClass(element, className) {
    element.className = className;
  }
}