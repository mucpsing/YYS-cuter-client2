<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-09-26 14:23:33
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-06-21 17:39:30
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\body\SwiperSetp1.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <section :class="['flex flex-col w-full gap-2', 'flex-grow-[2]', 'bg-sky-100 rounded-md p-2']">
    <t-card title="1. 指定输出名称：" :bordered="false" hover-shadow>
      <t-input-adornment prepend="名称：">
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
    </t-card>

    <t-card title="2. 选择模板：" :bordered="false" hover-shadow :style="{ height: '100%' }">
      <t-row> 搜索框 </t-row>
      <t-row>
        <t-col :flex="3">
          <t-image
            :key="templateInfo[0].template_name"
            :src="templateInfo[0].preview"
            :style="{  height: '100%' }"
            :lazy="true"
          />
        </t-col>

        <t-col :flex="3">
          <t-card theme="poster2" :style="{ height: '150px' }">
            <template #footer>
              <t-comment
                :avatar="templateInfo[0].preview"
                :author="templateInfo[0].template_name"
                :content="templateInfo[0].description"
                @click="() => console.log(123)"
              />
            </template>
            <template #actions>
              <t-dropdown :options="options" :min-column-width="112" @click="clickHandler">
                <t-button variant="text" shape="square">
                  <more-icon />
                </t-button>
              </t-dropdown>
            </template>
          </t-card>
        </t-col>
      </t-row>
    </t-card>

    <!-- 父级元素可被撑开 -->
    <!-- <test ></test> -->
  </section>
</template>

<script setup lang="ts">
import { templateInfo, keyWord, data } from "../store/data"
import { currtFormDataId, currtTemplateId, formDataList } from "../store/state"

import test from "../_components/test.vue"
onMounted(() => {
  console.log("创建1")

  // 请求数据
})

const options = ref(keyWord) // 提示词列表
const popupVisible = ref(false) // 是否显示提示列表的状态

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
