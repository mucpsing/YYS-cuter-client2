<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-06-28 08:59:23
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-07-18 21:37:00
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
          <EchartGeoJson :show="true" :geo-json="currtRangeGeoJson" />
        </t-card>
      </div>

      <div class="flex-col flex-grow-[111] flex-1 h-full">
        <t-card
          title="基础配置"
          :class="['w-full h-full min-w-[180px]', 'fix__t-card-fix-center flex-col flex']"
        >
          <template #actions>
            <t-button @click="" variant="text" theme="primary">本地上传</t-button>
          </template>
          <t-form labelWidth="70px" class="h-full">
            <t-form-item label="选择范围" name="name" label-align="left" initial-data="TDesign">
              <t-select
                :options="rangeFileSelectOptions"
                v-model="currtSelectDfsuName"
                class="min-w-[120px] w-full"
                @change="(value) => onSelectRangeFile(value)"
              >
              </t-select>
            </t-form-item>
          </t-form>

          <template #footer>
            <t-button @click="test" theme="success" class="w-full"> 保存范围到本地</t-button>
          </template>
        </t-card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import EchartGeoJson from "@gisapi/_components/echartGeoJson/index.vue"
import { formDataList, currtFormDataId } from "@gisapi/store/state"

const currtRangeGeoJson = ref<any[]>([])

const rangeFileSelectOptions = computed(() => {
  if (formDataList.value.length == 0) return []

  const beInfo = formDataList.value[currtFormDataId.value].beDfsuInfo
  const afInfo = formDataList.value[currtFormDataId.value].afDfsuInfo

  if (!beInfo || !beInfo.range_geojson) return []
  if (!afInfo || !afInfo.range_geojson) return []

  const rangeFileInfoList = [
    { value: beInfo.md5, label: beInfo.name },
    { value: afInfo.md5, label: afInfo.name },
  ]

  return rangeFileInfoList
})

function onSelectRangeFile(md5: string) {
  const beInfo = formDataList.value[currtFormDataId.value].beDfsuInfo
  const afInfo = formDataList.value[currtFormDataId.value].afDfsuInfo

  if (beInfo.md5 == md5) {
    currtRangeGeoJson.value[0] = beInfo.range_geojson
    console.log(md5)
  } else if (afInfo.md5 == md5) {
    currtRangeGeoJson.value[0] = afInfo.range_geojson
    console.log(md5)
  } else {
    console.log("geosjon不在上传的dfsu之列")
  }
}

// const currtDfsu = ref<any>(null)
const currtSelectDfsuName = ref("")

function test(dfsu: any) {
  console.log(formDataList.value)
  console.log(rangeFileSelectOptions)
}
</script>

<style lang="stylus">
.fix__t-card-fix-center>.t-card__body{
    flex-grow: 111
}
</style>
