<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-07-05 16:13:25
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-08-08 21:18:32
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\_components\echartGeoJson.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
    :class="[show ? '' : 'bg-gray-200']"
-->
<template>
  <div class="relative">
    <!-- echarts绘制元素 -->
    <div
      ref="chartContainerRef"
      :style="{ width: `${props.width}px`, height: `${props.height}px` }"
      :class="['bg-gray-200', 'flex flex-col items-center justify-center']"
      class="relative rounded-lg border-slate-500"
    ></div>

    <!-- 裁剪框 -->
    <div
      ref="rectElementRef"
      v-show="props.geoJson.length > 0 && props.showRect"
      class="absolute top-0 w-20 h-20 border-2 border-red-600"
    ></div>

    <!-- 左下角信息框，展示最终坐标 -->
    <div
      v-show="props.geoJson.length > 0 && props.showRect"
      class="absolute bottom-0 left-0 pointer-events-none"
    >
      <ul>
        <li v-for="(item, idx) of props.rect" :key="idx">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { debounce } from "lodash"
import type { WatchStopHandle } from "vue"
import Props, { type DefaultPropsT } from "./props"

import ChartGenJson from "./echartGeoJson"

const emit = defineEmits(["update:rect"])
const props = withDefaults(defineProps<DefaultPropsT>(), Props)

const chartContainerRef = ref(null)
const rectElementRef = ref<HTMLDivElement | null>(null)
let myChart: ChartGenJson

// 存放watch事件，在组件卸载时销毁
const watchList: WatchStopHandle[] = [
  // 监听河道数据变化，用来重新绘制
  watch([props.geoJson, () => props.maxLinkPoint], () => drawOnce()),
]

const drawOnce = debounce(() => {
  myChart.drawPolygon(props.geoJson[0], { max_len: props.maxLinkPoint })
}, 300)

function updateRectCoordsToData(coords) {
  if (!props.showRect) return
  emit("update:rect", coords)
}
onMounted(() => {
  // console.log("process:", process.env.NODE_ENV)
  if (chartContainerRef.value) {
    myChart = new ChartGenJson(chartContainerRef.value, { renderer: "canvas" })
  }

  if (rectElementRef.value) {
    myChart
      .interactInit(rectElementRef.value)
      .on("onRectMove", (e) => updateRectCoordsToData(e.rectCoords))
      .on("onRectResize", (e) => updateRectCoordsToData(e.rectCoords))
    // .on("onDataZoom", (e) => emit("update:rect", e.rectCoords))
  }

  if (props.geoJson.length > 0) drawOnce()
})

// 在组件卸载时销毁 ECharts 实例
onUnmounted(() => {
  if (myChart) myChart.dispose()

  if (watchList.length > 0) watchList.forEach((w) => w())
})

defineExpose({
  resize: () => {
    if (myChart) myChart.resize()
  },
})
</script>
