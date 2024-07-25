export default class Merge {

  // isMerged() {
  //
  // }


  static getInRangeMerge(data, startX, startY, endX, endY) {
    let {merges} = data;
    return merges.filter(i => {
      let {sx, sy, ex, ey} = i;
      return startX <= sx && startY <= sy && sx < endX && sy < endY;
    });

  }
};


