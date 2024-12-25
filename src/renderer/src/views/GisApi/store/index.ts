/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-07-18 14:59:47
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-11-27 15:51:43
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\store\index.ts
 * @Description: 目前使用pinia存放页面所有的状态，日后如果复杂，可以使用./modules/xxx.ts来进行分类管理，这里是唯一状态store入口
 */
import { defineStore } from "pinia"
import { createFormData } from "./formDataState"
import config, { DEFAULT_SERVER_IP_LIST } from "@gisapi/store/config"
import { getTemplateList, serverCheckApi } from "@gisapi/api"

import type { TabValue } from "tdesign-vue-next"
import type { TemplateInfo } from "@gisapi/Types"

export const useGisApiStateStore = defineStore("globalState", {
  state: () => ({
    isGisServerConnected: false,
    GlobalLoading: false,

    currtOpenSettingsPageNames: [] as string[],

    showImgPreview: false,
    showImgPreviewUrl: "",
  }),

  actions: {
    async checkoutServerOnReady() {
      this.GlobalLoading = true
      const formStore = useGisApiTabStore()

      for (let serverIp of DEFAULT_SERVER_IP_LIST) {
        console.log("检查IP: ", serverIp)
        config.SERVER_IP = serverIp
        this.isGisServerConnected = await serverCheckApi(500)

        if (this.isGisServerConnected && formStore.templateInfoList.length == 0) {
          await formStore.getTemplateList()

          setTimeout(() => (this.GlobalLoading = false), 600)

          break
        }
      }
      setTimeout(() => (this.GlobalLoading = false), 1200)
    },

    async showPreview(url: string) {
      console.log({ url })
      if (!url) return
      this.showImgPreview = true
      this.showImgPreviewUrl = url
    },
  },
})

export const useGisApiTabStore = defineStore("formState", {
  state: () => ({
    currtTabId: 0,
    currtExtendId: -1, // 记录要继承哪个模板的下标

    tabList: [
      {
        id: 0 as TabValue,
        label: "未命名工况",
      },
    ],

    formCount: 1,
    formDataList: [createFormData(0)], // 初始化0索引的数据模板

    templateInfoList: [] as TemplateInfo[], // 从后端获取mxd模板数据
  }),

  getters: {
    currtTab: (state) => state.tabList[state.currtTabId],
    currtFormData: (state) => state.formDataList[state.currtTabId],
  },

  actions: {
    // addDfsu(dataKey: string, md5: string) {
    //   const targetKey = dataKey == "be" ? "beDfsuMd5List" : "afDfsuMd5List"

    //   this.formDataList[this.currtTabId][targetKey].push(md5)
    // },

    clreanDfsu(dataKey: string) {
      const targetKey = dataKey == "be" ? "beDfsuMd5List" : "afDfsuMd5List"
      this.formDataList[this.currtTabId][targetKey] = []
    },

    // TODO 当前仅实现了单选，后续实现多选
    selectDfsu(dataKey: string, md5: string) {
      const targetKey = dataKey == "be" ? "beDfsuMd5List" : "afDfsuMd5List"

      if (!this.formDataList[this.currtTabId][targetKey].includes(md5))
        this.formDataList[this.currtTabId][targetKey] = [md5]
    },

    removeDfsu(dataKey: string, md5: string) {
      const targetKey = dataKey == "be" ? "beDfsuMd5List" : "afDfsuMd5List"

      const index = this.formDataList[this.currtTabId][targetKey].indexOf(md5)

      if (index >= 0) this.formDataList[this.currtTabId][targetKey].splice(index, 1)
    },

    addTab(extendTabId: string | number = -1) {
      extendTabId = parseInt(extendTabId.toString())

      const newTabId = this.tabList.length
      const newFormData = createFormData(newTabId)

      if (extendTabId >= 0) {
        Object.assign(newFormData, this.formDataList[extendTabId])

        this.currtTabId++
      }

      this.formDataList.push(newFormData)

      const newTab = {
        id: newTabId,
        label: newFormData.title ? newFormData.title : `未命名${newTabId}`,
      }

      this.tabList.push(newTab)

      // 切换到新增的页面
      this.currtTabId = newTabId
    },

    removeTab(tabId: string | number) {
      tabId = parseInt(tabId.toString())

      // const formStore = useGisApiDataStroe()
      this.formDataList.splice(tabId, 1)

      this.tabList.splice(tabId, 1)

      // 防止删除后，tab页数不对
      if (this.tabList.length == 0) {
        this.addTab()
        this.currtTabId = 0
        return
      }

      // 删除当前页
      if (tabId == this.currtTabId) {
        // 删除第一个tab
        if (tabId > 0) this.currtTabId = this.currtTabId - 1
      } else if (tabId <= this.currtTabId) {
        // 删除当前的tab
        this.currtTabId = this.currtTabId - 1
      }
    },

    changeTab(tabId: string | number) {
      tabId = parseInt(tabId.toString())

      this.currtTabId = tabId
    },

    setTemplateInfoToFormDataById(templateId: number) {
      for (let tempalteInfo of this.templateInfoList) {
        if (tempalteInfo.template_id == templateId) {
          this.formDataList[this.currtTabId].templateInfo = tempalteInfo
          this.formDataList[this.currtTabId].mxdName = tempalteInfo.mxd_name
          this.formDataList[this.currtTabId].mxdId = tempalteInfo.template_id
        }
      }
    },

    async exchaneDfsuInfo() {
      const temp = Object.assign({}, this.formDataList[this.currtTabId].beDfsuInfo)
      Object.assign(
        this.formDataList[this.currtTabId].beDfsuInfo,
        this.formDataList[this.currtTabId].afDfsuInfo,
      )
      Object.assign(this.formDataList[this.currtTabId].afDfsuInfo, temp)
    },

    async getTemplateList() {
      this.templateInfoList = await getTemplateList()
    },
  },
})

// 对应tab页中，setp3 的formList组件
export const useGisApiChartStroe = defineStore("chartsState", {
  state: () => ({
    chartList: [],
  }),
})

// 存放文件数据的store
// export const useFileStroe = defineStore("fileStore", fileStoreBase)
export { useFileStroe } from "./fileStore"
