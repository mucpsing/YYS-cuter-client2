<!--
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-06-30 00:31:18
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-07-21 23:38:28
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\_components\guideSetp1.vue
 * @Description: 动态的引导组件
-->
<template>
  <t-guide
    v-model="guideCurrentId"
    :steps="currtSetp"
    :finishButtonProps="{ content: '关闭', theme: 'success' }"
    :hideCounter="false"
    :show-overlay="true"
  />
</template>

<script setup lang="ts">
import { GuideProps } from "tdesign-vue-next"
import eventBus from "@renderer/libs/eventBus"

const guideCurrentId = ref(-1)
const currtSetp: Ref<GuideProps["steps"]> = ref([])

const setp_object = {
  setp1: [
    [
      {
        element: ".Gis-Api__template_input_mxd_name",
        title: "未指定输出名称",
        body: "输出名称指当前模板最终输出的图片名称",
        placement: "bottom-right",
        highlightPadding: 5,
      },
    ],

    [
      {
        element: ".Gis-Api__template_input_select",
        title: "未选择【mxd】模板",
        body: "可以选择公共模板或上传自定义模板，才能继续进行输出",
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

  header: [
    [
      {
        element: "#Gis-Api__header_settings_btn",
        title: "服务器未连接",
        body: "合成服务端口未连接，请手动配置服务器重新连接",
        placement: "bottom-right",
        highlightPadding: 5,
      },
    ],
  ] as GuideProps["steps"][],
}
function show(setpKey: keyof typeof setp_object, setpIndex: number = 0) {
  // 检查 setpKey 是否存在于 setp_object 的键中
  if (!(setpKey in setp_object)) {
    console.error(`Invalid key: ${setpKey}. It does not exist in setp_object.`)
    return
  }

  // 获取当前键对应的值（可能是一个数组或其他可索引的结构）
  const currentValue = setp_object[setpKey]

  // 检查 setpIndex 是否在合理范围内
  if (Array.isArray(currentValue) && setpIndex >= currentValue.length) {
    console.error(`Index ${setpIndex} is out of bounds for key ${setpKey}.`)
    return
  }

  // 如果 currentValue 不是数组或类数组，并且 setpIndex 不为 0，也抛出错误
  if (!Array.isArray(currentValue) && setpIndex !== 0) {
    console.error(`Index ${setpIndex} is not applicable for non-array value of key ${setpKey}.`)
    return
  }

  // 如果所有检查都通过，则更新值
  currtSetp.value = currentValue[setpIndex] ?? currtSetp.value // 使用空值合并操作符作为默认值
  guideCurrentId.value = 0
}

defineExpose({ show })
eventBus.on("show-guide", (args: any[]) => {
  console.log("show-guide: ", args)
  show(...args)
})

onMounted(()=>{
  console.log("guide onMounted")
})
</script>

<style scoped></style>
