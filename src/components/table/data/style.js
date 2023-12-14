import { equals } from '../helper';
export function addStyle(t, value) {
    if (!t.styles)
        t.styles = [];
    if (value) {
        for (let i = 0; i < t.styles.length; i += 1) {
            const it = t.styles[i];
            if (equals(it, value)) {
                return i;
            }
        }
    }
    return t.styles.push(value) - 1;
}
export function getStyle(t, index, withDefault = true) {
    const style = t.styles[index];
    if (withDefault) {
        return Object.assign({}, t.style, t.styles[index] || {});
    }
    return style;
}

export function getStyleIndex(tableData,value){
  const styleKeys = Object.keys(value);
  const defaultStyle = tableData.style;
  console.log(defaultStyle);
  let result = true;
  for (let i = 0; i < styleKeys.length; i++) {
    console.log(styleKeys[i])
    console.log(value[styleKeys[i]])
    console.log(defaultStyle[styleKeys[i]])
    if (value[styleKeys[i]] != defaultStyle[styleKeys[i]]){
      result = false;
    }
  }
  // 如果给的style不是默认的style，那么找一找styles里面有没有，没有就加
  if (!result){
    return addStyle(tableData,value);
  }
}

export function clearStyles(t) {
    t.styles.length = 0;
}
