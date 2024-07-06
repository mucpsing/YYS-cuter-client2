<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-07-05 16:13:25
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-07-06 11:04:16
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\_components\echartGeoJson.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <div ref="chartContainer" style="width: 600px; height: 400px" class="bg-red-200"></div>
    <t-button @click="test">123</t-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue"
import * as echarts from "echarts"
import geoJson from "./range_clip"

const t = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Area 1" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [0, 0],
            [4, 0],
            [4, 4],
            [0, 4],
            [0, 0],
          ],
        ],
      },
    },
  ],
}

export default defineComponent({
  name: "PolygonChart",
  createDraggingLayer(myChart) {},
  setup() {
    const chartContainer = ref(null)
    let myChart: echarts.ECharts | null = null

    const test = () => {
      console.log(myChart)
    }

    const coords = [444148.69649, 2514477.95128542, 453274.64157178, 2517030.60091383]
    const react = {
      coords: [444148.69649, 2514477.95128542, 453274.64157178, 2517030.60091383],
      left_top: [444148.69649, 2517030.60091383],
      left_bottom: [444148.69649, 2514477.95128542],
      right_top: [453274.64157178, 2517030.60091383],
      right_bottom: [453274.64157178, 2514477.95128542],
    }

    onMounted(() => {
      if (chartContainer.value) {
        myChart = echarts.init(chartContainer.value)

        echarts.registerMap("clip_range", geoJson, null)

        const option = {
          series: [
            {
              type: "map",
              map: "clip_range", // 使用注册的地图名称
            },
          ],

          // graphic: {
          //   type: "circle",
          //   shape: {
          //     // 圆点的半径。
          //     r: 20,
          //   },
          //   position:
          // },
        }

        myChart.setOption(option)

        console.log({ echarts })
      }
    })

    // 在组件卸载时销毁 ECharts 实例
    onUnmounted(() => {
      if (myChart) {
        myChart.dispose()
      }
    })

    return {
      chartContainer,
      test,
    }
  },
})
</script>

<style scoped>
/* 你的样式 */
</style>
