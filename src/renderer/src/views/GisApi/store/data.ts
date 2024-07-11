/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-09-22 08:48:27
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-06-30 22:09:05
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\store\data.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { reactive, Ref } from "vue"
import type { TabValue } from "tdesign-vue-next"

import type { TemplateInfo } from "@gisapi/Types"

export const defaultDataItem = { label: "未命名工况" }

// 从后端获取mxd模板数据
export const templateInfo: Ref<TemplateInfo[]> = ref([])

// export const dfsuInfo = reactive({})

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
