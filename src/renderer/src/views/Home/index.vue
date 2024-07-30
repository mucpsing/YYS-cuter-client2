<template>
  <div class="flex justify-between w-full">
    <div class="flex-1 p-4 border border-gray-200 rounded-lg">
      <h3 class="mb-2 text-lg font-medium">List 1</h3>
      <ul ref="el1" class="p-0 list-none">
        <li v-for="item in list1" :key="item.id" class="py-2 my-1 border-b" :data-id="item.id">
          {{ item.name }}
        </li>
      </ul>
    </div>
    <div class="flex flex-col items-center justify-center space-y-2">
      <button
        class="px-4 py-2 font-medium text-white bg-blue-500 rounded-md"
        @click="moveAllToRight"
      >
        Move All →
      </button>
      <button
        class="px-4 py-2 font-medium text-white bg-gray-500 rounded-md"
        @click="moveAllToLeft"
      >
        Move All ←
      </button>
    </div>
    <div class="flex-1 p-4 border border-gray-200 rounded-lg">
      <h3 class="mb-2 text-lg font-medium">List 2</h3>
      <ul ref="el2" class="p-0 list-none">
        <li v-for="item in list2" :key="item.id" class="py-2 my-1 border-b" :data-id="item.id">
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import Sortable from "sortablejs"

const el1 = ref<HTMLElement | null>(null)
const el2 = ref<HTMLElement | null>(null)

// 定义响应式数据
const list1 = ref([
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
  { id: 3, name: "Item 3" },
])

const list2 = ref([
  { id: 4, name: "Item 4" },
  { id: 5, name: "Item 5" },
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
