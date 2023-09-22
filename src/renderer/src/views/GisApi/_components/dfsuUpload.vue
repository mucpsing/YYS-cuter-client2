<template>
  <t-card class="flex-grow-[1]" :title="props.title">
    <div :class="['flex justify-start']">
      <div class="flex flex-col text-gray-500">
        <h3 class="my-1 text-lg text-black"><strong>文件名：</strong>{{ props.name }}</h3>
        <p>文件路径：{{ props.path }}</p>
        <span>文件大小：{{ props.size.toFixed(2) }} MB</span>
        <span>解析进度：{{ props.progress.toFixed(2) }}<strong>%</strong></span>
        <span>上传名称：{{ props.md5 }}.dfsu</span>
      </div>
    </div>

    <div class="absolute bottom-0 left-0 flex justify-center w-full pb-2">
      <t-button
        class="min-w-[250px]"
        theme="danger"
        :onClick="uploadHandler"
        :loading="!Boolean(progress == 0 || progress == 100)"
        :disabled="!Boolean(progress == 0 || progress == 100)"
      >
        上传dfsu文件
      </t-button>
    </div>
  </t-card>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
    name: string
    path: string
    size: string
    md5: string
    progress: string
  }>(),
  {
    title: "dfsu文件",
  },
)
</script>

<style scoped></style>
