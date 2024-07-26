<!--
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-07-25 12:44:26
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-07-25 21:33:02
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\body\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <section
    :class="['__gis-api__tabs', 'mb-2 p-2', 'rounded-xl', 'w-full h-full']"
    ref="bodyElementRef"
  >
    <t-tabs
      class="h-full"
      :value="tabStore.currtTabId"
      size="medium"
      theme="card"
      default-value="0"
      @add="addTab"
      @change="changeTab"
      @remove="removeTab"
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

onMounted(() => {
  eventBus.on("gis-api:checkServer", globalStore.checkoutServerOnReady)

  globalStore.checkoutServerOnReady()
})

onUnmounted(() => {
  eventBus.off("gis-api:checkServer", globalStore.checkoutServerOnReady)
})

/**
 * @description: 创建一个新的Tab，新的工况
 * @param {*} _context 事件实例
 * @param {*} extendDataId 继承id，是否继承指定id的tab数据
 */
const addTab = (_context?: { e: MouseEvent }, extendDataId: number = -1) => {
  tabStore.addTab(extendDataId)
}

const removeTab = ({ index }) => {
  tabStore.removeTab(index)
}

const changeTab = (tabId: number | string) => {
  // currtTab.value = tabId as number

  tabStore.changeTab(tabId)
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
