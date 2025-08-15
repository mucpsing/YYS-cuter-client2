/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-07-18 14:59:47
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2025-08-15 14:56:55
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\store\index.ts
 * @Description: 目前使用pinia存放页面所有的状态，日后如果复杂，可以使用./modules/xxx.ts来进行分类管理，这里是唯一状态store入口
 */
import { defineStore } from "pinia"
import { createFormData } from "./formDataState"
import config, { DEFAULT_SERVER_IP_LIST } from "@gisapi/store/config"
import { getTemplateList, serverCheckApi } from "@renderer/views/GisApi/utils/server"

import type { TabValue } from "tdesign-vue-next"
import type { TemplateInfo } from "@gisapi/Types"

export const useGisApiStateStore = defineStore("globalStore", {
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

export const useGisApiTabStore = defineStore("tabStore", {
  state: () => ({
    currtTabId: 0,
    currtExtendId: -1, // 记录要继承哪个模板的下标
    showAddTapDialog: false, // 关联@gisApi/body/topToolBar里面的dialog组件
    tabList: [
      {
        id: 0 as TabValue,
        label: "未命名工况",
      },
    ],

    formCount: 1,
    formDataList: [createFormData(0)], // 初始化0索引的数据模板

    templateInfoList: [] as TemplateInfo[], // 从后端获取mxd模板数据
    fileListKeys: ["beDfsuMd5List", "afDfsuMd5List"],
  }),

  getters: {
    currtTab: (state) => state.tabList[state.currtTabId],
    currtFormData: (state) => state.formDataList[state.currtTabId],
  },

  actions: {
    clreanDfsu(dataKey: string) {
      this.formDataList[this.currtTabId][dataKey] = []
    },

    // TODO 当前仅实现了单选，后续实现多选
    selectDfsu(targetKey: string, md5: string) {
      // const targetKey = dataKey == "be" ? "beDfsuMd5List" : "afDfsuMd5List"

      if (!this.formDataList[this.currtTabId][targetKey].includes(md5))
        this.formDataList[this.currtTabId][targetKey] = [md5]
    },

    addDfsu(key: "beDfsuMd5List" | "afDfsuMd5List", md5: string) {
      this.formDataList[this.currtTabId][key].push()
    },

    updateSelectFileItemByMd5(md5: string, newInfo: any) {
      for (let key of this.fileListKeys) {
        for (let eachIten of this.formDataList[this.currtTabId][key]) {
          if (eachIten.md5 === md5) Object.assign(eachIten, newInfo)
        }
      }
    },

    removeDfsu(md5: string) {
      for (let key of this.fileListKeys) {
        const index = this.formDataList[this.currtTabId][key].indexOf(md5)
        const removeItem = this.formDataList[this.currtTabId][key][index]

        if (index >= 0) {
          this.formDataList[this.currtTabId][key].splice(index, 1)
          return removeItem
        }
      }
    },

    showAddTabDialog() {
      this.showAddTapDialog = true
    },

    closeAddTabDialog() {
      this.showAddTapDialog = false
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

    // async exchaneDfsuInfo() {
    //   const temp = Object.assign({}, this.formDataList[this.currtTabId].beDfsuInfo)
    //   Object.assign(
    //     this.formDataList[this.currtTabId].beDfsuInfo,
    //     this.formDataList[this.currtTabId].afDfsuInfo,
    //   )
    //   Object.assign(this.formDataList[this.currtTabId].afDfsuInfo, temp)
    // },

    async getTemplateList() {
      this.templateInfoList.length = 0
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
export { useTaskStore } from "./taskStore"
