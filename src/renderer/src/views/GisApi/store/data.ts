/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-09-22 08:48:27
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2023-12-20 15:11:19
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\store\data.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { reactive } from "vue"
import type { TabValue } from "tdesign-vue-next"

export const defaultDataItem = {
  label: "未命名工况",
}

// 从后端获取mxd模板数据
export const templateInfo = ref([
  {
    template_id: 1,
    template_name: "采样点",
    mxd_name: "采样点_template.mxd",
    preview: "points_template.png",
    description:
      "默认的采样点mxd模板，支持自定义项目范围（shp面文件）、自定义显示范围（默认河道前后1.5km）、可选是否添加水文站点显示。",
  },
  {
    template_id: 2,
    template_name: "流速",
    mxd_name: "流速_template.mxd",
    preview: "speed_template.png",
    description: "默认的流速mxd模板，支持自定义项目范围（shp面文件）",
  },
  {
    template_id: 3,
    template_name: "流向",
    mxd_name: "流向_template.mxd",
    preview: "dir_template.png",
    description: "默认的流向（流场）mxd模板，支持自定义项目范围（shp面文件）",
  },
  {
    template_id: 1,
    template_name: "采样点",
    mxd_name: "采样点_template.mxd",
    preview: "points_template.png",
    description:
      "默认的采样点mxd模板，支持自定义项目范围（shp面文件）、自定义显示范围（默认河道前后1.5km）、可选是否添加水文站点显示。",
  },
  {
    template_id: 2,
    template_name: "流速",
    mxd_name: "流速_template.mxd",
    preview: "speed_template.png",
    description: "默认的流速mxd模板，支持自定义项目范围（shp面文件）",
  },
  {
    template_id: 3,
    template_name: "流向",
    mxd_name: "流向_template.mxd",
    preview: "dir_template.png",
    description: "默认的流向（流场）mxd模板，支持自定义项目范围（shp面文件）",
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

/**
 * @description: 用于补全自定义输出名称
 */
export const keyWord = [
  "洪水",
  "10年一遇",
  "20年一遇",
  "50年一遇",
  "100年一遇",
  "200年一遇",
  "以洪为主",
  "以潮为主",
]

export default reactive({})
