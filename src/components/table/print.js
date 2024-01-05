

// todo: 这个是给打印模块用的
export function print(table){
  // 先根据数据量，确定总宽度和高度，用来制作一个巨大的canvas
  // 如果不足一页A4的，那么就把宽和高设置为A4大小

  // 复制 renderArea函数，根据数据绘制不带框线的展示
  // 根据之前设置的宽高，使用canvas2dContext.drawImage()进行剪切成对应的块。用toDataUrl输出Base64的图片。

  // 返回带有多张图片的List
}