import Cells, {cellValue, cellValueString} from './cells';
import {scrollx, scrolly, scrollResetRows, scrollResetCols} from './scroll';
import {isMerged, merge, unmerge, rangeUnoinMerges} from './merge';
import {addStyle, clearStyles} from './style';
import {addBorder, clearBorder, clearBorders} from './border';
import {col, colWidth, colsWidth, isLastCol, stepColIndex} from './col';
import {row, rowHeight, rowsHeight, isLastRow, stepRowIndex} from './row';
import {copy} from './copy';

export function defaultData() {
  return {
    rows: {
      len: 100,
    },
    cols: {
      len: 26,
    },
    rowHeight: 25,
    colWidth: 100,
    scroll: [0, 0, 0, 0],
    style: {
      bgcolor: '#FFF',
      color: '#333',
      align: 'left',
      valign: 'middle',
      textwrap: true,
      bold: false,
      italic: false,
      fontFamily: 'Roboto',
      fontSize: 10,
      underline: false,
      strikethrough: false,
      border: {}
    },
    styles: [],
    borders: [],
    merges: [],
    cells: [],
  };
}

export {
  isMerged,
  merge,
  unmerge,
  rangeUnoinMerges,
  addStyle,
  clearStyles,
  addBorder,
  clearBorder,
  clearBorders,
  col,
  colWidth,
  colsWidth,
  isLastCol,
  stepColIndex,
  row,
  rowHeight,
  rowsHeight,
  isLastRow,
  stepRowIndex,
  scrollx,
  scrolly,
  scrollResetRows,
  scrollResetCols,
  Cells,
  cellValue,
  cellValueString,
  copy,
};
