<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-12-24 17:03:36
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-12-30 09:35:52
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\TyphoonUI\index.vue
 * @Description: 这是一个台风动态展示组件
-->
<template>
  <div :class="['w-full h-full', 'bg-gray-300 p-3 rounded-md relative']">
    <div id="echartsMapRef" ref="echartsMapRef" class="relative w-full h-full"></div>
    <SearchInputBar></SearchInputBar>

    <div
      :class="[
        'absolute -translate-y-1/2 top-1/2 rounded-lg right-5',

        'flex flex-col gap-4 justify-center items-center',
        'text-2xl',
      ]"
    >
      <ToolBar></ToolBar>

      <t-button @click="() => eventBus.emit('typhoon-test-events')">test</t-button>
    </div>

    <div :class="['absolute left-2 bottom-2', 'w-1/2']">
      <TyphoonDataListTable></TyphoonDataListTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { eventBus } from "@renderer/libs"

import * as echarts from "echarts"
import "echarts-extension-amap"
import { initJSAmap } from "./_components/amap"

import SearchInputBar from "./_components/SearchInputBar.vue"
import ToolBar from "./_components/ToolBar.vue"
import TyphoonDataListTable from "./_components/DataTable/index.vue"

import { useTyphoonFileStore } from "./store"

import { initEcharts2d } from "@Typhoon/_components/echartsMap/index"

const fileStore = useTyphoonFileStore()
let AMap: any // 高德地图对象
let mapModel: AMap.Map | null = null // 地图实例
let myChart: echarts.ECharts // echarts实例

const echartsMapRef = ref<HTMLElement>()

async function test() {
  console.log(fileStore.fileObj)
  console.log(fileStore.fileMd5Options)
  console.log(fileStore.currtSelectDataList)
  console.log(fileStore.currtTpyhoonNameList)
  console.log(fileStore.currtTpyhoonDataList)
}

onMounted(async () => {
  // await initAMap()

  eventBus.on("typhoon-test-events", test)
})

onUnmounted(() => {
  mapModel?.destroy()

  eventBus.off("typhoon-test-events", test)
})

async function initAMap() {
  AMap = await initJSAmap("ceec0c8cc35492b2a7e83f5be1043de0", "5a0c9bd829d2c5f203330fc94c9f0dfc")

  // @ts-ignore 获取到高德地图实例
  if (!echartsMapRef || !echartsMapRef.value) return console.error("echarts基础元素获取失败")
  myChart = await initEcharts2d(echartsMapRef as Ref<HTMLElement>)
  mapModel = myChart.getModel().getComponent("amap").getAMap()
  console.log({ myChart })
  // 调用高德API
  if (!mapModel) return console.error("获取地图实例失败")
  mapModel.addControl(new AMap.Scale())
  mapModel.addControl(new AMap.ToolBar())
}
</script>
