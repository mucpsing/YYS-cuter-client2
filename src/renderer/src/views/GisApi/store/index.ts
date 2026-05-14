/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-07-18 14:59:47
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2026-05-14 15:13:47
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\store\index.ts
 * @Description: 目前使用pinia存放页面所有的状态，日后如果复杂，可以使用./modules/xxx.ts来进行分类管理，这里是唯一状态store入口
 */
import { defineStore } from "pinia"
import { createFormData, type FormDataItemT } from "./formDataState"
import config from "@gisapi/store/config"
import { getTemplateList, serverCheckApi } from "@renderer/views/GisApi/utils/server"
import { useFileStroe } from "./fileStore"
// import { useTaskStore } from "./taskStore"

import { cloneDeep } from "lodash-es"

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
        // 需要在最外层的app.vue或者index.vue调用，初始化本store
        async init() {
            await this.checkoutServerOnReady()
        },

        async checkoutServerOnReady() {
            this.GlobalLoading = true
            const formStore = useGisApiTabStore()

            console.log("检查IP: ", config.SERVER_IP)
            this.isGisServerConnected = await serverCheckApi(500)

            if (this.isGisServerConnected && formStore.templateInfoList.length == 0) {
                await formStore.getTemplateList()

                setTimeout(() => (this.GlobalLoading = false), 600)
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

export type FileListKeyT = "beDfsuMd5List" | "afDfsuMd5List"

export const useGisApiTabStore = defineStore("tabStore", {
    state: () => ({
        currtTabId: 0,
        currtExtendId: -1, // 记录要继承哪个模板的下标,tabID，但是当前当前似乎没有用到
        showAddTapDialog: false, // 关联@gisApi/body/topToolBar里面的dialog组件
        tabList: [
            {
                id: 0 as TabValue,
                label: "未命名工况",
            },
        ],

        formCount: 1,
        formDataList: [createFormData(0)] as FormDataItemT[], // 初始化0索引的数据模板

        templateInfoList: [] as TemplateInfo[], // 从后端获取mxd模板数据
        fileListKeys: ["beDfsuMd5List", "afDfsuMd5List"] as FileListKeyT[],
    }),

    getters: {
        currtTab: (state) => state.tabList[state.currtTabId],
        currtFormData: (state) => state.formDataList[state.currtTabId],
        currtFileCount: (state) => {
            let allFileCount = 0
            state.fileListKeys.forEach((key) => (allFileCount += state.formDataList[state.currtTabId][key].length))
            return allFileCount
        },
    },

    actions: {
        clreanDfsu(dataKey: string) {
            this.formDataList[this.currtTabId][dataKey] = []
        },

        // TODO 当前仅实现了单选，后续实现多选
        selectDfsu(targetKey: string, md5: string) {
            if (!this.formDataList[this.currtTabId][targetKey].includes(md5))
                this.formDataList[this.currtTabId][targetKey] = [md5]
        },

        addDfsu(key: FileListKeyT, md5: string) {
            const dfsuInfo = useFileStroe().getFile(md5)

            if (!dfsuInfo) return

            // 从fileStore中读取的话，文件应该是已经上传完毕的缓存文件
            // BUG 可能会添加一个已经上传的文件，但是这里的进度还是0
            this.formDataList[this.currtTabId][key].push({
                ...dfsuInfo,
                checked: false,
                loading: false,
                disabled: false,
                uploadProgress: 0,
            })
        },

        updateSelectFileItemByMd5(md5: string, newInfo: any) {
            for (let key of this.fileListKeys) {
                for (let eachIten of this.formDataList[this.currtTabId][key]) {
                    if (eachIten.md5 === md5) Object.assign(eachIten, newInfo)
                }
            }
        },

        removeDfsu(md5: string) {
            let removeCount = 0
            for (let key of this.fileListKeys) {
                const index = this.formDataList[this.currtTabId][key].findIndex((item) => item.md5 === md5)

                if (index != -1) {
                    this.formDataList[this.currtTabId][key].splice(index, 1)
                    removeCount++
                }
            }

            return removeCount
        },

        showAddTabDialog() {
            this.showAddTapDialog = true
        },

        closeAddTabDialog() {
            this.showAddTapDialog = false
        },

        /**
         * @description: 
         * @param {string} extendTabId -1代表创建全新
         * @return {*}
         */
        addTab(extendTabId: string | number = -1) {
            extendTabId = parseInt(extendTabId.toString())

            const newTabId = this.tabList.length
            const newFormData = createFormData(newTabId)

            if (extendTabId >= 0) {
                Object.assign(newFormData, cloneDeep(this.formDataList[extendTabId]))

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

        async getTemplateList() {
            this.templateInfoList.length = 0
            this.templateInfoList = await getTemplateList()
            console.log("templateInfoList:", this.templateInfoList)
        },
    },
})

// 对应tab页中，setp3 的formList组件
export const useGisApiChartStroe = defineStore("chartsState", {
    state: () => ({
        chartList: [],
    }),
})

export { useFileStroe } from "./fileStore"
export { useTaskStore } from "./taskStore"
export { useConfigStore } from "./config"
