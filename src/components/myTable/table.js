export default class Table {
  constructor(element, width, height, options) {
    this.element = element;
    this.width = width;
    this.height = height;
    this.data = null;

  }

  setData(data){
    this.data = data;
    return this;
  }

  getData(){
    return this.data;
  }

  /**
   * 渲染表单
   */
  render(){

  }
}