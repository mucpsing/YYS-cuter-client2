<template>
  <section :class="['flex flex-row w-full gap-2', 'flex-grow-[2]', 'bg-sky-400 rounded-xl p-2']">
    <div class="h-full flex-grow-[1] bg-red-300 left">
      <div class="py-2 pl-3 pr-4">
        <div>
          <h2 class="SwiperSetp__h2"><strong>模型数据</strong></h2>
          <t-divider class="my-2"></t-divider>
          <div class="flex flex-row items-center justify-between">
            <span>工程前 dfsu 文件</span>
            <t-button>选择文件</t-button>
          </div>
          <div class="flex flex-row items-center justify-between mt-2">
            <span>工程后 dfsu 文件</span>
            <t-button>选择文件</t-button>
          </div>
        </div>

        <t-divider class="my-2"></t-divider>

        <div class="flex items-center justify-between mt-2">
          <div class="flex flex-col items-start justify-between max-w-[50%]">
            <h2 class="SwiperSetp__h2"><strong>输出名称</strong></h2>
            <p class="">
              指定图片的输出名称，默认情况下会尝试识别shp文件名称，根据最后一段_{xxx}的xxx来命名
            </p>
          </div>
          <div class="flex gap-1">
            <t-input class="" placeholder="文件名（不带后缀）"></t-input>
            <t-dropdown
              :options="[
                { content: `.jpeg`, value: `.jpg` },
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

        <div class="flex items-center justify-between mt-2">
          <div class="flex flex-col items-start justify-between">
            <h2 class="SwiperSetp__h2"><strong>工况选择</strong></h2>
            <span
              >常见的工况有：

              <t-tag
                class="mx-1 hover:cursor-pointer"
                v-for="(item, idx) of projectTypeList"
                :key="idx"
                theme="success"
                variant="light-outline"
                @click="outputPojectType = item.value"
                >{{ item.value }}</t-tag
              >
            </span>
          </div>
          <div class="flex gap-1">
            <t-dropdown
              :options="projectTypeList"
              @click="(item) => (outputPojectType = (item.value as string))"
            >
              <t-button>{{ outputPojectType }}</t-button>
            </t-dropdown>
          </div>
        </div>
        <t-divider class="my-2"></t-divider>
      </div>
    </div>

    <div class="h-full min-w-[500px] flex-grow-[999] bg-red-400 right"></div>
  </section>
</template>

<script setup lang="ts">
const outputExt = ref(".jpg")
const outputPojectType = ref("选择工况")

const projectTypeList = [
  { content: `10年一遇`, value: `10年一遇` },
  { content: `20年一遇`, value: `20年一遇` },
  { content: `50年一遇`, value: `50年一遇` },
  { content: `100年一遇`, value: `100年一遇` },
  { content: `200年一遇`, value: `200年一遇` },
]

const formData = {
  be_dfsu: "",
  af_dfsu: "",
}
</script>

<style lang="stylus" scoped>
.SwiperSetp__h2{
  @apply text-xl text-slate-600
}
</style>
