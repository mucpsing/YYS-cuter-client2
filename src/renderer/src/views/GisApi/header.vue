<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-08-29 10:39:32
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-06-30 16:23:58
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\header.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <header
    id="alice"
    :class="['flex items-center content-center justify-between bg-white', 'h-[60px] w-full']"
  >
    <div class="mx-2"></div>
    <div :class="['flex flex-row items-center']">
      <c-icon-font
        class="mx-2 text-3xl"
        iconName="icon-yys-GISguankong"
        color="#31302d"
      ></c-icon-font>
      <h2>Gis-Api</h2>
    </div>
    <div id="Gis-Api__header_settings_btn" class="flex flex-row items-center gap-1 mx-2">
      <t-button
        variant="text"
        :icon="stateIcon"
        :theme="btnTheme"
        :loading="serverConnecting"
        @click="onCheckServerBtnClick"
      >
        {{ btnMsg }}
      </t-button>

      <t-button variant="outline" :icon="settingIcon" @click="showSettingsPage"></t-button>
    </div>
  </header>
</template>

<script setup lang="tsx">
import { Link1Icon, LinkUnlinkIcon, SettingIcon } from "tdesign-icons-vue-next"
import { isGisServerConnected } from "./store/state"
import { eventBus } from "@renderer/libs"
import { SettingPageValue as SettingsPageId } from "@renderer/stores"

import { currtOpenSettingsPageNames } from "./store/state"
import { serverCheckApi } from "./api"

// 按钮的状态
const btnTheme = computed(() => (isGisServerConnected.value ? "success" : "danger"))
const btnMsg = computed(() => (isGisServerConnected.value ? "已连接" : "未连接"))
const serverConnecting = ref(false)
const stateIcon = () => (isGisServerConnected.value ? <Link1Icon /> : <LinkUnlinkIcon />)
const settingIcon = () => <SettingIcon />

onMounted(async () => {
  // 检查服务器状态
  isGisServerConnected.value = await serverCheckApi()

  if (isGisServerConnected.value) {
    // 从服务器获取模板列表数据
  }
})

const showSettingsPage = () => eventBus.emit("showSettingsPage", SettingsPageId.GIS_API)

async function onCheckServerBtnClick() {
  console.log(isGisServerConnected.value)

  if (!isGisServerConnected.value) {
    serverConnecting.value = true

    // 全局事件，调用总线来打开配置页
    showSettingsPage()

    // 打开配置对应项来快速配置
    // 使用setTimeout是为了防止配置页还没打开就触发
    setTimeout(() => {
      if (!currtOpenSettingsPageNames.value.includes("服务器配置")) {
        currtOpenSettingsPageNames.value.push("服务器配置")
      }
    }, 450)

    setTimeout(() => (serverConnecting.value = false))
  }
}
</script>

<style lang="stylus" scoped></style>
