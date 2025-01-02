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
import * as echarts from "echarts"
import "echarts-extension-amap"

import { eventBus } from "@renderer/libs"
import { EVENT_NAME } from "@Typhoon/events"
import { useTyphoonFileStore } from "@Typhoon/store"
import { initJSAmap } from "@Typhoon/_components/amap"
import { initEcharts2d } from "@Typhoon/_components/echartsMap/index"
import { parserEachPointData } from "@Typhoon/utils"
import { converCoords, extendEchartColors } from "@Typhoon/utils"

import ToolBar from "@Typhoon/_components/ToolBar.vue"
import SearchInputBar from "@Typhoon/_components/SearchInputBar.vue"
import TyphoonDataListTable from "@Typhoon/_components/DataTable/index.vue"

const fileStore = useTyphoonFileStore()
let AMap: any // 高德地图对象
let mapModel: AMap.Map | null = null // 地图实例
let myChart: echarts.ECharts // echarts实例

const echartsMapRef = ref<HTMLElement>()
const colorMap: { [md5: string]: string } = {}

async function test() {
  console.log(fileStore.fileObj)
  console.log(fileStore.fileMd5Options)
  console.log(fileStore.currtSelectDataList)
  console.log(fileStore.currtTpyhoonNameList)
  console.log(fileStore.currtTpyhoonDataList)
}

function getColor(md5: string) {
  if (colorMap[md5]) return colorMap[md5]

  let newColor = extendEchartColors.find((color) => {
    if (!Object.values(colorMap).includes(color)) return true

    return false
  })

  if (!newColor) newColor = "#000"

  colorMap[md5] = newColor
  return colorMap[md5]
}

function converData(targetData: string[][], targetId: string) {
  // const [md5, name, id] = targetId.split("_")
  // 先生成坐标信息
  const lines: number[][] = []
  const points: { value: number[]; data: ReturnType<typeof parserEachPointData> }[] = []
  const effectPoint: {
    value: [number, number, any]
    data: ReturnType<typeof parserEachPointData>
  }[] = []

  targetData.forEach((eachLine: string[], idx) => {
    const pointData = parserEachPointData(eachLine)
    const coord = [converCoords(eachLine[3]), converCoords(eachLine[2])]
    const point = { value: [coord[0], coord[1], idx], data: pointData }

    if (idx === 0) {
      effectPoint.push({ value: [coord[0], coord[1], "起点"], data: pointData })
    } else if (idx === targetData.length - 1) {
      effectPoint.push({ value: [coord[0], coord[1], "终点"], data: pointData })
    } else {
      points.push(point)
    }

    lines.push(coord)
  })

  // coords 是lines使用地图坐标时要求的格式，支持多个coords
  return { lines, points, effectPoint }
}

async function chartRenderTpyhoonData(target: [md5: string, name: string, id: number]) {
  console.log("render-typhoon-data: ", target)
  const [md5, name, id] = target
  const targetId = target.join("_")

  // 查找指定的台风数据
  const targetData = fileStore.fileObj[md5].parserData[id]
  if (targetData["英文名称"] !== name) return

  const data = converData(targetData.RAW, targetId)
  console.log(data)

  // 因为每个台风位置都不一样，使用中间的位置未中心进行视图修正
  const centerIndex = Math.trunc(data.lines.length / 2)
  const centerCoord = [data.lines[centerIndex][0], data.lines[centerIndex][1]]

  // 设置中心
  const oldOption = myChart.getOption()
  myChart.setOption({ amap: { center: centerCoord } })

  const color = getColor(targetId)

  let series: any = []

  // 生成线的坐标点列表
  series.push(
    {
      id: `Line-${targetId}`,
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
        color,
        width: 2,
        opacity: 0.8,
      },
      data: [{ coords: data.lines }],
    },
    {
      id: `Points-${targetId}`,
      type: "scatter",
      color,
      coordinateSystem: "amap",
      symbolSize: 8,
      encode: { value: 2 },
      // label: {
      //   formatter: "{b}",
      //   position: "right",
      //   show: false,
      // },
      // emphasis: { label: { show: true } },
      data: data.points,
      tooltip: {
        formatter: (params) =>
          Object.entries(params.data.data)
            .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
            .join("<br/>"),
      },
    },
    {
      id: `StartAndEnd-${targetId}`,
      type: "effectScatter",
      color,
      coordinateSystem: "amap",
      symbolSize: 15,
      encode: { value: 2 },
      label: {
        formatter: "{b}",
        position: "right",
        show: true,
      },
      // emphasis: {
      //   label: {
      //     show: true,
      //     formatter: (params) => {
      //       console.log({ params })
      //       return "aaaa"
      //     },
      //   },
      // },
      data: data.effectPoint,
      tooltip: {
        formatter: (params) => {
          const { data } = params
          console.log({ params })
          // const rawDataInfo = parserEachPointData
          // const targetData = fileStore.getTyphoonInfoByTargetId(data.targetId)

          const res = [`<strong>${data.targetId}</strong> - ${data.value[2]}`]

          return res.join("<br/>")
        },
        padding: 5,
      },
    },
  )
  myChart.setOption({ series })

  console.log(oldOption)
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

  // @ts-ignore 目前只有这个方法能在5.0版本后获取地图实例，这里先忽略错误
  mapModel = myChart.getModel().getComponent("amap").getAMap()

  // 调用高德API
  if (!mapModel) return console.error("获取地图实例失败")
  mapModel.addControl(new AMap.Scale())
  mapModel.addControl(new AMap.ToolBar())
}
</script>
