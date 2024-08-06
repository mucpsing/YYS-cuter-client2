<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-07-05 16:13:25
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-08-06 17:15:10
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\_components\echartGeoJson.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
    :class="[show ? '' : 'bg-gray-200']"

-->
<template>
  <div class="relative">
    <div
      ref="chartContainerRef"
      :style="{ width: `${width}px`, height: `${height}px` }"
      :class="{ 'bg-gray-200': show }"
      class="rounded-lg border-slate-500"
    ></div>
    <div>{{ rect }}</div>
    <div
      style="
         {
          opacity: opacityRect;
        }
      "
      ref="rectElementRef"
      class="absolute top-0 w-20 h-20 border-2 border-red-600"
    ></div>
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
    const showRect = ref(false)
    const opacityRect = ref(0)

    const watchList: WatchStopHandle[] = []

    let myChart: ChartGenJson
    const rectElementRef = ref<HTMLDivElement | null>(null)

    const drawOnce = debounce(() => {
      console.log("drawOnce")

      myChart.drawPolygon(props.geoJson[0], { max_len: props.maxLinkPoint })
    }, 300)

    // const drawRectOnce = debounce(() => {
    //   if (!myChart) return console.warn("echarts not init")

    //   const size = props.drawRectSize.split("x")
    //   const w = parseInt(size[0]) * props.drawRectScale
    //   const h = parseInt(size[1]) * props.drawRectScale

    //   if (myChart.drawRectCount > 0) {
    //     const currentOption: any = myChart.chart.getOption()
    //     const oldPosition = currentOption.graphic[0].elements[0].position
    //     const x = oldPosition[0]
    //     const y = oldPosition[1]
    //     myChart.drawRect(w, h, x, y)
    //   } else {
    //     myChart.drawRect(w, h)
    //   }
    // }, 300)

    // 监听河道数据变化，用来重新绘制
    watchList.push(watch([props.geoJson, () => props.maxLinkPoint], () => drawOnce()))
    // watchList.push(
    //   // watch(drawPolygonCount, () => {
    //   watch(toRef(myChart.drawPolygonCount), () => {
    //     // if (!isDraw.value) drawRectOnce()
    //     if (myChart.isDraw) drawRectOnce()
    //   }),
    // )
    // watchList.push(
    //   // 外部修改矩形的大小
    //   watch(
    //     () => props.drawRectSize,
    //     () => drawRectOnce(),
    //   ),
    // )

    onMounted(() => {
      if (chartContainerRef.value) {
        myChart = new ChartGenJson(chartContainerRef.value, { renderer: "canvas" })
        // myChart = echarts.init(chartContainerRef.value, null, { renderer: "canvas" })
      }

      if (rectElementRef.value) myChart.interactInit(rectElementRef.value)

      if (props.geoJson.length > 0) drawOnce()
    })

    // 在组件卸载时销毁 ECharts 实例
    onUnmounted(() => {
      if (myChart) myChart.dispose()

      if (watchList.length > 0) watchList.forEach((w) => w())
    })

    return { chartContainerRef, drawOnce, rectElementRef, showRect, opacityRect }
  },
})
</script>
