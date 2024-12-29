<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-12-24 17:03:36
 * @LastEditors: Capsion 373704015@qq.com
 * @LastEditTime: 2024-12-28 22:10:04
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
import TyphoonDataListTable from "./_components/TyphoonTable.vue"

import { testData } from "./data/testData"
import { useTyphoonFileStore } from "./store"

import { type DataItem, data, baseGeoCoordMap } from "./data/cityData"

const fileStore = useTyphoonFileStore()
let AMap: any // 高德地图对象
let mapModel: AMap.Map | null = null // 地图实例
const echartsMapRef = ref<HTMLElement | null>(null)
const convertData = function (data: DataItem[]) {
  let res: any[] = []
  for (let i = 0; i < data.length; i++) {
    const geoCoord = baseGeoCoordMap[data[i].name]
    if (geoCoord) {
      res.push({
        name: data[i].name,
        value: geoCoord.concat(data[i].value),
      })
    }
  }
  return res
}

async function test() {
  console.log(fileStore.fileObj)
  console.log(fileStore.fileMd5Options)
  console.log(fileStore.currtSelectDataList)
  console.log(fileStore.currtTpyhoonNameList)
  console.log(fileStore.currtTpyhoonDataList)
}

onMounted(async () => {
  fixEchatrstImageDataWarning()

  // await initAMap()

  // await initEcharts2d()

  eventBus.on("typhoon-test-events", test)
})

onUnmounted(() => {
  mapModel?.destroy()

  eventBus.off("typhoon-test-events", test)
})

async function initAMap() {
  AMap = await initJSAmap("ceec0c8cc35492b2a7e83f5be1043de0", "5a0c9bd829d2c5f203330fc94c9f0dfc")
}

// init echarts-2d
async function initEcharts2d() {
  const myChart = echarts.init(echartsMapRef.value, "echarts-2d-map", {
    renderer: "canvas", // 确保使用 Canvas 渲染器
    devicePixelRatio: window.devicePixelRatio, // 解决eacharts
  })

  myChart.setOption({
    // backgroundColor: "transparent",
    title: {
      text: "台风信息展示平台 - 高德地图API",
      subtext: "Data From [www.typhoon.org.cn]",
      sublink: "https://tcdata.typhoon.org.cn/zjljsjj.html",
      left: "left",
      z: 10,
    },
    tooltip: {
      trigger: "item",
    },
    amap: {
      // 高德地图中心经纬度
      center: [116.397428, 39.90923],
      // 高德地图缩放
      zoom: 4.8,
      // 启用resize
      resizeEnable: false,
      // 移动过程中实时渲染 默认为true 如数据量较大 建议置为false
      renderOnMoving: false,
      // 高德的地图样式需要使用id进行设置
      // https://lbs.amap.com/api/javascript-api-v2/guide/map/map-style/
      mapStyle: "amap://styles/fresh",
      // viewMode: '3D',
      // pitch: 60,
      echartsLayerInteractive: true,
      largeMode: false,
      returnMapCameraState: true,
    },
    series: [
      {
        name: "pm2.5",
        type: "scatter",
        coordinateSystem: "amap",
        data: convertData(data),
        symbolSize: function (val) {
          return val[2] / 10
        },
        encode: {
          value: 2,
        },
        label: {
          formatter: "{b}",
          position: "right",
          show: false,
        },
        emphasis: {
          label: {
            show: true,
          },
        },
      },
      {
        name: "Top 5",
        type: "effectScatter",
        coordinateSystem: "amap",
        data: convertData(
          data
            .sort(function (a, b) {
              return b.value - a.value
            })
            .slice(0, 6),
        ),
        symbolSize: function (val) {
          return val[2] / 10
        },
        encode: {
          value: 2,
        },
        showEffectOn: "render",
        rippleEffect: {
          brushType: "stroke",
        },
        label: {
          formatter: "{b}",
          position: "right",
          show: true,
        },
        itemStyle: {
          shadowBlur: 10,
          shadowColor: "#333",
        },
        emphasis: {
          scale: true,
        },
        zlevel: 1,
        z: 2,
      },
    ],
  })

  // @ts-ignore 获取到高德地图实例
  mapModel = myChart.getModel().getComponent("amap").getAMap()

  // 调用高德API
  if (mapModel) {
    mapModel.addControl(new AMap.Scale())
    mapModel.addControl(new AMap.ToolBar())

    // mapModel.setMapStyle(mapStyle);
  }
}

/**
 * @description:  拦截 Canvas 创建，修复频繁读取数据警告
 */
function fixEchatrstImageDataWarning() {
  const originalGetContext = HTMLCanvasElement.prototype.getContext

  HTMLCanvasElement.prototype.getContext = function (type, options) {
    if (type === "2d") {
      options = options || {}
      options.willReadFrequently = true // 设置 willReadFrequently 属性
    }
    return originalGetContext.call(this, type, options)
  }
}
</script>

<style lang="scss" scoped>
// #echartsMapRef {
//   pointer-events: none; /* 禁止地图容器的鼠标事件响应 */
// }

// #echartsMapRef .echarts-gl {
//   pointer-events: auto; /* 允许 ECharts 的图形层响应鼠标事件 */
// }
</style>
