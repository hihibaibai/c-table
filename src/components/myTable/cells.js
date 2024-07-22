/**
 * 这个类是专门用来操作数据的
 */
export default class Cells {
  static getCell(data, x, y) {
    let cells = data.cells;
    let cell = cells.find(i => {return i[1] === x && i[0] === y;});
    if (cell) {
      return cell[2];
    }
    return {value: ''};
  }

  static setCell(data, x, y, value) {
    let cells = data.cells;
    let cell = cells.find(i => {return i[0] === x && i[1] === y;});
    if (cell) {
      cell[2] = value;
    }
    else {
      cells.push([x, y, value]);
    }
  }
};