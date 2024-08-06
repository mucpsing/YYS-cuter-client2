<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-07-05 16:13:25
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-08-06 22:33:29
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\_components\echartGeoJson.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
    :class="[show ? '' : 'bg-gray-200']"
-->
<template>
  <div class="relative">
    <!-- 确保chartContainerRef与父容器的尺寸一致，否则转换出来的坐标会错误 -->
    <div
      ref="chartContainerRef"
      :style="{ width: `${width}px`, height: `${height}px` }"
      :class="{ 'bg-gray-200': show }"
      class="rounded-lg border-slate-500"
    ></div>
    <div ref="rectElementRef" class="absolute top-0 w-20 h-20 border-2 border-red-600"></div>
  </div>
</template>

<script lang="ts">
import { debounce } from "lodash"
import type { WatchStopHandle } from "vue"

import ChartGenJson from "./echartGeoJson"

export default defineComponent({
  name: "PolygonChart",
  props: {
    show: { type: Boolean, default: false },
    width: { type: Number, default: 550 },
    height: { type: Number, default: 280 },
    drawRectSize: { type: String, default: "297x210" },
    drawRectScale: { type: Number, default: 0.5 },
    geoJson: { type: Array, default: [] },
    maxLinkPoint: { type: Number, default: 50 },
    dataZoom: { type: Array, default: [] },
    rect: { type: Array, default: () => [0, 0, 0, 0] },
  },

  emit: ["update:rect"],

  setup(props, { emit }) {
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
      if (chartContainerRef.value) {
        myChart = new ChartGenJson(chartContainerRef.value, { renderer: "canvas" })
      }

      if (rectElementRef.value) myChart.interactInit(rectElementRef.value)

      if (props.geoJson.length > 0) drawOnce()
    })

    // 在组件卸载时销毁 ECharts 实例
    onUnmounted(() => {
      if (myChart) myChart.dispose()

      if (watchList.length > 0) watchList.forEach((w) => w())
    })

    return { chartContainerRef, rectElementRef, localStore }
  },
})
</script>
