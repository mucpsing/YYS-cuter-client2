<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-07-05 16:13:25
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2026-07-06 15:36:36
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\_components\echartGeoJson.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
    :class="[show ? '' : 'bg-gray-200']"
-->
<template>
    <div class="relative">
        <!-- echarts绘制元素 -->
        <div
            ref="chartContainerRef"
            :style="{ width: `${props.width}px`, height: `${props.height}px` }"
            :class="['bg-gray-200', 'flex flex-col items-center justify-center']"
            class="relative rounded-lg border-slate-500"
        ></div>

        <!-- 裁剪框，覆盖在echarts元素上层 -->
        <div
            ref="rectElementRef"
            v-show="props.geoJson.length > 0 && props.showRect && isInside"
            :class="[
                'absolute top-0 w-20 h-20 bg-red-200/50',
                'flex items-end justify-center',
                'text-center text-gray-500 text-xl',
            ]"
        >
            <div :class="['translate-y-[120%]']">拖动蒙版修改裁剪范围</div>
        </div>

        <!-- 左下角信息框，展示最终坐标 -->
        <div v-show="props.geoJson.length > 0 && props.showRect" class="absolute bottom-0 left-0 pointer-events-none">
            <ul>
                <li v-for="(item, idx) of props.rect" :key="idx">{{ item.toFixed(3) }}</li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { debounce } from "lodash"
import type { WatchStopHandle } from "vue"
import Props, { type DefaultPropsT } from "./props"

// import ChartGenJson from "./echartGeoJson"
import ChartGenJson from "@gisapi/_components/echarts/geoJsonPolygon"
import eventBus from "@renderer/libs/eventBus"

import { useTaskStore, useGisApiTabStore } from "@gisapi/store/index"
import { useEhartGeoJsonStore } from "./state"

import { useMouseInElement } from "@vueuse/core"
const tabStore = useGisApiTabStore()
const echartGeoJsonStore = useEhartGeoJsonStore()

const emit = defineEmits(["update:rect"])
const props = withDefaults(defineProps<DefaultPropsT>(), Props)

const chartContainerRef = ref<HTMLDivElement | null>(null)
const rectElementRef = ref<HTMLDivElement | null>(null)
let myChart: ChartGenJson

const { isOutside } = useMouseInElement(chartContainerRef)
const isInside = computed(() => !isOutside.value)

// 存放watch事件，在组件卸载时销毁
const watchList: WatchStopHandle[] = [
    // 监听河道数据变化，用来重新绘制
    watch([props.geoJson, () => props.maxLinkPoint], () => drawOnce()),
]

const drawOnce = debounce(() => {
    const initDrawConfig: any = { max_len: props.maxLinkPoint }
    // 判断如果存在缩放数据
    if (!tabStore.currtFormData.echartOptionId) {
        console.log("drawOnce: ", 1)
        const newOptionId = echartGeoJsonStore.getId()
        tabStore.currtFormData.echartOptionId = newOptionId
        echartGeoJsonStore.setOptionById(newOptionId, {})
        // echartGeoJsonStore.setOptionById(newOptionId, { dataZoomOption: {}, rectOption: [] })
    } else {
        console.log("drawOnce: ", 2)
        const echartState = echartGeoJsonStore.getOptionById(tabStore.currtFormData.echartOptionId)

        if (echartState && echartState.dataZoomOption) {
            // 配置对象
            initDrawConfig.dataZoomOption = echartState.dataZoomOption
        }
    }

    myChart.drawPolygon(props.geoJson[0], initDrawConfig)
}, 300)

function updateRectCoordsToData(coords) {
    if (!props.showRect) return

    tabStore.currtFormData.projectPoints = coords

    emit("update:rect", coords)
}

onMounted(() => {
    // console.log("process:", process.env.NODE_ENV)
    if (chartContainerRef.value) {
        // 从state中获取当前视图的配置id，如果有则通过id获取配置，如视图缩放比例，裁剪框的位置等

        myChart = new ChartGenJson(chartContainerRef.value, { renderer: "canvas" })

        console.log("创建echart")
        // if(myChart) myChart.recordBounds()
    }

    if (rectElementRef.value) {
        myChart
            .interactInit(rectElementRef.value)
            .on("onRectMove", (e) => updateRectCoordsToData(e.rectCoords))
            .on("onRectResize", (e) => updateRectCoordsToData(e.rectCoords))
    }

    // 渲染
    if (props.geoJson.length > 0) drawOnce()

    eventBus.on("gis-api:setp2:create-preview-to-task", (taskId: string) => {
        const base64 = myChart.getBase64Image()
        if (!base64) return

        console.log("生成缩率图到任务", { taskId, base64 })

        useTaskStore().updateTask(taskId, { preview: base64 })
    })

    nextTick(() => {
        // 视图事件，延迟更新，因为首次还需要更新视图
        myChart.chart.on("dataZoom", (params: any) => {
            if (!params) return

            const batch = params.batch || [params]

            console.log({ data: batch.map((item) => ({ ...item })) })

            const dataZoomOptionNew = myChart.chart.getOption().dataZoom
            const dataZoomOptionOld = echartGeoJsonStore.getOptionById(tabStore.currtFormData.echartOptionId)

            if (!dataZoomOptionOld || !dataZoomOptionOld.dataZoomOption) return console.warn(`记录dataZoom失败`)

            if (JSON.stringify(dataZoomOptionNew) === JSON.stringify(dataZoomOptionOld.dataZoomOption)) return

            // 记录视图
            echartGeoJsonStore.updateOptionById(
                tabStore.currtFormData.echartOptionId,
                "dataZoomOption",
                dataZoomOptionNew,
            )
        })
    })
})

// 在组件卸载时销毁 ECharts 实例
onUnmounted(() => {
    if (myChart) myChart.dispose()

    if (watchList.length > 0) watchList.forEach((w) => w())
})

defineExpose({
    resize: () => {
        if (myChart) myChart.resize()
    },

    addProjectRange: (polygon: any) => {
        polygon.features.forEach((feature, idx) => {
            myChart.removePolygon(`projectRange_${idx}`)
            myChart.addPolygon(feature.geometry.coordinates[0], { id: `projectRange_${idx}` })
        })
    },
})
</script>
