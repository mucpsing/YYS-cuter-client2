<template>
  <t-card :loadding="taskItem.status === `running`" :title="`taskId:${props.taskId}`">
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

<script setup lang="ts">
import {
  CloseOctagonIcon,
  PauseCircleStrokeIcon,
  PlayCircleStrokeIcon,
} from "tdesign-icons-vue-next"
import { useTaskStore } from "@gisapi/store/index"
const taskStore = useTaskStore()

let localIntervalId = ref<NodeJS.Timeout | null>(null)
const props = withDefaults(defineProps<{ taskId: string; taskInterval: number }>(), {
  taskInterval: 1000,
})

const taskItem = computed(() => {
  const taskRes = taskStore.getTask(props.taskId)
  if (!taskRes) {
    return {
      task_id: props.taskId,
      status: "invalid",
      progress: 0,
      request: {},
      created_at: 0,
      updated_at: 0,
      result: null,
      error: null,
    }
  } else {
    return taskRes
  }
})

onMounted(() => {
  localIntervalId = setInterval(() => {
    if (taskItem) useTaskStore().updateTask(props.taskId)
  }, props.taskInterval)
})
</script>
