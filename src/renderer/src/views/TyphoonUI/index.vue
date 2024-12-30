<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-12-24 17:03:36
 * @LastEditors: Capsion 373704015@qq.com
 * @LastEditTime: 2024-12-30 21:43:25
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
import { EVENT_NAME } from "@Typhoon/events"

import * as echarts from "echarts"
import "echarts-extension-amap"
import { initJSAmap } from "./_components/amap"

import SearchInputBar from "./_components/SearchInputBar.vue"
import ToolBar from "./_components/ToolBar.vue"
import TyphoonDataListTable from "./_components/DataTable/index.vue"

import { useTyphoonFileStore } from "./store"
import { type DataObjItemT, converCoords } from "@Typhoon/utils"

import { initEcharts2d } from "@Typhoon/_components/echartsMap/index"

const fileStore = useTyphoonFileStore()
let AMap: any // 高德地图对象
let mapModel: AMap.Map | null = null // 地图实例
let myChart: echarts.ECharts // echarts实例

const echartsMapRef = ref<HTMLElement>()

function converData(targetData: string[][]) {
  // 先生成坐标信息
  const lines: number[][] = []

  targetData.forEach((eachLine: string[]) => {
    lines.push([converCoords(eachLine[3]), converCoords(eachLine[2])])
  })

  // coords 是lines使用地图坐标时要求的格式，支持多个coords
  return { lines }
}

async function test() {
  console.log(fileStore.fileObj)
  console.log(fileStore.fileMd5Options)
  console.log(fileStore.currtSelectDataList)
  console.log(fileStore.currtTpyhoonNameList)
  console.log(fileStore.currtTpyhoonDataList)
}

async function chartRenderTpyhoonData(target) {
  console.log("render-typhoon-data: ", target)
  const [md5, name, id] = target

  // 查找指定的台风数据
  const targetData = fileStore.fileObj[md5].parserData[id]
  if (targetData["英文名称"] !== name) return

  const data = converData(targetData.RAW)

  // 因为每个台风位置都不一样，使用中间的位置未中心进行视图修正
  const centerIndex = Math.trunc(data.lines.length / 2)
  const centerCoord = [data.lines[centerIndex][0], data.lines[centerIndex][1]]
  const len = data.lines.length

  // 设置中心
  myChart.setOption({ amap: { center: centerCoord } })

  let series: any = []

  // 生成线的坐标点列表
  series.push(
    {
      id: `台风路线_${md5.slice(0, 6)}_${id}`,
      type: "lines",
      coordinateSystem: "amap",
      polyline: true,
      effect: {
        show: true,
        trailLength: 0.7,
        symbol: "arrow",
        trailWidth: 2,
        trailOpacity: 1,
        color: "#fff",
        symbolSize: 5,
      },
      lineStyle: {
        width: 2,
        opacity: 0.8,
      },
      data: [{ coords: data.lines }],
    },
    {
      id: `台风路线点_${md5.slice(0, 6)}_${id}`,
      type: "scatter",
      coordinateSystem: "amap",
      symbolSize: 20,
      encode: { value: 2 },
      label: {
        formatter: "{b}",
        position: "right",
        show: false,
      },
      emphasis: { label: { show: true } },
      data: [
        { value: [data.lines[0][0], data.lines[0][1], 200], name },
        { value: [data.lines[len - 1][0], data.lines[len - 1][1], 200], name },
      ],
    },
  )
  myChart.setOption({ series })
}

onMounted(async () => {
  await initAMap()

  eventBus.on("typhoon-test-events", test)
  eventBus.on(EVENT_NAME.showTyphoon, chartRenderTpyhoonData)
})

onUnmounted(() => {
  mapModel?.destroy()

  eventBus.off("typhoon-test-events", test)
  eventBus.off(EVENT_NAME.showTyphoon, chartRenderTpyhoonData)
})

async function initAMap() {
  AMap = await initJSAmap("ceec0c8cc35492b2a7e83f5be1043de0", "5a0c9bd829d2c5f203330fc94c9f0dfc")

  // @ts-ignore 获取到高德地图实例
  if (!echartsMapRef || !echartsMapRef.value) return console.error("echarts基础元素获取失败")
  myChart = await initEcharts2d(echartsMapRef as Ref<HTMLElement>)
  mapModel = myChart.getModel().getComponent("amap").getAMap()

  // 调用高德API
  if (!mapModel) return console.error("获取地图实例失败")
  mapModel.addControl(new AMap.Scale())
  mapModel.addControl(new AMap.ToolBar())
}
</script>
