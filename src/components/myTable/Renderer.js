import Cells from '@/components/myTable/cells';

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
        'bgcolor': '#f0f000',
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
        [2, 0, {'value': '', 'border': 0,'style': 0}],
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
  canvasContext.translate(xOffset, yOffset);
  // 先渲染单元格
  let heightOffset = 0;
  for (y = startY; y <= endY; y++) {
    let cellHeight = data.rows[y] ? Number(data.rows[y]) : data.rowHeight;
    let widthOffset = 0;
    for (x = startX; x <= endX; x++) {
      let cellWidth = data.cols[x] ? Number(data.cols[x]) : data.colWidth;
      let cell = Cells.getCell(data, x, y);
      console.log(x, y, data);
      console.log(cell);
      let text = cell.value ? cell.value : '';
      let style;
      if (!!data.styles[cell.style]) {
        style = data.styles[cell.style];
      }
      else {
        style = data.style;
      }
      const {
        fontSize,
        fontFamily,
        bold,
        italic,
        color,
        bgcolor,
        align,
        valign,
        underline,
        strikethrough,
        textwrap,
      } = style;

      canvasContext.save();
      canvasContext.beginPath();
      canvasContext.translate(widthOffset, heightOffset);
      // 开始绘制数据
      canvasContext.rect(0, 0, cellWidth, cellHeight);
      canvasContext.clip();

      if (bgcolor) {
        canvasContext.fillStyle = bgcolor;
        canvasContext.fill();
      }
      // 绘制文本
      canvasContext.textAlign = align;
      canvasContext.textBaseline = valign;
      canvasContext.fontFamily = fontFamily;
      canvasContext.fontSize = `${fontSize}pt`;
      canvasContext.bold = bold;
      canvasContext.italic = italic;
      canvasContext.fillStyle = color;
      // 下面这部分实际绘制文本的代码是复制的，我觉得可读性太差了，之后会写成我能读懂的
      const [xPadding, yPadding] = [5, 5];
      const tx = textx(align, cellWidth, xPadding);
      const txts = text.split('\n');
      const innerWidth = cellWidth - xPadding * 2;
      const ntxts = [];
      txts.forEach((item) => {
        const txtWidth = canvasContext.measureText(item).width;
        if (textwrap && txtWidth > innerWidth) {
          let txtLine = {w: 0, len: 0, start: 0};
          for (let i = 0; i < item.length; i += 1) {
            if (txtLine.w > innerWidth) {
              ntxts.push(item.substr(txtLine.start, txtLine.len));
              txtLine = {w: 0, len: 0, start: i};
            }
            txtLine.len += 1;
            txtLine.w += canvasContext.measureText(item[i]).width + 1;
          }
          if (txtLine.len > 0) {
            ntxts.push(item.substr(txtLine.start, txtLine.len));
          }
        }
        else {
          ntxts.push(item);
        }
      });
      const fontHeight = fontSize / 0.75; // pt => px
      const txtHeight = (ntxts.length - 1) * fontHeight;
      const lineTypes = [];
      if (underline) {
        lineTypes.push('underline');
      }
      if (strikethrough) {
        lineTypes.push('strikethrough');
      }
      let ty = texty(valign, cellHeight, txtHeight, fontHeight, yPadding);
      ntxts.forEach((item) => {
        const txtWidth = canvasContext.measureText(item).width;
        canvasContext.fillText(item, tx, ty);
        lineTypes.forEach((type) => {
          let lineCoordination = textLine(type, align, valign, tx, ty, txtWidth,
              fontSize);
          canvasContext.moveTo(lineCoordination[0], lineCoordination[1]);
          canvasContext.lineTo(lineCoordination[2], lineCoordination[3]);
          canvasContext.stroke();
        });
        ty += fontHeight;
      });

      // 结束本单元格的绘制
      canvasContext.closePath();
      canvasContext.restore();

      // 设置下一列的初始x位置
      widthOffset = widthOffset + cellWidth;
    }

    // 设置下一行的初始y位置
    heightOffset = heightOffset + cellHeight;
  }


  // canvasContext.closePath();
  canvasContext.restore();
}

// align: left | center | right
// width: the width of cell
// padding: the padding of cell
function textx(align, width, padding) {
  switch (align) {
    case 'left':
      return padding;
    case 'center':
      return width / 2;
    case 'right':
      return width - padding;
    default:
      return 0;
  }
}

// align: top | middle | bottom
// height: the height of cell
// txtHeight: the height of text
// padding: the padding of cell
function texty(align, height, txtHeight, fontHeight, padding) {
  switch (align) {
    case 'top':
      return padding;
    case 'middle':
      let y = height / 2 - txtHeight / 2;
      const minHeight = fontHeight / 2 + padding;
      return y < minHeight ? minHeight : y;
    case 'bottom':
      return height - padding - txtHeight;
    default:
      return 0;
  }
}

// type: underline | strike
// align: left | center | right
// valign: top | middle | bottom
function textLine(type, align, valign, x, y, w, h) {
  // y
  let ty = 0;
  if (type === 'underline') {
    if (valign === 'top') {
      ty = -h;
    }
    else if (valign === 'middle') {
      ty = -h / 2;
    }
  }
  else if (type === 'strikethrough') {
    if (valign === 'top') {
      ty = -h / 2;
    }
    else if (valign === 'bottom') {
      ty = h / 2;
    }
  }
  // x
  let tx = 0;
  if (align === 'center') {
    tx = w / 2;
  }
  else if (align === 'right') {
    tx = w;
  }
  return [x - tx, y - ty, x - tx + w, y - ty];
}