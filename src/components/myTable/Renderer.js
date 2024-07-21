/**
 * 这个渲染器会根据传入的ctx和数据，以及传入的固定的默认表头格式渲染数据
 */
const defaultColWidth = 100;
const defaultRowHeight = 25;
const headerWidth = 100;
const headerHeight = 26;




export default class Renderer {
  canvasContext = {};
  canvasWidth = 0;
  canvasHeight = 0;
  defaultRenderData = { // 这个不会使用，只是用来看一下格式差不多是什么样子的
    // 这个是实际的数据，数据的获取可以写在这里，也可以写在data.js里面 写在data.js好像会更加好一点。
    // data:{},
    data: {
      'rows': {'1': 40},
      'cols': {},
      'rowHeight': 25,
      'colWidth': 100,
      'style': {
        'bgcolor': '#FFF',
        'color': '#333',
        'align': 'left',
        'valign': 'middle',
        'textwrap': false,
        'bold': false,
        'italic': false,
        'fontFamily': 'Roboto',
        'fontSize': 10,
        'underline': false,
        'strikethrough': false,
        'border': {},
      },
      'styles': [
        {
          'bgcolor': '#000100',
          'color': '#333',
          'align': 'left',
          'valign': 'middle',
          'textwrap': false,
          'bold': false,
          'italic': false,
          'fontFamily': 'Roboto',
          'fontSize': 10,
          'underline': false,
          'strikethrough': false,
          'border': {},
        }],
      'borders': [
        {
          'top': ['thin', '#000'],
          'left': ['thin', '#000'],
          'right': ['thin', '#000'],
          'bottom': ['thin', '#000'],
        }],
      "merges":[{sx:0,sy:0,ex:1,ey:0}],//startX,startY,endX,endY 所有的合并单元格中显示的数据以sx，sy为准
      'cells': [
        [0, 1, {'value': '#{SP_Q_KCPDB.商品编号}'}],
        [0, 2, {'value': '#{SP_Q_KCPDB.商品编号}'}],
        [2, 0, {'value': '', 'border': 0}],
        [2, 1, {'value': '', 'border': 0}],
        [2, 2, {'border': 0, 'style': 0}],
        [3, 0, {'value': '', 'border': 0}],
        [3, 1, {'value': '', 'border': 0}],
        [3, 2, {'border': 0, 'style': 0}],
        [4, 0, {'value': '', 'border': 0}],
        [4, 1, {'value': '', 'border': 0}],
        [4, 2, {'value': '', 'border': 0}],
      ],
    },
    scrollPosition: [0, 0], // 第一个元素是左侧第几个单元格开始，第二个元素是上边第几个单元格开始
  };

  constructor(canvasContext, width, height) {
    this.canvasContext = canvasContext;
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  render(renderData) {
    renderData = this.defaultRenderData;
    if (!(renderData.scrollPosition instanceof Array && renderData.scrollPosition.length === 2)){
      throw new Error('滚动条格式不正确');
    }

    // 这里的渲染顺序始终是从第四象限开始的，表头的部分是最后贴上去的
    // 第四象限主要放数据的，按照以下的顺序渲染 背景颜色-》数据-》合并单元格背景-》合并单元格数据-》边框-》合并单元格边框
    const xOffset = headerWidth;
    const yOffset = headerHeight;
    renderDataPart(this.canvasContext, this.canvasWidth, this.canvasHeight,
        renderData.data, renderData.scrollPosition,
        xOffset, yOffset);
  }
};

function renderDataPart(canvasContext, canvasWidth, canvasHeight, data, scrollPosition, xOffset, yOffset) {
  // 先确定渲染的宽高，再确定需要渲染多少行、多少列单元格
  const renderWidth = canvasWidth - xOffset;
  const renderHeight = canvasHeight - yOffset;
  let widthCount = 0;
  let heightCount = 0;
  let x = scrollPosition[0];
  let y = scrollPosition[1];
  const startX = scrollPosition[0];
  const startY = scrollPosition[1];
  while (renderWidth - widthCount >= 0) {
    let cellWidth = 0;
    if (data.cols[x]) {
      cellWidth = data.cols[x];
    }
    else {
      cellWidth = data.colWidth;
    }
    widthCount = widthCount + cellWidth;
    x++;
  }
  while (renderHeight - heightCount >= 0) {
    let cellHeight = 0;
    if (data.rows[y]) {
      cellHeight = data.rows[y];
    }
    else {
      cellHeight = data.rowHeight;
    }
    heightCount = heightCount + cellHeight;
    y++;
  }
  const endX = x;
  const endY = y;

  canvasContext.save();
  canvasContext.beginPath();
  canvasContext.translate(xOffset, yOffset);
  for (y = startY; y <= endY; y++) {
    for (x = startX; x <= endX; x++) {

    }
  }


  canvasContext.restore();
}