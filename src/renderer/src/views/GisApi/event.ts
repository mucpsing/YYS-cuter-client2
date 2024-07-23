/*
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2023-08-30 23:21:18
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-07-24 00:23:30
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\event.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

export type GisApiEventBusTypes = {
  "gis-api:checkServer": any
  "show-guide": (paramList: [setpKey: string, setpIndex: number]) => void
  "test-guide": (setpOptions: any) => void
}
