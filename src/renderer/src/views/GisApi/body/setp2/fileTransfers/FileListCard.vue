<!-- src/renderer/src/components/FileListCard.vue -->
<template>
  <div
    class="flex flex-col flex-1 p-4 border border-gray-200 rounded-lg"
    :data-list-id="listId"
  >
    <h3 class="flex flex-row items-center justify-between pb-2 mb-2 text-lg font-medium border-b">
      <strong>{{ title }}</strong>
      <div class="flex gap-2">
        <t-button
          theme="success"
          size="small"
          :loading="isUploading"
          @click="$emit('select')"
        >
          选择文件
        </t-button>
        <t-button size="small" theme="danger" @click="$emit('remove-checked')">
          <template #icon>
            <Delete1Icon />
          </template>
        </t-button>
      </div>
    </h3>

    <ul
      :data-list-id="listId"
      class="relative flex-col flex-1 pr-1 overflow-x-hidden overflow-y-auto list-none __scrollbar-bule"
    >
      <!-- 空状态 -->
      <template v-if="files.length === 0">
        <div
          @click="$emit('select')"
          class="absolute w-full h-full text-base text-center text-gray-300 transition-all duration-500 ease-in-out border-2 border-gray-200 border-dashed rounded-md cursor-pointer hover:bg-blue-100"
        >
          <div class="flex flex-col items-center justify-center w-full h-full">
            <p>拖拽或点击上传dfsu文件</p>
            <p>（将文件拖放到此处或者点击下方选择按钮）</p>
          </div>
        </div>
      </template>

      <!-- 文件列表 -->
      <li
        v-for="item in files"
        :key="item.md5"
        class="flex items-center w-full my-1"
        :data-id="item.md5"
      >
        <t-button
          block
          theme="default"
          :variant="item.checked ? 'base' : 'outline'"
          class="relative flex flex-row flex-1 fix__t-button-content-w-full"
          @click="item.checked = !item.checked"
          :disabled="item.disabled"
          :loading="item.uploadProgress !== 100"
        >
          <template #content>
            <div class="flex justify-between flex-1 w-full">
              <input
                v-model="item.checked"
                type="checkbox"
                :disabled="item.disabled"
                @click.stop
              />
              <span>{{ truncateText(item.name, 16) }} ({{ item.size.toFixed(2) }}MB)</span>
              <div class="flex flex-col items-center justify-center">
                <div v-if="item.uploadProgress === 0">文件解析中...</div>
                <div v-else class="min-w-[150px]">
                  <t-progress
                    :color="{ from: '#0052D9', to: '#00A870' }"
                    :percentage="item.uploadProgress"
                    :status="item.uploadProgress === 100 ? 'success' : 'active'"
                    theme="line"
                  />
                </div>
              </div>
            </div>
          </template>
        </t-button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Delete1Icon } from 'tdesign-icons-vue-next'
import { truncateText } from '@gisapi/utils/index'
import type { FileListKeyT } from '@gisapi/Types'

defineProps<{
  listId: FileListKeyT
  title: string
  files: any[] // 实际类型应为 FileItem[]
  isUploading: boolean
}>()

defineEmits<{
  (e: 'select'): void
  (e: 'remove-checked'): void
}>()
</script>

<style scoped>
.fix__t-button-content-w-full > .t-button__text {
  width: 100%;
}
</style>