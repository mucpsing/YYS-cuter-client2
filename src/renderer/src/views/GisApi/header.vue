<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-08-29 10:39:32
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-06-28 11:12:01
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\header.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <header
    id="alice"
    :class="['flex items-center content-center justify-between bg-white', 'h-[60px] w-full']"
  >
    <div></div>
    <div :class="['flex flex-row items-center']">
      <c-icon-font
        class="mx-2 text-3xl"
        iconName="icon-yys-GISguankong"
        color="#31302d"
      ></c-icon-font>
      <h2>Gis-Api</h2>
      <!-- <t-loading class="mx-2" :loading="loading" :text="loadingMsg" size="small"></t-loading> -->
    </div>
    <div>
      <t-button
        class="mr-2"
        variant="text"
        :icon="stateIcon"
        :theme="btnState.theme"
        :loading="btnState.loading"
        @click="onCheckServerBtnClick"
      >
        {{ btnState.msg }}
      </t-button>
    </div>
  </header>
</template>

<script setup lang="tsx">
import { Link1Icon, LinkUnlinkIcon } from "tdesign-icons-vue-next"
import { isGisServerConnected } from "./store/state"
import { eventBus } from "@renderer/libs"
import { SettingPageValue } from "@renderer/stores"

import { currtOpenSettingsPageNames } from "./store/state"
import { serverCheckApi } from "./api"

onMounted(async () => {
  btnState.loading = true

  // 检查服务器状态
  isGisServerConnected.value = await serverCheckApi()
  setTimeout(() => {
    if (!isGisServerConnected.value) {
      btnState.msg = "未连接"
      btnState.theme = "danger"
    } else {
      btnState.msg = "已连接"
      btnState.theme = "success"
    }
    btnState.loading = false
  })
})

// 按钮的状态
const stateIcon = () => (isGisServerConnected.value ? <Link1Icon /> : <LinkUnlinkIcon />)
const btnState = reactive({
  msg: "未连接",
  loading: false,
  loadingMsg: "正在连接",
  theme: "success" as "success" | "danger",
})

async function onCheckServerBtnClick() {
  if (!isGisServerConnected.value) {
    // 全局事件，调用总线来打开配置页
    eventBus.emit("showSettingsPage", SettingPageValue.GIS_API)

    // 打开配置对应项来快速配置
    // 使用setTimeout是为了防止配置页还没打开就触发
    setTimeout(() => {
      if (!currtOpenSettingsPageNames.value.includes("服务器配置")) {
        currtOpenSettingsPageNames.value.push("服务器配置")
      }
    }, 450)
  }
}
</script>

<style lang="stylus" scoped></style>
