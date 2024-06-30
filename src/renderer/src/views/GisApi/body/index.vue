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
        v-for="(item, idx) in data"
        class="flex flex-col h-full"
        :key="idx"
        :value="idx"
        :label="`${item.label} (${idx + 1}/${data.length})`"
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
import { data } from "../store/data"
import { formDataList, createFormData } from "../store/state"
import { currtFormDataId as currtTab } from "../store/state"

const bodyElementRef = ref<HTMLDivElement>()

const dataChange = ({ id, value }) => {
  data.value.forEach((item) => {
    if (item.id == id) {
      item.label = value
    }
  })
}

/**
 * @description: 创建一个新的Tab，新的工况
 * @param {*} _context 事件实例
 * @param {*} extendId 继承，是否继承上一个tab的数据
 */
const addTab = (_context?: { e: MouseEvent }, extendId: number = -1) => {
  console.log("addTab...", extendId)

  const newTabId = parseInt(data.value.length.toString())
  const newData = createFormData(newTabId)

  if (extendId >= 0) {
    Object.assign(newData, formDataList.value[extendId])

    currtTab.value = currtTab.value + 1
  }

  formDataList.value.push(newData)

  // tab的标题
  data.value.push({
    id: newTabId,
    label: newData.title ? newData.title : `未命名${newTabId}`,
  })

  currtTab.value = newTabId

  console.log(formDataList.value)
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

const changeTab = (newTabs: number | string) => {
  currtTab.value = newTabs as number
  console.log(formDataList.value)
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
