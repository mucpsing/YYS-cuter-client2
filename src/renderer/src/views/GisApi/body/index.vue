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
import { formDataList, createFormData, currtFormDataId as currtTab } from "../store/state"

const bodyElementRef = ref<HTMLDivElement>()

const dataChange = ({ id, value }) => {
  console.log("dataChange11111111111111111111111111111111111")
  data.value.forEach((item) => {
    if (item.id == id) {
      item.label = value
    }
  })
}

const addTab = (extendId: number = -1) => {
  console.log("addTab...")

  const newTabId = parseInt(data.value.length.toString())
  const newData = createFormData(newTabId)

  if (extendId >= 0) Object.assign(newData, formDataList.value[extendId])
  // if (extendId >= 0) Object.assign(newData, formDataList[extendId])

  formDataList.value.push(newData)
  // formDataList.push(newData)

  data.value.push({
    id: newTabId,
    label: `未命名${newTabId}`,
  })

  currtTab.value = newTabId

  console.log(data.value[currtTab.value])
  console.log(data.value)
}

const removeTab = ({ index }) => {
  console.log(`要删除的id： ${index}`)

  // if (data.value.length == 1) return console.log("剩下一个tab了，不执行关闭")

  formDataList.value.splice(index, 1)
  // formDataList.splice(index, 1)
  data.value.splice(index, 1)

  if (data.value.length == 0) {
    addTab()
    currtTab.value = 0
    return
  }

  if (index == currtTab.value) {
    // 删除第一个tab
    currtTab.value = currtTab.value - 1
  } else if (index <= currtTab.value) {
    // 删除当前的tab
    currtTab.value = currtTab.value - 1
  } else {
    console.log("dadadadadaaaaaaaaaaaa")
  }

  console.log(data.value[currtTab.value])
  console.log(data.value)
}

const changeTab = (newTabs: number) => {
  console.log({ newTabs })
  currtTab.value = newTabs

  console.log(data.value[currtTab.value])
  console.log(data.value)
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
</style>
