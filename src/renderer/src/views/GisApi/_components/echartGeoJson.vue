<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-07-05 16:13:25
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-07-08 00:23:17
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\_components\echartGeoJson.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <div ref="chartContainer" style="width: 600px; height: 400px" class="bg-red-200"></div>
    <t-button @click="test">123</t-button>
    <t-button @click="test1">234</t-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue"
import * as echarts from "echarts"
import geoJson from "./range_clip"

import { getOddIndexedElements } from "@gisapi/utils/index"

export default defineComponent({
  name: "PolygonChart",
  createDraggingLayer(myChart) {},
  setup() {
    const chartContainer = ref(null)
    let myChart: echarts.ECharts | null = null

    const test = () => {
      const start = myChart.convertToPixel({ seriesId: "polygon_base" }, polygon[0])
      console.log({ start })
      myChart.setOption({
        graphic: [
          {
            id: "sel_rect",
            position: [0, 0],
          },
        ],
      })
    }

    const test1 = () => {
      const start = myChart.convertToPixel({ seriesId: "polygon_base" }, polygon[0])
      console.log({ start })
      myChart.setOption({
        graphic: [
          {
            id: "sel_rect",
            position: [100, 100],
          },
        ],
      })
    }

    const coords = [444148.69649, 2514477.95128542, 453274.64157178, 2517030.60091383]

    const bounds = {
      coords: [444148.69649, 2514477.95128542, 453274.64157178, 2517030.60091383],
      left_top: [444148.69649, 2517030.60091383],
      left_bottom: [444148.69649, 2514477.95128542],
      right_top: [453274.64157178, 2517030.60091383],
      right_bottom: [453274.64157178, 2514477.95128542],
      minx: 444148.69649,
      miny: 2514477.95128542,
      maxx: 453274.64157178,
      maxy: 2517030.60091383,
    }

    // const Polygon = geoJson.features[0].geometry.coordinates[0]

    const max_len = 200
    let polygon = getOddIndexedElements(geoJson.features[0].geometry.coordinates[0])
    polygon = getOddIndexedElements(polygon)
    const boundsW = (bounds.maxx - bounds.minx) / 2
    const boundsH = (bounds.maxy - bounds.miny) / 2
    const react = {
      w: boundsW / 2,
      h: boundsH / 2,
      x: bounds.minx + boundsW,
      y: bounds.miny + boundsH,
    }

    const reactData = []

    while (polygon.length > max_len) {
      polygon = getOddIndexedElements(polygon)
    }

    onMounted(() => {
      if (chartContainer.value) {
        myChart = echarts.init(chartContainer.value)
        // echarts.registerMap("clip_range", geoJson, null)

        const option = {
          title: {
            text: "项目文件.dfsu",
            left: "center",
          },
          series: [
            // {
            //   type: "map",
            //   map: "clip_range", // 使用注册的地图名称
            // },
            {
              id: "polygon_base",
              type: "line",
              data: polygon,
              Symbol: false,
              symbolSize: 0,
            },
          ],
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
              position: [100, 100],
              // transition: 'shape',
              onclick: (e) => {
                console.log({ e })
                var graphic = myChart.getModel().getComponent("graphic")

                console.log(graphic)

                // 遍历 graphic 元素来找到具有指定 id 的元素
                var rect = graphic.option.elements.find(function (element) {
                  return element.id === "sel_rect"
                })

                if (rect) {
                  // 直接访问 rect 的 shape 属性来获取 x 和 y 坐标
                  console.log("Rect position:", rect.shape.x, rect.shape.y)
                } else {
                  console.log('Rect with id "sel_rect" not found.')
                }
              },
            },
          ],
        }

        myChart.setOption(option)
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
      test1,
    }
  },
})
</script>

<style scoped>
/* 你的样式 */
</style>
