<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2025-07-03 08:48:30
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2025-07-04 09:40:18
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\Demo\polygon.vue
 * @Description: 这是gisapi的多边形echarts组件预览调试demo
-->
<template>
  <div class="relative w-full h-full bg-red-300">
    <div
      ref="chartContainerRef"
      :style="{ width: `${localStore.width}px`, height: `${localStore.height}px` }"
      :class="['bg-gray-200', 'flex flex-col items-center justify-center']"
      class="relative rounded-lg border-slate-500"
    ></div>

    <t-button @click="test">test</t-button>
  </div>
</template>

<script setup lang="ts">
import { debounce } from "lodash"
import ChartGenJson from "@gisapi/_components/echarts/geoJsonPolygon"
import testData, { projectRange } from "@gisapi/_components/echarts/testData"

let myChart: ChartGenJson
const chartContainerRef = ref<
  HTMLDivElement & { resize: () => void; addProjectRange: (geojson: any) => void }
>()
const localStore = reactive({
  width: 700,
  height: 500,
  showRect: true,
  maxLinkPoint: 50,
  rect: {},
})

async function test() {
  console.log("/demo/polygon: ")

  if (myChart) {
    myChart.addPolygon(projectRange.features[0].geometry.coordinates[0], { id: "0" })
    myChart.addPolygon(projectRange.features[1].geometry.coordinates[0], { id: "2" })
  }
}

const drawOnce = debounce(() => {
  if (chartContainerRef.value) {
    console.log("drawOnce: ", testData)
    myChart.drawPolygon(testData, { max_len: 500 })
  }
}, 300)

onMounted(() => {
  console.log("step3 on onMounted")

  setTimeout(() => {
    if (chartContainerRef.value) {
      myChart = new ChartGenJson(chartContainerRef.value, { renderer: "canvas" })

      drawOnce()
    }
  }, 500)
})
</script>

<style scoped></style>
