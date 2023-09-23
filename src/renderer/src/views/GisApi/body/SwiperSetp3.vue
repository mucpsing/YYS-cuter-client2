<template>
  <section :class="['flex flex-row w-full gap-2', 'flex-grow-[2]', 'rounded-xl p-2']">
    <div class="h-full flex-grow-[1] left bg-gray-100 rounded-md overflow-auto">
      <div class="py-2 pl-3 pr-4 h-[0]">
        <!-- --------------- 【 工程范围 】 --------------- -->
        <div class="flex items-center justify-between mt-2">
          <div class="flex flex-col items-start justify-between">
            <h2 class="SwiperSetp__h2"><strong>工程范围</strong></h2>
            <p class="flex gap-2">
              请选择完整的shp文件，包含格式如下：
              <t-tag
                variant="light-outline"
                theme="success"
                v-for="(ext, idx) of ['.cpg', '.dbf', '.sbn', '.sbx', '.shp', '.shx', '.shp.xml']"
                :key="idx"
              >
                {{ ext }}
              </t-tag>
            </p>
          </div>
          <div class="flex gap-1">
            <t-button theme="danger" variant="outline">选择工程范围文件(.shp)</t-button>
          </div>
        </div>
        <t-divider class="my-2"></t-divider>

        <input type="file" style="display: none" accept=".cpg,.dbf,.sbn,.sbx,.shp,.shx,.shp.xml" />

        <!-- --------------- 【 河道选择 】 --------------- -->
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
              @click="(item) => (riverSelect = (item.value as string))"
            >
              <t-button variant="outline" theme="primary">{{ riverSelect }}</t-button>
            </t-dropdown>
          </div>
        </div>
        <t-divider class="my-2"></t-divider>

        <!-- --------------- 【 模型数据 】 --------------- -->
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

        <!-- --------------- 【 流速范围 】 --------------- -->
        <div class="flex items-center justify-between mt-2">
          <div class="flex flex-col items-start justify-between">
            <h2 class="SwiperSetp__h2"><strong>流速范围</strong></h2>
            <p class="max-w-[80%]">
              大于这个长度的流速等值线才会被标注流速关系字段（不变，增大，减少）
            </p>
          </div>
          <div class="flex gap-1">
            <t-input placeholder="200" class="w-[100px]" align="center"></t-input>
          </div>
        </div>
        <t-divider class="my-2"></t-divider>

        <!-- --------------- 【 等值线序列 】 --------------- -->
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

    <!-- <div class="h-full min-w-[450px] flex-grow-[999] right"></div> -->
  </section>
</template>

<script setup lang="ts">
const riverSelect = ref("工程后")

const defaultCounterSetp =
  "0.01;-0.01;0.03;-0.03;0.05;-0.05;0.1;-0.1;0.15;-0.15;0.2;-0.2;0;-0.3;0.3"
const counterSetp = ref("")

const outputPojectMode = ref("选择类型")

const formData = {
  be_dfsu: "",
  af_dfsu: "",
}
</script>

<style lang="stylus">
.SwiperSetp__h2{
  @apply text-xl text-slate-600
}
</style>
