<template>
  <section :class="['flex flex-col w-full gap-2', 'flex-grow-[2]', 'bg-sky-600 rounded-xl p-2']">
    <!-- --------------- 【 工程前后的数据文件上传 】 --------------- -->
    <header :class="['flex-grow-[1]', 'flex gap-2', 'min-h-[250px]']">
      <DfsuUpload title="工程前 - DFSU文件" />
      <DfsuUpload title="工程后 - DFSU文件" />
    </header>

    <footer :class="['flex-grow-[1]']">
      <!-- --------------- 【 输出名称 】 --------------- -->
      <div class="flex items-center justify-between mt-2">
        <div class="flex flex-col items-start justify-between">
          <h2 class="SwiperSetp__h2"><strong>输出名称</strong></h2>
          <p class="max-w-[90%]">
            指定图片的输出名称，默认情况下会尝试识别shp文件名称，根据最后一段_{xxx}的xxx来命名
          </p>
        </div>
        <div class="flex gap-1">
          <t-input class="" placeholder="文件名（不带后缀）" align="center"></t-input>
          <t-dropdown
            :options="[
              { content: `.jpg`, value: `.jpg` },
              { content: `.jpeg`, value: `.jpeg` },
              { content: `.png`, value: `.png` },
            ]"
            @click="(item) => (outputExt = (item.value as string))"
          >
            <t-button>{{ outputExt }}</t-button>
          </t-dropdown>
        </div>
      </div>

      <t-divider class="my-2"></t-divider>

      <!-- --------------- 【 工况选择 】 --------------- -->
      <div class="flex items-center justify-between mt-2">
        <div class="flex flex-col items-start justify-between">
          <h2 class="SwiperSetp__h2"><strong>工况选择</strong></h2>
          <p>
            常见的工况有：
            <t-tag
              class="mx-1 hover:cursor-pointer"
              v-for="(item, idx) of [
                { content: `10年一遇`, value: `10年一遇` },
                { content: `20年一遇`, value: `20年一遇` },
                { content: `50年一遇`, value: `50年一遇` },
                { content: `100年一遇`, value: `100年一遇` },
                { content: `200年一遇`, value: `200年一遇` },
              ]"
              :key="idx"
              theme="success"
              variant="light-outline"
              @click="outputPojectType = item.value"
              >{{ item.value }}</t-tag
            >
          </p>
        </div>
        <div class="flex gap-1">
          <t-dropdown
            :options="[
              { content: `10年一遇`, value: `10年一遇` },
              { content: `20年一遇`, value: `20年一遇` },
              { content: `50年一遇`, value: `50年一遇` },
              { content: `100年一遇`, value: `100年一遇` },
              { content: `200年一遇`, value: `200年一遇` },
            ]"
            @click="(item) => (outputPojectType = (item.value as string))"
          >
            <t-button>{{ outputPojectType }}</t-button>
          </t-dropdown>
        </div>
      </div>

      <t-divider class="my-2"></t-divider>

      <!-- --------------- 【 洪水类型 】 --------------- -->
      <div class="flex items-center justify-between mt-2">
        <div class="flex flex-col items-start justify-between">
          <h2 class="SwiperSetp__h2"><strong>洪水类型</strong></h2>
          <p>
            常见的<strong>洪水</strong>类型有：
            <t-tag
              class="mx-1 hover:cursor-pointer"
              v-for="(item, idx) of [
                { content: `以洪为主`, value: `以洪为主` },
                { content: `以潮为主`, value: `以潮为主` },
              ]"
              :key="idx"
              theme="warning"
              variant="light-outline"
              @click="outputFloodMode = item.value"
              >{{ item.value }}</t-tag
            >
          </p>
        </div>
        <div class="flex gap-1">
          <t-dropdown
            :options="[
              { content: `以洪为主`, value: `以洪为主` },
              { content: `以潮为主`, value: `以潮为主` },
            ]"
            @click="(item) => (outputFloodMode = (item.value as string))"
          >
            <t-button>{{ outputFloodMode }}</t-button>
          </t-dropdown>
        </div>
      </div>

      <t-divider class="my-2"></t-divider>
    </footer>
  </section>
</template>

<script setup lang="ts">
import DfsuUpload from "../_components/dfsuUpload.vue"

const outputExt = ref(".jpg")
const outputFloodMode = ref("选择类型")
const outputPojectType = ref("选择工况")

const formData = reactive({
  be_dfsu: {} as File,
  af_dfsu: {} as File,
})
</script>

<style scoped></style>
