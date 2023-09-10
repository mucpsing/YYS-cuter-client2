<template>
  <div :class="['flex flex-col h-full px-2 gap-4']">
    <header :class="['flex justify-between items-center', 'py-6 px-6 gap-8', 'min-w-[250px]']">
      <t-button
        ><template #icon><AddIcon /></template
      ></t-button>

      <t-steps v-model="currtSetp" layout="horizontal" :options="Sopts" />

      <t-button theme="danger"
        ><template #icon><c-icon-font iconName="icon-yys-huishouzhan" /></template
      ></t-button>
    </header>

    <transition name="GisApi__body-fade">
      <component :is="SwiperComponentList[currtSetp]"></component>
    </transition>

    <footer :class="['flex gap-1', 'mt-4', 'flex-grow-0']">
      <t-button class="flex-[1]" :disabled="currtSetp == 1" @click="swtichSetp('back')" size="large"
        >上一步<template #icon>
          <c-icon-font
            iconName="icon-yys-xiayiye"
            :rotate="180"
            color="white"
            :class="['text-white mr-2']"
          ></c-icon-font> </template
      ></t-button>
      <t-button class="flex-[1]" disabled theme="success" size="large"
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
        :disabled="currtSetp == Sopts.length"
        @click="swtichSetp('next')"
        size="large"
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

// inject()!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const Sopts = computed(() => templateSetpOptions)
const currtSetp = ref(1)
const currtSetpId = computed(() => currtSetp.value - 1)

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
