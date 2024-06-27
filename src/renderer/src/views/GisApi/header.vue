<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-08-29 10:39:32
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-06-27 17:38:27
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\header.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <header
    id="alice"
    :class="['flex items-center content-center justify-between bg-white', 'h-[60px] w-full']"
  >
    <div></div>
    <div :class="['flex flex-row']">
      <c-icon-font
        class="mx-2 text-3xl"
        iconName="icon-yys-GISguankong"
        color="#31302d"
      ></c-icon-font>
      <h2>Gis-Api</h2>
      <!-- <t-loading class="mx-2" :loading="loading" :text="loadingMsg" size="small"></t-loading> -->
    </div>
    <div>
      <t-button :icon="stateIcon" :theme="stateBtnTheme" @click="connectServer">
        {{ btnState.msg }}
      </t-button>
    </div>
  </header>
</template>

<script setup lang="tsx">
import { Link1Icon, LinkUnlinkIcon } from "tdesign-icons-vue-next"
import { isGisServerConnected } from "./store/state"

// 按钮的状态
const stateIcon = () => (isGisServerConnected.value ? <Link1Icon /> : <LinkUnlinkIcon />)
const stateBtnTheme = computed(() => (isGisServerConnected.value ? "success" : "danger"))
const btnState = reactive({
  msg: "未连接",
  loading: false,
  loadingMsg: "正在连接",
  theme: "success",
})

async function connectServer() {
  if (isGisServerConnected.value) {
    btnState.msg = "已连接"
  } else {
    btnState.msg = "未连接"
    btnState.loading = true

    // 尝试链接
  }
}
</script>

<style lang="stylus" scoped></style>
