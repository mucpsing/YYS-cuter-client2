<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-07-05 16:13:25
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-08-08 11:08:25
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\_components\echartGeoJson.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
    :class="[show ? '' : 'bg-gray-200']"
-->
<template>
  <div class="relative">
    <!-- 确保chartContainerRef与父容器的尺寸一致，否则转换出来的坐标会错误 -->
    <div
      ref="chartContainerRef"
      :style="{ width: `${props.width}px`, height: `${props.height}px` }"
      :class="['bg-gray-200', 'flex flex-col items-center justify-center']"
      class="relative rounded-lg border-slate-500"
    ></div>
    <div
      ref="rectElementRef"
      v-show="props.geoJson.length > 0 && props.showRect"
      class="absolute top-0 w-20 h-20 border-2 border-red-600"
    ></div>
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

const watchList: WatchStopHandle[] = []

const localStore = reactive({
  rectShow: false,
  rectOpacity: 0,
})

const drawOnce = debounce(() => {
  myChart.drawPolygon(props.geoJson[0], { max_len: props.maxLinkPoint })
}, 300)

// 监听河道数据变化，用来重新绘制
watchList.push(watch([props.geoJson, () => props.maxLinkPoint], () => drawOnce()))

onMounted(() => {
  // console.log("process:", process.env.NODE_ENV)
  if (chartContainerRef.value) {
    myChart = new ChartGenJson(chartContainerRef.value, { renderer: "canvas" })
  }

  if (rectElementRef.value) {
    myChart
      .interactInit(rectElementRef.value)
      .on("onRectMove", (e) => emit("update:rect", e.rectCoords))
      .on("onRectResize", (e) => emit("update:rect", e.rectCoords))
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
