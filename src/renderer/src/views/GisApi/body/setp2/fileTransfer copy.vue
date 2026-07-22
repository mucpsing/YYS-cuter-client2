<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-07-31 08:49:33
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2026-01-08 10:39:22
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\Home\index.vue
 * @Description: 这里是文件筐拉选组件，内置了拖拽上传功能，默认自动上传，返回md5存放在fileStore中
-->
<template>
    <div
        ref="dropElementRef"
        :class="['flex justify-between', 'w-full min-h-[160px] max-h-[240px]', 'gap-2 ', 'relative']"
    >
        <template v-for="eachElement of ElementList">
            <div :class="['flex flex-col flex-1', 'p-4 rounded-lg', 'border border-gray-200']">
                <h3 class="flex flex-row items-center justify-between pb-2 mb-2 text-lg font-medium border-b">
                    <strong>{{ eachElement.title }}</strong>

                    <div class="flex gap-2">
                        <t-button
                            :on-click="() => uploadFileDialog(eachElement)"
                            theme="success"
                            size="small"
                            :loading="eachElement.loading"
                            >选择文件</t-button
                        >
                        <t-button size="small" theme="danger" :on-click="() => removeItemByChecked(eachElement)">
                            <template #icon>
                                <Delete1Icon />
                            </template>
                        </t-button>
                    </div>
                </h3>

                <ul
                    :id="eachElement.id"
                    :class="[
                        '__scrollbar-bule',
                        'relative flex-col flex-1 pr-1',
                        'overflow-y-auto overflow-x-hidden',
                        'list-none',
                    ]"
                >
                    <!-- 【空文件状态】上传提示词模板 -->
                    <template v-if="tabStore.currtFormData[eachElement.id].length == 0">
                        <div
                            @click="() => uploadFileDialog(eachElement)"
                            :class="[
                                'transition-all duration-500 ease-in-out',
                                'absolute w-full  h-full text-center',
                                'hover:bg-blue-100 rounded-md',
                                'text-base cursor-pointer border-2 border-dashed border-gray-200',
                                tabStore.currtFormData[eachElement.id].length == 0 ? 'text-gray-300' : 'opacity-0',
                            ]"
                        >
                            <div :class="['w-full h-full', '', 'flex flex-col flex-1 justify-center items-center']">
                                <p>拖拽或点击上传dfsu文件</p>
                                <p>（将文件拖放到此处或者点击下方选择按钮）</p>
                            </div>
                        </div>
                    </template>

                    <!-- 文件列表，每个文件以按钮形式覆盖 -->
                    <template v-for="item in tabStore.currtFormData[eachElement.id]" :key="item.id">
                        <li class="flex items-center w-full my-1" :data-id="item.id">
                            <t-button
                                block
                                theme="default"
                                :variant="item.checked ? 'base' : 'outline'"
                                :class="['fix__t-button-content-w-full relative', 'flex flex-row flex-1']"
                                :on-click="() => (item.checked = !item.checked)"
                                :disabled="item.disabled"
                                :loading="item.uploadProgress != 100"
                            >
                                <template #content>
                                    <div class="flex justify-between flex-1 w-full">
                                        <input v-model="item.checked" type="checkbox" :disabled="item.disabled" />

                                        <span>{{ truncateText(item.name, 16) }} ({{ item.size.toFixed(2) }}MB)</span>

                                        <div class="flex flex-col items-center justify-center">
                                            <div v-if="item.uploadProgress == 0">文件解析中...</div>

                                            <div v-else class="min-w-[150px]">
                                                <t-progress
                                                    :color="{ from: '#0052D9', to: '#00A870' }"
                                                    :percentage="item.uploadProgress"
                                                    :status="item.uploadProgress == 100 ? 'success' : 'active'"
                                                    theme="line"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </t-button>
                        </li>
                    </template>
                </ul>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import Sortable from "sortablejs"
import { MessagePlugin } from "tdesign-vue-next"

import { useFileStroe, useGisApiTabStore } from "@gisapi/store/index"
import { UP_FILE_ACCEPT_TYPE } from "@gisapi/store/config"

import { uploadFile } from "@gisapi/utils/server"
import { Delete1Icon } from "tdesign-icons-vue-next"
import { truncateText } from "@gisapi/utils/index"
import eventBus from "@renderer/libs/eventBus"

import type { FileListKeyT } from "@gisapi/Types"

const fileStore = useFileStroe()
const tabStore = useGisApiTabStore()
const dropElementRef = ref<HTMLElement>()
const DEFAULT_INPUT_ELEMENT_REF = document.createElement("input")

function removeItemByChecked(eachElement: ElementStoreT) {
    console.log({ eachElement })

    // 删除tabStore的
    const removeMd5List: string[] = []
    tabStore.currtFormData[eachElement.id].forEach((eachData) => {
        if (eachData.checked) {
            removeMd5List.push(eachData.md5)
        }
    })

    removeMd5List.forEach((md5) => tabStore.removeDfsu(md5))
}

interface ElementStoreT {
    title: string
    id: FileListKeyT
    loading: boolean
}

const localStore = reactive({
    switchIconRoate: 0,
    dragging: false,
})

const ElementList = reactive<ElementStoreT[]>([
    { title: "工程前1", id: "beDfsuMd5List", loading: false },
    { title: "工程后2", id: "afDfsuMd5List", loading: false },
])

// 初始化Sortable
onMounted(() => {
    nextTick(() => initSortable())

    console.log("initSortable:: ~~~~")

    // 这个全局事件供外部下一步进行数据校验时调用
    eventBus.on("gis-api:fileTransfer-default-checked", onlyOneChecked)
})

/**
 * @description: 当前如果只有一个文件，那么自动选中，给予下一步时快捷调用
 */
function onlyOneChecked() {
    console.log("onlyOneChecked", tabStore.currtFormData)
    for (let key of tabStore.fileListKeys) {
        console.log("onlyOneChecked", key, tabStore.currtFormData[key])

        if (tabStore.currtFormData[key].length == 1) tabStore.currtFormData[key][0].checked = true
    }
}

// 初始化拖拽组件
async function initSortable() {
    ElementList.forEach((eachElement) => {
        const element = document.getElementById(eachElement.id)
        const currtTabData = tabStore.currtFormData

        if (!element) return console.log(`element is null: ${eachElement.id}`)

        Sortable.create(element, {
            group: "items",
            animation: 150,

            onStart: () => {
                localStore.dragging = true
                console.log("onStart:", localStore.dragging)
            },

            onEnd: (e) => {
                const { id } = eachElement

                console.log("onEnd:", { localStore, currtTabData })

                // 修改排序
                if (e.newIndex == undefined || e.oldIndex == undefined) {
                    return console.log("onEnd 3", e)
                }

                if (e.from.id === e.to.id) {
                    console.log("onEnd1:")
                    const item = currtTabData[id].splice(e.oldIndex, 1)[0]
                    currtTabData[id].splice(e.newIndex, 0, item)
                } else {
                    console.log("onEnd2:")

                    // 元素拖动
                    const target = currtTabData[e.from.id].splice(e.oldIndex, 1)[0]
                    if (!target) {
                        console.log({ e })

                        return console.warn("发生异常，数据为空: ", tabStore.currtFormData)
                    }

                    if (target.checked) target.checked = false
                    if (target.disabled) target.disabled = false

                    currtTabData[e.to.id].splice(e.newIndex, 0, target)

                    // 修复
                    const fromList = currtTabData[e.from.id]

                    if (fromList.length == 1) {
                        fromList[0].checked = false
                        fromList[0].disabled = false
                    }
                }

                localStore.dragging = false
            },
        })
    })
}

async function uploadFileDialog(elementStore: ElementStoreT) {
    // console.log("elementStore: ", elementStore)
    const target = "dfsu"
    // 调用点击事件
    DEFAULT_INPUT_ELEMENT_REF.accept = UP_FILE_ACCEPT_TYPE[target]
    DEFAULT_INPUT_ELEMENT_REF.onchange = (e) => addItem(e, elementStore)

    DEFAULT_INPUT_ELEMENT_REF.type = "file"
    DEFAULT_INPUT_ELEMENT_REF.multiple = true
    if (DEFAULT_INPUT_ELEMENT_REF.value) DEFAULT_INPUT_ELEMENT_REF.value = ""
    DEFAULT_INPUT_ELEMENT_REF.click()
}

/**
 * 添加文件项并尝试上传。
 * @param e - 事件对象，包含文件选择信息。
 * @param item - 基础项类型，表示当前操作的项。
 * 该函数首先检查事件对象是否有效以及是否有选中的文件。
 * 然后为每个选中的文件创建一个新的文件信息项，并计算其MD5值。
 * 接着尝试上传文件，并在上传过程中更新上传进度。
 * 上传成功后，将文件信息存储到相应的存储对象中；如果上传失败，则移除该项。
 * @returns 无返回值，但会更新数据列表和文件存储对象。
 */
async function addItem(e, elementStore: ElementStoreT) {
    if (!e.target) return console.warn("获取实例失败")
    if (!e.target.files) return console.warn("没有选中文件")
    if (e.target.files.length == 0) return console.warn("没有文件")
    elementStore.loading = true

    // TODO 是否需要优化，这里使用了tabStore和fileStore两个store进行数据操作

    // 【交互优化1】当初始文件为0，且本次添加2个文件时，一个文件分配给工程前，一个分配给工程后
    const allFileCount = tabStore.currtFileCount
    let fileCount = parseInt(e.target.files.length)
    tabStore.fileListKeys.forEach((key) => (fileCount += tabStore.currtFormData[key].length))
    let fileIndex = 1
    let fileKey = elementStore.id

    // 添加一个空elementStore进行展示
    // 为了支持多个文件上传，这里使用了遍历
    for (let file of e.target.files) {
        const fileInfo = await fileStore.addDfsuItem(file)

        // 文件添加失败或者已经存在
        if (!fileInfo) {
            MessagePlugin.warning({
                content: "添加文件失败，请检查文件格式是否正确",
                duration: 3000,
                zIndex: 1001,
            })

            continue
        }
        const { md5 } = fileInfo

        // 当首次添加两个文件时，需要将第一个文件分配给工程前，第二个文件分配给工程后
        if (fileCount == 2 && allFileCount == 0) fileKey = tabStore.fileListKeys[fileIndex - 1]

        tabStore.addDfsu(fileKey, md5)

        // 尝试进行上传，并传递上传进度的变量
        uploadFile(file, fileInfo, (uploadPress: number) => {
            tabStore.updateSelectFileItemByMd5(md5, { uploadProgress: uploadPress })
        })
            .then((upload_res) => {
                // 上传成功后，后端会解析出geojson，dfsu的几何轮廓，将这个轮廓缓存到fileStore中
                if (upload_res && upload_res.range_geojson) {
                    fileStore.geoJsonObj[md5] = upload_res.range_geojson
                    tabStore.updateSelectFileItemByMd5(md5, { uploadProgress: 100 })
                } else {
                    // 上传失败？
                    fileStore.removeDataByMd5(md5)
                    tabStore.removeDfsu(md5)
                }
            })
            .catch((err) => {
                console.warn("Server.uploadFile: ", { err })
                fileStore.removeDataByMd5(md5)
                tabStore.removeDfsu(md5)
            })

        fileIndex++
    }

    elementStore.loading = false
}
</script>

<style lang="stylus">
.fix__t-button-content-w-full{
  &>.t-button__text{
    width: 100%
  }
}

  /* 遮罩具体样式 */
.GisApi__drapMask{
  position absolute
  width 100%
  height 100%
  text-align center
  display flex
  align-items center
  justify-content center
  pointer-events none
  color rgba(0, 0, 0,1)
  background-color rgba(255, 255, 255, 0.1)
  opacity 0
  box-sizing border-box
  border-radius 5px
  backdrop-filter blur(5px)
  transition all 0.6s cubic-bezier(0.25, 1, 0.5, 1)

  .GisApi__drapMaskTip{
    font-size clamp(1rem, 4vh, 2rem)
  }
}

.GisApi__drapMask-show{
  opacity 1
  z-index 50
}

.GisApi__SwiperSetp2-title{
  opacity 1
  @apply text-lg
}
</style>
