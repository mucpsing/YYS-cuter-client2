<template>
  <section :class="['flex flex-col w-full', 'flex-grow-[2]', 'overflow-hidden', ' rounded-md p-2']">
    <section :class="['parent', 'h-full', 'flex flex-row gap-4 ', 'bg-white']">
      <div :class="['flex flex-col gap-4 flex-1 h-full']">
        <t-card title="模板配置" :bordered="true" :style="{ flex: 1 }">
          <template #actions>
            <t-button @click="selectLocalTemplate" variant="text" theme="primary"
              >使用本地mxd</t-button
            >
          </template>

          <div :class="['flex-col flex-[111] flex gap-4 justify-around', 'h-full']">
            <div :class="['flex flex-col', 'flex-1  flex-grow-[11]']">
              <div :class="['flex items-center justify-center']">
                <t-image
                  :class="['min-w-[160px] min-h-[160px]', 'max-w-[300px]']"
                  :error="'未选择任何模板'"
                  :src="`${currtPreviewUrl}${tabStore.currtFormData.templateInfo.preview}`"
                  class="cursor-pointer hover:opacity-75"
                  @click="
                    glboalStore.showPreview(
                      `${currtPreviewUrl}${tabStore.currtFormData.templateInfo.preview}`,
                    )
                  "
                >
                </t-image>
              </div>

              <h3 class="my-2 text-base">
                <strong>{{ tabStore.currtFormData.templateInfo.template_name }}</strong>
              </h3>
              <p class="min-h-[60px]">
                {{ tabStore.currtFormData.templateInfo.description }}
              </p>
            </div>

            <t-space direction="vertical" size="10px">
              <t-input-adornment prepend="1、输出名称：">
                <t-select-input
                  :id="`Gis-Api__template_input_mxd_name_${tabStore.currtFormData.id}`"
                  :value="tabStore.currtFormData.outputName"
                  :popup-visible="tipWrodsPopupVisible"
                  :popup-props="{ overlayInnerStyle: { padding: '0px' } }"
                  placeholder="点击列出常用命名推荐"
                  allow-input
                  clearable
                  @input-change="onTitleChange"
                  @popup-visible-change="(val) => (tipWrodsPopupVisible = val)"
                >
                  <template #panel>
                    <ul class="">
                      <li
                        class="w-full p-2 cursor-pointer hover:bg-gray-200"
                        v-for="item in outNameTipWordsList"
                        :key="item"
                        @click="() => onTitleWithPopupChange(item)"
                      >
                        {{ item }}
                      </li>
                    </ul>
                  </template>
                </t-select-input>
              </t-input-adornment>

              <div class="flex flex-wrap gap-2 mb-4 whitespace-nowrap">
                <template v-for="(item, idx) of outNameTipWordsList" :key="idx">
                  <t-tag
                    @click="() => onTitleWithPopupChange(outNameTipWordsList[idx])"
                    class="cursor-pointer"
                    size="small"
                    :theme="outputNameTagList[idx].theme"
                    :variant="outputNameTagList[idx].variant"
                    >{{ item }}</t-tag
                  >
                </template>
              </div>

              <t-input-adornment prepend="2、选择模板：">
                <t-auto-complete
                  :id="`Gis-Api__template_input_select_${formDataList[currtTabId].id}`"
                  :value="formDataList[currtTabId].mxdName"
                  :options="template_name_list"
                  placeholder="从右方【模板列表】中选择"
                  clearable
                  highlight-keyword
                  filterable
                  @change="onSelectInputHandler"
                  @clear="
                    () => {
                      console.log('clear')
                      formDataList[currtTabId].mxdId = -1
                      formDataList[currtTabId].mxdName = ''
                    }
                  "
                >
                  <template #suffixIcon><SearchIcon /></template>
                </t-auto-complete>
              </t-input-adornment>
            </t-space>
          </div>
        </t-card>
      </div>

      <div :class="['flex-1 h-full', 'py-[16px] px-[16px] border-1 border rounded-md']">
        <TemplateList />
      </div>
    </section>
  </section>
</template>

<script setup lang="tsx">
import { storeToRefs } from "pinia"
import { debounce } from "lodash-es"
import { SearchIcon, PrintIcon } from "tdesign-icons-vue-next"

import { currtPreviewUrl } from "@gisapi/store/config"
import { DEFAULT_TEMPLATE_OUTNAME } from "@gisapi/store/state"

import { crossCombineThemesAndVariants } from "@gisapi/utils/index"
import { swtichCommonTemplate } from "./utils"

import TemplateList from "./templateList.vue"
import { useGisApiTabStore, useGisApiStateStore } from "@gisapi/store/index"

const tabStore = useGisApiTabStore()
const glboalStore = useGisApiStateStore()
const { formDataList, currtTabId } = storeToRefs(tabStore)

// 提示词列表
const outNameTipWordsList = [
  "工程前",
  "工程后",
  "枯水",
  "洪水",
  "以洪为主",
  "以潮为主",
  "10年一遇",
  "20年一遇",
  "50年一遇",
  "100年一遇",
  "200年一遇",
]
const tipWrodsPopupVisible = ref(false) // 是否显示提示列表的状态

const template_name_list = computed(() =>
  tabStore.templateInfoList.map((item) => `${item.template_id}-${item.template_name}`),
)

const outputNameTagList = crossCombineThemesAndVariants()

const selectLocalTemplate = () => {
  // 选择本地模板，弹出文件选择
  // 校验文件
}

const onSelectInputHandler = (s: string) => {
  console.log(s)
  if (!s) return

  // 假设模板ID和模板名称之间只有一个中文字符的顿号
  const parts = s.trim().split("-")

  // 检查是否只有两个部分（ID和名称）
  if (parts.length !== 2) {
    throw new Error(`无效的输入字符串格式: ${s}, 预期格式为 'ID-Name'。`)
  }

  // 尝试将ID部分转换为整数
  const template_id = parseInt(parts[0], 10)
  if (isNaN(template_id)) {
    throw new Error("无效的模板ID。预期为整数。")
  }

  // 名称部分直接作为字符串使用
  const template_name = parts[1]
  tabStore.formDataList[tabStore.currtTabId].mxdName = s

  // 构造并返回对象
  swtichCommonTemplate({ template_id, template_name })
}

/**
 * @description: 输入新标题时，同步tab标题显示的函数，有多次触发的BUG，这里使用debounce进行消除
 */
const onTitleChange = debounce(async (newTitle: string) => {
  if (newTitle === "") {
    newTitle = DEFAULT_TEMPLATE_OUTNAME
  }
  console.log(newTitle)

  tabStore.formDataList[tabStore.currtTabId].title = newTitle
  tabStore.formDataList[tabStore.currtTabId].outputName = newTitle
  tabStore.tabList[tabStore.currtTabId].label = newTitle
}, 100)

/**
 * @description: 选择了常用后缀的触发函数
 */
async function onTitleWithPopupChange(new_popup: string) {
  let newTitle: string
  if (["", DEFAULT_TEMPLATE_OUTNAME].includes(tabStore.formDataList[tabStore.currtTabId].title)) {
    newTitle = new_popup
  } else {
    newTitle = `${tabStore.formDataList[tabStore.currtTabId].title}_${new_popup}`
  }

  tabStore.formDataList[tabStore.currtTabId].title = newTitle
  tabStore.formDataList[tabStore.currtTabId].outputName = newTitle
  tabStore.tabList[tabStore.currtTabId].label = newTitle
  tipWrodsPopupVisible.value = false
}
</script>
