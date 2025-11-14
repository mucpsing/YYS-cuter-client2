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
            <div class="h-[0]">
                <t-card>
                    <div class="flex items-center justify-between mt-2">
                        <div class="flex flex-col items-start justify-between">
                            <h2 :class="['SwiperSetp__h2', 'xl:text-xl text-sm']">
                                <strong>DFSU流向单位</strong>
                            </h2>
                            <p>
                                dfsu文件默认导出是使用弧度（rad）为单位，但也可以以角度（deg）为单位，如果没有修改，默认为弧度。
                            </p>
                        </div>
                        <div class="flex gap-1 text-md">
                            <t-dropdown
                                :options="[
                                    { content: `弧度(rad)`, value: `弧度` },
                                    { content: `角度(deg)`, value: `角度` },
                                ]"
                                @click="(item) => (tabStore.currtFormData.radian_or_angle = (item.value as `弧度`| `角度`))"
                            >
                                <t-button
                                    variant="outline"
                                    :theme="tabStore.currtFormData.radian_or_angle == '弧度' ? 'danger' : 'warning'"
                                    size="medium"
                                >
                                    {{ tabStore.currtFormData.radian_or_angle }}
                                </t-button>
                            </t-dropdown>
                        </div>
                    </div>

                    <t-divider class="my-2"></t-divider>
                    <div class="flex items-center justify-between mt-2">
                        <div class="flex flex-col items-start justify-between">
                            <h2 :class="['SwiperSetp__h2', 'xl:text-xl text-sm']"><strong>河道选择</strong></h2>
                            <p>
                                使用哪个工况的河道作用到图片中（一般建议采用工程前）：
                                <t-button
                                    size="small"
                                    variant="outline"
                                    theme="primary"
                                    :onclick="() => (tabStore.currtFormData.riverRange = '工程前')"
                                    >工程前</t-button
                                >
                                、
                                <t-button
                                    size="small"
                                    variant="outline"
                                    theme="danger"
                                    :onclick="() => (tabStore.currtFormData.riverRange = '工程后')"
                                    >工程后</t-button
                                >
                            </p>
                        </div>
                        <div class="flex gap-1 text-md">
                            <t-dropdown
                                :options="[
                                    { content: `工程前`, value: `工程前` },
                                    { content: `工程后`, value: `工程后` },
                                ]"
                                @click="(item) => (tabStore.currtFormData.riverRange = (item.value as `工程前`| `工程后`))"
                            >
                                <t-button
                                    variant="outline"
                                    :theme="tabStore.currtFormData.riverRange == '工程后' ? 'primary' : 'danger'"
                                    size="medium"
                                >
                                    {{ tabStore.currtFormData.riverRange }}
                                </t-button>
                            </t-dropdown>
                        </div>
                    </div>
                    <t-divider class="my-2"></t-divider>

                    <!-- --------------- 【 网格间距 】 --------------- -->
                    <div class="flex items-center justify-between mt-2">
                        <div class="flex flex-col items-start justify-between">
                            <h2 :class="['SwiperSetp__h2', 'xl:text-xl text-sm']"><strong>网格间距</strong></h2>
                            <p>河道数据点的间距（如果工程前后网格相同，则不会采用本参数）</p>
                        </div>
                        <div class="flex gap-1">
                            <t-input-number
                                theme="normal"
                                size="medium"
                                v-model="tabStore.currtFormData.mesh_size"
                                class="w-[100px]"
                                align="center"
                            ></t-input-number>
                        </div>
                    </div>
                    <t-divider class="my-2"></t-divider>
                    <!-- --------------- 【 指定时间序列 】 --------------- -->
                    <div class="flex items-center justify-between mt-2">
                        <div class="flex flex-col items-start justify-between">
                            <h2 :class="['SwiperSetp__h2', 'xl:text-xl text-sm']"><strong>时间序列</strong></h2>
                            <p>设置要输出的时间序列，默认-1，既最后一个</p>
                        </div>
                        <div class="flex gap-1">
                            <t-input-number
                                theme="normal"
                                size="medium"
                                v-model="tabStore.currtFormData.timeStep"
                                class="w-[100px]"
                                align="center"
                            ></t-input-number>
                        </div>
                    </div>

                    <t-divider class="my-2"></t-divider>

                    <!-- --------------- 【 等值线显示范围 】 --------------- -->
                    <div class="flex items-center justify-between mt-2">
                        <div class="flex flex-col items-start justify-between">
                            <h2 :class="['SwiperSetp__h2', 'xl:text-xl text-sm']">
                                <strong>等值线显示范围</strong>
                            </h2>
                            <p>大于这个长度的流速等值线才会绘制（不变，增大，减少3中颜色线段）</p>
                        </div>
                        <div class="flex gap-1">
                            <t-input-number
                                v-model="tabStore.currtFormData.contour_range"
                                theme="normal"
                                size="medium"
                                class="w-[100px]"
                                align="center"
                            ></t-input-number>
                        </div>
                    </div>

                    <t-divider class="my-2"></t-divider>

                    <!-- --------------- 【 图例缩放比例 】 --------------- -->
                    <div class="flex items-center justify-between mt-2">
                        <div class="flex flex-col items-start justify-between">
                            <h2 :class="['SwiperSetp__h2', 'xl:text-xl text-sm']">
                                <strong>图例缩放比例</strong>
                            </h2>
                            <p>图例的视图比例，0.5缩小，1.5放大，默认1.0</p>
                        </div>
                        <div class="flex gap-1">
                            <t-input-number
                                v-model="tabStore.currtFormData.subTitleZoomRatio"
                                theme="normal"
                                size="medium"
                                class="w-[100px]"
                                :decimal-places="1"
                                align="center"
                            ></t-input-number>
                        </div>
                    </div>

                    <t-divider class="my-2"></t-divider>

                    <!-- --------------- 【 等值线显示值 】 --------------- -->
                    <!-- TODO 缓存失效，需要在后台添加动态的等值线重新显示功能-->
                    <!-- TODO 添加不使用缓存的功能 -->
                    <div class="flex items-center justify-between mt-2">
                        <div class="flex flex-col items-start justify-between">
                            <h2 :class="['SwiperSetp__h2', 'xl:text-xl text-sm']">
                                <strong>等值线显示值</strong>
                            </h2>
                            <p>自定义等值线步进，使用英文的分号<strong>';'</strong> 分割每个步进，默认</p>
                            <div class="flex gap-1 mt-2">
                                <t-input
                                    v-model="tabStore.currtFormData.contour_setp"
                                    theme="normal"
                                    size="medium"
                                    class="min-w-[500px] mr-2"
                                    align="left"
                                ></t-input>
                                <t-button
                                    theme="danger"
                                    variant="outline"
                                    @click="
                                        () => {
                                            tabStore.currtFormData.contour_setp = DEFAULT_CONTOUR_STEP
                                        }
                                    "
                                    >默认</t-button
                                >
                            </div>
                        </div>
                    </div>
                </t-card>
            </div>
        </section>
    </section>
</template>

<script setup lang="ts">
// import { useDropZone } from "@vueuse/core"
import FileTransfer from "./fileTransfer.vue"
import { useGisApiTabStore } from "@gisapi/store/index"
import { DEFAULT_CONTOUR_STEP } from "@gisapi/store/formDataState"
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

// 用来支持拖拽文件
// const dropElementRef = ref<HTMLElement>()
// const { isOverDropZone } = useDropZone(dropElementRef, onDrop)
// async function onDrop(files: File[] | null) {
//   if (isOverDropZone && files) {
//     if (files.length == 1) {
//       // 文件读取
//     }
//   }
// }
</script>

<style lang="stylus"></style>
