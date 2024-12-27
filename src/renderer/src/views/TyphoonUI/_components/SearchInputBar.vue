<!--
 * @Author: Capsion 373704015@qq.com
 * @Date: 2024-12-26 20:46:37
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-12-27 17:10:07
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\TyphoonUI\_components\SearchInputBar.vue
 * @Description: 搜索栏组件
-->
<!-- fileStore.currtFileMd5.length > 0 ? 'h-[16vh] hover:h-[24vh]' : 'h-[8vh]', -->
<template>
  <div
    :class="[
      'typhoon-ui__search-input-bar transition-all',
      'absolute left-1/2 -translate-x-1/2 top-10',
      'w-4/5 p-5',
      'rounded-lg bg-orange-200/30',
      'flex flex-col gap-2',
      'overflow-hidden',
    ]"
  >
    <div class="flex flex-row w-full gap-2">
      <t-select-input
        v-model:inputValue="inputValue"
        size="medium"
        :value="selectList"
        :allow-input="allowInput"
        :placeholder="allowInput ? '请选择或输入' : '请选择'"
        :tag-input-props="{ excessTagsDisplayType: 'break-line' }"
        :popup-props="{
          overlayInnerClassName: ['narrow-scrollbar'],
          overlayInnerStyle: {
            maxHeight: '300px',
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            padding: '6px',
          },
        }"
        clearable
        multiple
        @tag-change="onTagChange"
        @input-change="onInputChange"
      >
        <template #panel>
          <t-checkbox-group
            v-if="fileStore.fileMd5Options.length"
            :value="checkboxValue"
            :options="fileStore.fileMd5Options"
            class="tdesign-demo__panel-options-multiple"
            @change="onCheckedChange"
          />
          <div v-else class="tdesign-demo__select-empty-multiple">暂无数据，点击右侧上传数据</div>
        </template>
        <template #suffixIcon>
          <chevron-down-icon />
        </template>
      </t-select-input>
      <t-button
        class="min-w-[120px]"
        size="medium"
        theme="success"
        @click="() => uploadFileDialog()"
      >
        本地文件
        <template #icon>
          <c-icon-font
            iconName="icon-yys-document"
            color="white"
            :class="['text-white mr-2']"
          ></c-icon-font>
        </template>
      </t-button>
    </div>

    <div v-if="fileStore.currtFileMd5.length">
      <t-select-input
        v-model="localStore.currtTyphoon"
        panel="暂无台风数据，请选择一个台风数据集"
        placeholder="请输入关键字搜索"
        :popup-props="{
          overlayInnerClassName: ['narrow-scrollbar bg-gray-300/50'],
          overlayInnerStyle: {
            maxHeight: '600px',
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            padding: '6px',
          },
        }"
      >
        <template #panel>
          <t-checkbox-group
            v-if="fileStore.fileMd5Options.length"
            :value="checkboxValue"
            :options="fileStore.currtTpyhoonDataList"
            class="tdesign-demo__panel-options-multiple"
            @change="onCheckedChange"
          />
          <div v-else class="tdesign-demo__select-empty-multiple">暂无数据，点击右侧上传数据</div>
        </template>
      </t-select-input>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SelectInputProps, CheckboxGroupProps } from "tdesign-vue-next"
import { ChevronDownIcon } from "tdesign-icons-vue-next"
import { UP_FILE_ACCEPT_TYPE } from "@gisapi/store/config"

import { useTyphoonFileStore } from "@Typhoon/store/index"

const fileStore = useTyphoonFileStore()
const localStore = reactive({
  currtTyphoon: "",
})

// const typhoonOptions = computed(()=>{
//   fileStore.
// })

const SEARCH_BAR_INPUT_REF = document.createElement("input")
async function uploadFileDialog(inputElement: HTMLInputElement = SEARCH_BAR_INPUT_REF) {
  const target = "txt"
  // 调用点击事件
  inputElement.accept = UP_FILE_ACCEPT_TYPE[target]

  inputElement.onchange = async (e: any) => {
    if (!e || !e.target || !e.target.files) return

    for (let file of e.target.files) await fileStore.addFile(file)
  }

  inputElement.type = "file"
  inputElement.multiple = true
  if (inputElement.value) inputElement.value = ""
  inputElement.click()
}

interface CustomOptionInfo {
  label: string
  value?: number | string
  checkAll?: boolean
}

const allowInput = ref(true)
const inputValue = ref("")
const selectList = ref<CustomOptionInfo[]>([])

const checkboxValue = computed<CheckboxGroupProps["value"]>(() => {
  const arr: any[] = []
  const list = selectList.value
  // 此处不使用 forEach，减少函数迭代
  for (let i = 0, len = list.length; i < len; i++) {
    list[i].value && arr.push(list[i].value)
  }
  return arr
})

// 直接 checkboxgroup 组件渲染输出下拉选项
const onCheckedChange: CheckboxGroupProps["onChange"] = (val, { current, type }) => {
  // current 不存在，则表示操作全选
  // if (!current) {
  //   selectList.value =
  //     type === "check"
  //       ? fileStore.fileMd5Options.slice(1).map((option) => ({
  //           ...option,
  //           value: option?.value || 0,
  //         }))
  //       : []
  //   return
  // }

  // 普通操作
  if (type === "check") {
    console.log("CheckboxGroupProps: ", { val, current, type })
    // 触发渲染
    fileStore.selectFile(current as string)

    // const option = options.value.find((t) => t.value === current)
    const option = fileStore.fileMd5Options.find((t) => t.value === current)
    if (option) selectList.value.push(option)
  } else {
    selectList.value = selectList.value.filter((v) => v.value !== current)
  }
}

// 可以根据触发来源，自由定制标签变化时的筛选器行为
const onTagChange: SelectInputProps["onTagChange"] = (currentTags, context) => {
  console.log(currentTags, context)
  const { trigger, index, item } = context
  if (trigger === "clear") {
    selectList.value = []
  }
  if (["tag-remove", "backspace"].includes(trigger)) {
    selectList.value.splice(index, 1)
  }
}

const onInputChange: SelectInputProps["onInputChange"] = (val, context) => {
  console.log(val, context)
}
</script>

<style lang="stylus">
.tdesign-demo__panel-options-multiple {
  width: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.tdesign-demo__panel-options-multiple .t-checkbox {
  display: flex;
  border-radius: 3px;
  line-height: 22px;
  cursor: pointer;
  padding: 3px 8px;
  color: var(--td-text-color-primary);
  transition: background-color 0.2s linear;
  white-space: nowrap;
  word-wrap: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}
.tdesign-demo__panel-options-multiple .t-checkbox:hover {
  background-color: var(--td-bg-color-container-hover);
}

.typhoon-ui__search-input-bar {
  transition: all .6s cubic-bezier(0.25, 1, 0.5, 1);
}
</style>
