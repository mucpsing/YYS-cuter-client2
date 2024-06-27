<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-09-22 14:23:07
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-06-27 09:32:41
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\_components\dfsuInfo.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
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
        class="min-w-[250px] text-sm"
        :theme="props.fileInfo.md5 ? 'success' : 'danger'"
        :onClick="() => emit('onBtnClick')"
      >
        选择dfsu（点击或拖拽）
      </t-button>
    </div>
  </t-card>
</template>

<script setup lang="ts">
const emit = defineEmits(["onBtnClick"])

const props = withDefaults(
  defineProps<{
    fileInfo: {
      name: string
      path: string
      size: number
      md5: string
      progress: number
      reading: boolean
      file?: File
    }
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
