<!--
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-06-30 00:31:18
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-06-30 01:00:15
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\_components\guideSetp1.vue
 * @Description: 动态的引导组件
-->
<template>
  <t-guide v-model="guideCurrentId" :steps="currtSetp" :show-overlay="true" />
</template>

<script setup lang="ts">
import { GuideProps } from "tdesign-vue-next"

const guideCurrentId = ref(-1)
const currtSetp: Ref<GuideProps["steps"]> = ref([
  {
    element: "#Gis-Api__template_input_seletc",
    title: "未指定输出名称",
    body: "输出名称指当前模板最终输出的图片名称",
    placement: "bottom-right",
    highlightPadding: 5,
  },
])

const setp_object = {
  setp1: [
    [
      {
        element: "#Gis-Api__template_input_seletc",
        title: "未指定输出名称",
        body: "输出名称指当前模板最终输出的图片名称",
        placement: "bottom-right",
        highlightPadding: 5,
      },
    ],
  ] as GuideProps["steps"][],

  setp2: [
    [
      {
        element: "#Gis-Api__template_input_seletc",
        title: "未指定输出名称",
        body: "输出名称指当前模板最终输出的图片名称",
        placement: "bottom-right",
        highlightPadding: 5,
      },
    ],
  ] as GuideProps["steps"][],
}
function show(setpKey: keyof typeof setp_object, setpIndex: number = 0) {
  currtSetp.value = setp_object[setpKey][setpIndex]
  guideCurrentId.value = 0
}

defineExpose({ show })
</script>

<style scoped></style>
