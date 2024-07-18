<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-06-28 08:59:23
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-07-18 11:24:25
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\body\SwiperSetp3.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <section
    :class="['flex flex-col w-full gap-2', 'flex-grow-[2]', 'rounded-xl p-2 whitespace-nowrap']"
  >
    <div class="flex flex-row gap-2">
      <div class="flex-col flex-1">
        <t-card title="范围选择">
          <EchartGeoJson :show="true" :geo-json="data" />
        </t-card>
      </div>

      <div class="flex-col flex-grow-[111] flex-1 h-full">
        <t-card
          title="基础配置"
          :class="['w-full h-full min-w-[200px]', 'fix__t-card-fix-center flex-col flex']"
        >
          <template #actions>
            <t-button @click="" variant="text" theme="primary">本地上传</t-button>
          </template>
          <t-form labelWidth="80px" class="h-full">
            <t-form-item label="选择范围" name="name" label-align="left" initial-data="TDesign">
              <t-select v-model="currtSelectDfsuName" class="min-w-[120px] w-[120px]">
                <t-option
                  v-for="(item, index) in [
                    { value: '1', label: '1' },
                    { value: '2', label: '2' },
                  ]"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                >
                  {{ item.label }}
                </t-option>
              </t-select>
            </t-form-item>
          </t-form>

          <template #footer>
            <t-button theme="success" class="w-full"> 保存范围到本地</t-button>
          </template>
        </t-card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import EchartGeoJson from "@gisapi/_components/echartGeoJson/index.vue"
import data from "@gisapi/_components/echartGeoJson/testData"

// const currtDfsu = ref<any>(null)
const currtSelectDfsuName = ref("")

function test(dfsu: any) {
  console.log(data)
}
</script>

<style lang="stylus">
.fix__t-card-fix-center>.t-card__body{
    flex-grow: 111
}
</style>
