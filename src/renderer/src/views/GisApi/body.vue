<template>
  <section :class="['bg-red-200 mt-2', panelData.length > 4 ? 'w-[90%]' : 'max-w-[60%]']">
    <t-tabs
      :value="currtTab"
      :size="pannelSize"
      addable
      @add="addTab"
      @change="changeTab"
      @remove="removeTab"
    >
      <t-tab-panel
        v-for="(item, idx) in panelData"
        :key="idx"
        :value="idx"
        :label="`${item.label} (${idx + 1}/${panelData.length})`"
        :removable="true"
      >
        <!-- <t-input v-mode="item.label" @change="dataChange" /> -->
        <p style="padding: 25px">{{ item.label }}</p>
      </t-tab-panel>
    </t-tabs>
  </section>
</template>

<script setup lang="ts">
import { type TabValue } from "tdesign-vue-next"

const id = ref(0)

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

const currtTab = ref<TabValue>("1")
const panelData = ref<Data[]>([
  {
    id: 0,
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

  id.value += 1
}

const removeTab = ({ value, index }) => {
  if (index < 0) return false

  panelData.value.splice(index, 1)

  if (panelData.value.length === 0) {
    addTab()
  } else {
    id.value -= 1
  }
}

const changeTab = (newTabs: TabValue) => {
  console.log({ newTabs })
  currtTab.value = newTabs
}
</script>

<style scoped></style>
