<!--
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-07-25 12:44:26
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-07-26 11:30:27
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\body\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <section
    :class="['__gis-api__tabs', 'mb-2 p-2', 'rounded-xl', 'w-full h-full']"
    ref="bodyElementRef"
    @click="handleMiddleClick"
  >
    <t-tabs
      class="h-full"
      :value="tabStore.currtTabId"
      size="medium"
      theme="card"
      default-value="0"
      @add="(_e:any) => tabStore.addTab()"
      @change="(tabId) => tabStore.changeTab(tabId)"
      @remove="({ index }) => tabStore.removeTab(index)"
    >
      <t-tab-panel
        v-for="(item, idx) in tabStore.tabList"
        class="flex flex-col h-full"
        :key="idx"
        :value="idx"
        :label="`${item.label} (${idx + 1}/${tabStore.tabList.length})`"
        :removable="true"
        :destroyOnHide="false"
      >
        <!-- 模板选择 -->
        <BodyContent />
      </t-tab-panel>
    </t-tabs>
  </section>
</template>

<script setup lang="ts">
import BodyContent from "./content.vue"
import { useGisApiTabStore, useGisApiStateStore } from "@gisapi/store/index"

import eventBus from "@renderer/libs/eventBus"

const tabStore = useGisApiTabStore()
const globalStore = useGisApiStateStore()
const bodyElementRef = ref<HTMLElement | null>(null)

onMounted(() => {
  eventBus.on("gis-api:checkServer", globalStore.checkoutServerOnReady)

  if (!globalStore.isGisServerConnected) globalStore.checkoutServerOnReady()

  bodyElementRef.value?.addEventListener("mousedown", handleMiddleClick, false)
})

onUnmounted(() => {
  eventBus.off("gis-api:checkServer", globalStore.checkoutServerOnReady)
  bodyElementRef.value?.removeEventListener("mousedown", handleMiddleClick)
})

/**
 * @description: 中键触发的删除tab事件，但是当前无法识别点击下去的是哪个tab
 * @param {*} event
 * @return {*}
 */
function handleMiddleClick(event) {
  if (event.button !== 1) return

  if (event.target.className.split(" ").includes("t-tabs__nav-item-text-wrapper")) {
    // BUG 无法识别TabId
    console.log({ target: event.target })
    console.log("当前标签内容： ", event.target.innerText)

    const regex = /(\([^)]*?)(\d+)\/(\d+)\)$/
    const match = event.target.innerText.match(regex)
    console.log({ match })
    console.log(match[2])

    if (match && match.length > 2) {
      // tabStore.removeTab(tabStore.currtTabId)
      tabStore.removeTab(parseInt(match[2]))
      // return match[2] // match[2] 是第二个捕获组，即分数的分子
    }
  }
}
</script>

<style lang="stylus">

.__gis-api__tabs .t-tabs__content{
  height 100%
}

.__gis-api__tabs .t-tab-panel{
  height calc(100% - 124px) /* 因为TDesign的tabs默认带64px像素会出现在流之外 */
}

.__gis-api__tabs .t-tabs{
  height 100%
}

.SwiperSetp__h2 {
  @apply text-slate-600 pb-1
}
</style>
