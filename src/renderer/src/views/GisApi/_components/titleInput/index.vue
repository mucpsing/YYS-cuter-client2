<template>
    <t-space direction="vertical" size="10px">
        <t-input-adornment prepend="图片输出名称：">
            <t-input clearable type="text" v-model="tabStore.currtFormData.outputName" @change="onTitleChange"
                @focus="onTitleInputOnFocus" @blur="onTitleInputOnBlur"
                :id="`Gis-Api__template_input_mxd_name_${tabStore.currtFormData.id}`"
                :placeholder="DEFAULT_TEMPLATE_OUTNAME" />
        </t-input-adornment>

        <div class="flex flex-wrap gap-2 mb-4 whitespace-nowrap">
            <template v-for="(item, idx) of outNameTipWordsList" :key="idx">
                <t-tag @click="() => onTitleWithPopupChange(outNameTipWordsList[idx])" class="cursor-pointer" size="small"
                    :theme='(outputNameTagList[idx].theme as "default" | "primary" | "danger" | "warning" | "success")'
                    :variant='(outputNameTagList[idx].variant as "dark" | "light" | "outline" | "light-outline")'>{{
                        item }}</t-tag>
            </template>
        </div>
    </t-space>
</template>


<script setup lang="tsx">
import type { InputProps } from "tdesign-vue-next"
import { crossCombineThemesAndVariants } from "@gisapi/utils/index"
import { DEFAULT_TEMPLATE_OUTNAME } from "@gisapi/store/formDataState"
import { useGisApiTabStore } from "@gisapi/store/index"

const tabStore = useGisApiTabStore()
const tipWrodsPopupVisible = ref(false) // 是否显示提示列表的状态

// 提示词列表
const outNameTipWordsList = [
    "工程前",
    "工程后",
    "运行期",
    "施工期",
    "枯水",
    "洪水",
    "以洪为主",
    "以潮为主",
    "5年一遇",
    "10年一遇",
    "20年一遇",
    "50年一遇",
    "100年一遇",
    "200年一遇",
]
const outputNameTagList = crossCombineThemesAndVariants()


/**
 * @description: 输入新标题时，同步tab标题显示的函数，有多次触发的BUG，这里使用debounce进行消除
 */
const onTitleChange = (newTitle) => {
    tabStore.formDataList[tabStore.currtTabId].title = newTitle
    tabStore.formDataList[tabStore.currtTabId].outputName = newTitle
    // tabStore.tabList[tabStore.currtTabId].label = newTitle
}

const onTitleInputOnFocus: InputProps["onFocus"] = () => {
    if (tabStore.currtFormData.outputName === DEFAULT_TEMPLATE_OUTNAME) {
        tabStore.currtFormData.outputName = ""
        tabStore.currtFormData.title = ""
    }
}


const onTitleInputOnBlur: InputProps["onBlur"] = (value) => {
    const newTitle = String(value ?? "") || DEFAULT_TEMPLATE_OUTNAME

    // tabStore.formDataList[tabStore.currtTabId].title = newTitle
    tabStore.formDataList[tabStore.currtTabId].outputName = newTitle
    // tabStore.tabList[tabStore.currtTabId].label = newTitle
}

async function onTitleWithPopupChange(new_popup: string) {
    const formData = tabStore.formDataList[tabStore.currtTabId]
    const base = formData.title

    // 只要不是有效名字，就直接用后缀；否则拼接
    const hasValidBase = !!base && base !== DEFAULT_TEMPLATE_OUTNAME
    const newTitle = hasValidBase ? `${base}_${new_popup}` : new_popup

    formData.title = newTitle
    formData.outputName = newTitle
    // tabStore.tabList[tabStore.currtTabId].label = newTitle
    tipWrodsPopupVisible.value = false
}
</script>