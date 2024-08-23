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

  /**
   * 如果是merge的话，会把merge的范围返回，不是的情况下返回false
   * @param data
   * @param x
   * @param y
   */
  static isCellMerge(data, x, y) {
    let {merges} = data;
    // console.log(data);
    // console.log(merges);
    // console.log(x, y);
    return merges.find(merge => {
      return x >= merge.sx && x <= merge.ex && y >= merge.sy && y <= merge.ey;
    });
  }
};