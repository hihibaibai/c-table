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

function fontString(family, size, italic, bold) {
  if (family && size) {
    let font = '';
    if (italic)
      font += 'italic ';
    if (bold)
      font += 'bold ';
    return `${font} ${size}pt ${family}`;
  }
  return undefined;
}

export function cellBorderRender(canvas, rect, borderLine, autoAlign = false) {
  let top, right, bottom, left;
  if (Array.isArray(borderLine)) {
    top = right = bottom = left = borderLine;
  }
  else {
    ({top, right, bottom, left} = borderLine);
  }
  canvas.save().beginPath().translate(rect.x, rect.y);
  const lineRects = (index, offset) => {
    const array = [
      [0 - offset, 0, rect.width + offset, 0],
      [rect.width, 0, rect.width, rect.height],
      [0 - offset, rect.height, rect.width + offset, rect.height],
      [0, 0, 0, rect.height],
    ];
    return array[index];
  };
  [top, right, bottom, left].forEach((it, index) => {
    if (it) {
      let lineDash = [];
      let lineWidth = 1;
      if (it[0] === 'thick') {
        lineWidth = 3;
      }
      else if (it[0] === 'medium') {
        lineWidth = 2;
      }
      else if (it[0] === 'dotted') {
        lineDash = [1, 1];
      }
      else if (it[0] === 'dashed') {
        lineDash = [2, 2];
      }
      let offset = 0;
      if (autoAlign) {
        offset = lineWidth / 2;
      }
      canvas
          .prop({strokeStyle: it[1], lineWidth})
          .setLineDash(lineDash)
          .line(...lineRects(index, offset));
    }
  });
  canvas.restore();
}

// canvas: Canvas2d
// style:
export function cellRender(canvas, cell, rect, style, border, cellRenderer, formatter) {
  // console.log(canvas, cell, rect, style, cellRenderer, formatter)
  let text = '';
  if (cell) {
    if (typeof cell === 'string' || typeof cell === 'number') {
      text = formatter(`${cell}`);
    }
    else {
      text = formatter((cell[2].value || '') + '', cell[2].format);
    }
  }
  // console.log(style)
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
    rotate,
    textwrap,
    padding,
  } = style;
  // at first move to (left, top)
  canvas.save().beginPath().translate(rect.x, rect.y);
  // clip
  canvas.rect(0, 0, rect.width, rect.height).clip();
  if (bgcolor)
    canvas.prop('fillStyle', bgcolor).fill();
  // rotate
  if (rotate && rotate > 0) {
    canvas.rotate(rotate * (Math.PI / 180));
  }
  if (cellRenderer !== undefined) {
    canvas.save();
    if (!cellRenderer(canvas, rect, cell, text)) {
      canvas.restore();
      return;
    }
    canvas.restore();
  }
  // text
  if (text && !/^\s*$/.test(text)) {
    // text style
    canvas
        .save()
        .beginPath()
        .prop({
          textAlign: align,
          textBaseline: valign,
          font: fontString(fontFamily, fontSize, italic, bold),
          fillStyle: color,
        });
    const [xp, yp] = padding || [5, 5];
    const tx = textx(align, rect.width, xp);
    const txts = text.split('\n');
    const innerWidth = rect.width - xp * 2;
    const ntxts = [];
    txts.forEach((it) => {
      const txtWidth = canvas.measureTextWidth(it);
      if (textwrap && txtWidth > innerWidth) {
        let txtLine = {w: 0, len: 0, start: 0};
        for (let i = 0; i < it.length; i += 1) {
          if (txtLine.w > innerWidth) {
            ntxts.push(it.substr(txtLine.start, txtLine.len));
            txtLine = {w: 0, len: 0, start: i};
          }
          txtLine.len += 1;
          txtLine.w += canvas.measureTextWidth(it[i]) + 1;
        }
        if (txtLine.len > 0) {
          ntxts.push(it.substr(txtLine.start, txtLine.len));
        }
      }
      else {
        ntxts.push(it);
      }
    });
    const fontHeight = fontSize / 0.75; // pt => px
    const txtHeight = (ntxts.length - 1) * fontHeight;
    const lineTypes = [];
    if (underline)
      lineTypes.push('underline');
    if (strikethrough)
      lineTypes.push('strikethrough');
    let ty = texty(valign, rect.height, txtHeight, fontHeight, yp);
    ntxts.forEach((it) => {
      const txtWidth = canvas.measureTextWidth(it);
      canvas.fillText(it, tx, ty);
      lineTypes.forEach((type) => {
        canvas.line(...textLine(type, align, valign, tx, ty, txtWidth, fontSize));
      });
      ty += fontHeight;
    });
    canvas.restore();
  }

  // border 之前是单独渲染border的,现在在这里直接渲染了.
  if (Object.keys(border).length > 0) {
    canvas
        .save()
        .beginPath();
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
          x2=rect.width;
          y2=0;
          break;
        case 'right':
          x1=rect.width;
          y1=0;
          x2=rect.width;
          y2=rect.height;
          break;
        case 'bottom':
          x1=0;
          y1=rect.height;
          x2=rect.width;
          y1=rect.height;
          break;
        case 'left':
          x1=0;
          y1=0;
          x2=0;
          y2=rect.height;
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
      canvas
          .prop({strokeStyle: borderColor,lineWidth: lineWidth})
          .setLineDash(lineDash)
          .line(x1,y1,x2,y2);
    });
    canvas.restore();
  }
  canvas.restore();
}

export default {};
