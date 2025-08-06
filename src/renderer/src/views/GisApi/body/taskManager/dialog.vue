<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2025-08-05 15:24:08
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2025-08-05 16:00:25
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\body\taskManager\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <t-dialog
    header="历史任务管理器"
    body="历史任务管理器"
    :visible="taskStore.dialog.visible"
    :on-close="
      () => {
        taskStore.closeDialog()
      }
    "
    confirmOnEnter
    @confirm="onConfirm"
  >
    <t-empty>
      <template #action>
        <t-button @click="close">关闭</t-button>
      </template>
    </t-empty>
  </t-dialog>
</template>

<script setup lang="ts">
import { AddIcon, Task1Icon, HistoryIcon, ChevronDownIcon } from "tdesign-icons-vue-next"
import { useTaskStroe } from "@gisapi/store/index"

const taskStore = useTaskStroe()
const title = ref("空状态 Empty")
const description = ref("暂无任务")
async function onConfirm() {}
async function close() {}
</script>

<style scoped></style>
