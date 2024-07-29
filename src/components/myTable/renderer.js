import Cells from '@/components/myTable/cells';
import Merge from '@/components/myTable/merge';
import {stringAt} from '@/components/myTable/alphabetUtil';

/**
 * 这个渲染器会根据传入的ctx和数据，以及传入的固定的默认表头格式渲染数据
 */
const defaultColWidth = 100;
const defaultRowHeight = 25;
const headerWidth = 50;
const headerHeight = 26;

const gridLineColor = '#eaeaea';



export default class Renderer {
  canvasContext = {};
  canvasWidth = 0;
  canvasHeight = 0;
  defaultRenderData = { // 这个不会使用，只是用来看一下格式差不多是什么样子的
    // 这个是实际的数据，数据的获取可以写在这里，也可以写在data.js里面 写在data.js好像会更加好一点。
    // data:{},
    data: {
      'rows': {},
      'cols': {},
      'rowHeight': 25,
      'colWidth': 100,
      'style': {
        'bgColor': '#FFF',
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
          'bgColor': '#000100',
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
        }],
      'borders': [
        {
          'top': ['thin', '#000'],
          'left': ['thin', '#000'],
          'right': ['thin', '#000'],
          'bottom': ['thin', '#000'],
        }
      ],
      "merges":[{sx:1,sy:0,ex:2,ey:0},{sx:1,sy:4,ex:2,ey:4}],//startX,startY,endX,endY 所有的合并单元格中显示的数据以sx，sy为准
      'cells': [
        [0, 1, {'value': '#{SP_Q_KCPDB.商品编号}', 'border': 0}],
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
    viewport: [0, 0, 0, 0], // 第一个元素是左侧第几个单元格开始，第二个元素是上边第几个单元格开始
  };

  constructor(canvasContext, width, height) {
    this.canvasContext = canvasContext;
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  render(renderData) {
    // renderData = this.defaultRenderData;
    console.log(renderData.viewport);
    if (!(renderData.viewport instanceof Array && renderData.viewport.length === 4)){
      throw new Error('滚动条格式不正确');
    }

    // 这里的渲染顺序始终是从第四象限开始的，按照以下的顺序渲染 背景颜色-》数据-》合并单元格背景-》合并单元格数据-》边框-》合并单元格边框
    // 这里的xOffset和yOffset只是暂时这个样子的，之后要处理冻结的时候这个值会改的
    const xOffset = headerWidth;
    const yOffset = headerHeight;
    renderDataPart(this.canvasContext, this.canvasWidth, this.canvasHeight,
        renderData.data, renderData.viewport,
        xOffset, yOffset);

    // 渲染表头的时候，要处理冻结表格的情况
    renderTableHeader(this.canvasContext, this.canvasWidth, this.canvasHeight,
        renderData.data, renderData.viewport);
  }
};

function renderDataPart(canvasContext, canvasWidth, canvasHeight, data, viewport, xOffset, yOffset) {
  // 先确定渲染的宽高，再确定需要渲染多少行、多少列单元格
  const renderWidth = canvasWidth - xOffset;
  const renderHeight = canvasHeight - yOffset;
  let widthCount = 0;
  let heightCount = 0;
  let x = viewport[0];
  let y = viewport[1];
  console.log("renderingStartXandY",x,y);
  const startX = viewport[0];
  const startY = viewport[1];
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
      canvasContext.closePath();
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
      canvasContext.fillStyle = color;
      const [xPadding, yPadding] = [5, 5]; // 设置默认的左方上方padding
      const textXPosition = getTextXPosition(align, cellWidth, xPadding);// 如果align设置为center的话，filltext中的x坐标就会从中间开始算。也就是说，x坐标是这行字中间的点的坐标
      const innerWidth = cellWidth - xPadding * 2; // 确定可以绘制字符的宽度
      const lineOfTexts = [];
      const textWidth = canvasContext.measureText(text).width;
      if (textWrap && textWidth > innerWidth) { // 需要做字符串的换行，这里不用自带的换行是因为不能自定义padding
        let startingIndex = 0;  // 这里一个字符一个字符的测试字符长度，直到超出了给定的宽度，再换行继续测
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
        canvasContext.beginPath();
        const textWidth = canvasContext.measureText(lineOfText).width;
        canvasContext.fillText(lineOfText,textXPosition,textYPosition);
        canvasContext.closePath();
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
        canvasContext.beginPath();
        canvasContext.moveTo(lineCoordination[0], lineCoordination[1]);
        canvasContext.lineTo(lineCoordination[2], lineCoordination[3]);
        canvasContext.stroke();
        canvasContext.closePath();
        textYPosition = textYPosition + fontHeight;// 为第二行做准备
      }

      // 结束本单元格的绘制
      canvasContext.restore();

      // 设置下一列的初始x位置
      widthOffset = widthOffset + cellWidth;
    }

    // 设置下一行的初始y位置
    heightOffset = heightOffset + cellHeight;
  }

  // 再次渲染网格，不然网格的显示会有问题
  x = viewport[0];
  y = viewport[1];
  heightOffset = 0;
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
      canvasContext.lineWidth = 1;
      canvasContext.strokeStyle = gridLineColor;
      canvasContext.moveTo(cellWidth, 0);
      canvasContext.lineTo(cellWidth, cellHeight);
      canvasContext.lineTo(0, cellHeight);
      canvasContext.stroke();

      canvasContext.closePath();
      canvasContext.restore();

      widthOffset = widthOffset + cellWidth;
    }
    heightOffset = heightOffset + cellHeight;
  }

  // 接着处理边框
  x = viewport[0];
  y = viewport[1];
  heightOffset = 0;
  for (y = startY; y <= endY; y++) {
    let cellHeight = data.rows[y] ? Number(data.rows[y]) : data.rowHeight;
    let widthOffset = 0;
    for (x = startX; x <= endX; x++) {
      let cellWidth = data.cols[x] ? Number(data.cols[x]) : data.colWidth;
      let cell = Cells.getCell(data, x, y);
      let text = cell.value ? cell.value : '';
      let border;
      if (!!data.borders[cell.border]) {
        border = data.borders[cell.border];
      }
      else {
        border = data.style;
      }

      canvasContext.save();
      canvasContext.translate(widthOffset, heightOffset);

      const borderTypes = Object.keys(border);
      borderTypes.forEach((type) => {
        const borderLineStyle = border[type][0];
        const borderColor = border[type][1];
        let x1;
        let y1;
        let x2;
        let y2;
        switch (type){
          case 'top':
            x1=0;
            y1=0;
            x2=cellWidth;
            y2=0;
            break;
          case 'right':
            x1=cellWidth;
            y1=0;
            x2=cellWidth;
            y2=cellHeight;
            break;
          case 'bottom':
            x1=0;
            y1=cellHeight;
            x2=cellWidth;
            y2=cellHeight;
            break;
          case 'left':
            x1=0;
            y1=0;
            x2=0;
            y2=cellHeight;
            break;
          default:
            break;
        }
        let lineDash = [];
        let lineWidth = 1;
        switch (borderLineStyle){
          case 'thick':
            lineWidth = 3;
            break;
          case 'medium':
            lineWidth = 2;
            break;
          case 'dotted':
            lineDash = [1, 1];
            break;
          case 'dashed':
            lineDash = [2, 2];
            break;
          default:
            break;
        }

        canvasContext.beginPath();
        canvasContext.strokeStyle = borderColor;
        canvasContext.lineWidth = lineWidth;
        canvasContext.setLineDash(lineDash);
        canvasContext.moveTo(x1, y1);
        canvasContext.lineTo(x2, y2);
        canvasContext.stroke();
        canvasContext.closePath();

      });
      canvasContext.restore();

      widthOffset = widthOffset + cellWidth;
    }
    heightOffset = heightOffset + cellHeight;
  }

  // 再处理合并单元格的情况
  let mergeCellsNeedRender = [];
  x = startX;
  y = startY;
  mergeCellsNeedRender = Merge.getInRangeMerge(data, startX, startY, endX, endY);
  mergeCellsNeedRender.forEach(i => {
    let {sx, sy, ex, ey} = i;
    let widthOffsetIndex = sx - startX;
    let heightOffsetIndex = sy - startY;
    let widthOffset = 0;
    let heightOffset = 0;

    for (i = 0; i < widthOffsetIndex; i++) {
      let cellWidth = data.cols[x+i] ? Number(data.cols[x+i]) : data.colWidth;
      widthOffset = widthOffset + cellWidth;
    }
    for (i = 0; i < heightOffsetIndex; i++) {
      let cellHeight = data.rows[y+i] ? Number(data.rows[y+i]) : data.rowHeight;
      heightOffset = heightOffset + cellHeight;
    }

    let mergedCellWidth = 0;
    let mergedCellHeight = 0;
    for (i = 0; i <= ex - sx; i++) {
      let cellWidth = data.cols[sx + i] ? Number(data.cols[sx + i]) : data.colWidth;
      mergedCellWidth = mergedCellWidth + cellWidth;
    }
    for (i = 0; i <= ey - sy; i++) {
      let cellHeight = data.rows[sy + i] ? Number(data.rows[sy + i]) : data.rowHeight;
      mergedCellHeight = mergedCellHeight + cellHeight;
    }

    let cell = Cells.getCell(data, sx, sy);
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
    let border;

    if (!!data.borders[cell.border]) {
      border = data.borders[cell.border];
    }
    else {
      border = data.style;
    }

    canvasContext.save();
    canvasContext.beginPath();
    canvasContext.translate(widthOffset, heightOffset);
    // 渲染单元格内的内容
    canvasContext.save();
    canvasContext.rect(0, 0, mergedCellWidth, mergedCellHeight);
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
    canvasContext.fillStyle = color;
    const [xPadding, yPadding] = [5, 5]; // 设置默认的左方上方padding
    const textXPosition = getTextXPosition(align, mergedCellWidth, xPadding);// 如果align设置为center的话，filltext中的x坐标就会从中间开始算。也就是说，x坐标是这行字中间的点的坐标
    const innerWidth = mergedCellWidth - xPadding * 2; // 确定可以绘制字符的宽度
    const lineOfTexts = [];
    const textWidth = canvasContext.measureText(text).width;
    if (textWrap && textWidth > innerWidth) { // 需要做字符串的换行，这里不用自带的换行是因为不能自定义padding
      let startingIndex = 0;  // 这里一个字符一个字符的测试字符长度，直到超出了给定的宽度，再换行继续测
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
    let textYPosition = getTextYPosition(valign, mergedCellHeight, textHeight, fontHeight, yPadding);
    for (let lineOfText of lineOfTexts) {
      canvasContext.beginPath();
      const textWidth = canvasContext.measureText(lineOfText).width;
      canvasContext.fillText(lineOfText,textXPosition,textYPosition);
      canvasContext.closePath();
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
      canvasContext.beginPath();
      canvasContext.moveTo(lineCoordination[0], lineCoordination[1]);
      canvasContext.lineTo(lineCoordination[2], lineCoordination[3]);
      canvasContext.stroke();
      canvasContext.closePath();
      textYPosition = textYPosition + fontHeight;// 为第二行做准备
    }
    canvasContext.restore();
    // 结束渲染单元格内的
    // 开始渲染边框
    canvasContext.save();
    const borderTypes = Object.keys(border);
    borderTypes.forEach((type) => {
      const borderLineStyle = border[type][0];
      const borderColor = border[type][1];
      let x1;
      let y1;
      let x2;
      let y2;
      switch (type){
        case 'top':
          x1=0;
          y1=0;
          x2=mergedCellWidth;
          y2=0;
          break;
        case 'right':
          x1=mergedCellWidth;
          y1=0;
          x2=mergedCellWidth;
          y2=mergedCellHeight;
          break;
        case 'bottom':
          x1=0;
          y1=mergedCellHeight;
          x2=mergedCellWidth;
          y2=mergedCellHeight;
          break;
        case 'left':
          x1=0;
          y1=0;
          x2=0;
          y2=mergedCellHeight;
          break;
        default:
          break;
      }
      let lineDash = [];
      let lineWidth = 1;
      switch (borderLineStyle){
        case 'thick':
          lineWidth = 3;
          break;
        case 'medium':
          lineWidth = 2;
          break;
        case 'dotted':
          lineDash = [1, 1];
          break;
        case 'dashed':
          lineDash = [2, 2];
          break;
        default:
          break;
      }

      canvasContext.beginPath();
      canvasContext.strokeStyle = borderColor;
      canvasContext.lineWidth = lineWidth;
      canvasContext.setLineDash(lineDash);
      canvasContext.moveTo(x1, y1);
      canvasContext.lineTo(x2, y2);
      canvasContext.stroke();
      canvasContext.closePath();

    });
    canvasContext.restore();

    canvasContext.closePath();
    canvasContext.restore();

  });

  canvasContext.restore();
}

function renderTableHeader(canvasContext, canvasWidth, canvasHeight, data,viewport) {
  // 先做横向的header
  // 确定横向的header大小
  const rowHeaderWidth = canvasWidth - headerWidth;
  const rowHeaderHeight = headerHeight;
  const colHeaderHeight = canvasHeight - headerHeight;
  const colHeaderWidth = headerWidth;
  let widthCount = 0;
  let heightCount = 0;
  let x = viewport[0];
  let y = viewport[1];
  const startX = viewport[0];
  const startY = viewport[1];
  while (rowHeaderWidth - widthCount >= 0) {
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
  while (colHeaderHeight - heightCount >= 0) {
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

  // 渲染纵向的表头
  let heightOffset = headerHeight;
  for (y = startY; y <= endY; y++) {
    let cellHeight = data.rows[y] ? Number(data.rows[y]) : data.rowHeight;
    canvasContext.save();
    canvasContext.beginPath();
    canvasContext.translate(0, heightOffset);
    canvasContext.rect(0, 0, headerWidth, cellHeight);
    canvasContext.clip();
    canvasContext.fillStyle = '#fbfbfd';
    canvasContext.fill();
    canvasContext.fillStyle = '#585757';
    canvasContext.font = '12px sans-serif';
    canvasContext.textAlign = 'center';
    canvasContext.textBaseline = 'middle';
    const textXPosition = getTextXPosition('center', headerWidth, 5);
    const fontHeight = 12 / 0.75; // pt => px
    const textHeight = fontHeight;
    const textYPosition = getTextYPosition('middle', cellHeight, textHeight, fontHeight, 5);
    canvasContext.fillText(y+1,textXPosition,textYPosition);
    canvasContext.closePath();

    canvasContext.beginPath();
    canvasContext.moveTo(0, headerHeight-1);
    canvasContext.lineTo(headerWidth, headerHeight-1);
    canvasContext.strokeStyle = '#ababab';
    canvasContext.stroke();
    canvasContext.closePath();
    canvasContext.restore();
    heightOffset = heightOffset + cellHeight;
  }

  // 渲染横向的表头
  let widthOffset = headerWidth;
  for (x = startX; x <= endX; x++) {
    let cellWidth = data.cols[x] ? Number(data.cols[x]) : data.colWidth;

    canvasContext.save();
    canvasContext.beginPath();
    canvasContext.translate(widthOffset, 0);
    canvasContext.rect(0, 0, cellWidth, headerHeight);
    canvasContext.clip();
    canvasContext.fillStyle = '#f4f5f8';
    canvasContext.fill();
    canvasContext.fillStyle = '#585757';
    canvasContext.font = '12px sans-serif';
    canvasContext.textAlign = 'center';
    canvasContext.textBaseline = 'middle';
    const textXPosition = getTextXPosition('center', cellWidth, 5);
    const fontHeight = 12 / 0.75; // pt => px
    const textHeight = fontHeight;
    const textYPosition = getTextYPosition('middle', rowHeaderHeight, textHeight, fontHeight, 5);
    canvasContext.fillText(stringAt(x),textXPosition,textYPosition);
    canvasContext.closePath();
    canvasContext.beginPath();
    canvasContext.fillRect(cellWidth,0,10,10)
    canvasContext.moveTo(cellWidth, 0);
    canvasContext.lineTo(cellWidth, headerHeight);
    canvasContext.strokeStyle = '#ababab';
    canvasContext.stroke();
    canvasContext.closePath();
    canvasContext.restore();
    widthOffset = widthOffset + cellWidth;
  }

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