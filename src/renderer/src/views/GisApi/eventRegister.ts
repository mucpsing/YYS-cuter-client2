/*
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2023-08-30 23:21:18
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-11-27 14:58:20
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\event.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { GUIDE_EVENTS } from "@gisapi/_components/guideEvents"

export type GisApiEventBusTypes = {
  "gis-api:init": any // @gisapi/index.vue
  "gis-api:checkServer": any // @gisapi/body/index.vue
  "gis-api:show-preview": (url: string) => void // @gisapi/body/index.vue

  [GUIDE_EVENTS.SHOW]: (string | number)[] // @gisapi/_components/guide.vue
  [GUIDE_EVENTS.TEST]: any // @gisapi/_components/guide.vue

  "gis-api:add-upload-task": () => void // @gisapi/utils/uploadHander.ts
}
