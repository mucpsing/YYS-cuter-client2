/**
 * @description: 对多边形的折点进行稀释，减少折点数量
 * @param {T} arr
 * @return {*}
 */
export function getOddIndexedElements<T>(arr: T[]): T[] {
  // 创建一个空数组来存储结果
  let result = []

  // 遍历原数组
  for (let i = 0; i < arr.length; i++) {
    if (i == 0 || i == arr.length - 1) {
      result.push(arr[i])
    } else if (i % 2 !== 0) {
      // 如果是奇数下标，则将当前元素添加到结果数组中
      result.push(arr[i])
    }
  }

  // 返回结果数组
  return result
}

export function calculateDimension(
  dimensions: { width?: number; height?: number },
  aspectRatio: number = 1.414286,
): number {
  if ("width" in dimensions && dimensions.width !== undefined) {
    // 如果对象中定义了宽度，则计算高度
    return dimensions.width * aspectRatio
  } else if ("height" in dimensions && dimensions.height !== undefined) {
    // 如果对象中定义了高度，则计算宽度
    return dimensions.height / aspectRatio
  } else {
    // 如果没有定义宽度或高度，可以抛出错误或返回某个默认值
    throw new Error("No width or height provided to calculate dimension.")
  }
}
