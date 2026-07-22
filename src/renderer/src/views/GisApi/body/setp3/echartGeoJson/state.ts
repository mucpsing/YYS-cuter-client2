/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2026-07-02 10:13:00
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2026-07-06 15:34:03
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\body\setp3\echartGeoJson\state.ts
 * @Description: 记录当前组件中出现过的所有视图，因为要考虑不同tab可能共用一个echart实例的显示视图，所以将视图进行独立的状态管理，
 * 达到一对多的效果，即一个echart视图状态可被多个echart进行关联，tab数据只要记录当前ehcart视图id即可
 */

import { defineStore } from "pinia"
import { hash } from "spark-md5"

import { merge } from "lodash-es"

export interface GeoJsonEchartStoreItem {
    id?: string
    rectOption?: number[]
    dataZoomOption?: any
}

export const useEhartGeoJsonStore = defineStore({
    id: "useEhartGeoJsonStore",

    state: () => ({
        options: {} as { [optionId: string]: GeoJsonEchartStoreItem },
    }),

    actions: {
        getId() {
            return hash(`${Date.now()}`)
        },

        getOptionById(optionId: string) {
            if (!this.options[optionId]) return console.log(`没有这个id：${optionId}`)
            return this.options[optionId]
        },

        setOptionById(optionId: string, item: GeoJsonEchartStoreItem) {
            this.options[optionId] = item

            return optionId
        },

        updateOptionById(optionId: string, itemKey: "rectOption" | "dataZoomOption", item: any) {
            if (!this.options[optionId]) return
            if (!this.options[optionId][itemKey]) return

            this.options[optionId][itemKey] = merge(this.options[optionId][itemKey], item)
        },

        removeOption(optionId: string) {
            if (this.options[optionId]) delete this.options[optionId]
        },
    },

    getters: {},
})
