<template>
  <section
    :class="['__gis-api__tabs', 'mb-2 p-2', 'rounded-xl', 'w-full h-full']"
    ref="bodyElementRef"
  >
    <t-tabs
      class="h-full p2"
      :value="currtTab"
      size="large"
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
      >
        <!-- 模板选择 -->
        <BodyContent />
      </t-tab-panel>
    </t-tabs>
  </section>
</template>

<script setup lang="ts">
import BodyContent from "./content.vue"
import { useResizeObserver } from "@vueuse/core"

import { data, defaultDataItem, currtIndex as currtTab } from "../store/data"


const bodyElementRef = ref<HTMLDivElement>()

onMounted(() => {
  useResizeObserver(bodyElementRef, (entries) => {
    const target = entries[0]

    if (target) {
      const { width, height } = target.contentRect
      if (width > height) {
        console.log("宽")
      } else {
        console.log("高")
      }
    }
  })
})

// 必须为0，用来记录总的添加删除的序号
const pannelCountId = ref(0)

const dataChange = ({ id, value }) => {
  data.value.forEach((item) => {
    if (item.id == id) {
      item.label = value
    }
  })
}

const addTab = () => {
  console.log("addTab...")

  data.value.push({
    id: data.value.length,
    ...defaultDataItem,
  })

  pannelCountId.value += 1
}

const removeTab = ({ value, index }) => {
  if (index < 0) return false

  data.value.splice(index, 1)

  if (data.value.length === 0) {
    addTab()
  } else {
    pannelCountId.value -= 1
  }
}

const changeTab = (newTabs: number) => {
  console.log({ newTabs })
  currtTab.value = newTabs
}


/* 注册全局事件 */
provide("tagControler", {
  dataChange,
  addTab,
  removeTab,
  changeTab,
})
provide("dataChange", dataChange)
provide("addTab", addTab)
provide("removeTab", removeTab)
provide("changeTab", changeTab)
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
</style>
