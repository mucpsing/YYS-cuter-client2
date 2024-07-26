<!--
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-07-25 12:44:26
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-07-26 11:15:10
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

  globalStore.checkoutServerOnReady()

  if (bodyElementRef.value) {
    bodyElementRef.value.addEventListener("mousedown", handleMiddleClick, false)
  }
})

onUnmounted(() => {
  eventBus.off("gis-api:checkServer", globalStore.checkoutServerOnReady)
  bodyElementRef.value?.removeEventListener("mousedown", handleMiddleClick)
})

function handleMiddleClick(event) {
  if (event.button !== 1) return

  if (event.target.className.split(" ").includes("t-tabs__nav-item-text-wrapper")) {
    tabStore.removeTab(tabStore.currtTabId)
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
