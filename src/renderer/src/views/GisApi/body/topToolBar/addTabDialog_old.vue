<!--
 * @Author: Capsion 373704015@qq.com
 * @Date: 2026-05-14 21:58:21
 * @LastEditors: Capsion 373704015@qq.com
 * @LastEditTime: 2026-05-14 23:28:15
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\body\topToolBar\addTabDialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <!-- 【弹窗】添加工况 -->
    <t-dialog
        :closeBtn="true"
        header="新建工况"
        body="对话框内容"
        :visible="tabStore.showAddTabDialogFlag"
        :on-close="() => tabStore.closeAddTabDialog()"
        :footer="false"
        confirm
        confirmOnEnter
        :onConfirm="() => onAddTap(-1)"
    >
        <div class="mt-2">
            <h2 @click="onAddTap(-1)" theme="success" class="w-full"><strong>继承指定工况配置</strong></h2>
        </div>
        <t-card>
            <div class="flex flex-col-reverse gap-2 py-1 max-h-[300px] overflow-y-auto __scrollbar-bule p-1">
                <div v-for="(item, _index) in selectTemplateExtendIdOptions" :key="item.tabId">
                    <t-button @click="onAddTap(item.tabId)" variant="outline" class="w-full">{{ item.title }}</t-button>
                </div>
            </div>
        </t-card>
        <div class="mt-2">
            <t-button @click="onAddTap(-1)" theme="primary" class="w-full">【全新创建】</t-button>
        </div>
    </t-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"

import { useGisApiTabStore } from "@gisapi/store/index"

const tabStore = useGisApiTabStore()
const { formDataList } = storeToRefs(tabStore)

const selectTemplateExtendIdOptions = computed(() => {
    let res: { title: string; tabId: number }[] = []

    formDataList.value.forEach((item, _idx) => {
        res.push({ title: item.title, tabId: item.id })
    })

    return res
})

async function onAddTap(tabId: number) {
    tabStore.addTab(tabId)

    tabStore.closeAddTabDialog()
}
</script>