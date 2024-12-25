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
