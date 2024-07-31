<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-07-31 08:49:33
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-07-31 10:56:22
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\Home\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div :class="['flex justify-between', 'w-full h-[200px]', 'gap-2']">
    <div
      :class="['flex flex-col flex-1', 'p-4 rounded-lg', 'bg-red-300', 'border border-gray-200']"
    >
      <h3 class="mb-2 text-lg font-medium bg-red-200"><strong>工程前</strong></h3>
      <ul
        ref="el1"
        :class="['flex-1 p-0 list-none bg-red-200', 'overflow-y-auto overflow-x-hidden']"
      >
        <template v-for="item in list1" :key="item.id">
          <li class="py-2 my-1 border-b" :data-id="item.id">
            {{ item.name }}
          </li>
        </template>
      </ul>
    </div>

    <div
      class="flex items-center justify-center px-2 bg-blue-100 rounded-sm cursor-pointer hover:bg-blue-300"
      @click="switchData"
    >
      <strong
        class="flex items-center justify-center transition-all"
        :style="{ transform: `rotate(${localStore.switchIconRoate}deg)` }"
      >
        <c-icon-font
          iconName="icon-yys-04zhuanhuan"
          class="flex text-xl text-center text-white"
        ></c-icon-font>
      </strong>
    </div>

    <div :class="['flex flex-col flex-1', 'p-4 rounded-lg', 'border border-gray-200']">
      <h3 class="flex flex-row justify-between mb-2 text-lg font-medium border-b">
        <strong>工程后</strong>
        <span class="text-sm">0 / 1</span>
      </h3>
      <ul ref="el2" class="flex-1 p-0 list-none">
        <template v-for="item in list2" :key="item.id">
          <li class="flex items-center w-full my-1" :data-id="item.id">
            <t-button
              block
              theme="default"
              :class="['fix__t-button-content-w-full', 'flex flex-row flex-1']"
              :on-click="() => onChecked(item)"
            >
              <template #content>
                <div class="flex justify-between flex-1 w-full">
                  <span>{{ item.name }}</span>
                  <input v-model="item.checked" type="checkbox" id="scales" name="scales" checked />
                </div>
              </template>
            </t-button>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import Sortable from "sortablejs"
const baseStore = [
  { title: "工程前", content: "内容1", onClick: () => console.log(1), ref: "el1" },
  { title: "工程后", content: "内容1", onClick: () => console.log(1), ref: "el2" },
]
const localStore = reactive({
  loading: false,
  switchIconRoate: 0,
})
interface ItemT {
  id: number
  name: string
  checked: boolean
}

const el1 = ref<HTMLElement | null>(null)
const el2 = ref<HTMLElement | null>(null)

// 定义响应式数据
const list1 = ref<ItemT[]>([
  { id: 1, name: "Item 1", checked: false },
  { id: 2, name: "Item 2", checked: false },
  { id: 3, name: "Item 3", checked: false },
])

const list2 = ref<ItemT[]>([
  { id: 4, name: "Item 4", checked: false },
  { id: 5, name: "Item 5", checked: false },
])

// 初始化Sortable
onMounted(() => {
  initSortable()
})

// 初始化Sortable的逻辑
function initSortable() {
  if (!el1 || !el2) return console.log("获取元素失败")
  if (!el1.value || !el2.value) return console.log("创建元素失败")

  Sortable.create(el1.value, {
    group: "items",
    animation: 150,
    onEnd: onEnd,
  })

  Sortable.create(el2.value, {
    group: "items",
    animation: 150,
    onEnd: onEnd,
  })
}

// 处理拖拽结束的逻辑
function onEnd(evt: any) {
  if (evt.to.id === "list1") {
    list1.value.splice(evt.newIndex, 0, list2.value.splice(evt.oldIndex, 1)[0])
  } else if (evt.to.id === "list2") {
    list2.value.splice(evt.newIndex, 0, list1.value.splice(evt.oldIndex, 1)[0])
  }
}

function switchData() {
  if (localStore.switchIconRoate >= 18000) localStore.switchIconRoate = 0
  localStore.switchIconRoate += 180 // 点击旋转按钮效果
}

function onChecked(item: ItemT) {
  item.checked = !item.checked
  console.log({ item })
}

// 移动所有项到右侧
function moveAllToRight() {
  list2.value = [...list2.value, ...list1.value]
  list1.value = []
}

// 移动所有项到左侧
function moveAllToLeft() {
  list1.value = [...list1.value, ...list2.value]
  list2.value = []
}
</script>

<style lang="stylus">
.fix__t-button-content-w-full{
  &>.t-button__text{
    width: 100%
  }

}
</style>
