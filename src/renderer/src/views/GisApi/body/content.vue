<template>
  <div :class="['flex flex-col h-full px-2']">
    <header :class="['flex justify-between items-center', 'py-6 px-8 gap-16', 'min-w-[250px]']">
      <t-button
        ><template #icon><AddIcon /></template
      ></t-button>

      <t-steps v-model="currtSetp" layout="horizontal" :options="Sopts" />

      <t-button theme="danger"
        ><template #icon><c-icon-font iconName="icon-yys-huishouzhan" /></template
      ></t-button>
    </header>

    <!-- <SwiperSetp1 /> -->
    <t-swiper class="bg-red-300 tdesign-demo-block--swiper" animation="fade" :height="280">
      <t-swiper-item>
        <SwiperSetp1 />
      </t-swiper-item>

      <t-swiper-item>
        <div>1</div>
      </t-swiper-item>

      <t-swiper-item>
        <div>2</div>
      </t-swiper-item>
    </t-swiper>

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
import { templateSetpOptions } from "../store/data"
import { AddIcon } from "tdesign-icons-vue-next"

import SwiperSetp1 from "./SwiperSetp1.vue"

const data = {}

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
</script>
