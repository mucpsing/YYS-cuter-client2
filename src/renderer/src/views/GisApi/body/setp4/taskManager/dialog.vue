<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2025-08-05 15:24:08
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2025-08-15 16:28:10
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\body\taskManager\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <t-dialog
    header="历史任务"
    :visible="taskStore.dialog.visible"
    :onClose="onClose"
    mode="modal"
    :footer="false"
  >
    <template v-show="taskStore.taskList.length == 0">
      <t-empty :title="localStore.emptyTitle" :description="localStore.emptyDescription">
        <t-button @click="onClose">关闭</t-button>
      </t-empty>
    </template>

    <TaskList></TaskList>
    <t-button @click="() => console.log(taskStore.taskList)">test</t-button>
  </t-dialog>
</template>

<script setup lang="ts">
import TaskList from "./taskList.vue"
import { useTaskStore } from "@gisapi/store/index"

const localStore = reactive({
  emptyTitle: "任务列表",
  emptyDescription: "暂无任务",
})

const taskStore = useTaskStore()
async function onClose() {
  taskStore.closeDialog()
}

onMounted(() => {})
</script>
