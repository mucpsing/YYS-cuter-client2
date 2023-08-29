<template>
  <section :class="['mt-2 p-2', 'rounded-xl']">
    <t-tabs
      class="p2"
      :value="currtTab"
      :size="pannelSize"
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
        <!-- <t-button class="my-2" @click="addTab"> 新建工况 + </t-button> -->
        <header :class="['w-full h-[200px] my-2 bg-gray-400 rounded-md', 'flex flex-row gap-2']">
          <div :class="['h-full flex-1 bg-red-200', 'flex justify-center items-center']">
            <img src="" alt="预览图" />
          </div>

          <div :class="['h-full py-2', 'flex-1', 'flex flex-col justify-center items-start gap-2']">
            <h2 :class="['text-2xl']">模板名称.mxd</h2>
            <p :class="['flex-grow-[999] bg-red-300 py-2']">
              模板说明模板说明模板说明模板说明模板说明模板说明
            </p>
            <div class="w-full">
              <t-button class="w-full">模版选择</t-button>
              <t-button class="w-full mt-1">上传模板</t-button>
            </div>
          </div>

          <div :class="['h-full flex-[2]', 'flex justify-center items-center']">
            <img src="" alt="指示图" />
          </div>
        </header>
      </t-tab-panel>
    </t-tabs>
  </section>
</template>

<script setup lang="ts">
import { type TabValue } from "tdesign-vue-next"
import { templateInfo } from "./data"

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
