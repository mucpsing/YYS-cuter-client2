/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-07-22 09:51:34
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-07-25 23:05:18
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\body\SwiperSetp1\event.ts
 * @Description: 需要优化，两个组件的通讯函数，又不想使用父传组的硬连接方式
 */
import { throttle } from "lodash"
import type { TemplateInfo } from "@gisapi/Types"

import { useGisApiTabStore, useGisApiTemplateStroe } from "@gisapi/store/index"
const tabStore = useGisApiTabStore()

/**
 * @description: 选择常用模板的触发函数
 */
export const swtichCommonTemplate = throttle(
  (item: { template_name: string; template_id: number } | TemplateInfo) => {
    if (item.template_id) {
      tabStore.setTemplateInfoToFormDataById(item.template_id)
    }
  },
  300,
)
