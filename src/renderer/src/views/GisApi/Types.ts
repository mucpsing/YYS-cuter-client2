/**
 * @description: 整个组件的核心数据
 * @return {*}
 */
interface TemplateParamItemBase {
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
