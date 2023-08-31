<template>
  <div :class="['flex flex-col h-full px-2']">
    <header :class="['flex justify-between items-center', 'py-6 px-6 gap-8', 'min-w-[250px]']">
      <t-button
        ><template #icon><AddIcon /></template
      ></t-button>

      <t-steps v-model="currtSetp" layout="horizontal" :options="Sopts" />

      <t-button theme="danger"
        ><template #icon><c-icon-font iconName="icon-yys-huishouzhan" /></template
      ></t-button>
    </header>

    <section :class="['flex flex-row w-full gap-2', 'flex-grow-[2]', 'bg-sky-200 rounded-xl p-2']">
      <div :class="['flex-[3]', 'flex justify-start items-start']">
        <img src="points_template.png" class="object-cover h-full rounded-xl" alt="" />
      </div>

      <div :class="['flex-[1]', , 'flex flex-col justify-between items-start']">
        <div>
          <h2 :class="['text-2xl']">模板名称.mxd</h2>
          <p :class="['bg-red-300 min-h-[400px]', 'py-2']">
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
            <t-button theme="success" class="w-full" disabled
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
    </section>

    <footer :class="['flex gap-1', 'mt-2', 'flex-grow-0']">
      <t-button class="flex-[1]" :disabled="currtSetp == 1" @click="swtichSetp('back')"
        >上一步<template #icon>
          <c-icon-font
            iconName="icon-yys-xiayiye"
            :rotate="180"
            color="white"
            :class="['text-white mr-2']"
          ></c-icon-font> </template
      ></t-button>
      <t-button class="flex-[1]" disabled theme="success"
        >生成图片
        <template #icon>
          <c-icon-font
            iconName="icon-yys-picture"
            color="white"
            :class="['text-white mr-2']"
          ></c-icon-font>
        </template>
      </t-button>
      <t-button class="flex-[1]" :disabled="currtSetp == Sopts.length" @click="swtichSetp('next')"
        >下一步<template #suffix>
          <c-icon-font
            iconName="icon-yys-xiayiye"
            color="white"
            :rotate="0"
            :class="['text-white mr-2']"
          ></c-icon-font> </template
      ></t-button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { templateSetpOptions, templateInfo } from "../store/data"
import { AddIcon, HelpCircleIcon } from "tdesign-icons-vue-next"

const data = {}

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

const Sopts = computed(() => templateSetpOptions)
const currtSetp = ref(1)

function swtichSetp(setp: "next" | "back") {
  console.log(Sopts.value.length)
  console.log(currtSetp.value)
  switch (setp) {
    case "next":
      if (currtSetp.value == Sopts.value.length) return
      currtSetp.value += 1
      break

    case "back":
      if (currtSetp.value == 0) return
      currtSetp.value -= 1
  }
}

const clickHandler = (item) => {
  if (item.template_id) {
    selected_template = `${item.template_id} - ${item.template_name} `
  } else {
    selected_template = "未选择模板"
  }
}
</script>

<style lang="scss" scoped></style>
