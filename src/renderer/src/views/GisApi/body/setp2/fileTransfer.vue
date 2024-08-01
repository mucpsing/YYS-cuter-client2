<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-07-31 08:49:33
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-08-01 11:09:38
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\Home\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div
    ref="dropElementRef"
    :class="['flex justify-between', 'w-full min-h-[160px] max-h-[240px]', 'gap-2 ', 'relative']"
  >
    <!-- 拖拽激活后的样式遮罩层 -->
    <div class="GisApi__drapMask" :class="{ 'GisApi__drapMask-show': showDropMask }">
      <div class="GisApi__drapMaskTip">最多支持读取前两个dfsu文件</div>
    </div>

    <template v-for="baseItem of baseStore">
      <div :class="['flex flex-col flex-1', 'p-4 rounded-lg', 'border border-gray-200']">
        <h3
          class="flex flex-row items-center justify-between pb-2 mb-2 text-lg font-medium border-b"
        >
          <strong>{{ baseItem.title }}</strong>
          <t-button
            :on-click="() => fileStore.onUploadBtnClick('dfsu')"
            theme="success"
            size="small"
            >选择文件</t-button
          >
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
          <template v-if="dataList[baseItem.id].length == 0">
            <div
              :class="[
                'transition-all duration-500 ease-in-out',
                'absolute w-full  h-full text-center',
                'text-base cursor-pointer border-2 border-dashed border-gray-200',
                dataList[baseItem.id].length == 0 ? 'text-gray-300' : 'opacity-0',
              ]"
              @click="() => test(baseItem.id)"
            >
              <div :class="['w-full h-full', 'flex flex-col flex-1 justify-center items-center']">
                <p>拖拽或点击上传dfsu文件</p>
                <p>（将文件拖放到此处或者点击下方选择按钮）</p>
              </div>
            </div>
          </template>
          <template v-for="item in dataList[baseItem.id]" :key="item.id">
            <li class="flex items-center w-full my-1" :data-id="item.id">
              <t-button
                block
                theme="default"
                :class="['fix__t-button-content-w-full', 'flex flex-row flex-1']"
                :on-click="() => onChecked(baseItem.id, item)"
                :disabled="item.disabled"
              >
                <template #content>
                  <div class="flex justify-between flex-1 w-full">
                    <input v-model="item.checked" type="checkbox" :disabled="item.disabled" />

                    <span>{{ item.name }}</span>
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
import { useDropZone } from "@vueuse/core"

import { useFileStroe } from "@gisapi/store/index"

const fileStore = useFileStroe()

const dropElementRef = ref<HTMLElement>()
const { isOverDropZone } = useDropZone(dropElementRef, onDrop)
const showDropMask = computed(() => Boolean(isOverDropZone.value && !localStore.dragging))

async function onDrop(files: File[] | null) {
  if (files && files.length >= 1) {
    // 文件读取
    console.log(files[0])
  }
}

// 初始化Sortable
onMounted(() => {
  nextTick(() => initSortable())
})

const localStore = reactive({
  switchIconRoate: 0,
  dragging: false,
})

const baseStore = [
  { title: "工程前", id: "be" },
  { title: "工程后", id: "af" },
]

// const dataList = reactive({
//   be: [
//     { id: 1, name: "Item 1", checked: false, disabled: false },
//     { id: 2, name: "Item 2", checked: false, disabled: false },
//     { id: 3, name: "Item 3", checked: false, disabled: false },
//   ],
//   af: [
//     { id: 4, name: "Item 4", checked: false, disabled: false },
//     { id: 5, name: "Item 5", checked: false, disabled: false },
//   ],
// })

const dataList = reactive({
  be: [],
  af: [],
})

interface ItemT {
  id: number
  name: string
  checked: boolean
}

// 初始化Sortable的逻辑
function initSortable() {
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

          // console.log("排序修改")
          // console.log(dataList[id].forEach((item) => console.log(item.id)))
          // console.log(dataList[id])
        } else {
          const target = dataList[e.from.id].splice(e.oldIndex, 1)[0]
          if (target.checked) target.checked = false
          if (target.disabled) target.disabled = false

          dataList[e.to.id].splice(e.newIndex, 0, target)

          const fromList = dataList[e.from.id]
          if (fromList.length == 1) {
            fromList[0].checked = false
            fromList[0].disabled = false
          }
          // dataList[e.to.id].splice(e.newIndex, 0, dataList[e.from.id].splice(e.oldIndex, 1)[0])

          //   console.log({ target })
          //   console.log({ from: fromList })
          //   console.log({ from: fromList.length })
          // console.log("改变容器")
          // console.log(dataList[e.to.id].forEach((item) => console.log(item.id)))
          // console.log(dataList[e.from.id])
          // console.log(dataList[e.to.id])
        }

        localStore.dragging = false
        // console.log("onEnd", localStore.dragging)
      },
    })
  })
}

function onChecked(dataListKey: string, item: ItemT) {
  item.checked = !item.checked
  if (item.checked) {
    dataList[dataListKey].forEach((eachData) => {
      if (item.id != eachData.id) eachData.checked = false
    })
  }

  // 其他元素锁定
  // if (item.checked) {
  //   dataList[dataListKey].forEach((eachData) => {
  //     if (item.id != eachData.id) {
  //       eachData.disabled = true
  //     } else {
  //       eachData.disabled = false
  //     }
  //   })
  // } else {
  //   dataList[dataListKey].forEach((eachData) => {
  //     eachData.disabled = false
  //   })
  // }
}

function test(dataListKey: string) {
  const target = dataList[dataListKey]

  target.push({
    id: new Date().getTime().toString(36),
    name: "test",
    checked: false,
    disabled: false,
  })
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
