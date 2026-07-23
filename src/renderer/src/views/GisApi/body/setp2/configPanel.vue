<template>
    <div class="h-[0]">
        <t-card class="mx-1">
            <template v-for="(item, index) in configItems" :key="item.key">
                <div class="flex items-center justify-between mt-2">
                    <div class="flex flex-col items-start justify-between gap-1">
                        <!-- 标题 -->
                        <h2 :class="['SwiperSetp__h2', 'xl:text-xl']">
                            <strong>{{ item.label }}</strong>
                        </h2>
                        <!-- 描述 -->
                        <p>{{ item.description }}</p>

                        <!-- ---------- 下拉选择 ---------- -->
                        <div class="flex gap-1 text-md" v-if="item.type === 'dropdown'">
                            <t-dropdown
                                :options="item.options"
                                @click="(opt) => (tabStore.currtFormData[item.key] = opt.value)"
                            >
                                <t-button
                                    variant="outline"
                                    :theme="getDropdownTheme(tabStore.currtFormData[item.key], item)"
                                    size="medium"
                                >
                                    {{ tabStore.currtFormData[item.key] }}
                                </t-button>
                            </t-dropdown>
                        </div>

                        <!-- ---------- 数字输入 ---------- -->
                        <div class="flex gap-1" v-else-if="item.type === 'number'">
                            <t-input-number v-model="tabStore.currtFormData[item.key]" v-bind="item.props" />
                        </div>

                        <!-- ---------- 等值线显示值（自定义） ---------- -->
                        <div v-else-if="item.type === 'contour'">
                            <div class="flex gap-1 mt-2">
                                <!-- 常用间隔弹出 -->
                                <t-popup placement="top-right">
                                    <t-button>常用间隔</t-button>
                                    <template #content>
                                        <div class="max-w-2xl p-6 mx-auto">
                                            <h2 class="mb-4 font-semibold">常用等值线范围 (点击)</h2>
                                            <div class="grid grid-cols-9 gap-2">
                                                <!-- 第一组 0.1 ~ 0.9 -->
                                                <template
                                                    v-for="(val, idx) of Array.from(
                                                        { length: 9 },
                                                        (_, i) => (i + 1) / 10 + '',
                                                    )"
                                                    :key="`row1-${idx}`"
                                                >
                                                    <t-tag
                                                        @click="() => onContourTipClick(val)"
                                                        class="justify-center cursor-pointer"
                                                        size="medium"
                                                        :theme="(outputNameTagList[idx]?.theme as 'default' | 'primary' | 'danger' | 'warning' | 'success') || 'default'"
                                                        :variant="(outputNameTagList[idx]?.variant as 'dark' | 'light' | 'outline' | 'light-outline') || 'outline'"
                                                    >
                                                        {{ val }}
                                                    </t-tag>
                                                </template>
                                                <!-- 第二组 0.01 ~ 0.09 -->
                                                <template
                                                    v-for="(val, idx) of Array.from(
                                                        { length: 9 },
                                                        (_, i) => (i + 1) / 100 + '',
                                                    )"
                                                    :key="`row2-${idx}`"
                                                >
                                                    <t-tag
                                                        @click="() => onContourTipClick(val)"
                                                        class="justify-center cursor-pointer"
                                                        size="medium"
                                                        :theme="(outputNameTagList[idx]?.theme as 'default' | 'primary' | 'danger' | 'warning' | 'success') || 'default'"
                                                        :variant="(outputNameTagList[idx]?.variant as 'dark' | 'light' | 'outline' | 'light-outline') || 'outline'"
                                                    >
                                                        {{ val }}
                                                    </t-tag>
                                                </template>
                                            </div>
                                            <div class="flex gap-2 mt-2">
                                                <t-button
                                                    theme="danger"
                                                    size="small"
                                                    @click="
                                                        () =>
                                                            (tabStore.currtFormData.contour_setp = DEFAULT_CONTOUR_STEP)
                                                    "
                                                >
                                                    默认值
                                                </t-button>
                                                <t-button size="small" @click="() => onContourTipClick('0')"
                                                    >"0"</t-button
                                                >
                                            </div>
                                        </div>
                                    </template>
                                </t-popup>

                                <t-button
                                    theme="danger"
                                    @click="() => (tabStore.currtFormData.contour_setp = DEFAULT_CONTOUR_STEP)"
                                >
                                    默认值
                                </t-button>
                            </div>

                            <!-- 标签输入 -->
                            <div class="mt-2">
                                <t-tag-input
                                    clearable
                                    excess-tags-display-type="break-line"
                                    v-model="tabStore.currtFormData.contour_setp"
                                    theme="normal"
                                    size="medium"
                                    class="min-w-[240px] max-w-[540px]"
                                    align="left"
                                    placeholder="手动输入等值线间隔"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 分割线（除最后一项） -->
                <t-divider class="my-2" v-if="index < configItems.length - 1" />
            </template>
        </t-card>
    </div>
</template>

<script setup lang="ts">
import { useGisApiTabStore } from "@gisapi/store/index"
import { DEFAULT_CONTOUR_STEP } from "@gisapi/store/formDataState"
import { crossCombineThemesAndVariants } from "@gisapi/utils/index"

const tabStore = useGisApiTabStore()
const outputNameTagList = crossCombineThemesAndVariants()

// ---------- 配置项抽象数组 ----------
const configItems = [
    {
        key: "radian_or_angle",
        label: "流向单位",
        description: "dfsu文件默认导出是使用弧度（rad）为单位，但也可以以角度（deg）为单位，如果没有修改，默认为弧度。",
        type: "dropdown",
        options: [
            { content: "弧度(rad)", value: "弧度" },
            { content: "角度(deg)", value: "角度" },
        ],
    },
    {
        key: "riverRange",
        label: "河道选择",
        description: "使用哪个工况的河道作用到图片中（一般建议采用工程前）：",
        type: "dropdown",
        options: [
            { content: "工程前", value: "工程前" },
            { content: "工程后", value: "工程后" },
        ],
    },
    {
        key: "mesh_size",
        label: "网格间距",
        description: "河道数据点的间距（如果工程前后网格相同，则不会采用本参数）",
        type: "number",
        props: { theme: "normal", size: "medium", class: "w-[100px]", align: "center" },
    },
    {
        key: "timeStep",
        label: "时间序列",
        description: "设置要输出的时间序列，默认-1，既最后一个",
        type: "number",
        props: { theme: "normal", size: "medium", class: "w-[100px]", align: "center" },
    },
    {
        key: "contourMinLen",
        label: "等值线显示范围",
        description: "大于这个长度的流速等值线才会绘制（不变，增大，减少3中颜色线段）",
        type: "number",
        props: { theme: "normal", size: "medium", class: "w-[100px]", align: "center" },
    },
    {
        key: "subTitleZoomRatio",
        label: "图例缩放比例",
        description: "图例的视图比例，0.5缩小，1.5放大，默认1.0",
        type: "number",
        props: { theme: "normal", size: "medium", class: "w-[100px]", decimalPlaces: 1, align: "center" },
    },
    {
        key: "contour_setp",
        label: "等值线显示值",
        description: "自定义等值线步进",
        type: "contour",
    },
    {
        key: "directionArrowSize",
        label: "流场箭头",
        description: "流场箭头大小，0代表根据水位自动生成，支持1-100，如果流场使用插值，这里必须进行指定",
        type: "number",
        props: { theme: "normal", size: "medium", class: "w-[100px]", align: "center" },
    },
    {
        key: "interpolation",
        label: "是否插值",
        description: "是否插值，目前仅支持流向，流速默认插值",
        type: "dropdown",
        options: [
            { content: "插值", value: "插值" },
            { content: "不插值", value: "不插值" },
        ],
    },
]

// ---------- 下拉按钮主题逻辑 ----------
function getDropdownTheme(value: string, item: any) {
    if (item.key === "radian_or_angle") {
        return value === "弧度" ? "danger" : "warning"
    } else if (item.key === "riverRange") {
        return value === "工程后" ? "primary" : "danger"
    }
    return "default"
}

// ---------- 等值线点击逻辑 ----------
async function onContourTipClick(tagTipValue: string) {
    const list = tabStore.currtFormData.contour_setp
    if (list.includes(tagTipValue)) {
        list.splice(list.indexOf(tagTipValue), 1)
    } else {
        list.push(tagTipValue)
    }

    if (tagTipValue === "0") return

    if (list.includes(`-${tagTipValue}`)) {
        list.splice(list.indexOf(`-${tagTipValue}`), 1)
    } else {
        list.push(`-${tagTipValue}`)
    }
}
</script>
