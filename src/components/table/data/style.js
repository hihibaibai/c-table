import { equals } from '../helper';
export function addStyle(tableData, value) {
    if (!tableData.styles)
        tableData.styles = [];
    if (value) {
        for (let i = 0; i < tableData.styles.length; i += 1) {
            const it = tableData.styles[i];
            if (equals(it, value)) {
                return i;
            }
        }
    }
    return tableData.styles.push(value) - 1;
}
export function getStyle(tableData, index, withDefault = true) {
    const style = tableData.styles[index];
    if (withDefault) {
        return Object.assign({}, tableData.style, tableData.styles[index] || {});
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

export function clearStyles(tableData) {
    tableData.styles.length = 0;
}
