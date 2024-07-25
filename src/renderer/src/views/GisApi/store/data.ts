/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-09-22 08:48:27
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-07-25 10:17:27
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



export default reactive({})
