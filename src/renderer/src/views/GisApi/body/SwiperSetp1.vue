<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-09-26 14:23:33
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-06-21 22:13:46
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

    <t-card title="2. 选择模板：" :bordered="false" hover-shadow :style="{ width: '100%' }">
      <!-- 搜索框 -->
      <!-- <t-space :class="['flex flex-col gap-4']"> -->
      <t-space :size="10" direction="vertical">
        <t-auto-complete
          v-model="test1"
          :options="template_name_list"
          placeholder="请输入关键词搜索常用模板"
          highlight-keyword
          filterable
          class="t-demo-autocomplete__search"
        >
          <template #suffixIcon><SearchIcon /></template>
        </t-auto-complete>

        <t-card theme="poster2">
          <div :class="['flex gap-4']">
            <t-image
              :key="templateInfo[0].template_name"
              :src="templateInfo[0].preview"
              :style="{ height: '120px', width: '200px' }"
              :lazy="true"
            />
            <t-comment
              :author="templateInfo[0].template_name"
              :content="templateInfo[0].description"
              @click="() => console.log(123)"
            />
          </div>
        </t-card>
      </t-space>
    </t-card>
    <!-- 父级元素可被撑开 -->
    <!-- <test ></test> -->
  </section>
</template>

<script setup lang="ts">
import { templateInfo, keyWord, data } from "../store/data"
import { currtFormDataId, currtTemplateId, formDataList } from "../store/state"
import { SearchIcon } from "tdesign-icons-vue-next"

onMounted(() => {
  console.log("创建1")

  // 请求数据
})

const options = ref(keyWord) // 提示词列表
const popupVisible = ref(false) // 是否显示提示列表的状态
const test1 = ref("test")
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
