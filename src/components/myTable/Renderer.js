import Cells from '@/components/myTable/cells';

/**
 * 这个渲染器会根据传入的ctx和数据，以及传入的固定的默认表头格式渲染数据
 */
const defaultColWidth = 100;
const defaultRowHeight = 25;
const headerWidth = 50;
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
        'bgColor': '#f0f0f0',
        'color': '#333',
        'align': 'left',
        'valign': 'middle',
        'textWrap': false,
        'bold': false,
        'italic': false,
        'fontFamily': 'Roboto',
        'fontSize': 12,
        'underline': false,
        'strikethrough': false,
        'border': {},
      },
      'styles': [
        {
          'bgColor': '#f0f000',
          'color': '#333',
          'align': 'left',
          'valign': 'middle',
          'textWrap': true,
          'bold': false,
          'italic': false,
          'fontFamily': 'Roboto',
          'fontSize': 12,
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
        }
      ],
      "merges":[{sx:0,sy:0,ex:1,ey:0}],//startX,startY,endX,endY 所有的合并单元格中显示的数据以sx，sy为准
      'cells': [
        [0, 1, {'value': '#{SP_Q_KCPDB.商品编号}','style': 0}],
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
        bgColor,
        align,
        valign,
        underline,
        strikethrough,
        textWrap,
      } = style;

      canvasContext.save();
      canvasContext.beginPath();
      canvasContext.translate(widthOffset, heightOffset);
      // 开始绘制数据
      canvasContext.rect(0, 0, cellWidth, cellHeight);
      canvasContext.clip();

      if (bgColor) {
        canvasContext.fillStyle = bgColor;
        canvasContext.fill();
      }
      // 绘制文本
      canvasContext.textAlign = align;
      canvasContext.textBaseline = valign;
      canvasContext.fontFamily = fontFamily;
      const prepareFont = (fontSize, bold, italic) => {
        let fontStyle = '';
        if (bold) {
          fontStyle = fontStyle + 'bold ';
        }
        if (italic) {
          fontStyle = fontStyle + 'italic ';
        }
        fontStyle = fontStyle + `${fontSize}px sans-serif`;
        return fontStyle;
      };
      canvasContext.font = prepareFont(fontSize, bold, italic);
      canvasContext.bold = bold;
      canvasContext.italic = italic;
      canvasContext.fillStyle = color;
      // 下面这部分实际绘制文本的代码是复制的，我觉得可读性太差了，之后会写成我能读懂的
      const [xPadding, yPadding] = [5, 5]; // 设置默认的左方上方padding
      const textXPosition = getTextXPosition(align, cellWidth, xPadding);// 如果align设置为center的话，filltext中的x坐标就会从中间开始算。也就是说，x坐标是这行字中间的点的坐标
      const innerWidth = cellWidth - xPadding * 2; // 确定可以绘制字符的宽度
      const lineOfTexts = [];
      const textWidth = canvasContext.measureText(text).width;
      if (textWrap && textWidth > innerWidth) { // 需要做字符串的换行，这里不用自带的换行是因为不能自定义padding
        // 这里一个字符一个字符的测试字符长度，直到超出了给定的宽度，再换行继续测
        let startingIndex = 0;
        let stringLength = 0;
        for (let i = 0; i < text.length; i++) {
          let testString = text.substring(startingIndex, i);
          if (canvasContext.measureText(testString).width >= innerWidth) {
            stringLength = 0;
            lineOfTexts.push(text.substring(startingIndex, i-1));
            startingIndex = i-1;
          }
          stringLength ++;
        }
        if (stringLength > 0) {
          lineOfTexts.push(text.substring(startingIndex));
        }
      }
      else {
        lineOfTexts.push(text);
      }
      const fontHeight = fontSize / 0.75; // pt => px
      const textHeight = (lineOfTexts.length) * fontHeight;
      let textYPosition = getTextYPosition(valign, cellHeight, textHeight, fontHeight, yPadding);
      for (let lineOfText of lineOfTexts) {
        const textWidth = canvasContext.measureText(lineOfText).width;
        canvasContext.fillText(lineOfText,textXPosition,textYPosition);
        // 绘制好了字符之后，绘制下划线和划线
        let lineCoordination = [];
        if (strikethrough) {
          lineCoordination = getTextLineCoord('strikethrough', align, valign,
              textXPosition, textYPosition, textWidth, fontSize);
        }
        if (underline) {
          lineCoordination = getTextLineCoord('underline', align, valign,
              textXPosition, textYPosition, textWidth, fontSize);
        }
        canvasContext.moveTo(lineCoordination[0], lineCoordination[1]);
        canvasContext.lineTo(lineCoordination[2], lineCoordination[3]);
        canvasContext.stroke();

        textYPosition = textYPosition + fontHeight;// 为第二行做准备
      }
      // const lineTypes = [];
      // if (underline) {
      //   lineTypes.push('underline');
      // }
      // if (strikethrough) {
      //   lineTypes.push('strikethrough');
      // }
      // let ty = texty(valign, cellHeight, txtHeight, fontHeight, yPadding);
      // ntxts.forEach((item) => {
      //   const txtWidth = canvasContext.measureText(item).width;
      //   canvasContext.fillText(item, tx, ty);
      //   lineTypes.forEach((type) => {
      //     let lineCoordination = textLine(type, align, valign, tx, ty, txtWidth,
      //         fontSize);
      //     canvasContext.moveTo(lineCoordination[0], lineCoordination[1]);
      //     canvasContext.lineTo(lineCoordination[2], lineCoordination[3]);
      //     canvasContext.stroke();
      //   });
      //   ty += fontHeight;
      // });

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
// cellWidth: the width of cell
// xPadding: the left padding of cell
function getTextXPosition (align, cellWidth, xPadding) {
  switch (align) {
    case 'left':
      return xPadding;
    case 'center':
      return cellWidth / 2;
    case 'right':
      return cellWidth - xPadding;
    default:
      return 0;
  }
}

// align: top | middle | bottom
// cellHeight: the height of cell
// textHeight: the height of text
// fontHeight: the height of font
// yPadding: the top padding of cell
function getTextYPosition (valign, cellHeight, textHeight, fontHeight, yPadding) {
  switch (valign) {
    case 'top':
      return yPadding;
    case 'middle':
      let y = cellHeight / 2 - textHeight / 2;
      const minHeight = fontHeight / 2 + yPadding;
      return y < minHeight ? minHeight : y;
    case 'bottom':
      return cellHeight - yPadding - textHeight;
    default:
      return 0;
  }
}

// type: underline | strike
// align: left | center | right
// valign: top | middle | bottom
function getTextLineCoord(type, align, valign,
    textXPosition, textYPosition, textWidth, fontSize) {
  // y
  let endY = 0;
  if (type === 'underline') {
    if (valign === 'top') {
      endY = -fontSize;
    }
    else if (valign === 'middle') {
      endY = -fontSize / 2;
    }
  }
  else if (type === 'strikethrough') {
    if (valign === 'top') {
      endY = -fontSize / 2;
    }
    else if (valign === 'bottom') {
      endY = fontSize / 2;
    }
  }
  // x
  let endX = 0;
  if (align === 'center') {
    endX = textWidth / 2;
  }
  else if (align === 'right') {
    endX = textWidth;
  }
  return [textXPosition - endX, textYPosition - endY, textXPosition - endX + textWidth, textYPosition - endY];
}