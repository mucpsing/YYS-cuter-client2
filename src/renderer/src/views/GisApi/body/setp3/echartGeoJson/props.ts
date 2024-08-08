/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-08-08 10:27:00
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-08-08 11:12:50
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\body\setp3\echartGeoJson\props.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

export interface DefaultPropsT {
  show?: boolean
  showRect?: boolean
  width?: number
  height?: number
  drawRectSize?: string
  drawRectScale?: number
  maxLinkPoint?: number
  geoJson: any[] // 或者使用更具体的类型，如 GeoJSON 类型的定义
  dataZoom?: any[] // 或者使用更具体的数组类型
  rect?: any[]
}

export const Props = {
  show: false,
  showRect: false,
  width: 550,
  height: 280,
  drawRectSize: "297x210",
  drawRectScale: 0.5,
  maxLinkPoint: 50,
  geoJson: () => [],
  dataZoom: () => [],
  rect: () => [0, 0, 0, 0],
}
export default Props
