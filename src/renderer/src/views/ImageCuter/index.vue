<!--
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-11-24 11:01:27.780521
 * @Last Modified by: CPS
 * @Last Modified time: 2022-11-24 11:01:27.785969
 * @Filename idnex.vue
 * @Description: 这是整个ImageCuter插件的入口，所以使用defineComponent形式书写，方便区分和维护
-->

<template>
  <section class="ImageReader__container" :style="{ gap: `${config.UI_GAP_WIDTH}px` }">
    <header
      class="flex items-center content-center justify-center ImageReader__header"
      :style="{ 'flex-basis': `${config.UI_HEADER_HEIGHT}px` }"
    >
      <span>{{ localStore.currtMode }}</span>
      <c-icon-font class="mx-2 text-3xl" iconName="picture-outline" color="#31302d"></c-icon-font>
      <h2>{{ localStore.currtFileName }}</h2>
    </header>
    <section class="ImageReader__body">
      <image-cuter-body></image-cuter-body>
    </section>
    <footer
      class="flex flex-col w-full gap-2 ImageReader__footer h-52"
      :style="{ 'flex-basis': `${config.UI_FOOTER_HEIGHT}px` }"
    >
      <image-cuter-footer></image-cuter-footer>
    </footer>
  </section>
</template>

<script lang="ts" setup>
import { eventBus } from "@renderer/libs"
import type { ImageCuterExportJsonOptions } from "@renderer/global"

import localStore from "./store"
import config from "./store/config"
import imageCuterBody from "./body/index.vue"
import imageCuterFooter from "./footer/index.vue"
// import imageCuterHeader from "./header/index.vue";

async function exportFile(opts: ImageCuterExportJsonOptions<any>) {
  window.electron.send("selectFolder", opts)
}

async function exportData(opts?: any) {
  window.electron.send("selectFolder", opts)
}

onMounted(() => {
  nextTick(() => {
    /**
     * ************************ 插件全局事件注册 ************************
     */
    /* 导出当前配置文件 */
    eventBus.on("imageCuterExportFile", exportFile)

    eventBus.on("imc-save-data", exportData)

    /**
     * ************************ 插件功能 ************************
     */
    /* 监听粘贴板的图片 */
    document.addEventListener(
      "paste",
      async (event: ClipboardEvent) => {
        event.preventDefault()

        const items = event.clipboardData && event.clipboardData.items
        let file: File | null
        if (items && items.length) {
          // 检索剪切板items中类型带有image的
          for (let i = 0; i < items.length; i++) {
            if (config.IMG_SUPORT_TYPES.includes(items[i].type)) {
              // 读取为File格式
              file = items[i].getAsFile()

              if (file) {
                // 弹出确认框
                eventBus.emit("showDialog", {
                  title: "检测到来自剪贴板的图片，是否加载图片",
                  message: " - ",
                  acceptCallback: async () => localStore.setCurrtFile(file as File),
                })
              }

              break
            }
          }
        }
      },
      false,
    )
  })
})

onUnmounted(() => {
  eventBus.off("imageCuterExportFile", exportFile)
})
</script>

<style lang="stylus">
.ImageReader__container *
  box-sizing border-box

.ImageReader__container
  height 100%
  width 100%
  box-sizing border-box
  display flex
  flex-direction column
  align-items center
  align-content center
  background-color #e9ebec

  /.ImageReader__header
    width 100%
    // flex-basis 60px
    flex-shrink 0
    flex-grow 0
    text-align center
    background-color #fff

  /.ImageReader__body
    position relative
    border-radius 15px
    flex 1
    width 100%
    display flex
    flex-direction column
    padding 0 10px

  /.ImageReader__footer
    display:flex
    padding 0 10px
    // flex-basis 220px
</style>
