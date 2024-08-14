<template>
  <div class="" style="width: 800px; height: 600px">
    <div ref="testRef" class="w-full h-full"></div>
    <t-button @click="test">ttttt</t-button>
  </div>
</template>

<script setup lang="ts">
import ChartDragLine from "@gisapi/_components/echarts/dranAndClick"
import * as echarts from "echarts"

const testRef = ref()
let myChart

function test() {
  console.log(myChart)
}

onMounted(() => {
  myChart = echarts.init(testRef.value)

  const option = {
    tooltip: {
      triggerOn: "none",
    },

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

  new ChartDragLine(myChart)
})
</script>
