<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-06-28 08:59:23
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-07-24 10:46:50
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
          <EchartGeoJson :show="true" :geo-json="currtRangeGeoJson" :maxLinkPoint="maxLinkPoint" />
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
                :onChange="(value) => onSelectRangeFile(value)"
              >
              </t-select>
            </t-form-item>

            <t-form-item label="稀释折点" name="name" label-align="left" initial-data="TDesign">
              <t-slider
                :max="300"
                :min="10"
                :step="10"
                v-model="maxLinkPoint"
                :show-tooltip="true"
                :input-number-props="{
                  theme: 'column',
                }"
              />
            </t-form-item>

            <t-form-item label=" " name="name" label-align="left" initial-data="TDesign">
              <div class="flex flex-row gap-[10px]">
                <template
                  v-for="(theme, idx) in ['primary', 'danger', 'warning', 'success', 'default']"
                  :key="theme"
                >
                  <t-button
                    @click="() => (maxLinkPoint = 30 * (1 + idx))"
                    variant="outline"
                    size="small"
                    :theme="theme"
                  >
                    {{ 30 * (1 + idx) }}
                  </t-button>
                </template>
              </div>
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

const currtSelectDfsuName = ref("")
const currtRangeGeoJson = ref<any[]>([])
const maxLinkPoint = ref(50)

// 动态计算范围文件列表
const rangeFileSelectOptions = computed(() => {
  if (formDataList.value.length == 0) return []

  console.log("触发: rangeFileSelectOptions")

  const beInfo = formDataList.value[currtFormDataId.value].beDfsuInfo
  const afInfo = formDataList.value[currtFormDataId.value].afDfsuInfo
  const rangeFileInfoList: { value: string; label: string }[] = []

  if (beInfo && beInfo.range_geojson)
    rangeFileInfoList.push({ value: beInfo.md5, label: beInfo.name })
  if (afInfo && afInfo.range_geojson)
    rangeFileInfoList.push({ value: afInfo.md5, label: afInfo.name })

  return rangeFileInfoList
})

function onSelectRangeFile(md5: string) {
  console.log("触发: onSelectRangeFile")

  const beInfo = formDataList.value[currtFormDataId.value].beDfsuInfo
  const afInfo = formDataList.value[currtFormDataId.value].afDfsuInfo

  if (beInfo.md5 == md5) {
    currtRangeGeoJson.value[0] = beInfo.range_geojson
  } else if (afInfo.md5 == md5) {
    currtRangeGeoJson.value[0] = afInfo.range_geojson
  } else {
    console.log("geosjon不在上传的dfsu之列")
  }
}

function test() {
  console.log(formDataList.value)
  console.log(rangeFileSelectOptions)
}

onMounted(() => {
  // 初始化时，如果有文件信息，则默认绘制一个
  if (rangeFileSelectOptions.value.length > 0 && currtSelectDfsuName.value == "") {
    console.log("进行初始化")
    let md5 = ""
    if (formDataList.value[currtFormDataId.value].beDfsuInfo) {
      md5 = formDataList.value[currtFormDataId.value].beDfsuInfo.md5
    } else if (formDataList.value[currtFormDataId.value].afDfsuInfo) {
      md5 = formDataList.value[currtFormDataId.value].afDfsuInfo.md5
    }

    if (md5) {
      onSelectRangeFile(md5)
      currtSelectDfsuName.value = md5
    }
  }
})
</script>

<style lang="stylus">
.fix__t-card-fix-center>.t-card__body{
  flex-grow: 111
}
</style>
