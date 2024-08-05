<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-07-05 16:13:25
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-08-06 00:07:36
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\_components\echartGeoJson.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
    :class="[show ? '' : 'bg-gray-200']"

-->
<template>
  <div>
    <div
      ref="chartContainer"
      :style="{ width: `${width}px`, height: `${height}px` }"
      :class="{ 'bg-gray-200': show }"
      class="rounded-lg border-slate-500"
    ></div>
    <div>{{ rect }}</div>
  </div>
</template>

<script lang="ts">
import { debounce } from "lodash"
import * as echarts from "echarts"
import { WatchStopHandle, defineEmits } from "vue"

import { getOddIndexedElements } from "./utils"
interface DrawPolygonConfig {
  title?: string
  max_len?: number
  range?: number[]
}

export default defineComponent({
  name: "PolygonChart",
  props: {
    show: { type: Boolean, default: false },
    width: { type: Number, default: 550 },
    height: { type: Number, default: 400 },
    drawRectSize: { type: String, default: "297x210" },
    drawRectScale: { type: Number, default: 0.5 },
    geoJson: { type: Array, default: [] },
    maxLinkPoint: { type: Number, default: 50 },
    dataZoom: { type: Array, default: [] },
    rect: { type: Array, default: () => [0, 0, 0, 0] },
  },

  emit: ["update:rect"],

  setup(props, { emit }) {
    const chartContainer = ref(null)
    const centerCoords = ref([0, 0])
    const isDraw = ref(false)
    const watchList: WatchStopHandle[] = []
    const drawPolygonCount = ref(0) // 记录绘制河道的次数，同时用来检测确保绘制后进行矩形的绘制
    const drawRectCount = ref(0) // 用来记录绘制矩形的次数
    let myChart: echarts.ECharts | null = null

    const emits = emit

    // const emits = defineEmits<{
    //   (e: "update:rect", newRect: number[]): void
    // }>()

    // const rect = reactive({
    //   x: 0,
    //   y: 0,
    //   w: 0,
    //   h: 0,
    // })

    // const rect = defineModel<number[]>("rect", { default: () => [0, 0, 0, 0] })

    const projectPoints = reactive([])

    function drawPolygon(geojson: any, customConfig: DrawPolygonConfig) {
      if (!geojson) return console.warn("have no geojsonData")

      if (!myChart) return console.warn("echarts not init")

      const defaultConfig = {
        title: "图片标题",
        max_len: 200,
        range: [],
      }

      const config = Object.assign(defaultConfig, customConfig)

      // 对折现的折点进行稀释
      let polygon = getOddIndexedElements<number>(geojson.features[0].geometry.coordinates[0])

      while (polygon.length > config.max_len) polygon = getOddIndexedElements(polygon)

      // xy坐标轴的余量
      const axisOffset = 0.05
      const bounds = {
        maxx: Math.max(...polygon.map((item) => item[0])),
        minx: Math.min(...polygon.map((item) => item[0])),
        maxy: Math.max(...polygon.map((item) => item[1])),
        miny: Math.min(...polygon.map((item) => item[1])),
      }
      const shap = {
        w: bounds.maxx - bounds.minx,
        h: bounds.maxy - bounds.miny,
      }

      // 计算中心点
      centerCoords.value = [
        bounds.minx + (bounds.maxx - bounds.minx) / 2,
        bounds.miny + (bounds.maxy - bounds.miny) / 2,
      ]

      const option = {
        // title: {
        //   text: config.title,
        //   left: "center",
        // },

        xAxis: {
          show: false,
          min: bounds.minx - shap.w * axisOffset,
          max: bounds.maxx + shap.w * axisOffset,
          type: "value",
          axisLine: { onZero: false },
        },
        yAxis: {
          show: false,
          min: bounds.miny - shap.h * axisOffset,
          max: bounds.maxy + shap.h * axisOffset,
          type: "value",
          axisLine: { onZero: false },
        },

        tooltip: {
          triggerOn: "none",
          formatter: function (params) {
            return "X: " + params.data[0].toFixed(2) + "<br>Y: " + params.data[1].toFixed(2)
          },
        },

        grid: {
          show: false, // 所有边距统一设置

          left: "5%",
          right: "5%",
          top: "5%",
          bottom: "5%",
        },

        dataZoom: [
          {
            type: "inside",
            xAxisIndex: 0,
            filterMode: "none",
          },
          {
            type: "inside",
            yAxisIndex: 0,
            filterMode: "none",
          },
        ],

        series: [
          {
            id: "polygon_base",
            type: "line",
            data: polygon,
            Symbol: false,
            symbolSize: 0,
          },
        ],
      }

      myChart.setOption(option)
      myChart.on("finished", () => {
        drawPolygonCount.value++
      })
    }

    // function dataZoom(newDataZoom: any) {
    //   myChart?.setOption({ dataZoom: newDataZoom })
    // }

    function drawRect(w: number = 297 / 2, h: number = 210 / 2, x?: number, y?: number) {
      if (!myChart) return console.log("myChart is null")

      // 中心坐标在上一步绘制折线后已经提前生成
      let position
      if (x && y) {
        position = [x, y]
        console.log("更新坐标: ", { x, y })
      } else {
        const centerXY = myChart.convertToPixel({ seriesId: "polygon_base" }, [
          ...centerCoords.value,
        ])

        position = [centerXY[0] - w / 2, centerXY[1] - h / 2]
        console.log("没有提供坐标，使用中心坐标: ", position)
      }

      // rect.w = w
      // rect.h = h

      emits("update:rect", [props.rect[0] as number, props.rect[1] as number, w, h])

      const graphic = [
        {
          id: "sel_rect",
          z: 10,
          type: "rect",
          draggable: true,
          position,

          shape: {
            x: 0,
            y: 0,
            width: w,
            height: h,
          },
          style: {
            fill: "transparent", // 设置为透明填充
            stroke: "#ff0000", // 设置边框颜色为红色
            lineWidth: 2, // 设置边框宽度为2
          },

          onmouseup: (e) => {
            if (!myChart) return console.log("myChart is null")

            const [x, y] = myChart.convertFromPixel({ seriesId: "polygon_base" }, [
              e.target.x,
              e.target.y,
            ])

            // rect.value = [e.target.x, e.target.y, e.target.shape.width, e.target.shape.height]
            emits("update:rect", [
              e.target.x,
              e.target.y,
              e.target.shape.width,
              e.target.shape.height,
            ])

            // rect.x = e.target.x
            // rect.y = e.target.y
            // rect.w = e.target.shape.width
            // rect.h = e.target.shape.height

            console.log("更新坐标: ", e.target)
            console.log("更新坐标: ", { x, y })

            const currentOption: any = myChart.getOption()
            const oldPosition = currentOption.graphic[0].elements[0].position
            console.log("oldPosition: ", oldPosition)
          },
        },
      ]

      myChart.setOption({ graphic })
      drawRectCount.value++
      isDraw.value = true
    }

    const drawOnce = debounce(() => {
      console.log("drawOnce")
      drawPolygon(props.geoJson[0], { max_len: props.maxLinkPoint })
    }, 300)

    const drawRectOnce = debounce(() => {
      if (!myChart) return
      const size = props.drawRectSize.split("x")
      const w = parseInt(size[0]) * props.drawRectScale
      const h = parseInt(size[1]) * props.drawRectScale

      // 获取当前绘制的矩形中心点坐标
      if (drawRectCount.value > 0) {
        const currentOption: any = myChart.getOption()
        const oldPosition = currentOption.graphic[0].elements[0].position
        console.log("oldPosition: ", oldPosition)
        // const x = rect.value[0]
        // const y = rect.value[1]
        // const x = rect.x
        // const y = rect.y
        const x = rect[0]
        const y = rect[1]
        drawRect(w, h, x, y)
      } else {
        drawRect(w, h)
      }
    }, 300)

    // 监听河道数据变化，用来重新绘制
    watchList.push(watch([props.geoJson, () => props.maxLinkPoint], () => drawOnce()))
    watchList.push(
      watch(drawPolygonCount, () => {
        if (!isDraw.value) drawRectOnce()
      }),
    )
    watchList.push(
      // 外部修改矩形的大小
      watch(
        () => props.drawRectSize,
        () => drawRectOnce(),
      ),
    )

    onMounted(() => {
      if (chartContainer.value) myChart = echarts.init(chartContainer.value)

      if (props.geoJson.length > 0) drawOnce()
    })

    // 在组件卸载时销毁 ECharts 实例
    onUnmounted(() => {
      if (myChart) myChart.dispose()

      if (watchList.length > 0) watchList.forEach((w) => w())
    })

    return { chartContainer, drawOnce, drawRect, isDraw, projectPoints }
  },
})
</script>
