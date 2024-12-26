<!--
 * @Author: Capsion 373704015@qq.com
 * @Date: 2024-12-26 20:46:37
 * @LastEditors: Capsion 373704015@qq.com
 * @LastEditTime: 2024-12-26 22:48:36
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\TyphoonUI\_components\SearchInputBar.vue
 * @Description: 搜索栏组件
-->
<template>
  <div
    :class="[
      'absolute left-1/2 -translate-x-1/2 top-10',
      'w-4/5 h-[5hv] p-5',
      'rounded-lg bg-orange-200/50',
      'flex flex-row gap-2',
    ]"
  >
    <t-select-input
      v-model:inputValue="inputValue"
      size="medium"
      :value="value"
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
          v-if="options.length"
          :value="checkboxValue"
          :options="options"
          class="tdesign-demo__panel-options-multiple"
          @change="onCheckedChange"
        />
        <div v-else class="tdesign-demo__select-empty-multiple">暂无数据</div>
      </template>
      <template #suffixIcon>
        <chevron-down-icon />
      </template>
    </t-select-input>
    <t-button class="min-w-[120px]" size="medium" theme="success" @click="() => uploadFileDialog()">
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
</template>

<script setup lang="ts">
import { SelectInputProps, CheckboxGroupProps } from "tdesign-vue-next"
import { ChevronDownIcon } from "tdesign-icons-vue-next"
import { UP_FILE_ACCEPT_TYPE } from "@gisapi/store/config"

import { useTyphoonFileStore } from "@Typhoon/store/index"

const fileStore = useTyphoonFileStore()

console.log({ fileStore })

const SEARCH_BAR_INPUT_REF = document.createElement("input")
async function uploadFileDialog() {
  const target = "txt"
  // 调用点击事件
  SEARCH_BAR_INPUT_REF.accept = UP_FILE_ACCEPT_TYPE[target]

  SEARCH_BAR_INPUT_REF.onchange = async (e: any) => {
    if (!e || !e.target || !e.target.files) return

    for (let file of e.target.files) await fileStore.addFile(file)
  }

  SEARCH_BAR_INPUT_REF.type = "file"
  SEARCH_BAR_INPUT_REF.multiple = true
  if (SEARCH_BAR_INPUT_REF.value) SEARCH_BAR_INPUT_REF.value = ""
  SEARCH_BAR_INPUT_REF.click()
}

interface CustomOptionInfo {
  label: string
  value?: number
  checkAll?: boolean
}
const OPTIONS: CustomOptionInfo[] = [
  // 全选
  {
    label: "Check All",
    checkAll: true,
  },
  {
    label: "tdesign-vue",
    value: 1,
  },
  {
    label: "tdesign-react",
    value: 2,
  },
  {
    label: "tdesign-miniprogram",
    value: 3,
  },
  {
    label: "tdesign-angular",
    value: 4,
  },
  {
    label: "tdesign-mobile-vue",
    value: 5,
  },
  {
    label: "tdesign-mobile-react",
    value: 6,
  },
  {
    label: "Check All",
    checkAll: true,
  },
  {
    label: "tdesign-vue",
    value: 1,
  },
  {
    label: "tdesign-react",
    value: 2,
  },
  {
    label: "tdesign-miniprogram",
    value: 3,
  },
  {
    label: "tdesign-angular",
    value: 4,
  },
  {
    label: "tdesign-mobile-vue",
    value: 5,
  },
  {
    label: "tdesign-mobile-react",
    value: 6,
  },
  {
    label: "Check All",
    checkAll: true,
  },
  {
    label: "tdesign-vue",
    value: 1,
  },
  {
    label: "tdesign-react",
    value: 2,
  },
  {
    label: "tdesign-miniprogram",
    value: 3,
  },
  {
    label: "tdesign-angular",
    value: 4,
  },
  {
    label: "tdesign-mobile-vue",
    value: 5,
  },
  {
    label: "tdesign-mobile-react",
    value: 6,
  },
  {
    label: "Check All",
    checkAll: true,
  },
  {
    label: "tdesign-vue",
    value: 1,
  },
  {
    label: "tdesign-react",
    value: 2,
  },
  {
    label: "tdesign-miniprogram",
    value: 3,
  },
  {
    label: "tdesign-angular",
    value: 4,
  },
  {
    label: "tdesign-mobile-vue",
    value: 5,
  },
  {
    label: "tdesign-mobile-react",
    value: 6,
  },
]

const allowInput = ref(true)
const creatable = ref(true)
const inputValue = ref("")

// 全量数据
const options = ref<CustomOptionInfo[]>([...OPTIONS])
const value = ref<CustomOptionInfo[]>([
  {
    label: "Vue",
    value: 1,
  },
  {
    label: "React",
    value: 2,
  },
  {
    label: "Miniprogram",
    value: 3,
  },
])

const checkboxValue = computed<CheckboxGroupProps["value"]>(() => {
  const arr: any[] = []
  const list = value.value
  // 此处不使用 forEach，减少函数迭代
  for (let i = 0, len = list.length; i < len; i++) {
    list[i].value && arr.push(list[i].value)
  }
  return arr
})

// 直接 checkboxgroup 组件渲染输出下拉选项
const onCheckedChange: CheckboxGroupProps["onChange"] = (val, { current, type }) => {
  console.log(current)
  // current 不存在，则表示操作全选
  if (!current) {
    value.value =
      type === "check"
        ? options.value.slice(1).map((option) => ({
            ...option,
            value: option?.value || 0,
          }))
        : []
    return
  }
  // 普通操作
  if (type === "check") {
    const option = options.value.find((t) => t.value === current)
    value.value.push(option)
  } else {
    value.value = value.value.filter((v) => v.value !== current)
  }
}

// 可以根据触发来源，自由定制标签变化时的筛选器行为
const onTagChange: SelectInputProps["onTagChange"] = (currentTags, context) => {
  console.log(currentTags, context)
  const { trigger, index, item } = context
  if (trigger === "clear") {
    value.value = []
  }
  if (["tag-remove", "backspace"].includes(trigger)) {
    value.value.splice(index, 1)
  }
  // 如果允许创建新条目
  if (creatable.value && trigger === "enter") {
    const current = {
      label: item.toString(),
      value: Number(item) || index,
    }
    value.value.push(current)
    const newOptions = options.value.concat(current)
    options.value = newOptions
    inputValue.value = ""
  }
}
const onInputChange: SelectInputProps["onInputChange"] = (val, context) => {
  console.log(val, context)
}
</script>

<style>
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
</style>
