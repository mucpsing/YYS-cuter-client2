<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-07-31 08:49:33
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-12-24 16:07:47
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\Home\index.vue
 * @Description: 这里是文件筐拉选组件，内置了拖拽上传功能，默认自动上传，返回md5存放在fileStore中
-->
<template>
  <div
    ref="dropElementRef"
    :class="['flex justify-between', 'w-full min-h-[160px] max-h-[240px]', 'gap-2 ', 'relative']"
  >
    <!-- 拖拽激活后的样式遮罩层 -->
    <!-- <div class="GisApi__drapMask" :class="{ 'GisApi__drapMask-show': showDropMask }">
      <div class="GisApi__drapMaskTip">最多支持读取前两个dfsu文件</div>
    </div> -->

    <template v-for="baseItem of baseStore">
      <div :class="['flex flex-col flex-1', 'p-4 rounded-lg', 'border border-gray-200']">
        <h3
          class="flex flex-row items-center justify-between pb-2 mb-2 text-lg font-medium border-b"
        >
          <strong>{{ baseItem.title }}</strong>

          <div class="flex gap-2">
            <t-button
              :on-click="() => uploadFileDialog(baseItem)"
              theme="success"
              size="small"
              :loading="baseItem.loading"
              >选择文件</t-button
            >
            <t-button
              size="small"
              theme="danger"
              :on-click="() => removeItemByChecked(baseItem.id)"
            >
              <template #icon>
                <Delete1Icon />
              </template>
            </t-button>
          </div>
        </h3>

        <ul
          :id="baseItem.id"
          :class="[
            '__scrollbar-bule',
            'relative flex-col flex-1 pr-1',
            'overflow-y-auto overflow-x-hidden',
            'list-none',
          ]"
        >
          <!-- 【空文件状态】上传提示词模板 -->
          <template v-if="dataList[baseItem.id].length == 0">
            <div
              @click="() => uploadFileDialog(baseItem)"
              :class="[
                'transition-all duration-500 ease-in-out',
                'absolute w-full  h-full text-center',
                'hover:bg-blue-100 rounded-md',
                'text-base cursor-pointer border-2 border-dashed border-gray-200',
                dataList[baseItem.id].length == 0 ? 'text-gray-300' : 'opacity-0',
              ]"
            >
              <div
                :class="['w-full h-full', '', 'flex flex-col flex-1 justify-center items-center']"
              >
                <p>拖拽或点击上传dfsu文件</p>
                <p>（将文件拖放到此处或者点击下方选择按钮）</p>
              </div>
            </div>
          </template>

          <!-- item -->
          <template v-for="item in dataList[baseItem.id]" :key="item.id">
            <li class="flex items-center w-full my-1" :data-id="item.id">
              <t-button
                block
                theme="default"
                :variant="item.checked ? 'base' : 'outline'"
                :class="['fix__t-button-content-w-full relative', 'flex flex-row flex-1']"
                :on-click="() => onItemChecked(baseItem.id, item)"
                :disabled="item.disabled"
                :loading="item.uploadProgress != 100"
              >
                <template #content>
                  <div class="flex justify-between flex-1 w-full">
                    <input v-model="item.checked" type="checkbox" :disabled="item.disabled" />

                    <span>{{ truncateText(item.name, 16) }} ({{ item.size.toFixed(2) }}MB)</span>

                    <div>
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
// import { useDropZone } from "@vueuse/core"
import { useFileStroe, useGisApiTabStore } from "@gisapi/store/index"
import { UP_FILE_ACCEPT_TYPE } from "@gisapi/store/config"
import { getMd5 } from "@renderer/utils/calculateMd5"
import * as API from "@gisapi/api"
import { Delete1Icon } from "tdesign-icons-vue-next"
import { truncateText } from "@gisapi/utils/index"
import eventBus from "@renderer/libs/eventBus"

import type { FileInfoItemT } from "@gisapi/Types"

const fileStore = useFileStroe()
const tabStore = useGisApiTabStore()
const dropElementRef = ref<HTMLElement>()
const DEFAULT_INPUT_ELEMENT_REF = document.createElement("input")

// 初始化Sortable
onMounted(() => {
  nextTick(() => {
    initSortable()
  })

  eventBus.on("gis-api:fileTransfer-default-checked", onlyOneChecked)
})

const localStore = reactive({
  switchIconRoate: 0,
  dragging: false,
})

interface BaseItemT {
  title: string
  id: string
  loading: boolean
}

const baseStore = reactive<BaseItemT[]>([
  { title: "工程前", id: "be", loading: false },
  { title: "工程后", id: "af", loading: false },
])

const dataList = reactive({
  be: [] as FileInfoItemT[],
  af: [] as FileInfoItemT[],
})

/**
 * @description: 当前如果只有一个文件，那么自动选中，给予下一步时快捷调用
 */
function onlyOneChecked() {
  console.log("onlyOneChecked: ", { be: dataList.be, af: dataList.af })

  if (dataList.be.length == 1 && !dataList.be[0].checked) onItemChecked("be", dataList.be[0])

  if (dataList.af.length == 1 && !dataList.af[0].checked) onItemChecked("af", dataList.af[0])
}

// 初始化Sortable的逻辑
async function initSortable() {
  baseStore.forEach((item) => {
    const element = document.getElementById(item.id)

    if (!element) return console.log(`element is null: ${item.id}`)

    Sortable.create(element, {
      group: "items",
      animation: 150,
      onStart: () => (localStore.dragging = true),

      onEnd: (e) => {
        const { id } = item

        // 修改排序
        if (e.from.id === e.to.id) {
          const item = dataList[id].splice(e.oldIndex, 1)[0]
          dataList[id].splice(e.newIndex, 0, item)
        } else {
          const target = dataList[e.from.id].splice(e.oldIndex, 1)[0]
          if (target.checked) target.checked = false
          if (target.disabled) target.disabled = false

          dataList[e.to.id].splice(e.newIndex, 0, target)
          tabStore.removeDfsu(e.to.id, target.md5)

          // 修复
          const fromList = dataList[e.from.id]

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

async function onItemChecked(dataListKey: string, item: FileInfoItemT) {
  // 临时处理上传失败的文件
  // TODO 应该建立一个check函数，通过md5对存在pinia中的数据进行检查
  if (item.uploadProgress != 100) {
    item.name = `${item.name} 文件上传失败，进行移除...`
    setTimeout(() => fileStore.removeDataByMd5(item.md5), 3000)
    return
  }

  item.checked = !item.checked
  if (item.checked) {
    dataList[dataListKey].forEach((eachData) => {
      if (item.id != eachData.id) eachData.checked = false
    })
  }

  // 工程前后数据存放
  tabStore.selectDfsu(dataListKey, item.md5)
}

async function uploadFileDialog(item: BaseItemT) {
  console.log({ item })
  const target = "dfsu"
  // 调用点击事件
  DEFAULT_INPUT_ELEMENT_REF.accept = UP_FILE_ACCEPT_TYPE[target]

  DEFAULT_INPUT_ELEMENT_REF.onchange = (e) => addItem(e, item)

  DEFAULT_INPUT_ELEMENT_REF.type = "file"
  DEFAULT_INPUT_ELEMENT_REF.multiple = true
  if (DEFAULT_INPUT_ELEMENT_REF.value) DEFAULT_INPUT_ELEMENT_REF.value = ""
  DEFAULT_INPUT_ELEMENT_REF.click()
}

async function updateItemById(id: string, newData: any) {
  try {
    for (const [_key, value] of Object.entries(dataList)) {
      value.forEach((eachData) => {
        if (eachData.id == id) Object.assign(eachData, newData)
      })
    }
  } catch (error) {
    console.log("updateItemById:", { error })
  }
}

async function removeItemByChecked(dataKey: string) {
  const target = dataList[dataKey]
  target.forEach((eachData, idx) => {
    if (eachData.checked) {
      fileStore.removeDataByMd5(eachData.md5)
      tabStore.removeDfsu(dataKey, eachData.md5)
      target.splice(idx, 1)
    }
  })
}

async function removeItemById(id: string) {
  for (const [_key, value] of Object.entries(dataList)) {
    value.forEach((eachData, idx) => {
      if (eachData.id == id) {
        eachData.disabled = true
        fileStore.removeDataByMd5(eachData.md5)
        value.splice(idx, 1)
      }
    })
  }
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
async function addItem(e, item: BaseItemT) {
  if (!e.target) return console.warn("获取实例失败")
  if (!e.target.files) return console.warn("没有选中文件")
  if (e.target.files.length == 0) return console.warn("没有文件")
  item.loading = true

  const data = dataList[item.id]
  // const target = item.id

  // 添加一个空item进行展示
  // 为了支持多个文件上传，这里使用了遍历
  for (let file of e.target.files) {
    const md5 = await getMd5(file)

    const newItem: FileInfoItemT = {
      id: new Date().getTime().toString(36),
      name: file.name,
      md5,
      md5Name: `${md5}.dfsu`,
      size: file.size / 1024 / 1024,
      checked: false,
      disabled: false,
      uploadProgress: 0,
      file,
    }

    data.push(newItem)

    // 尝试进行上传，并传递上传进度的变量
    API.uploadFile(newItem, (uploadPress: number) => {
      // 如果不动态获取真实实例，在上传中移动可能丢失进度条
      updateItemById(newItem.id, { uploadProgress: uploadPress })
    })
      .then((upload_res) => {
        // 上传成功后，添加带store
        if (upload_res && upload_res.range_geojson) {
          fileStore.geoJsonObj[md5] = upload_res.range_geojson
          fileStore.dfsuObj[md5] = newItem

          // tabStore.addDfsu(target, md5)
          updateItemById(newItem.id, { uploadProgress: 100 })
        } else {
          removeItemById(newItem.id)
        }
      })
      .catch((err) => {
        console.warn("API.uploadFile: ", { err })
        removeItemById(newItem.id)
      })
  }

  item.loading = false
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
