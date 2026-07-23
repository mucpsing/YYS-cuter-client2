<!-- src/renderer/src/views/Home/index.vue -->
<template>
    <div ref="dropContainerRef" class="flex justify-between w-full min-h-[160px] max-h-[240px] gap-2 relative px-1">
        <FileListCard
            v-for="card in cardList"
            :key="card.id"
            :list-id="card.id"
            :title="card.title"
            :files="tabStore.currtFormData[card.id]"
            :is-uploading="card.loading"
            @select="() => handleSelectFiles(card.id)"
            @remove-checked="() => handleRemoveChecked(card.id)"
        />
    </div>
</template>

<script setup lang="ts">
import { useFileUpload } from "./useFileUpload"
import { useSortableDrag } from "./useSortableDrag"
import FileListCard from "./FileListCard.vue"

import { useGisApiTabStore } from "@gisapi/store/index"
import { UP_FILE_ACCEPT_TYPE } from "@gisapi/store/config"
import eventBus from "@renderer/libs/eventBus"
import type { FileListKeyT } from "@gisapi/Types"

// ============ 定义卡片配置 ============
const cardList = reactive<{ id: FileListKeyT; title: string; loading: boolean }[]>([
    { id: "beDfsuMd5List", title: "工程前1", loading: false },
    { id: "afDfsuMd5List", title: "工程后2", loading: false },
])

// ============ Store ============
const tabStore = useGisApiTabStore()

// ============ 组合式函数 ============
const { addFiles, removeCheckedItems, autoCheckSingle } = useFileUpload()

// ============ 文件选择处理 ============
const selectInput = ref<HTMLInputElement>()

function handleSelectFiles(listId: FileListKeyT) {
    // 动态创建 input 元素，避免全局单例
    const input = document.createElement("input")
    input.type = "file"
    input.accept = UP_FILE_ACCEPT_TYPE.dfsu
    input.multiple = true

    const card = cardList.find((c) => c.id === listId)
    if (card) card.loading = true

    input.onchange = async (e) => {
        const files = (e.target as HTMLInputElement).files

        if (files && files.length > 0) {
            // 将 FileList 转为 File[]
            const fileArray = Array.from(files)
            await addFiles(fileArray, listId)

            // 自动选中唯一文件
            autoCheckSingle()
        }
        if (card) card.loading = false
        input.remove() // 清理 DOM
    }

    // 若已存在值则重置，以支持重复选择同一文件
    if (input.value) input.value = ""
    input.click()
    if (card) card.loading = false
}

function handleRemoveChecked(listId: FileListKeyT) {
    removeCheckedItems(listId)
}

// ============ 拖拽管理 ============
const dropContainerRef = ref<HTMLElement>()

// 提供数据映射给拖拽回调
function getDataMap() {
    return tabStore.currtFormData
}

const { reInit } = useSortableDrag(dropContainerRef, getDataMap)

// 当 cardList 变化时（比如动态增删），重新初始化拖拽
watch(
    () => cardList.map((c) => c.id),
    () => {
        reInit()
    },
    { deep: true },
)

// ============ 暴露方法供外部调用 ============
defineExpose({
    autoCheckSingle, // 外部可通过 ref 调用
})

// ============ 事件总线（若需保留） ============
onMounted(() => {
    eventBus.on("gis-api:fileTransfer-default-checked", autoCheckSingle)
})

onBeforeUnmount(() => {
    eventBus.off("gis-api:fileTransfer-default-checked", autoCheckSingle)
})

// ============ 生命周期 ============
onMounted(() => {
    nextTick(() => {
        // 初次拖拽由 useSortableDrag 自动初始化
    })
})

onUnmounted(() => {
    console.log("un111111111")
})
</script>

<style lang="stylus">
.fix__t-button-content-w-full>.t-button__text {
  width: 100%;
}
</style>
