<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-07-05 16:13:25
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-07-18 16:21:38
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\_components\echartGeoJson.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div
    ref="chartContainer"
    :style="{ width: `${width}px`, height: `${height}px` }"
    :class="[show ? 'bg-red-200' : 'bg-gray-200']"
  ></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue"
import * as echarts from "echarts"
import { getOddIndexedElements } from "./utils"

import { debounce } from "lodash"

export default defineComponent({
  name: "PolygonChart",

  emits: ["draw"],

  props: {
    show: { type: Boolean, default: false },
    width: { type: Number, default: 600 },
    height: { type: Number, default: 400 },
    geoJson: { type: Array, default: [] },
    // bounds: { type: Array, default: [] },
  },

  created() {
    console.log("created")
  },

  mounted() {
    console.log("mounted")
  },

  computed: {},

  setup(props) {
    console.log("setup")

    const chartContainer = ref(null)
    const centerCoords = ref([0, 0])
    let myChart: echarts.ECharts | null = null

    // const test = () => {
    //   const start = myChart?.convertToPixel({ seriesId: "polygon_base" }, polygon[0])
    //   console.log({ start })
    //   myChart?.setOption({
    //     graphic: [
    //       {
    //         id: "sel_rect",
    //         position: [0, 0],
    //       },
    //     ],
    //   })
    // }

    // const test1 = () => {
    //   const start = myChart?.convertToPixel({ seriesId: "polygon_base" }, polygon[0])
    //   console.log({ start })
    //   myChart?.setOption({
    //     graphic: [
    //       {
    //         id: "sel_rect",
    //         position: [100, 100],
    //       },
    //     ],
    //   })
    // }

    function draw(
      geojson: any,
      config: { title: string; max_len: number; range: number[] } = {
        title: "图片标题",
        max_len: 200,
        range: [],
      },
    ) {
      console.log({ geojson })
      console.log({ config })

      if (!myChart) {
        console.warn("echarts not init")
        return
      }

      // 对折现的折点进行稀释
      let polygon = getOddIndexedElements<number>(geojson.features[0].geometry.coordinates[0])
      while (polygon.length > config.max_len) {
        polygon = getOddIndexedElements(polygon)
      }

      const bounds = {
        maxx: Math.max(...polygon.map((item) => item[0])),
        minx: Math.min(...polygon.map((item) => item[0])),
        maxy: Math.max(...polygon.map((item) => item[1])),
        miny: Math.min(...polygon.map((item) => item[1])),
      }

      centerCoords.value = [
        bounds.minx + (bounds.maxx - bounds.minx) / 2,
        bounds.miny + (bounds.maxy - bounds.miny) / 2,
      ]

      const option = {
        title: {
          text: config.title,
          left: "center",
        },
        xAxis: {
          show: false,
          min: bounds.minx,
          max: bounds.maxx,
          type: "value",
          axisLine: { onZero: false },
        },
        yAxis: {
          show: false,
          min: bounds.miny,
          max: bounds.maxy,
          type: "value",
          axisLine: { onZero: false },
        },
        grid: {
          show: true,
          top: "10%",
          bottom: "10%",
        },
        tooltip: {
          triggerOn: "none",
          formatter: function (params) {
            return "X: " + params.data[0].toFixed(2) + "<br>Y: " + params.data[1].toFixed(2)
          },
        },

        series: [
          {
            id: "polygon_base",
            type: "line",
            data: polygon,
            Symbol: false,
            symbolSize: 0,
          },
        ],

        // graphic: [
        //   {
        //     id: "sel_rect",
        //     type: "rect",
        //     shape: {
        //       x: 0,
        //       y: 0,
        //       width: 200,
        //       height: 100,
        //     },
        //     draggable: true,
        //     style: {
        //       fill: "transparent", // 设置为透明填充
        //       stroke: "#ff0000", // 设置边框颜色为红色
        //       lineWidth: 2, // 设置边框宽度为2
        //     },
        //     z: 10,
        //     position: [100, 100],
        //     onmouseup: (e) => {
        //       if (!myChart) return

        //       const [x, y] = myChart.convertFromPixel({ seriesId: "polygon_base" }, [
        //         e.target.x,
        //         e.target.y,
        //       ])

        //       console.log({ x, y })
        //     },
        //   },
        // ],
      }

      myChart.setOption(option)
    }

    function drawRect() {
      if (!myChart) return console.log("myChart is null")
      const startXY = myChart.convertToPixel({ seriesId: "polygon_base" }, [...centerCoords.value])
      console.log({ startXY })
      myChart.setOption({
        graphic: [
          {
            id: "sel_rect",
            type: "rect",
            shape: {
              x: 0,
              y: 0,
              width: 200,
              height: 100,
            },
            draggable: true,
            style: {
              fill: "transparent", // 设置为透明填充
              stroke: "#ff0000", // 设置边框颜色为红色
              lineWidth: 2, // 设置边框宽度为2
            },
            z: 10,

            position: startXY,

            onmouseup: (e) => {
              if (!myChart) return console.log("myChart is null")

              const [x, y] = myChart.convertFromPixel({ seriesId: "polygon_base" }, [
                e.target.x,
                e.target.y,
              ])
            },
          },
        ],
      })
    }
    const drawOnce = debounce(draw, 300)

    const geoJsonWatcher = watch(props.geoJson, (newVal) => {
      drawOnce(newVal[0])
      // 获取当前绘制的中心区域
      setTimeout(() => {
        drawRect()
      }, 2000)
    })

    onMounted(() => {
      if (chartContainer.value) {
        myChart = echarts.init(chartContainer.value)

        // if (myChart && geoJson) draw()
      }
    })

    // 在组件卸载时销毁 ECharts 实例
    onUnmounted(() => {
      if (myChart) myChart.dispose()

      if (geoJsonWatcher) geoJsonWatcher()
    })

    return { chartContainer, draw }
  },
})
</script>
