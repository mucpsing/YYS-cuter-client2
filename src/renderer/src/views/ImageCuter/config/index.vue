<!--
 * @Author: CPS-surfacePro7 holy.dandelion@139.com
 * @Date: 2023-01-24 23:15:31
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-09-14 11:02:45
 * @FilePath: \yys-cuter-client\src\components\ImageCuter\config\index.vue
 * @Description: 全局配置页入口
-->

<template>
  <t-form :data="config" :colon="true">
    <t-collapse v-model="currentPanel" borderless :change="onPanelChange">
      <!-- 【通用配置】 -->
      <GeneralPanel />

      <!-- 【显示配置】 -->
      <ScreenlPanel />

      <!-- 【图片配置】 -->
      <ImagePanel />

      <!-- 【服务器配置】 -->
      <ServerlPanel />
    </t-collapse>
  </t-form>
</template>

<script setup lang="ts">
import { eventBus } from "@renderer/libs"
// import type { SettingKeyVal } from "@renderer/global";
import config from "../store/config"
import { openConfigPannelList as currentPanel } from "../store"

import GeneralPanel from "./panelGeneral.vue"
import ServerlPanel from "./panelServer.vue"
import ScreenlPanel from "./panelScreen.vue"
import ImagePanel from "./panelImage.vue"

export interface SettingKeyVal {
  key: string
  val: string | number
}

// const onPanelChange = (page: number | string) => console.log("展开:", page);

type ImageCuterConfigT = typeof config

const onPanelChange = (page: number | string) => page

/**
 *  @Description 根据obj.key更新配置`config`，因为是响应式对象，无法直接使用assign进行更新
 *
 *  @param {SettingKeyVal} obj  {description}
 *
 */
function changeSetting(obj: SettingKeyVal) {
  if (!Object.keys(config).includes(obj.key)) return

  config[obj.key as keyof ImageCuterConfigT] = obj.val as never
}
// provide("changeSetting", changeSetting);

/**
 * 默认配置备份
 */
const defaultConfig: ImageCuterConfigT = JSON.parse(JSON.stringify(config))
const resetConfigData = (configItemKey: string[]) => {
  console.log("resetConfigData", configItemKey)

  // 记录当前打开选项的页号，用来确保不会被折叠
  const currtPage = currentPanel.value[currentPanel.value.length - 1]

  // 重置数据
  configItemKey.forEach((key) => {
    if (Object.keys(config).includes(key)) {
      if (config[key as keyof ImageCuterConfigT] != defaultConfig[key as keyof ImageCuterConfigT]) {
        // BUG 这里的never不知道如何定义
        config[key as keyof ImageCuterConfigT] = defaultConfig[
          key as keyof ImageCuterConfigT
        ] as never
      }
      // console.log('当前要重置的key: ', config[key as keyof ImageCuterConfigT]);
    }
  })

  // 点击重置按钮后，也会触发收起，这里相当于拦截了收起这个动作，确保currentPanel的值前后不变
  nextTick(() => {
    if (currtPage) currentPanel.value.push(currtPage)
  })
}
provide("resetConfigData", resetConfigData)

onMounted(() => {
  eventBus.on("imageCuterChangeSetting", changeSetting)
})

onUnmounted(() => {
  eventBus.off("imageCuterChangeSetting", changeSetting)
})
</script>

<style lang="stylus">
.collapse-style
  @apply border-2 border-solid border-gray-100 rounded-md bg-gray-100 my-2

.collapse-style:hover
  @apply border-2 border-solid border-blue-500
</style>
