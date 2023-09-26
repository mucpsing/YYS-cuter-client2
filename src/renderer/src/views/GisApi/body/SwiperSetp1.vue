<template>
  <section :class="['flex flex-col w-full gap-2', 'flex-grow-[2]', 'bg-sky-200 rounded-xl p-2']">
    <div class="flex justify-start">
      <t-input-adornment prepend="输出名称：">
        <t-select-input
          size="small"
          :value="data[currtFormDataId].label"
          :popup-visible="popupVisible"
          :popup-props="{ overlayInnerStyle: { padding: '0px' } }"
          placeholder="点击列出常用命名推荐"
          allow-input
          clearable
          style="width: 400px"
          @input-change="onInputChange"
          @popup-visible-change="onPopupVisibleChange"
        >
          <template #panel>
            <ul class="">
              <li
                class="p-1 cursor-pointer hover:bg-gray-200"
                v-for="item in options"
                :key="item"
                @click="
                  () => {
                    data[currtFormDataId].label = `${data[currtFormDataId].label}${item}`
                    popupVisible = false
                  }
                "
              >
                {{ item }}
              </li>
            </ul>
          </template>
        </t-select-input>
      </t-input-adornment>
    </div>

    <div :class="['flex-[3]', 'flex justify-center items-start', 'max-h-[500px]']">
      <img src="points_template.png" class="object-cover h-full rounded-xl" alt="" />
    </div>

    <t-card>
      <div class="flex w-full gap-2">
        <div class="w-full">
          <h2><strong>当前模板</strong></h2>
          <div class="flex justify-start gap-2">
            <p :class="['bg-red-300', 'p-2']">
              模板说明模板说明模板说明模板说明模板说明模板说明模板说明模板说明模明模板说明模板说明模板说
            </p>

            <div class="flex flex-col items-center justify-center gap-2">
              <div class="flex w-full gap-1">
                <t-dropdown
                  :options="dropdownOptions"
                  :max-column-width="200"
                  :max-height="200"
                  @click="clickHandler"
                >
                  <t-button class="w-full" size="small"
                    >{{ selected_template }}
                    <template #icon>
                      <c-icon-font
                        iconName="icon-yys-open"
                        :rotate="180"
                        color="white"
                        :class="['text-white mr-2']"
                      ></c-icon-font
                    ></template>
                  </t-button>
                </t-dropdown>
                <t-tooltip content="下载模板" placement="top">
                  <t-button size="small">
                    <template #icon>
                      <c-icon-font
                        iconName="icon-yys-xiazai"
                        color="white"
                        :class="['text-white']"
                      ></c-icon-font>
                    </template> </t-button
                ></t-tooltip>
              </div>
              <div class="flex w-full gap-1">
                <t-button theme="success" class="w-full" size="small"
                  >本地mxd模板
                  <template #icon>
                    <c-icon-font
                      iconName="icon-yys-shangchuan1"
                      :class="['text-white mr-2']"
                    ></c-icon-font>
                  </template>
                </t-button>
                <t-tooltip content="模板规范" placement="top">
                  <t-button theme="warning" size="small">
                    <template #icon>
                      <HelpCircleIcon />
                    </template> </t-button
                ></t-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </t-card>
  </section>
</template>

<script setup lang="ts">
import { HelpCircleIcon } from "tdesign-icons-vue-next"
import { templateInfo } from "../store/data"
import { formDataList, currtFormDataId } from "../store/state"
import { data } from "../store/data"
let selected_template = "未选择模板"

const dropdownOptions = computed(() => {
  const res = [{ content: `模板选择 (${templateInfo.value.length})`, value: 3, divider: true }]

  templateInfo.value.forEach((item) => {
    res.push({
      content: `${item.template_id}、 ${item.mxd_name}`,
      value: item.template_id,
      divider: false,
      ...item,
    })
  })
  return res
})

const clickHandler = (item) => {
  if (item.template_id) {
    selected_template = `${item.template_id} - ${item.template_name} `
  } else {
    selected_template = "未选择模板"
  }
}

const baseOptions = [
  "洪水",
  "10年一遇",
  "20年一遇",
  "50年一遇",
  "100年一遇",
  "200年一遇",
  "以洪为主",
  "以潮为主",
]
const options = ref(baseOptions)

async function onInputChange(keyword) {
  data.value[currtFormDataId.value].label = keyword
}

const popupVisible = ref(false)
async function onPopupVisibleChange(val) {
  popupVisible.value = val
}
</script>

<style scoped></style>
