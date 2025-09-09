<template>
  <template v-for="taskItem in taskStore.taskList">
    <t-card :loadding="taskItem.status === 'running'" :title="`taskId:${taskItem.task_id}`">
      <template #avatar>
        <t-avatar image="https://tdesign.gtimg.com/site/avatar-boy.jpg" size="56px"></t-avatar>
      </template>

      <template #description>
        <div>
          任务进度：<strong>{{ `${taskItem.progress}%` }}</strong>
        </div>
      </template>

      <template #content>
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
