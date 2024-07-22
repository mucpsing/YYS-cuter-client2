<!--
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-06-30 00:31:18
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-07-22 10:41:04
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\_components\guideSetp1.vue
 * @Description: 动态的引导组件
 * @BUG: 使用t-tab组件后，仅有第一页能正确生成引导，其他页面无法正常生成
-->
<template>
  <t-guide
    v-model="guideCurrentId"
    :mode="mode"
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
const mode = ref<"popup" | "dialog">("popup")
const currtSetp: Ref<GuideProps["steps"]> = ref([])

function createElementId(idName: string | number, baseName: string) {
  return `${baseName}_${idName}`
}

const setpObject = {
  setp1: [
    [
      {
        element: "Gis-Api__template_input_mxd_name",
        title: "未指定输出名称",
        body: "输出名称指当前模板最终输出的图片名称",
        placement: "bottom-right",
        highlightPadding: 5,
      },
    ],

    [
      {
        element: "#Gis-Api__template_input_select",
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
function show(
  setpName: keyof typeof setpObject,
  setpDataIndex: number = 0,
  tabId: string | number = -1,
) {
  // BUG 2024-07-19 引导位置异常
  // 1. 只有第一页的引导可以正常显示，其他页面引导元素的定位异常
  // 2. 使用修改mode的方式暂时仅在第一页面进行引导，其他页面进行全局居中的引导弹窗提示
  if (tabId == 0) {
    mode.value = "popup"
  } else {
    mode.value = "dialog"
  }
  // 检查 setpName 是否存在于 setpObject 的键中
  if (!(setpName in setpObject)) {
    console.error(`Invalid key: ${setpName}. It does not exist in setpObject.`)
    return
  }

  // 获取当前键对应的值（可能是一个数组或其他可索引的结构）
  if (!setpObject[setpName]) return
  const targetObj = setpObject[setpName]

  // 检查 setpDataIndex 是否在合理范围内
  if (Array.isArray(targetObj) && setpDataIndex >= targetObj.length) {
    console.error(`Index ${setpDataIndex} is out of bounds for key ${setpName}.`)
    return
  }

  // 如果 targetObj 不是数组或类数组，并且 setpDataIndex 不为 0，也抛出错误
  let targetData = targetObj[setpDataIndex]
  if (!targetData) return
  if (!Array.isArray(targetObj) && setpDataIndex !== 0) {
    console.error(
      `Index ${setpDataIndex} is not applicable for non-array value of key ${setpName}.`,
    )
    return
  }

  console.log({ targetData })
  if (tabId != -1) {
    targetData = targetData.map((item) =>
      Object.assign({}, item, {
        // element: createElementId(tabId, item.element as string),
        element: () => {
          const idName = createElementId(tabId, item.element as string)

          const target = document.getElementById(idName)

          console.log("我们的123: ", { tabId, item, idName })

          console.log(target)
          if (target) return target
        },
      }),
    )
  }

  console.log({ targetData })

  // 如果所有检查都通过，则更新值
  currtSetp.value = targetData ?? currtSetp.value // 使用空值合并操作符作为默认值
  guideCurrentId.value = 0
}

// defineExpose({ show })

const showOnce = (args: any[]) => {
  show(...args)
}

onMounted(() => {
  console.log("guide onMounted")
  eventBus.on("show-guide", showOnce)
})

onUnmounted(() => {
  console.log("guide onUnmounted")
  eventBus.off("show-guide", showOnce)
})
</script>

<style scoped></style>
