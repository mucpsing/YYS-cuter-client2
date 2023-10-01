<template>
  <t-card class="flex-grow-[1]" :title="props.title" :loading="props.fileInfo.reading">
    <div :class="['flex justify-start']">
      <div class="flex flex-col text-gray-500">
        <h3 class="my-1 text-lg text-black"><strong>文件：</strong>{{ props.fileInfo.name }}</h3>
        <!-- TODO electron 才有的特性这里屏蔽掉，后期需要优化 -->
        <!-- <p>文件路径：{{ props.fileInfo.path }}</p> -->
        <!-- <span>解析进度：{{ props.fileInfo.progress.toFixed(2) }}<strong>%</strong></span> -->
        <span>文件大小：{{ props.fileInfo.size.toFixed(2) }} MB</span>
        <span>上传名称：{{ props.fileInfo.md5 }}.dfsu</span>
      </div>
    </div>
    <div class="flex justify-center w-full pt-3">
      <t-button
        size="medium"
        class="min-w-[250px]"
        :theme="props.fileInfo.md5 ? 'success' : 'danger'"
        :onClick="() => emit('onBtnClick')"
      >
        选择dfsu文件
      </t-button>
    </div>
  </t-card>
</template>

<script setup lang="ts">
const emit = defineEmits(["onBtnClick"])
interface PropsType {
  name: string
  path: string
  size: number
  md5: string
  progress: number
  reading: boolean
  file?: File
}

const props = withDefaults(
  defineProps<{
    fileInfo: PropsType
    title?: string
  }>(),
  {
    fileInfo: {
      name: "",
      path: "",
      size: 0,
      md5: "",
      progress: "",
      reading: false,
      file: {},
    },
    title: "dfsu文件",
  },
)
</script>
