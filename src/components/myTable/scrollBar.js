export default class ScrollBar {
  vScrollBar;
  hScrollBar;
  vWeight;
  hWeight;
  constructor(container, width, height) {
    this.createVerticalScrollBar(container,height);
    this.createHorizontalScrollBar(container,width);
    const handleMouseWheelEvent = (e)=>{
      this.vScrollBar.scrollTop = this.vScrollBar.scrollTop + e.deltaY;
      this.hScrollBar.scrollLeft = this.hScrollBar.scrollLeft + e.deltaX;
      let vWeightHeight = parseInt(this.vWeight.style.height);
      console.log(this.vScrollBar.scrollTop + vWeightHeight);
      console.log(this.vScrollBar.scrollTop + e.deltaY);
      if (this.vScrollBar.scrollTop + vWeightHeight > this.vScrollBar.scrollTop + e.deltaY) {
        // 这个情况下，滚动条是拉到最底下的，要额外延长一点出来
        vWeightHeight = vWeightHeight + e.deltaY;
        this.vWeight.style.setProperty('height',`${vWeightHeight}px`);
      }

    }
    container.addEventListener('wheel', handleMouseWheelEvent);

  }

  createVerticalScrollBar(container, height) {
    let element = document.createElement('div');
    element.style.setProperty('height', `${height}px`);
    element.style.setProperty('display', 'block');
    element.style.setProperty('width', '15px');
    element.style.setProperty('bottom', '0');
    element.style.setProperty('overflow-x', 'hidden');
    element.style.setProperty('overflow-y', 'scroll');
    element.style.setProperty('position', 'absolute');
    element.style.setProperty('right', '0');
    element.style.setProperty('background-color', '#f4f5f8');
    element.style.setProperty('opacity', '1');
    let weight = document.createElement('div');
    weight.style.setProperty('height', '400px');// 这个值需要在外面确定好
    weight.style.setProperty('width', '1px');
    weight.style.setProperty('background', '#ddd');
    this.vWeight = weight;
    element.append(weight);
    container.append(element);
    element.addEventListener('mouseover', () => {
      element.style.setProperty('opacity', '0.8');
    });
    element.addEventListener('mouseout', () => {
      // element.style.setProperty('opacity', '0');
      element.style.setProperty('opacity', '1');
    });
    this.vScrollBar = element;
  }

  createHorizontalScrollBar(container, width) {
    let element = document.createElement('div');
    element.style.setProperty('width', `${width}px`);
    element.style.setProperty('display', 'block');
    element.style.setProperty('height', '15px');
    element.style.setProperty('right', '0');
    element.style.setProperty('overflow-x', 'scroll');
    element.style.setProperty('overflow-y', 'hidden');
    element.style.setProperty('position', 'absolute');
    element.style.setProperty('bottom', '0');
    element.style.setProperty('background-color', '#f4f5f8');
    element.style.setProperty('opacity', '0');
    let weight = document.createElement('div');
    weight.style.setProperty('width', '2660px');// 这个值需要在外面确定好
    weight.style.setProperty('height', '1px');
    weight.style.setProperty('background', '#ddd');
    this.hWeight = weight;
    element.append(weight);
    container.append(element);
    element.addEventListener('mouseover', () => {
      element.style.setProperty('opacity', '0.8');
    });
    element.addEventListener('mouseout', () => {
      element.style.setProperty('opacity', '0');
    });
    this.hScrollBar = element;
  }
};