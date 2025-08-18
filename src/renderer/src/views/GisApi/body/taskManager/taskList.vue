<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2025-08-06 09:19:57
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2025-08-15 17:38:59
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\body\taskManager\taskList.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <template v-for="(taskItem, idx) in taskStore.taskList">
    <!-- <t-card :loadding="taskItem.status === 'running'" :title="`taskId:${taskItem.task_id}`"> -->
    <t-card :loadding="taskItem.status === 'running'">
      <template #title>
        <div>
          <strong>{{ `任务_${idx + 1}` }}</strong>
        </div>
      </template>

      <template #avatar>
        <img :class="['w-[56px] h-[56px]']" v-if="taskItem.preview" :src="taskItem.preview"></img>
        <t-avatar
          v-else
          image="https://tdesign.gtimg.com/site/avatar-boy.jpg"
          size="56px"
        ></t-avatar>
      </template>

      <template #description>
        <div>
          任务进度：<strong>{{ `${taskItem.progress}%` }}</strong>
        </div>
      </template>

      <template #content>
        <div :class="['text-xs']">
          {{ taskItem.task_id }}
        </div>
        <t-progress :percent="taskItem.progress" status="success" :show-text="true"></t-progress>
      </template>

      <template #actions>
        <div style="display: flex; justify-content: space-between">
          <t-button v-if="taskItem.status == 'pending'" variant="text" shape="square">
            <play-circle-stroke-icon />
          </t-button>
          <t-button v-if="taskItem.status == 'running'" variant="text" shape="square">
            <pause-circle-stroke-icon />
          </t-button>
          <t-button variant="text" shape="square" style="color: red">
            <close-octagon-icon />
          </t-button>
        </div>
      </template>
    </t-card>
  </template>
</template>

<script setup lang="ts">
import {
  CloseOctagonIcon,
  PauseCircleStrokeIcon,
  PlayCircleStrokeIcon,
} from "tdesign-icons-vue-next"
import { type TaskItemT } from "@gisapi/Types"
import { useTaskStore } from "@gisapi/store/index"
// const props = withDefaults(defineProps<{ taskId: string; taskInterval: number }>(), {
//   taskInterval: 1000,
// })

// const taskItem = computed(() => taskStore.taskList.find((item) => item.task_id === props.taskId))

const taskStore = useTaskStore()
const loadding = ref(false)
</script>
