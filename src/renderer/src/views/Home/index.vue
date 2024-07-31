<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-07-31 08:49:33
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-07-31 11:24:50
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\Home\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div :class="['flex justify-between', 'w-full h-[200px]', 'gap-2']">
    <template v-for="(baseItem, idx) of baseStore">
      <div :class="['flex flex-col flex-1', 'p-4 rounded-lg', 'border border-gray-200']">
        <h3 class="flex flex-row justify-between mb-2 text-lg font-medium border-b">
          <strong>{{ baseItem.title }}</strong>
          <span class="text-sm">0 / 1</span>
        </h3>

        <ul
          :id="baseItem.contentId"
          :class="['flex-1 p-0', 'overflow-y-auto overflow-x-hidden', ' list-none']"
        >
          <template v-for="item in localStore[`list${idx + 1}`]" :key="item.id">
            <li class="flex items-center w-full my-1" :data-id="item.id">
              <t-button
                block
                theme="default"
                :class="['fix__t-button-content-w-full', 'flex flex-row flex-1']"
                :on-click="() => onChecked(item)"
              >
                <template #content>
                  <div class="flex justify-between flex-1 w-full">
                    <input
                      v-model="item.checked"
                      type="checkbox"
                      id="scales"
                      name="scales"
                      checked
                    />

                    <span>{{ item.name }}</span>
                  </div>
                </template>
              </t-button>
            </li>
          </template>
        </ul>
      </div>

      <!-- 中间数据的交换按钮 -->
      <div
        v-if="Boolean(idx === 0 && baseStore.length == 2)"
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
    </template>
  </div>
</template>

<script setup lang="ts">
import Sortable from "sortablejs"

// 初始化Sortable
onMounted(() => {
  nextTick(() => initSortable())
})

const baseStore = [
  { title: "工程前", contentId: "be" },
  { title: "工程后", contentId: "af" },
]

const localStore = reactive({
  loading: false,
  switchIconRoate: 0,
  list1: [
    { id: 1, name: "Item 1", checked: false },
    { id: 2, name: "Item 2", checked: false },
    { id: 3, name: "Item 3", checked: false },
  ],
  list2: [
    { id: 4, name: "Item 4", checked: false },
    { id: 5, name: "Item 5", checked: false },
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
    const element = document.getElementById(item.contentId)

    if (!element) return console.log(`element is null: ${item.contentId}`)

    Sortable.create(element, {
      group: "items",
      animation: 150,
    })
  })
}

function switchData() {
  if (localStore.switchIconRoate >= 18000) localStore.switchIconRoate = 0
  localStore.switchIconRoate += 180 // 点击旋转按钮效果
}

function onChecked(item: ItemT) {
  console.log({ item })
  item.checked = !item.checked
}
</script>

<style lang="stylus">
.fix__t-button-content-w-full{
  &>.t-button__text{
    width: 100%
  }
}
</style>
