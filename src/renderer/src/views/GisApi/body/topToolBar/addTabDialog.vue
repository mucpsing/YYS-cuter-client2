<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2026-05-14 09:15:07
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2026-05-14 09:17:35
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\body\topToolBar\addTabDialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <!-- 【弹窗】添加工况 -->
    <t-dialog
        header="创建工况配置"
        body="对话框内容"
        :visible="tabStore.showAddTapDialog"
        :on-close="() => tabStore.closeAddTabDialog()"
        confirmOnEnter
        @confirm="onAddTap"
    >
        <ul class="p-1">
            <li class="flex gap-2 py-1">
                <h3><strong>继承工况配置生成：</strong></h3>
                <t-dropdown
                    :options="selectTemplateExtendIdOptions"
                    @click="(data) => {
                tabStore.currtExtendId = data.value as number
                currtExtendValue = data.content as string
              }"
                >
                    <t-button size="small" variant="outline"
                        >{{ currtExtendValue }}
                        <template #suffix><ChevronDownIcon /> </template>
                    </t-button>
                </t-dropdown>
            </li>
        </ul>
    </t-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"

import { ChevronDownIcon } from "tdesign-icons-vue-next"

import { useGisApiTabStore } from "@gisapi/store/index"

const tabStore = useGisApiTabStore()
const { formDataList, currtExtendId } = storeToRefs(tabStore)

const currtExtendValue = ref("不继承")
const selectTemplateExtendIdOptions = computed(() => {
    const res = [{ content: `不继承`, value: -1 }]

    formDataList.value.forEach((item, idx) => {
        res.push({ content: item.title, value: idx })
    })

    return res
})

async function onAddTap() {
    tabStore.addTab(currtExtendId.value)

    tabStore.closeAddTabDialog()
}
</script>

<style scoped></style>
