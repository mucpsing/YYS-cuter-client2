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
