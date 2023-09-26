<template>
  <div :class="['flex flex-col h-full px-2 gap-4']">
    <header :class="['flex justify-between items-center', 'py-6 px-6 gap-8', 'min-w-[250px]']">
      <t-button :onClick="tabControler.addTab"
        ><template #icon><AddIcon /></template
      ></t-button>

      <t-steps
        size="small"
        v-model="formDataList[currtFormDataId].setp"
        layout="horizontal"
        :options="Sopts"
      />
    </header>

    <transition name="GisApi__body-fade">
      <KeepAlive>
        <component :is="SwiperComponentList[formDataList[currtFormDataId].setp]"></component>
      </KeepAlive>
    </transition>

    <footer :class="['flex gap-1', 'mt-4', 'flex-grow-0']">
      <t-button
        class="flex-[1]"
        :disabled="formDataList[currtFormDataId].setp == 1"
        @click="swtichSetp('back')"
        size="medium"
        >上一步<template #icon>
          <c-icon-font
            iconName="icon-yys-xiayiye"
            :rotate="180"
            color="white"
            :class="['text-white mr-2']"
          ></c-icon-font> </template
      ></t-button>
      <t-button
        :on-click="() => mxdToImg(formDataList[currtFormDataId])"
        class="flex-[1]"
        :disabled="formDataList[currtFormDataId].setp != 4"
        theme="success"
        size="medium"
        >生成图片 (1/4)
        <template #icon>
          <c-icon-font
            iconName="icon-yys-picture"
            color="white"
            :class="['text-white mr-2']"
          ></c-icon-font>
        </template>
      </t-button>
      <t-button
        class="flex-[1]"
        :disabled="formDataList[currtFormDataId].setp == Sopts.length"
        @click="swtichSetp('next')"
        size="medium"
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
<script lang="ts">
import SwiperSetp1 from "./SwiperSetp1.vue"
import SwiperSetp2 from "./SwiperSetp2.vue"
import SwiperSetp3 from "./SwiperSetp3.vue"
import SwiperSetp4 from "./SwiperSetp4.vue"

const SwiperComponentList = {
  "1": "SwiperSetp1",
  "2": "SwiperSetp2",
  "3": "SwiperSetp3",
  "4": "SwiperSetp4",
}
export default { components: { SwiperSetp1, SwiperSetp2, SwiperSetp3, SwiperSetp4 } }
</script>

<script setup lang="ts">
import { templateSetpOptions } from "../store/state"
import { AddIcon } from "tdesign-icons-vue-next"
import { formDataList, currtFormDataId } from "../store/state"

import { mxdToImg } from "../api"

const tabControler = inject("tabControler") as { addTab: () => void; removeTab: () => void }

const Sopts = computed(() => templateSetpOptions)
const currtSetp = computed(() => {
  return formDataList.value[currtFormDataId.value].setp
  // return formDataList[currtFormDataId.value].setp
})

async function onClickMxdToImg() {
  console.log()
}

function swtichSetp(setp: "next" | "back") {
  console.log(Sopts.value.length)
  switch (setp) {
    case "next":
      if (formDataList.value[currtFormDataId.value].setp == Sopts.value.length) return
      formDataList.value[currtFormDataId.value].setp += 1
      break

    case "back":
      if (formDataList.value[currtFormDataId.value].setp == 0) return
      formDataList.value[currtFormDataId.value].setp -= 1
  }
}
</script>

<style lang="stylus">
/* 面板切换过渡动效 */
.GisApi__body-fade-enter-active
  position relative
  opacity 1
  transition all 0.3s ease-out 0.3s

.GisApi__body-fade-leave-active
  position relative
  opacity 1
  transition all 0.3s cubic-bezier(1, 0.5, 0.8, 1)

.GisApi__body-fade-enter-from, .GisApi__body-fade-leave-to
  position relative
  opacity 0
</style>
