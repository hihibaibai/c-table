export default class ElementOperator{
  static showElement(element) {
    element.style.display = 'block';
  }

  static hideElement(element) {
    element.style.display = 'none';
  }

  static setWidth(element, width) {
    element.style.setProperty('width',width);
  }

  static setHeight(element, height) {
    element.style.setProperty('height', height);
  }

  static setClass(element, className) {
    element.className = className;
  }
}