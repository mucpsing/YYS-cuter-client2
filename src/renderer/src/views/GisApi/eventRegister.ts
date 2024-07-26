/*
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2023-08-30 23:21:18
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-07-25 19:50:45
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\event.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

export type GisApiEventBusTypes = {
  "gis-api:init": any // @gisapi/index.vue
  "gis-api:checkServer": any // @gisapi/body/index.vue
  "show-guide": (paramList: (number | string)[]) => void // @gisapi/_components/guide.vue
  "test-guide": (setpOptions: any) => void // @gisapi/_components/guide.vue
}
