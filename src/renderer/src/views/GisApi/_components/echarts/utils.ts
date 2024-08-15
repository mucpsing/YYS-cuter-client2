/**
 * 判断传入的对象是否为ECharts实例
 *
 * @param obj 待判断的对象
 * @returns 返回布尔值，表示传入的对象是否为ECharts实例
 */
export function isEchartsInstance(obj: any) {
  // 列出ECharts实例通常具有的一些方法
  const echartsMethodsToCheck = ["setOption", "getOption", "dispatchAction", "resize", "clear"]

  const isEchart = echartsMethodsToCheck.every(
    (method) => obj != null && typeof obj[method] === "function",
  )

  return isEchart
}

/**
 * 计算多边形的边界
 *
 * @param polygon 多边形数组，数组中的每个元素表示多边形的一个顶点
 * @returns 返回一个对象，包含多边形的最大x坐标、最小x坐标、最大y坐标和最小y坐标
 */
export const calculateBounds = <T>(polygon: T[]) => {
  // 计算边界的逻辑...
  return {
    maxX: Math.max(...polygon.map((item) => item[0])),
    minX: Math.min(...polygon.map((item) => item[0])),
    maxY: Math.max(...polygon.map((item) => item[1])),
    minY: Math.min(...polygon.map((item) => item[1])),
  }
}

/**
 * 计算中心点及形状大小
 *
 * @param bounds 边界信息，包含 minX、maxX、minY、maxY 属性
 * @returns 返回一个对象，包含 centerX、centerY、width、height 属性，分别表示中心点横坐标、中心点纵坐标、宽度和高度
 */
export const calculateCenterAndShape = (bounds) => {
  const centerX = bounds.minX + (bounds.maxX - bounds.minX) / 2
  const centerY = bounds.minY + (bounds.maxY - bounds.minY) / 2
  const width = bounds.maxX - bounds.minX
  const height = bounds.maxY - bounds.minY

  return { centerX, centerY, width, height }
}

/**
 * 计算坐标轴范围
 *
 * @param bounds 边界对象，包含 minX、maxX、minY、maxY 属性
 * @param shape 形状对象，包含 width、height 属性
 * @returns 返回包含 xAxisMin、xAxisMax、yAxisMin、yAxisMax 属性的对象
 */
export const calculateAxisRange = (bounds, shape) => {
  const offset = Math.max(shape.width, shape.height) / 2

  const xAxisMin = bounds.minX + shape.width / 2 - offset
  const xAxisMax = bounds.maxX - shape.width / 2 + offset

  const yAxisMin = bounds.minY + shape.height / 2 - offset
  const yAxisMax = bounds.maxY - shape.height / 2 + offset
  return { xAxisMin, xAxisMax, yAxisMin, yAxisMax }
}

/**
 * 判断两个点是否相等
 *
 * @param p1 第一个点，表示为一个包含两个数字的数组
 * @param p2 第二个点，表示为一个包含两个数字的数组
 * @returns 如果两个点相等则返回true，否则返回false
 */
export function isPointEqual(p1: number[], p2: number[]): boolean {
  return p1.every((item) => p2.includes(item))
}

/**
 * 判断给定的路径是否为闭合路径
 *
 * @param data 路径点数组
 * @returns 如果路径是闭合的返回true，否则返回false
 */
export const isClosedPath = (data: any[]) =>
  data.length > 2 && isPointEqual(data[0], data[data.length - 1])

/**
 * 判断点p1是否在点p2的指定范围内
 *
 * @param p1 第一个点的坐标，形如[x, y]
 * @param p2 第二个点的坐标，形如[x, y]
 * @param range 范围值，默认为20
 * @returns 如果点p1在点p2的指定范围内则返回true，否则返回false
 */
export const isNearExistingPoint = (p1, p2, range: number = 20) =>
  (p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2 <= (range / 2) ** 2

/**
 * 稀释多边形
 *
 * @param polygon 多边形数组
 * @param maxLength 最大长度
 * @returns 稀释后的多边形数组
 */
export function diluteThePolygon<T>(polygon: T[], maxLength: number): T[] {
  let result = polygon
  while (result.length > maxLength) {
    result = retainFirstLastAndOddIndexed<T>(result)
  }
  return result
}

/**
 * 保留数组的第一个元素、最后一个元素以及所有奇数索引（从0开始计数）的元素。
 * @param {T[]} arr 输入的数组。
 * @return {T[]} 包含指定元素的数组。
 */
export function retainFirstLastAndOddIndexed<T>(arr: T[]): T[] {
  if (arr.length === 0) return []

  let result = [arr[0]] // 始终包含第一个元素

  // 遍历原数组（从索引1开始，因为第一个元素已经添加到结果中）
  for (let i = 1; i < arr.length - 1; i++) {
    if (i % 2 !== 0) {
      // 如果是奇数索引，则将当前元素添加到结果数组中
      result.push(arr[i])
    }
  }

  // 添加最后一个元素，闭合作用
  if (result[0] !== arr[arr.length - 1]) result.push(arr[arr.length - 1])

  return result
}
