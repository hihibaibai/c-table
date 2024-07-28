const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function alphabet(index) {
  return alphabets.charAt(index % alphabets.length);
}

/**
 * 返回给定索引的abc字符串
 * @param index
 * @returns {string}
 */
export function stringAt(index) {
  const ary = [];
  while (index >= 0) {
    ary.push(alphabet(index));
    index = parseInt(index / alphabets.length + '', 10) - 1;
  }
  return ary.reverse().join('');
}
export function indexAt(str) {
  let ret = 0;
  for (let i = 0; i < str.length; i++) {
    ret = 26 * ret + str.charCodeAt(i) - 64;
  }
  return ret - 1;
}