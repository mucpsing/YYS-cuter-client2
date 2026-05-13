/*
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-06-30 22:08:32
 * @LastEditors: Capsion 373704015@qq.com
 * @LastEditTime: 2026-05-14 00:45:26
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\Types.ts
 * @Description: 这里将所有的类型收集进行导出
 */

export type { FormDataItemT } from "@gisapi/store/formDataState"
export type { FileInfoItemBaseT, FileTabInfoItemT } from "@gisapi/store/fileStore"
export type { FileListKeyT } from "@gisapi/store/index"

export interface TaskItemT {
    preview: string
    task_id: string
    status: "pending" | "running" | "processing" | "completed" | "failed" | "cancelling" | "cancelled" | "invalid" // invalid
    progress: number
    request: MxdToImgFormT
    created_at: number
    updated_at: number
    result: any
    error: any
}

// api接口返回的类型
export type show_range2DT = [xmin: number, ymin: number, xmax: number, ymax: number]

/** 本类型与后端/routers/v1/gisArcMap/types.py中DfsuToShpRequest始终保持一致 **/
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
    sub_title_zoom_ratio: number
    contour_setp: string
    contour_min_len:number
}

/** 本类型与后端/routers/v1/gisArcMap/types.py中DfsuToShpRequest始终保持一致 **/
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

export type TBtnThemeT = "default" | "success" | "primary" | "warning" | "danger"
