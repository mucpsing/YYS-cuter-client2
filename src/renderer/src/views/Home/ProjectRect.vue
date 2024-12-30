<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-12-26 08:52:29
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-12-30 14:37:56
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\Home\ProjectRect.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="" style="width: 800px; height: 600px">
    <div ref="testRef" class="w-full h-full"></div>

    <t-input v-model="newKey"></t-input>
    <t-button @click="test">显示对象</t-button>
    <t-button @click="addPoly">添加多边形</t-button>
    <t-button @click="removePoints">removePoints</t-button>

    <t-select :options="options" :onChange="onChange"></t-select>
  </div>
</template>

<script setup lang="ts">
import ChartDragLine from "@gisapi/_components/echarts/dranAndClick"
import * as echarts from "echarts"

const testRef = ref()
let myChart
let dragPolygon: ChartDragLine

const currtKey = ref("")
const newKey = ref("")
const data = reactive({})

const options = computed(() => {
  return Object.keys(data).map((key) => ({ label: key, value: key }))
})

function onChange(value) {
  console.log(value)
  currtKey.value = value
  dragPolygon.switchPoly(value)
  console.log(data[value])
}

function test() {
  console.log(data[currtKey.value])
}

function addPoly() {
  const [newKey, newData] = dragPolygon.addPolygon()
  data[newKey] = newData
}

/**
 * 移除当前选中项的最后一个点。
 * 如果当前选中项存在，则从其数据数组中弹出最后一个元素。
 */
function removePoints() {
  if (data[currtKey.value]) data[currtKey.value].pop()
}

onMounted(() => {
  myChart = echarts.init(testRef.value)

  const option = {
    xAxis: {
      min: -100,
      max: 70,
      type: "value",
      axisLine: { onZero: false },
    },

    yAxis: {
      min: -30,
      max: 60,
      type: "value",
      axisLine: { onZero: false },
    },

    series: [],
  }

  myChart.setOption(option)

  dragPolygon = new ChartDragLine(myChart)
  dragPolygon.getPolyList().forEach((key) => {
    data[key] = dragPolygon.getPolyData(key)
  })
})
</script>
