<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2025-08-05 15:24:08
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2025-08-19 09:55:12
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\body\taskManager\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <t-dialog header="批量任务" width="600" :visible="taskStore.dialog.visible" :onClose="onClose" mode="modal" :footer="false">
        <template v-show="taskStore.taskList.length == 0">
            <t-empty title="任务列表" description="暂无任务">
                <t-button @click="onClose">关闭</t-button>
            </t-empty>
        </template>

        <!-- <TaskList></TaskList> -->
        <div>
            <h2>文件选择:</h2>
        </div>
        <div class="flex gap-2">
            <t-select placeholder="请选择工程前文件" v-model="localStore.beFileSel">
                <t-option v-for="item in beforeDfsuListOptions" :key="item.value" :label="item.label" :value="item.value" />
            </t-select>

            <t-select placeholder="请选择工程后文件" v-model="localStore.afFileSel">
                <t-option v-for="item in afterDfsuListOptions" :key="item.value" :label="item.label" :value="item.value" />
            </t-select>
        </div>

        <div class="flex flex-col gap-2 pt-2 flex-grow-0">
            <div class="flex-1">

                <t-input-adornment prepend="图片名称：">
                    <t-input clearable type="text" v-model="localStore.outputName" id="122"
                        :placeholder="DEFAULT_OUTPUT_NAME" />
                </t-input-adornment>

            </div>

            <div class="flex flex-wrap gap-2 mb-4 whitespace-nowrap">
                <template v-for="(item, idx) of outNameTipWordsList" :key="idx">
                    <t-tag @click="() => onTitleWithPopupChange(outNameTipWordsList[idx])" class="cursor-pointer"
                        size="small"
                        :theme='(outputNameTagList[idx].theme as "default" | "primary" | "danger" | "warning" | "success")'
                        :variant='(outputNameTagList[idx].variant as "dark" | "light" | "outline" | "light-outline")'>{{
                            item }}</t-tag>
                </template>
            </div>


        </div>
        <div class="flex-1">
            <t-button @click="addTask" class="w-full">添加任务</t-button>
        </div>
        <t-form>
            <div class="flex gap-2 mt-4">

            </div>
        </t-form>

        <t-table title="任务列表" row-key="index" :data="tableData" :columns="columns">

        </t-table>

        <div class="flex gap-2 pt-2">
            <t-button @click="test" theme="success" class="w-full">批量执行</t-button>
        </div>

    </t-dialog>
</template>

<script setup lang="tsx">
// import TaskList from "./taskList.vue"
// import { storeToRefs } from "pinia"

import { crossCombineThemesAndVariants } from "@gisapi/utils/index"


import type { TableProps } from 'tdesign-vue-next';
import type { MxdToImgFormT, FileTabInfoItemT } from "@gisapi/Types"

import { useTaskStore } from "@gisapi/store/index"
import { useGisApiTabStore } from "@gisapi/store/index"


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
    "10年一遇",
    "20年一遇",
    "50年一遇",
    "100年一遇",
    "200年一遇",
]
const outputNameTagList = crossCombineThemesAndVariants()

const DEFAULT_OUTPUT_NAME = "请输入输出名称"

// const FileField = ["beDfsuMd5List", "afDfsuMd5List"]

const tabStore = useGisApiTabStore()
const taskStore = useTaskStore()

interface TaskItemT {
    outputName: string,
    beFileSel: FileTabInfoItemT,
    afFileSel: FileTabInfoItemT
}

const taskList = ref<TaskItemT[]>([])
const columns = ref<TableProps['columns']>([
    {
        colKey: 'outputName',
        title: '输出名称',
    },
    {
        colKey: 'beFileSel.name',
        title: '工程前',
        ellipsis: true,
        cell: (h, { row }) => {
            console.log({ row })
            return (
                <t-tag shape="round" variant="light-outline" size="small">
                    {row.beFileSel.name}
                </t-tag>
            );
        }
    },
    {
        colKey: 'afFileSel.name',
        title: '工程后',
    },
    {
        colKey: 'edit',
        title: '操作',
    },
]);


const beforeDfsuListOptions = computed(() =>
    tabStore.currtFormData['beDfsuMd5List'].map((each) => ({
        label: each.name,
        value: each,
    })),
)

const afterDfsuListOptions = computed(() =>
    tabStore.currtFormData['afDfsuMd5List'].map((each) => ({
        label: each.name,
        value: each,
    })),
)

const localStore = reactive<TaskItemT>({
    beFileSel: tabStore.currtFormData.beDfsuMd5List[0] ?? ({} as FileTabInfoItemT),
    afFileSel: tabStore.currtFormData.afDfsuMd5List[0] ?? ({} as FileTabInfoItemT),
    outputName: DEFAULT_OUTPUT_NAME as string
})

const tableData = computed(() => taskList.value.map((eachTask, index) => ({
    index,
    outputName: eachTask.outputName,
    beFileSel: eachTask.beFileSel,
    afFileSel: eachTask.afFileSel
})))

async function addTask() {
    const hasName = ["", DEFAULT_OUTPUT_NAME, null, undefined].some((each) => each == localStore.outputName)
    if (hasName) {
        console.log('请输入合适的输出名称')
        return
    }

    taskList.value.push(structuredClone(toRaw(localStore)))
}


async function onClose() {
    taskStore.closeDialog()
}

async function test() {
    console.log('tabStore.currtFormData[card.id]:  ', localStore)
    const data = tabStore.currtFormData
    const beSelDfsuMd5Info = tabStore.currtFormData['beDfsuMd5List'].find((item) => item.md5)
    const afSelDfsuMd5Info = tabStore.currtFormData['afDfsuMd5List'].find((item) => item.md5)

    if (!beSelDfsuMd5Info || !afSelDfsuMd5Info) return console.warn("没有找到文件")



    // 这是最后一步才进行，上层应该定义后每个body的输出title
    const taskBody: MxdToImgFormT = {
        template_id: data.mxdId,
        dfsu_be_md5: beSelDfsuMd5Info.md5,
        dfsu_af_md5: afSelDfsuMd5Info.md5,
        output_name: data.title,
        river_range: data.riverRange,
        // radian_or_angle: data.radian_or_angle == "弧度" ? "radian" : "angle",
        show_range: data.projectPoints,
        crs: "auto",
        time_step: data.timeStep,
        sub_title: data.outputName,
        sub_title_zoom_ratio: data.subTitleZoomRatio,
        contour_setp: data.contour_setp.join(";"),
        contour_min_len: data.contourMinLen,
        interpolation: data.interpolation == "插值" ? true : false,
        direction_arrow_size: data.directionArrowSize,
    }


    console.log('ttaskList:  ', taskList)
}

async function onTitleWithPopupChange(new_popup: string) {

    console.log({ new_popup })

    const outputName = localStore.outputName

    // 只要不是有效名字，就直接用后缀；否则拼接
    const hasValidBase = !!outputName && outputName !== DEFAULT_OUTPUT_NAME
    const newTitle = hasValidBase ? `${outputName}_${new_popup}` : new_popup

    console.log({ new_popup, newTitle })

    localStore.outputName = newTitle
}

onBeforeMount(() => {
})

onMounted(() => {
})
</script>
