<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2025-12-31 08:36:52
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2026-05-14 09:20:28
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\body\topToolBar\index.vue
 * @Description: 页面上零散的全局浮动或者置顶工具组件收集器
-->
<template>
    <!-- 添加工况 -->
    <AddTabDialog></AddTabDialog>

    <!-- 任务管理组件 -->
    <TaskDialog></TaskDialog>

    <!-- 浮动菜单栏按钮 -->
    <t-sticky-tool
        :style="{ zIndex: 100 }"
        :offset="[-50, 80]"
        placement="right-bottom"
        @click="handleClick"
        @hover="handleHover"
    >
        <t-sticky-item label="历史任务">
            <template #icon><HistoryIcon /></template>
        </t-sticky-item>
    </t-sticky-tool>
</template>

<script setup lang="ts">
import TaskDialog from "./taskManager/dialog.vue"
import AddTabDialog from "./addTabDialog.vue"

import { StickyToolProps } from "tdesign-vue-next"
import { HistoryIcon } from "tdesign-icons-vue-next"

import { useTaskStore } from "@gisapi/store/index"

const taskStore = useTaskStore()

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

const handleClick: StickyToolProps["onClick"] = ({ item }) => {
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

const handleHover: StickyToolProps["onHover"] = (context) => {
    console.log("hover", context)
}
</script>

<style scoped></style>
