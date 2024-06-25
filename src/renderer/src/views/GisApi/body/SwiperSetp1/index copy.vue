<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-09-26 14:23:33
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-06-25 10:56:49
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\body\SwiperSetp1.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <section :class="['flex flex-col w-full', 'flex-grow-[2]', ' rounded-md p-2']">
    <t-card title="模板配置" :bordered="true">
      <t-input-adornment prepend="1、输出名称：">
        <t-select-input
          :value="formDataList[currtFormDataId].title"
          :popup-visible="popupVisible"
          :popup-props="{ overlayInnerStyle: { padding: '0px' } }"
          placeholder="点击列出常用命名推荐"
          allow-input
          clearable
          style="min-width: 200px"
          @input-change="onTitleChange"
          @popup-visible-change="(val) => (popupVisible = val)"
        >
          <template #panel>
            <ul class="">
              <li
                class="p-1 cursor-pointer hover:bg-gray-200"
                v-for="item in options"
                :key="item"
                @click="() => onTitleWithPopupChange(item)"
              >
                {{ item }}
              </li>
            </ul>
          </template>
        </t-select-input>
      </t-input-adornment>
      <template #actions>
        <a href="javascript:void(0)" @click="clickHandler">快速配置</a>
      </template>

      <div class="my-2"></div>

      <t-input-adornment prepend="2、选择模板：">
        <div :class="['flex flex-row', 'flex-grow-[1]']">
          <t-auto-complete
            v-model="formDataList[currtFormDataId].mxdName"
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
          <t-button class="ml-1" theme="success">
            本地上传
            <template #icon><cloud-upload-icon :style="{ fontSize: '28px' }" /> </template>
          </t-button>
        </div>
      </t-input-adornment>
    </t-card>

    <!-- 父级元素可被撑开 -->
    <setp1_pannel></setp1_pannel>
  </section>
</template>

<script setup lang="ts">
import { templateInfo, keyWord, data } from "@renderer/views/GisApi/store/data"
import { currtFormDataId, currtTemplateId, formDataList } from "@renderer/views/GisApi/store/state"
import { SearchIcon, CloudUploadIcon } from "tdesign-icons-vue-next"

import setp1_pannel from "./setp1_pannel_2.vue"

onMounted(() => {
  console.log("创建1")

  // 请求数据
})

const options = ref(keyWord) // 提示词列表
const popupVisible = ref(false) // 是否显示提示列表的状态
const popupVisible2 = ref(false) // 是否显示提示列表的状态
const template_name_list = computed(() =>
  templateInfo.value.map((item, idx) => `${idx}.${item.template_name}`),
)

/**
 * @description: 选择模板的处理函数
 */
const clickHandler = (item) => {
  if (item.template_id) {
    currtTemplateId.value = item.template_id
    formDataList.value[currtFormDataId.value].mxdId = item.template_id
    formDataList.value[
      currtFormDataId.value
    ].mxdName = `${item.template_id} - ${item.template_name} `
  }
}

/**
 * @description: 输入新标题时，同步tab标题显示的函数
 */
async function onTitleChange(newTitle: string) {
  formDataList.value[currtFormDataId.value].title = newTitle
  data.value[currtFormDataId.value].label = newTitle
}

/**
 * @description: 选择了常用后缀的触发函数
 */
async function onTitleWithPopupChange(new_popup: string) {
  let newTitle: string
  if (formDataList.value[currtFormDataId.value].title == "") {
    newTitle = new_popup
  } else {
    newTitle = `${formDataList.value[currtFormDataId.value].title}_${new_popup}`
  }

  formDataList.value[currtFormDataId.value].title = newTitle
  data.value[currtFormDataId.value].label = newTitle
  popupVisible.value = false
}
</script>

<style scoped></style>
