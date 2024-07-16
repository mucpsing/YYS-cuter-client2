<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-07-16 15:56:49
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-07-16 15:59:08
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\DataCharts\_components\WarterLevelAndSiltDischarge.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div></div>
</template>

<script setup>
import * as echarts from "echarts/core"
import {
  DatasetComponent,
  TitleComponent,
  GraphicComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components"
import { ScatterChart, LineChart } from "echarts/charts"
import { UniversalTransition, LabelLayout } from "echarts/features"
import { CanvasRenderer } from "echarts/renderers"

echarts.use([
  DatasetComponent,
  TitleComponent,
  GraphicComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ScatterChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  LabelLayout,
])

import ecStat from "echarts-stat"
</script>

<style lang="scss" scoped></style>
