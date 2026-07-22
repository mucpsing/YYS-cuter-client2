<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2026-05-15 09:31:09
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2026-07-06 16:21:19
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\body\topToolBar\addTabDialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <!-- 【弹窗】添加工况 -->
    <t-dialog
        :closeBtn="true"
        header="是否继承其他工况参数"
        body="对话框内容"
        :visible="tabStore.showAddTabDialogFlag"
        :on-close="() => tabStore.closeAddTabDialog()"
        :footer="false"
        confirm
        confirmOnEnter
        :onConfirm="() => onAddTap(-1)"
    >
        <t-card>
            <div class="flex flex-col gap-2 py-0 h-[360px] overflow-y-auto __scrollbar-bule px-1">
                <div v-for="(item, index) in paginatedOptions" :key="item.tabId">
                    <t-button size="medium" @click="onAddTap(item.tabId)" variant="outline" class="w-full">
                        【快捷键：{{ getItemIndex(index) }}】 {{ item.title }} {{ item.tabId }}
                    </t-button>
                </div>
            </div>
            <div class="flex justify-center mt-2" v-if="totalOptions > pageSize">
                <t-pagination
                    size="small"
                    :total="totalOptions"
                    :current="tabStore.currentAddTabPage"
                    :page-size="pageSize"
                    :page-size-options="[9]"
                    :showPageSize="false"
                    @current-change="onPageChange"
                />
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
const { formDataList, currentAddTabPage } = storeToRefs(tabStore)

// 分页配置
// const currentAddTabPage = ref(1)
const pageSize = tabStore.currentAddTabPageSize

const selectTemplateExtendIdOptions = computed(() => {
    let res: { title: string; tabId: number }[] = []

    // 这里的item.id不是tabId，需要想办法修正
    formDataList.value.forEach((item, _idx) => {
        res.push({ title: item.title, tabId: item.id })
    })

    console.log("selectTemplateExtendIdOptions", res)
    console.log("formDataList.value", formDataList.value)
    return res
})

// 总数据量
const totalOptions = computed(() => selectTemplateExtendIdOptions.value.length)

// 分页后的数据
const paginatedOptions = computed(() => {
    const start = (currentAddTabPage.value - 1) * pageSize
    const end = start + pageSize
    return selectTemplateExtendIdOptions.value.slice(start, end)
})

// 获取当前项的序号（基于当前页，从1开始）
const getItemIndex = (index: number) => {
    return index + 1 // 每页都从1开始重新编号
}

// 分页变化处理（TDesign 直接返回新页码数字）
const onPageChange = (current: number) => {
    currentAddTabPage.value = current
}

// 监听数据源变化，重置页码到第一页
watch(selectTemplateExtendIdOptions, () => {
    currentAddTabPage.value = 1
})

async function onAddTap(tabId: number) {
    tabStore.addTab(tabId)
    tabStore.closeAddTabDialog()
}
</script>

<style scoped></style>
