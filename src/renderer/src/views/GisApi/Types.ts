/*
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-06-30 22:08:32
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2025-08-08 15:46:17
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\Types.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

export { type TaskItemT } from "@gisapi/store/taskStore"
export { type FormDataItemT } from "@gisapi/store/formDataState"
export { type FileInfoItemT } from "@gisapi/store/fileStore"

// api接口返回的类型
export type show_range2DT = [xmin: number, ymin: number, xmax: number, ymax: number]
export type MxdToImgFormBase = {
  template_id: number
  dfsu_be_md5: string
  dfsu_af_md5: string
  output_name: string
  river_range?: "工程前" | "工程后"
  show_range?: show_range2DT
  radian_or_angle?: "radian" | "angle"
  crs?: string | number // 支持直接使用crs代码， auto|unknown
  time_step?: number
  sub_title: string // 图例名称
}

export type MxdToImgFormT = MxdToImgFormBase

/**
 * @description: 整个组件的核心数据
 * @return {*}
 */
export interface TemplateParamItemBase {
  label: string
  tempalte_id: number
  dfsu_be_file: File
  dfsu_af_file: File
  output_name: string
  output_type: string // jpg|png
  project_select: EMPTY_STRING | "10年一遇" | "20年一遇" | "50年一遇" | "100年一遇" | "200年一遇"
  flood_Type: EMPTY_STRING | "以洪为主" | "以潮为主"
}

// 用户上传的自定义mxd，与id两者必须存在一个
export type TemplateParamItem =
  | (TemplateParamItemBase & { tempalte_id: number })
  | (TemplateParamItemBase & { template_url: string })

export interface TemplateInfo {
  template_id: number
  template_name: string
  mxd_name: string
  preview: string
  description: string
}
export type EMPTY_STRING = ""

export interface BoundsT {
  maxx: number // TypeScript中使用number代替Python的float
  minx: number
  maxy: number
  miny: number
}

export interface FileInfoBase {
  file_name: string
  file_ext: string
  md5: string
  bounds: BoundsT
  range_geojson: any
}

// export interface FileInfoItemT {
//   id: string
//   name: string
//   checked: boolean
//   // disabled: boolean
//   md5Name?: string
//   loading?: boolean
//   size?: number
//   md5: string
//   file?: File
//   uploadProgress?: number
//   uploadStatus?: string
//   geoJson?: any[]
// }

export type TBtnThemeT = "default" | "success" | "primary" | "warning" | "danger"
