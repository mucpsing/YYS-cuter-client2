<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-09-26 14:23:33
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-06-27 12:47:36
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\body\SwiperSetp1.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <section :class="['flex flex-col w-full', 'flex-grow-[2]', 'overflow-hidden', ' rounded-md p-2']">
    <section :class="['parent', 'h-full', 'flex flex-row gap-4 ', 'bg-white']">
      <div :class="['flex flex-col gap-4 flex-1 h-full']">
        <t-card title="模板配置" :bordered="true" :style="{ flex: 1 }">
          <template #actions>
            <a href="javascript:void(0)" @click="selectLocalTemplate">使用本地模板</a>
          </template>

          <div :class="['flex-col flex-[111] flex gap-8 justify-around', 'h-full']">
            <div :class="['flex flex-row items-center justify-center', 'flex-1  flex-grow-[11]']">
              <div
                :class="[
                  'border-2 border-sky-400',
                  'h-full w-full',
                  'flex-[111] flex-grow-[11] p-4',
                ]"
              >
                <t-image
                  :class="['min-w-[200px] min-h-[200px]']"
                  :error="'未选择任何模板'"
                ></t-image>
              </div>
            </div>

            <t-space direction="vertical" size="10px">
              <t-input-adornment prepend="1、输出名称：">
                <t-select-input
                  :value="currtFormDataList[currtFormDataId].title"
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
                        class="p-1 cursor-pointer hover:bg-gray-200"
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

              <t-input-adornment prepend="2、选择模板：">
                <div :class="['flex flex-row', 'flex-grow-[1]']">
                  <t-auto-complete
                    v-model="currtFormDataList[currtFormDataId].mxdName"
                    :options="template_name_list"
                    placeholder="选择一个mxd模板"
                    clearable
                    highlight-keyword
                    filterable
                    class="t-demo-autocomplete__search"
                  >
                    <template #suffixIcon><SearchIcon /></template>
                    <!-- <template #suffixIcon><SearchIcon /></template> -->
                  </t-auto-complete>
                </div>
              </t-input-adornment>
            </t-space>
          </div>
        </t-card>
      </div>

      <div :class="['flex-1 h-full', 'py-[16px] px-[16px] border-1 border rounded-md']">
        <div :class="['flex-col flex gap-2 flex-1 h-full']">
          <div :class="['mb-[16px]']">
            <h3 :class="['text-base']">
              <strong>{{ `模板选择(${templateInfo.length})` }}</strong>
            </h3>
          </div>
          <div
            :class="[
              '__scrollbar-bule',
              'flex-col flex gap-4',
              'h-full overflow-y-auto',
              'pr-[8px]',
            ]"
          >
            <template v-for="item in templateInfo" :key="item.template_id">
              <t-card theme="poster2">
                <div
                  :class="['flex gap-4', 'cursor-pointer', 'hover:bg-red-100/10']"
                  @click="selectCommonTemplateHandler(item)"
                >
                  <t-image
                    :key="item.template_name"
                    :src="item.preview"
                    :style="{ height: '80px', width: '200px' }"
                    :lazy="true"
                  />
                  <t-comment
                    :author="item.template_name"
                    :content="item.description"
                    @click="selectCommonTemplateHandler(item)"
                  />
                  <div :class="['flex flex-col gap-2 items-center justify-center']">
                    <t-button
                      :style="{ width: '100%', height: '40px' }"
                      theme="default"
                      @click="selectCommonTemplateHandler(item)"
                    >
                      点击选择
                      <template #icon><GestureClickIcon :style="{ fontSize: '16px' }" /> </template>
                    </t-button>
                    <t-button
                      :style="{ width: '100%' }"
                      theme="success"
                      disabled
                      @click="selectCommonTemplateHandler(item)"
                      >下 载
                      <template #icon><DownloadIcon :style="{ fontSize: '16px' }" /> </template>
                    </t-button>
                  </div>
                </div>
              </t-card>
            </template>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { templateInfo, keyWord, data } from "@renderer/views/GisApi/store/data"
import type { TemplateInfo } from "@renderer/views/GisApi/store/data"
import {
  currtFormDataId,
  currtTemplateId,
  formDataList as currtFormDataList,
} from "@renderer/views/GisApi/store/state"

import { SearchIcon, DownloadIcon, GestureClickIcon } from "tdesign-icons-vue-next"

onMounted(() => {
  console.log("setp1 on mounted")
})

const outNameTipWordsList = ref(keyWord) // 提示词列表
const tipWrodsPopupVisible = ref(false) // 是否显示提示列表的状态

const template_name_list = computed(() =>
  templateInfo.value.map((item, idx) => `${idx}.${item.template_name}`),
)

const selectLocalTemplate = () => {
  // 选择本地模板，弹出文件选择
  // 校验文件
}

const selectCommonTemplate = () => {
  // 选择常用模板
}

/**
 * @description: 选择常用模板的触发函数
 */
const selectCommonTemplateHandler = (item: TemplateInfo) => {
  if (item.template_id) {
    // 设置状态
    currtTemplateId.value = item.template_id
    currtFormDataList.value[currtFormDataId.value].mxdId = item.template_id
    currtFormDataList.value[
      currtFormDataId.value
    ].mxdName = `${item.template_id} - ${item.template_name} `
  }
}

/**
 * @description: 输入新标题时，同步tab标题显示的函数
 */
async function onTitleChange(newTitle: string) {
  currtFormDataList.value[currtFormDataId.value].title = newTitle
  data.value[currtFormDataId.value].label = newTitle
}

/**
 * @description: 选择了常用后缀的触发函数
 */
async function onTitleWithPopupChange(new_popup: string) {
  let newTitle: string
  if (currtFormDataList.value[currtFormDataId.value].title == "") {
    newTitle = new_popup
  } else {
    newTitle = `${currtFormDataList.value[currtFormDataId.value].title}_${new_popup}`
  }

  currtFormDataList.value[currtFormDataId.value].title = newTitle
  data.value[currtFormDataId.value].label = newTitle
  tipWrodsPopupVisible.value = false
}
</script>

<style lang="stylus">
.__scrollbar-bule{
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
      background: #b5c7ff; // 滑块颜色
      border-radius: 5px; // 滑块圆角
  }

  &::-webkit-scrollbar-thumb:hover {
      background: #366ef4; // 鼠标移入滑块颜色
      cursor pointer
  }

  &::-webkit-scrollbar-track {
      border-radius: 10px; // 轨道圆角
      background-color: #f6f6f6 // 轨道颜色
  }
}
</style>
