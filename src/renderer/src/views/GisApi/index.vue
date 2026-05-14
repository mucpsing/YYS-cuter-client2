<!--
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-06-21 21:40:50
 * @LastEditors: Capsion 373704015@qq.com
 * @LastEditTime: 2026-05-14 23:35:59
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\index.vue
 * @Description: 这个gisapi页面的入口文件，这里用来引入全局组件和核心组件，全局事件的注册
-->
<template>
    <section :class="['text-xs md:text-md xl:text-xl', 'h-full bg-gray-100']">
        <!-- header 头部组件，主要调用settings和触发一些全局前置事件（获取数据，检查服务器等） -->
        <GisApiHeader></GisApiHeader>

        <!-- 内容，目前主要使用tab组件来管理切换 -->
        <GisApiBody></GisApiBody>

        <!-- guid引导全局组件，使用eventBus.emit(guid-xxx)来调用，事件注册在event.ts -->
        <GuideSetp></GuideSetp>

        <!-- 图片预览弹窗 -->
        <t-image-viewer
            v-model:visible="globalStore.showImgPreview"
            draggable
            closeOnOverlay
            :images="[globalStore.showImgPreviewUrl]"
        >
        </t-image-viewer>
    </section>
</template>

<script lang="ts">
import "./index.stylus"

import GisApiHeader from "./header.vue"
import GisApiBody from "./body/index.vue"
import GuideSetp from "@gisapi/_components/guide.vue"
import eventBus from "@renderer/libs/eventBus"

import { useGisApiStateStore, useTaskStore, useGisApiTabStore } from "@gisapi/store/index"

const glboalStore = useGisApiStateStore()
const taskStore = useTaskStore()
const tabStore = useGisApiTabStore()

export default {
    components: { GisApiHeader, GisApiBody, GuideSetp },

    setup() {
        const globalStore = useGisApiStateStore()
        function handlePlusKeyPressed(event: KeyboardEvent) {
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return

            switch (event.key) {
                case "1":
                    if (tabStore.showAddTabDialogFlag) {
                        console.log("数字1")
                    }
                    break

                // 新增左右箭头
                case "ArrowLeft":
                    console.log("ArrowLeft")
                    if (tabStore.showAddTabDialogFlag) {
                        tabStore.setCurrentAddTabPage(tabStore.currentAddTabPage - 1)
                    }
                    break
                case "ArrowRight":
                    console.log("ArrowRight")
                    if (tabStore.showAddTabDialogFlag) {
                        tabStore.setCurrentAddTabPage(tabStore.currentAddTabPage + 1)
                    }
                    break

                case "+":
                    // 在这里添加你希望执行的代码
                    if (tabStore.showAddTabDialogFlag) {
                        tabStore.addTab(-1)
                    } else {
                        tabStore.showAddTabDialog()
                    }
                    break
                case "-":
                    tabStore.closeAddTabDialog()
                    break
            }
        }

        return { globalStore, handlePlusKeyPressed }
    },

    mounted() {
        eventBus.on("gis-api:init", async () => {
            console.log("gis-api init event")
            await glboalStore.init()
            await taskStore.init()
        })

        document.addEventListener("keydown", this.handlePlusKeyPressed)
    },

    unmounted() {
        document.removeEventListener("keydown", this.handlePlusKeyPressed)
    },
}
</script>
