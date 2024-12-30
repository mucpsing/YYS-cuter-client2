<!--
 * @Author: Capsion 373704015@qq.com
 * @Date: 2024-12-26 20:46:37
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-12-30 10:57:28
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\TyphoonUI\_components\SearchInputBar.vue
 * @Description: 搜索栏组件
-->
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
        @clear="fileStore.clearSelect"
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
            @change="onTyphoonListChange"
          />
          <div v-else class="tdesign-demo__select-empty-multiple">暂无数据，点击右侧上传数据</div>
        </template>
      </t-select-input>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SelectInputProps, CheckboxGroupProps } from "tdesign-vue-next"
import { type CheckboxGroupChangeContext } from "tdesign-vue-next"

import { ChevronDownIcon } from "tdesign-icons-vue-next"
import { UP_FILE_ACCEPT_TYPE } from "@gisapi/store/config"

import { useTyphoonFileStore } from "@Typhoon/store/index"
import { isNumber } from "lodash"

import { eventBus } from "@renderer/libs"
import { EVENT_NAME } from "@Typhoon/events"
const fileStore = useTyphoonFileStore()

const localStore = reactive({
  currtTyphoon: "",
  stripe: true, // 显示表格边框
  bordered: false, // 显示表格边框
  hover: true, // 显示悬浮效果
  tableLayout: false, // 宽度自适应
  showHeader: false, // 显示表头
})

const SEARCH_BAR_INPUT_REF = document.createElement("input")
async function uploadFileDialog(inputElement: HTMLInputElement = SEARCH_BAR_INPUT_REF) {
  const target = "txt"
  // 调用点击事件
  inputElement.accept = UP_FILE_ACCEPT_TYPE[target]

  inputElement.onchange = async (e: any) => {
    if (!e || !e.target || !e.target.files) return

    let fileInfo: any
    let fileCount = 0
    for (let file of e.target.files) {
      fileInfo = await fileStore.addFile(file)
      fileCount += 1
    }

    // 快速优化，如果当前未选择任何文件，则选择最后添加的一个
    const md5 = fileInfo.md5 as string
    if (fileCount && fileStore.currtFileMd5.length == 0) {
      if (onCheckedChange) {
        onCheckedChange([md5], { current: md5, type: "check" } as CheckboxGroupChangeContext)
      }
    }
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

    const option = fileStore.fileMd5Options.find((t) => t.value === current)
    if (option) selectList.value.push(option)
  } else {
    console.log("???")
    fileStore.unSelectFIle(current as string)

    selectList.value = selectList.value.filter((v) => v.value !== current)
  }
}

// 可以根据触发来源，自由定制标签变化时的筛选器行为
const onTagChange: SelectInputProps["onTagChange"] = (currentTags, context) => {
  const { trigger, index, item } = context

  console.log("onTagChange: ", { currentTags, context })

  if (trigger === "clear") {
    selectList.value = []
  }

  if (["tag-remove", "backspace"].includes(trigger)) {
    if (isNumber(index) && index >= -1) {
      selectList.value.splice(index, 1)
      Object.values(fileStore.fileObj).forEach((obj) => {
        if (obj.filename == item) fileStore.unSelectFIle(obj.md5)
      })
    }
  }
}

const onInputChange: SelectInputProps["onInputChange"] = (val, context) => {
  console.log(val, context)
}

const onTyphoonListChange: CheckboxGroupProps["onChange"] = async (_val, context) => {
  const target = context.current
  // console.log("onTyphoonListChange: ", { val, context }, { target })

  const [md5, name, id] = (target as string).split("_")

  eventBus.emit(EVENT_NAME.showTyphoon, [md5, name, parseInt(id)])
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
