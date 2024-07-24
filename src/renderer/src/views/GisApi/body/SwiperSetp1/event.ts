/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-07-22 09:51:34
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-07-24 10:15:32
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\body\SwiperSetp1\event.ts
 * @Description: 需要优化，两个组件的通讯函数，又不想使用父传组的硬连接方式
 */
import { throttle } from "lodash"

import { currtMxdName } from "@renderer/views/GisApi/store/state"
import { currtFormDataId, currtTemplateId } from "@renderer/views/GisApi/store/state"
import { formDataList as currtFormDataList } from "@renderer/views/GisApi/store/state"
import type { TemplateInfo } from "@gisapi/Types"

/**
 * @description: 选择常用模板的触发函数
 */
export const swtichCommonTemplate = throttle(
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
  300,
)
