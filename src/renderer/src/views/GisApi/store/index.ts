/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-07-18 14:59:47
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-08-01 17:27:23
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\store\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from "pinia"
import { createFormData } from "./state"
import config, { DEFAULT_SERVER_IP_LIST } from "@gisapi/store/config"
import { uploadFile, getTemplateList, serverCheckApi } from "@gisapi/api"
import * as API from "@gisapi/api"
import { UP_FILE_ACCEPT_TYPE } from "@gisapi/store/config"

import type { TemplateInfo } from "@gisapi/Types"
import type { TabValue } from "tdesign-vue-next"
import { getMd5 } from "@renderer/utils/calculateMd5"

const DEFAULT_INPUT_ELEMENT_REF = document.createElement("input")

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
export const useFileStroe = defineStore("fileStore", {
  state: () => ({
    fileReading: false,
    dfsuList: [] as any[],
    shpList: [],
    geoJsonList: [],
  }),

  actions: {
    async onUploadBtnClick(target) {
      // 调用点击事件
      DEFAULT_INPUT_ELEMENT_REF.accept = UP_FILE_ACCEPT_TYPE[target]

      DEFAULT_INPUT_ELEMENT_REF.onchange = (e) => this.upFileHandler(e, target)

      DEFAULT_INPUT_ELEMENT_REF.type = "file"
      DEFAULT_INPUT_ELEMENT_REF.multiple = true
      if (DEFAULT_INPUT_ELEMENT_REF.value) DEFAULT_INPUT_ELEMENT_REF.value = ""
      DEFAULT_INPUT_ELEMENT_REF.click()
    },

    async upFileHandler(e, target) {
      if (!e.target) return console.log("获取实例失败")
      if (!e.target.files) return console.log("没有选中文件")

      if (target == "dfsu") {
        this.dfsuHandler(e.target.files)
      } else if (target == "shp") {
        this.shpfileHandler(e.target.files)
      } else if (target == "geoJson") {
        this.geoJsonHandler(e.target.files)
      }

      console.log(e.target.files)
    },

    async shpfileHandler(files: FileList) {},

    async geoJsonHandler(files: FileList) {},
    async dfsuHandler(files: FileList) {
      console.log("dfsuHandler:", { files })
      if (files.length == 0) return

      for (let file of files) {
        const md5 = await getMd5(file)
        const eachFileInfo = {
          size: file.size / 1024 / 1024,
          name: `${md5}.dfsu`, // nameWithMd5
          md5,
          file,
          uploadProgress: -1,
          status: "uploading",
          geoJson: [],
        }

        // 判断文件是否已经存在
        let hasFile = this.dfsuList.some((each) => each.md5 == eachFileInfo.md5)
        if (hasFile) return console.log("再重复上传")

        // 添加到列表
        this.dfsuList.push(eachFileInfo)

        const upload_res = await API.uploadFile(eachFileInfo, (uploadPress: number) => {
          console.log({ uploadPress })
          eachFileInfo.uploadProgress = uploadPress
        })

        console.log({ upload_res })
      }
    },
  },
})
