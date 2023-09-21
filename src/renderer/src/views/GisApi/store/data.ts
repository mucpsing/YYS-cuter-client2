import { reactive } from "vue"
import type { TabValue } from "tdesign-vue-next"

export const defaultDataItem = {
  label: "未命名工况",
}

// 从后端获取
export const templateInfo = ref([
  {
    template_id: 1,
    template_name: "采样点",
    mxd_name: "采样点_template.mxd",
    preview: "./采样点_template.png",
  },
  {
    template_id: 2,
    template_name: "流速",
    mxd_name: "流速_template.mxd",
    preview: "./流速_template.png",
  },
  {
    template_id: 3,
    template_name: "流向",
    mxd_name: "流向_template.mxd",
    preview: "./流向_template.png",
  },
])

export type EMPTY_STRING = ""
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

export const currtIndex = ref(0)
export const data = ref([
  {
    id: 0 as TabValue,
    label: "未命名工况",
  },
])

export default reactive({})
