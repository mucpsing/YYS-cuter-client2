/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-12-27 09:04:16
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-12-30 11:03:39
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\TyphoonUI\events.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const EVENT_NAME = {
  showTyphoon: "TyphoonUI:render-typhoon-data",
} as const

export type TyphoonEventTypes = {
  "pythoon-show-settings": any
  "typhoon-test-events": any
  [EVENT_NAME.showTyphoon]: [md5: string, name: string, id: number]
}
