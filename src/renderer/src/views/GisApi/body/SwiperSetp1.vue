<template>
  <section :class="['flex flex-row w-full gap-2', 'flex-grow-[2]', 'bg-sky-200 rounded-xl p-2']">
    <div :class="['flex-[1]', , 'flex flex-col justify-between items-start']">
      <div>
        <!-- <h2 :class="['text-2xl']">模板名称.mxd</h2> -->
        <div class="flex items-center justify-center pb-2">
          <strong :class="['text-lg whitespace-nowrap']">输出名称：</strong>
          <t-popup
            content="如果工况名称未指定，默认会继承使用标签名称"
            destroy-on-close
            trigger="focus"
          >
            <t-input
              align="center"
              tpye="text"
              v-model="data[currtFormDataId].label"
              placeholder="工况名称"
            ></t-input>
          </t-popup>
        </div>
        <p :class="['bg-red-300 min-h-[400px]', 'p-2']">
          模板说明模板说明模板说明模板说明模板说明模板说明模板说明模板说明模板说明模板说明模板说明模板说明模板说明模板说明模板说明模板说明模板说明模板说明模板说明模板说明模板说明模板说明模板说明模板说明模板说明模板说明模板说明模板说明模板说明模板说明
        </p>
      </div>

      <div class="flex flex-col w-full gap-2">
        <div class="flex gap-1">
          <t-dropdown
            :options="dropdownOptions"
            :max-column-width="200"
            :max-height="200"
            @click="clickHandler"
          >
            <t-button class="w-full"
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
            <t-button>
              <template #icon>
                <c-icon-font
                  iconName="icon-yys-xiazai"
                  color="white"
                  :class="['text-white']"
                ></c-icon-font>
              </template> </t-button
          ></t-tooltip>
        </div>
        <div class="flex gap-1">
          <t-button theme="success" class="w-full"
            >本地mxd模板
            <template #icon>
              <c-icon-font
                iconName="icon-yys-shangchuan1"
                :class="['text-white mr-2']"
              ></c-icon-font>
            </template>
          </t-button>
          <t-tooltip content="模板规范" placement="top">
            <t-button theme="warning">
              <template #icon>
                <HelpCircleIcon />
              </template> </t-button
          ></t-tooltip>
        </div>
      </div>
    </div>

    <div :class="['flex-[3]', 'flex justify-start items-start']">
      <img src="points_template.png" class="object-cover h-full rounded-xl" alt="" />
    </div>
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
</script>

<style scoped></style>
