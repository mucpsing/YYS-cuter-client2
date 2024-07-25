<template>
  <section
    :class="['__gis-api__tabs', 'mb-2 p-2', 'rounded-xl', 'w-full h-full']"
    ref="bodyElementRef"
  >
    <t-tabs
      class="h-full"
      :value="currtTab"
      size="medium"
      theme="card"
      default-value="0"
      @add="addTab"
      @change="changeTab"
      @remove="removeTab"
    >
      <t-tab-panel
        v-for="(item, idx) in tabState.tabList"
        class="flex flex-col h-full"
        :key="idx"
        :value="idx"
        :label="`${item.label} (${idx + 1}/${tabState.tabList.length})`"
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
import { serverCheckApi, getTemplateList } from "@gisapi/api"
import { data, templateInfo } from "@gisapi/store/data"

import { useGisApiTabStore } from "@gisapi/store/index"

import { formDataList, createFormData } from "@gisapi/store/state"
import { currtFormDataId as currtTab } from "@gisapi/store/state"
import { isGisServerConnected, GlobalLoading } from "@gisapi/store/state"
import config, { DEFAULT_SERVER_IP_LIST } from "@gisapi/store/config"

import eventBus from "@renderer/libs/eventBus"

const tabState = useGisApiTabStore()

onMounted(() => {
  eventBus.on("gis-api:checkServer", checkoutServerOnReady)

  checkoutServerOnReady()
})

onUnmounted(() => {
  eventBus.off("gis-api:checkServer", checkoutServerOnReady)
})

const checkoutServerOnReady = async () => {
  // 检查所有预设的服务器ip
  GlobalLoading.value = true

  for (let serverIp of DEFAULT_SERVER_IP_LIST) {
    console.log("检查IP: ", serverIp)
    config.SERVER_IP = serverIp
    isGisServerConnected.value = await serverCheckApi(500)

    if (isGisServerConnected.value && templateInfo.value.length == 0) {
      const res = await getTemplateList()

      if (res.length > 0) {
        templateInfo.value = res

        setTimeout(() => (GlobalLoading.value = false), 600)

        break
      }
    }
  }
  setTimeout(() => (GlobalLoading.value = false), 1200)
}

const dataChange = ({ id, value }) => {
  tabState.tabList.forEach((item) => {
    if (item.id == id) {
      item.label = value
    }
  })
}

/**
 * @description: 创建一个新的Tab，新的工况
 * @param {*} _context 事件实例
 * @param {*} extendDataId 继承id，是否继承指定id的tab数据
 */
const addTab = (_context?: { e: MouseEvent }, extendDataId: number = -1) => {
  // console.log("extendDataId...", extendDataId)

  const newTabId = parseInt(data.value.length.toString())
  const newData = createFormData(newTabId)
  console.log("newTabId...", newTabId)

  if (extendDataId >= 0) {
    Object.assign(newData, formDataList.value[extendDataId])

    currtTab.value = currtTab.value + 1
  }

  formDataList.value.push(newData)

  // tab的标题
  tabState.addTab({
    id: newTabId,
    label: newData.title ? newData.title : `未命名${newTabId}`,
  })
  // tabState.tabList.push({
  //   id: newTabId,
  //   label: newData.title ? newData.title : `未命名${newTabId}`,
  // })

  currtTab.value = newTabId
}

const removeTab = ({ index }) => {
  formDataList.value.splice(index, 1)

  data.value.splice(index, 1)

  if (data.value.length == 0) {
    addTab()
    currtTab.value = 0
    return
  }

  if (index == currtTab.value) {
    // 删除第一个tab
    if (index > 0) currtTab.value = currtTab.value - 1
  } else if (index <= currtTab.value) {
    // 删除当前的tab
    currtTab.value = currtTab.value - 1
  } else {
    console.log("dadadadadaaaaaaaaaaaa")
  }
}

const changeTab = (tabId: number | string) => {
  currtTab.value = tabId as number

  // console.log("changeTab: ", currtTab.value)
  // console.log("formDataList: ", formDataList.value)
}

/* 注册全局事件 */
provide("tabControler", {
  addTab,
  dataChange,
  removeTab,
  changeTab,
})
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
