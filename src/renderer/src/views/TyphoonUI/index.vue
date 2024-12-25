<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-12-24 17:03:36
 * @LastEditors: Capsion 373704015@qq.com
 * @LastEditTime: 2024-12-26 00:06:50
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\TyphoonUI\index.vue
 * @Description: 这是一个台风动态展示组件
-->
<template>
  <div :class="['w-full h-full', 'bg-orange-300 p-5 rounded-md relative']">
    <div id="echartsMapRef" ref="echartsMapRef" class="relative w-full h-full"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts"
import "echarts-extension-amap"
import { initJSAmap } from "./_components/amap"

import { type DataItem, data, baseGeoCoordMap, baseBmap } from "./data/cityData"

let AMap: any // 高德地图对象
let mapModel: AMap.Map | null = null // 地图实例
const echartsMapRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  fixEchatrstImageDataWarning()

  await initAMap()

  await initEcharts2d()
})

onUnmounted(() => {
  mapModel?.destroy()
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
    amap: {
      // 高德地图中心经纬度
      center: [116.397428, 39.90923],
      // 高德地图缩放
      zoom: 4.8,
      // 启用resize
      resizeEnable: true,
      // 移动过程中实时渲染 默认为true 如数据量较大 建议置为false
      renderOnMoving: false,
      // mapStyle: 'amap://styles/dark',
      // viewMode: '3D',
      // pitch: 60,
    },
  })

  // @ts-ignore 获取到高德地图实例
  mapModel = myChart.getModel().getComponent("amap").getAMap()
  // 调用高德API
  mapModel?.addControl(new AMap.Scale())
  mapModel?.addControl(new AMap.ToolBar())
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

<style lang="scss" scoped></style>
