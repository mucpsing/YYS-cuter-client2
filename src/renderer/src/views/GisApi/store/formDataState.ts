/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-09-26 14:23:33
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-11-19 09:50:08
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\store\state.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @Description: 建议所有state变量使用currtXxxxXxxx来命名
 */
/** 关联下面的options.value，用来控制当前组件的setp */

import type { BoundsT, TemplateInfo } from "@gisapi/Types"
export const DEFAULT_TEMPLATE_OUTNAME = "未命名工况"

export function createFormData(newTabId: number) {
  return {
    id: newTabId,
    setp: 1,
    title: DEFAULT_TEMPLATE_OUTNAME,
    beDfsuMd5List: [] as string[], // 使用列表形式存储md5，后续添加批量导出功能
    afDfsuMd5List: [] as string[], // 使用列表形式存储md5，后续添加批量导出功能
    beDfsuInfo: {
      // dfsu 工程前文件信息
      md5: "",
      progress: 0,
      size: 0,
      path: "",
      name: "",
      reading: false,
      file: {} as File,
      bounds: undefined as BoundsT | undefined,
      range_geojson: undefined as object | undefined,
    },
    afDfsuInfo: {
      // dfsu 工程后文件信息
      md5: "",
      progress: 0,
      size: 0,
      path: "",
      name: "",
      reading: false,
      file: {} as File, // 文件实例，已缓存在浏览器
      bounds: undefined as BoundsT | undefined,
      range_geojson: undefined as object | undefined,
    },
    projectRange: {
      // 项目范围 shp文件信息
      md5: "",
      path: "",
      size: 0,
      name: "",
      reading: false,
      fileCount: 0,
      fileList: [] as { file: File; ext: string; name: string }[],
      shpList: [] as string[],
    },
    outputName: "",
    riverRange: "工程后" as "工程前" | "工程后",
    mxdId: -1, // 要使用的mxd模板id
    mxdName: "",
    projectRangeType: "shp" as "point" | "shp", // 仅前端用来打包参数时区分用shp还是point
    projectPoints: [0, 0, 0, 0] as number[], // [minX, maxX, minY, maxY]
    radian_or_angle: "弧度" as `弧度` | `角度`,
    show_range: 600,
    mesh_size: 25,
    contour_range: 200, // 大于这个长度的流速等值线才会被显示
    contour_setp: [] as number[], // 等值线要显示哪些值

    templateInfo: {} as TemplateInfo,
  }
}
const defaultFormData = createFormData(0)

export type FormDataItemT = typeof defaultFormData

export default defaultFormData
