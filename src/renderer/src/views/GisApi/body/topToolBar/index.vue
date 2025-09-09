<template>
  <!-- 【弹窗】添加工况 -->
  <t-dialog
    header="创建工况配置"
    body="对话框内容"
    :visible="tabStore.showAddTapDialog"
    :on-close="() => tabStore.closeAddTabDialog()"
    confirmOnEnter
    @confirm="onAddTap"
  >
    <ul class="p-1">
      <li class="flex gap-2 py-1">
        <h3><strong>继承工况配置生成：</strong></h3>
        <t-dropdown
          :options="selectTemplateExtendIdOptions"
          @click="(data) => {
                tabStore.currtExtendId = data.value as number
                currtExtendValue = data.content as string
              }"
        >
          <t-button size="small" variant="outline"
            >{{ currtExtendValue }}
            <template #suffix><ChevronDownIcon /> </template>
          </t-button>
        </t-dropdown>
      </li>
    </ul>
  </t-dialog>

  <TaskDialog></TaskDialog>

  <!-- 浮动菜单栏按钮 -->
  <t-sticky-tool
    :style="{ zIndex: 100 }"
    :offset="[-50, 80]"
    placement="right-bottom"
    @click="handleClick"
    @hover="handleHover"
  >
    <!-- <t-sticky-item label="新建工况">
      <template #icon><add-icon /></template>
    </t-sticky-item> -->

    <t-sticky-item label="历史任务">
      <template #icon><HistoryIcon /></template>
    </t-sticky-item>
  </t-sticky-tool>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import TaskDialog from "@gisapi/body/taskManager/dialog.vue"

import { StickyToolProps } from "tdesign-vue-next"
import { AddIcon, Task1Icon, HistoryIcon, ChevronDownIcon } from "tdesign-icons-vue-next"

import { useGisApiTabStore, useGisApiStateStore, useTaskStore } from "@gisapi/store/index"

const taskStore = useTaskStore()
const globalStore = useGisApiStateStore()
const tabStore = useGisApiTabStore()
const { formDataList, currtTabId, currtExtendId } = storeToRefs(tabStore)

const localStore = reactive({
  loading: false,
  showAddTapDialog: false,

  addNewTab: {
    title: "添加工况",
    action: () => {
      localStore.showAddTapDialog = true
    },
  },

  taskManager: {
    title: "历史任务",
    action: () => {
      taskStore.showDialog()
    },
  },
})

const currtExtendValue = ref("不继承")
const selectTemplateExtendIdOptions = computed(() => {
  const res = [{ content: `不继承`, value: -1 }]

  formDataList.value.forEach((item, idx) => {
    res.push({ content: item.title, value: idx })
  })

  return res
})

const handleClick: StickyToolProps["onClick"] = ({ e, item }) => {
  console.log(item)
  switch (item.label) {
    case localStore.addNewTab.title:
      localStore.addNewTab.action()

      break
    case localStore.taskManager.title:
      localStore.taskManager.action()
      break
    default:
      break
  }
}

async function onAddTap() {
  tabStore.addTab(currtExtendId.value)

  localStore.showAddTapDialog = false
}

const handleHover: StickyToolProps["onHover"] = (context) => {
  // console.log("hover", context)
}
</script>

<style scoped></style>
