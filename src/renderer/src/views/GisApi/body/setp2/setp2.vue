<template>
    <section :class="['flex flex-col w-full gap-2', 'flex-grow-[2]', 'rounded-xl text-xs xl:text-md']">
        <!-- --------------- 【 工程前后的数据文件上传 】 --------------- -->
        <header
            ref="dropElementRef"
            :class="['flex-grow-[0]', 'flex flex-col gap-1 justify-center', 'min-h-[200px] relative']"
            :id="`Gis-Api__dfsu_input_${tabStore.currtFormData.id}`"
        >
            <FileTransfer />
        </header>

        <!-- 下方配置区域 -->
        <section :class="['flex-grow-[1] overflow-auto __scrollbar-bule']">
            <!-- 添加h-[0] 确保支持上下 -->
            <ConfigPanel />
        </section>
    </section>
</template>

<script setup lang="ts">
// import { useDropZone } from "@vueuse/core"
import FileTransfer from "./fileTransfer.vue"
import ConfigPanel from "./configPanel.vue"

import { useGisApiTabStore } from "@gisapi/store/index"

const tabStore = useGisApiTabStore()
let customFileUpInputElement: HTMLInputElement

onMounted(() => {
    customFileUpInputElement = document.createElement("input")
})

onUnmounted(() => {
    // 挂载再卸载，用来清空这个全局的文件上传
    document.body.appendChild(customFileUpInputElement)
    document.body.removeChild(customFileUpInputElement)
})
</script>

<style lang="stylus"></style>
