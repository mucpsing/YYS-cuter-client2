<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-07-31 08:49:33
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-07-31 17:20:24
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\Home\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <div ref="dropElementRef" :class="['flex justify-between', 'w-full', 'gap-2 ', 'relative']">
      <!-- 拖拽激活后的样式遮罩层 -->
      <div class="GisApi__drapMask" :class="{ 'GisApi__drapMask-show': showDropMask }">
        <div class="GisApi__drapMaskTip">最多支持读取前两个dfsu文件</div>
      </div>

      <template v-for="baseItem of baseStore">
        <div :class="['flex flex-col flex-1', 'p-4 rounded-lg', 'border border-gray-200 relative']">
          <h3
            class="flex flex-row items-center justify-between pb-2 mb-2 text-lg font-medium border-b"
          >
            <strong>{{ baseItem.title }}</strong>
            <t-button theme="success" size="small">选择文件</t-button>
          </h3>

          <ul
            :id="baseItem.id"
            :class="[
              'relative flex-col flex-1 p-0',
              'overflow-y-auto overflow-x-hidden',
              'list-none',
            ]"
          >
            <template v-if="dataList[baseItem.id].length == 0">
              <div
                :class="[
                  'transition-all duration-500 ease-in-out pointer-events-none',
                  'absolute w-full  h-full text-center',
                  dataList[baseItem.id].length == 0 ? 'text-gray-300' : 'opacity-0',
                ]"
              >
                <div :class="['w-full h-full', 'flex flex-col flex-1 justify-center items-center']">
                  <p>未添加工程文件</p>
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
                      <input
                        v-model="item.checked"
                        type="checkbox"
                        id="scales"
                        name="scales"
                        checked
                        :disabled="item.disabled"
                      />

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
  </div>
</template>

<script setup lang="ts">
import Sortable from "sortablejs"
import { useDropZone } from "@vueuse/core"

const dropElementRef = ref<HTMLElement>()
const { isOverDropZone } = useDropZone(dropElementRef, onDrop)
const showDropMask = computed(() => {
  const t = Boolean(isOverDropZone.value && !localStore.dragging)

  console.log(t)

  return t
})

async function onDrop(files: File[] | null) {
  console.log("onDrop1")

  if (files && files.length >= 1) {
    // 文件读取
    console.log(files[0])
    console.log("onDrop3")
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

const dataList = reactive({
  be: [
    { id: 1, name: "Item 1", checked: false, disabled: false },
    { id: 2, name: "Item 2", checked: false, disabled: false },
    { id: 3, name: "Item 3", checked: false, disabled: false },
  ],
  af: [
    { id: 4, name: "Item 4", checked: false, disabled: false },
    { id: 5, name: "Item 5", checked: false, disabled: false },
  ],
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
      onStart: (e) => {
        localStore.dragging = true
        console.log("onStart:", localStore.dragging)

        console.log(e)
      },

      onEnd: (e) => {
        const { id } = item

        // 修改排序
        if (e.from.id === e.to.id) {
          const target = dataList[id][e.oldIndex]
          console.log({ target })

          const item = dataList[id].splice(e.oldIndex, 1)[0]
          dataList[id].splice(e.newIndex, 0, item)

          // console.log("排序修改")
          // console.log(dataList[id].forEach((item) => console.log(item.id)))
          // console.log(dataList[id])
        } else {
          dataList[e.to.id].splice(e.newIndex, 0, dataList[e.from.id].splice(e.oldIndex, 1)[0])
          const target = dataList[e.to.id][e.oldIndex]

          console.log({ target })
          // console.log("改变容器")
          // console.log(dataList[e.to.id].forEach((item) => console.log(item.id)))
          // console.log(dataList[e.from.id])
          // console.log(dataList[e.to.id])
        }

        localStore.dragging = false
        console.log("onEnd", localStore.dragging)
      },
    })
  })
}

function onChecked(dataListKey: string, item: ItemT) {
  item.checked = !item.checked
  console.log({ dataListKey })
  console.log({ item })

  // 其他元素锁定
  if (item.checked) {
    dataList[dataListKey].forEach((eachData) => {
      if (item.id != eachData.id) {
        eachData.disabled = true
      } else {
        eachData.disabled = false
      }
    })
  } else {
    dataList[dataListKey].forEach((eachData) => {
      eachData.disabled = false
    })
  }
}

function test() {
  dataList.be.push({ id: 99, name: "test", checked: false, disabled: false })
}
</script>

<style lang="stylus">
.fix__t-button-content-w-full{
  &>.t-button__text{
    width: 100%
  }
}
</style>
