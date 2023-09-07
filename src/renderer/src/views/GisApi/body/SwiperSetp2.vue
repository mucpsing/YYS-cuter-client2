<template>
  <section :class="['flex flex-row w-full gap-2', 'flex-grow-[2]', 'rounded-xl p-2']">
    <div
      :class="[
        'h-full flex-grow-[1] left bg-gray-100 rounded-md',
        'cps__scroll_style overflow-y-auto',
      ]"
    >
      <div class="h-0 py-2 pl-3 pr-4">
        <!-- ------------------------- 【 模型数据 】 ------------------------- -->
        <div class="">
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

        <!-- ------------------------- 【 输出名称 】 ------------------------- -->

        <div class="flex items-center justify-between mt-2">
          <div class="flex flex-col items-start justify-between">
            <h2 class="SwiperSetp__h2"><strong>输出名称</strong></h2>
            <p class="max-w-[80%]">
              指定图片的输出名称，默认情况下会尝试识别shp文件名称，根据最后一段_{xxx}的xxx来命名
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <t-input class="max-w-[110px]" placeholder="文件名" align="center"></t-input>
            <t-dropdown
              :options="outputExtList"
              @click="(item) => (outputExt = (item.value as string))"
            >
              <t-button>{{ outputExt }}</t-button>
            </t-dropdown>
          </div>
        </div>

        <t-divider class="my-2"></t-divider>

        <!-- ------------------------- 【 工况选择 】 ------------------------- -->
        <div class="flex items-center justify-between mt-2">
          <div class="flex flex-col items-start justify-between">
            <h2 class="SwiperSetp__h2"><strong>工况选择</strong></h2>
            <p>
              常见的工况有：
              <t-tag
                class="mx-1 hover:cursor-pointer"
                v-for="(item, idx) of projectTypeList"
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
              :options="projectTypeList"
              @click="(item) => (outputPojectType = (item.value as string))"
            >
              <t-button>{{ outputPojectType }}</t-button>
            </t-dropdown>
          </div>
        </div>
        <t-divider class="my-2"></t-divider>

        <!-- ------------------------- 【 工况类型 】 ------------------------- -->
        <div class="flex items-center justify-between mt-2">
          <div class="flex flex-col items-start justify-between">
            <h2 class="SwiperSetp__h2 max-w-[90%]"><strong>工况类型</strong></h2>
            <p class="">
              常见的工况类型有：
              <t-tag
                class="mx-1 hover:cursor-pointer"
                v-for="(item, idx) of projectModeList"
                :key="idx"
                theme="warning"
                variant="light-outline"
                @click="outputPojectMode = item.value"
                >{{ item.value }}</t-tag
              >
            </p>
          </div>
          <div class="flex gap-1">
            <t-dropdown
              :options="projectModeList"
              @click="(item) => (outputPojectMode = (item.value as string))"
            >
              <t-button>{{ outputPojectMode }}</t-button>
            </t-dropdown>
          </div>
        </div>
        <t-divider class="my-2"></t-divider>

        <!-- ------------------------- 【 河道选择 】 ------------------------- -->
        <div class="flex items-center justify-between mt-2">
          <div class="flex flex-col items-start justify-between">
            <h2 class="SwiperSetp__h2"><strong>河道选择</strong></h2>
            <p>使用哪个工况的河道作为模板河道</p>
          </div>
          <div class="flex gap-1">
            <t-dropdown
              :options="[
                { content: `工程前`, value: `工程前` },
                { content: `工程后`, value: `工程后` },
              ]"
              @click="(item) => (outputPojectMode = (item.value as string))"
            >
              <t-button>{{ riverSelect }}</t-button>
            </t-dropdown>
          </div>
        </div>
        <t-divider class="my-2"></t-divider>

        <!-- ------------------------- 【 网格间距 】 ------------------------- -->
        <div class="flex items-center justify-between mt-2">
          <div class="flex flex-col items-start justify-between">
            <h2 class="SwiperSetp__h2"><strong>网格间距</strong></h2>
            <p>河道数据点的间距（后期自动根据河道自动识别）</p>
          </div>
          <div class="flex gap-1">
            <t-input placeholder="25" class="w-[100px]" align="center"></t-input>
          </div>
        </div>
        <t-divider class="my-2"></t-divider>

        <!-- ------------------------- 【 流速范围 】 ------------------------- -->
        <div class="flex items-center justify-between mt-2">
          <div class="flex flex-col items-start justify-between">
            <h2 class="SwiperSetp__h2"><strong>流速范围</strong></h2>
            <p class="max-w-[90%]">
              大于这个长度的流速等值线才会被标注流速关系字段（不变，增大，减少）
            </p>
          </div>
          <div class="flex gap-1">
            <t-input placeholder="200" class="w-[100px]" align="center"></t-input>
          </div>
        </div>
        <t-divider class="my-2"></t-divider>

        <!-- ------------------------- 【 等值线序列 】 ------------------------- -->
        <div class="flex items-center justify-between mt-2">
          <div class="flex flex-col w-full gap-1">
            <h2 class="SwiperSetp__h2"><strong>等值线序列</strong></h2>
            <p class="max-w-[90%]">自定义等值线步进，使用分号 ";" 分割每个步进</p>
            <t-input
              v-model="counterSetp"
              :placeholder="defaultCounterSetp"
              class="w-[100%] text-sm"
              type="text"
              align="center"
            ></t-input>
          </div>
        </div>
        <t-divider class="my-2"></t-divider>
      </div>
    </div>

    <div class="h-full min-w-[450px] flex-grow-[999] right"></div>
  </section>
</template>

<script setup lang="ts">
const riverSelect = ref("工程后")

const defaultCounterSetp =
  "0.01;-0.01;0.03;-0.03;0.05;-0.05;0.1;-0.1;0.15;-0.15;0.2;-0.2;0;-0.3;0.3"
const counterSetp = ref("")

const outputExt = ref(".jpg")
const outputExtList = [
  { content: `.jpg`, value: `.jpg` },
  { content: `.jpeg`, value: `.jpeg` },
  { content: `.png`, value: `.png` },
]

const outputPojectType = ref("选择工况")
const projectTypeList = [
  { content: `10年一遇`, value: `10年一遇` },
  { content: `20年一遇`, value: `20年一遇` },
  { content: `50年一遇`, value: `50年一遇` },
  { content: `100年一遇`, value: `100年一遇` },
  { content: `200年一遇`, value: `200年一遇` },
]

const outputPojectMode = ref("选择类型")
const projectModeList = [
  { content: `以洪为主`, value: `以洪为主` },
  { content: `以潮为主`, value: `以潮为主` },
]

// const formData = {
//   be_dfsu: "",
//   af_dfsu: "",
// }
</script>

<style lang="stylus" scoped>
.SwiperSetp__h2{
  @apply text-xl text-slate-600
}
</style>
