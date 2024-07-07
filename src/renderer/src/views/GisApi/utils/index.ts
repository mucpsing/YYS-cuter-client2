/*
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-06-29 22:42:41
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-07-07 20:34:09
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\utils\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 *
 *
 */

/**
 * 截断文本
 *
 * @param text 待截断的文本
 * @param maxLength 截断后的最大长度
 * @returns 截断后的文本，如果原始文本长度小于等于最大长度，则返回原始文本；否则返回前 maxLength-3 个字符加上 "..."
 */
export function truncateText(text: string, maxLength: number = 30): string {
  if (text.length <= maxLength) {
    return text
  }
  return text.substring(0, maxLength - 3) + "..."
}

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
