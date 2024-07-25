/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-07-18 14:59:47
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-07-25 11:03:59
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\store\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from "pinia"
import { createFormData } from "./state"

import type { TemplateInfo } from "@gisapi/Types"
import type { TabValue } from "tdesign-vue-next"

export const useGisApiStateStore = defineStore("state", {
  state: () => ({
    isGisServerConnected: false,

    currtOpenSettingsPageNames: [] as string[],
  }),

  getters: {},
})

export const useGisApiTabStore = defineStore("state", {
  state: () => ({
    tabList: [
      {
        id: 0 as TabValue,
        label: "未命名工况",
      },
    ],
  }),

  getters: {},

  actions: {
    addTab(tab: { id: TabValue; label: string }) {
      this.tabList.push(tab)
    },
  },
})

// 对应tab页的数据
export const useGisApiDataStroe = defineStore("data", {
  state: () => ({
    currtSetp: 1,

    GlobalLoading: false,

    formCountL: 1,
    formData: [createFormData(0)], // 初始化0索引的数据模板
    currtFormDataId: 0,
    currtFormData: {},

    currtExtendId: -1, // 记录要继承哪个模板的下标
  }),
})

// 对应tab页中，setp1 的templateList组件
export const useGisApiTemplateStroe = defineStore("template", {
  state: () => ({
    TemplateInfo: [] as TemplateInfo[], // 从后端获取mxd模板数据

    templateList: [],
    currtMxdName: "未选择任何mxd模板",
    currtTemplateId: 0,
  }),
})

// 对应tab页中，setp3 的formList组件
export const useGisApiChartStroe = defineStore("charts", {
  state: () => ({
    chartList: [],
  }),
})
