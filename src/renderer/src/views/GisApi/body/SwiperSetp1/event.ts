import { debounce } from "lodash"

import { currtMxdName } from "@renderer/views/GisApi/store/state"
import { currtFormDataId, currtTemplateId } from "@renderer/views/GisApi/store/state"
import { formDataList as currtFormDataList } from "@renderer/views/GisApi/store/state"
import type { TemplateInfo } from "@gisapi/Types"

/**
 * @description: 选择常用模板的触发函数
 */
// export const selectCommonTemplateHandler = debounce((item: TemplateInfo) => {
export const swtichCommonTemplate = debounce(
  (item: { template_name: string; template_id: number } | TemplateInfo) => {
    if (item.template_id) {
      // 设置状态
      currtTemplateId.value = item.template_id
      currtFormDataList.value[currtFormDataId.value].mxdId = item.template_id

      currtMxdName.value = `${item.template_id}-${item.template_name}`
      currtFormDataList.value[
        currtFormDataId.value
      ].mxdName = `${item.template_id} - ${item.template_name}`
    }
  },
  100,
)
