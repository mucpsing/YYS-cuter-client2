/*
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-07-17 23:58:43
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-07-18 00:04:01
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\utils\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-06-29 22:42:41
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-07-14 21:45:46
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
