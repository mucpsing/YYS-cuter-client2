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
        v-for="(item, idx) in panelData"
        class="flex flex-col h-full"
        :key="idx"
        :value="idx"
        :label="`${item.label} (${idx + 1}/${panelData.length})`"
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
import type { TabValue } from "tdesign-vue-next"
import { templateInfo } from "../store/data"
import { useDropZone, useResizeObserver, UseResizeObserverOptions } from "@vueuse/core"

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

const currtSetp = ref(1)

// 必须为0，用来记录总的添加删除的序号
const pannelCountId = ref(0)

let selected_template = "未选择模板"

const dropdownOptions = computed(() => {
  const res = [{ content: `模板选择 (${templateInfo.value.length})`, value: 3, divider: true }]

  templateInfo.value.forEach((item) => {
    res.push({
      content: `${item.template_id}、 ${item.mxd_name}`,
      value: item.template_id,
      divider: false,
      ...item,
    })
  })
  return res
})

const clickHandler = (item) => {
  if (item.template_id) {
    selected_template = `${item.template_id} - ${item.template_name} `
  } else {
    selected_template = "未选择模板"
  }
}

const pannelSize = computed(() => {
  if (panelData.value.length > 4) {
    return "medium"
  } else {
    return "large"
  }
})

interface Data {
  id: number
  template_id: number
  label: string
}

const currtTab = ref<TabValue>(0)
const panelData = ref<Data[]>([
  {
    id: 1,
    template_id: 1,
    label: "未命名工况",
  },
])

const dataChange = ({ id, value }) => {
  panelData.value.forEach((item) => {
    if (item.id == id) {
      item.label = value
    }
  })
}

const addTab = () => {
  panelData.value.push({
    id: panelData.value.length,
    template_id: 0,
    label: "未命名工况",
  })

  pannelCountId.value += 1
}

const removeTab = ({ value, index }) => {
  if (index < 0) return false

  panelData.value.splice(index, 1)

  if (panelData.value.length === 0) {
    addTab()
  } else {
    pannelCountId.value -= 1
  }
}

const changeTab = (newTabs: TabValue) => {
  console.log({ newTabs })
  currtTab.value = newTabs
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
</style>
