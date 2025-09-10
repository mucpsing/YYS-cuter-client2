<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2025-08-06 09:19:57
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2025-08-19 10:36:26
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\body\taskManager\taskList.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <template v-for="(taskItem, idx) in taskStore.taskList">
    <div
      :loadding="taskItem.status === 'running'"
      :class="[
        'p-3 my-3 border-[1px] border-gray-200 border-solid rounded-lg',
        'cursor-pointer hover:bg-blue-200',
      ]"
      @click="onClick(taskItem)"
    >
      <div :class="['flex flex-row gap-4 items-center']">
        <div>
          <img :class="['w-[56px] h-[56px]']" v-if="taskItem.preview" :src="taskItem.preview" />
          <t-avatar
            v-else
            image="https://tdesign.gtimg.com/site/avatar-boy.jpg"
            size="56px"
          ></t-avatar>
        </div>

        <div class="w-full">
          任务进度：<strong>{{ `${taskItem.progress}%` }}</strong>
          <div :class="['text-xs']">任务ID：{{ taskItem.task_id }}</div>
          <t-progress :percent="taskItem.progress" status="success" :show-text="true"></t-progress>
        </div>

        <div :class="['flex justify-between items-center']">
          <t-button v-if="taskItem.status == 'pending'" variant="text" shape="square">
            <t-tooltip content="运行">
              <play-circle-stroke-icon />
            </t-tooltip>
          </t-button>
          <t-button v-if="taskItem.status == 'running'" variant="text" shape="square">
            <t-tooltip content="暂停">
              <pause-circle-stroke-icon />
            </t-tooltip>
          </t-button>
          <t-button variant="text" shape="square" style="color: red">
            <t-tooltip content="取消">
              <close-octagon-icon />
            </t-tooltip>
          </t-button>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { CloseOctagonIcon, PlayCircleStrokeIcon } from "tdesign-icons-vue-next"
import { PauseCircleStrokeIcon } from "tdesign-icons-vue-next"

import { useTaskStore } from "@gisapi/store/index"

import { type TaskItemT } from "@gisapi/Types"

const taskStore = useTaskStore()
async function onClick(taskItem: TaskItemT) {
  taskStore.selectTask(taskItem.task_id)
}
</script>
