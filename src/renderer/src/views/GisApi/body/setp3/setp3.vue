<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-06-28 08:59:23
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2025-08-20 16:40:01
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\body\SwiperSetp3.vue
 * @Description: 展示河道，数据是从后端返回的geojson格式
-->
<template>
  <section
    :class="['flex flex-col w-full gap-2', 'flex-grow-[2]', 'rounded-xl p-2 whitespace-nowrap']"
  >
    <div class="flex flex-row gap-2">
      <!-- echart 范围截取组件 -->
      <div class="flex-col flex-1">
        <t-card title="范围预览">
          <template #actions>
            <t-button @click="echartGeoJsonRef?.resize" variant="text" theme="primary"
              >重置视图</t-button
            >
          </template>
          <EchartGeoJson
            ref="echartGeoJsonRef"
            :show="true"
            v-model:rect="tabStore.currtFormData.projectPoints"
            :geo-json="currtRangeGeoJson"
            :maxLinkPoint="localStore.maxLinkPoint"
            :draw-rect-size="localStore.currtPaper"
            :width="localStore.width"
            :height="localStore.height"
            :showRect="localStore.showRect"
          />
        </t-card>
      </div>

      <!-- 配置项 -->
      <div class="flex-col flex-grow-[111] flex-1 h-full">
        <t-card
          title="基础配置"
          :class="['w-full h-full min-w-[180px]', 'fix__t-card-fix-center flex-col flex']"
        >
          <template #actions>
            <t-button @click="" variant="text" theme="primary">本地上传</t-button>
          </template>
          <t-form labelWidth="70px" class="h-full">
            <!-- 范围选择 -->
            <t-form-item label="选择范围" name="name" label-align="left" initial-data="TDesign">
              <t-select
                :options="geoJsonOptions"
                v-model="localStore.currtSelectDfsuName"
                :onChange="(value) => onSelectRangeFile(value as string)"
              >
              </t-select>
            </t-form-item>

            <!-- 稀释折点 -->
            <t-form-item label="稀释折点" name="name" label-align="left" initial-data="TDesign">
              <div class="w-full">
                <div>
                  <t-slider
                    :max="600"
                    :min="10"
                    :step="10"
                    v-model="localStore.maxLinkPoint"
                    :show-tooltip="true"
                    :input-number-props="{
                      theme: 'column',
                    }"
                  />
                </div>

                <div class="flex flex-row gap-[5px]">
                  <template
                    v-for="(theme, idx) in ['primary', 'danger', 'warning', 'success']"
                    :key="theme"
                  >
                    <t-button
                      @click="() => (localStore.maxLinkPoint = 100 * (1 + idx))"
                      variant="outline"
                      size="small"
                      :theme="(theme as TBtnThemeT)"
                    >
                      {{ 100 * (1 + idx) }}
                    </t-button>
                  </template>
                </div>
              </div>
            </t-form-item>

            <!-- 输出尺寸 -->
            <t-form-item label="输出尺寸" name="name" label-align="left" initial-data="TDesign">
              <div class="flex flex-row flex-wrap gap-2">
                <template v-for="(item, idx) in paperSizeOptions" :key="idx">
                  <t-button
                    @click="() => (localStore.currtPaper = item.value)"
                    variant="outline"
                    size="small"
                    :theme="(themeListTab[idx] as TBtnThemeT)"
                  >
                    {{ `${item.label} (${item.value})` }}
                  </t-button>
                </template>
              </div>
            </t-form-item>

            <!-- 项目范围 -->
            <t-form-item label="其他设置">
              <div class="flex flex-col gap-2">
                <div class="flex items-center justify-center gap-4">
                  <div class="flex gap-2">
                    <t-select
                      v-model="localStore.projectRangeModel"
                      :loading="localStore.projectRangeLoadding"
                      @change="onProjectRangeModelChange"
                    >
                      <t-option key="auto" label="自动生成" value="auto" />
                      <t-option key="user" label="手动上传" value="user" />
                    </t-select>
                  </div>

                  <div v-show="localStore.projectRangeModel == 'user'">
                    <t-button
                      :loading="localStore.projectRangeLoadding"
                      size="small"
                      theme="danger"
                      @click="test"
                      >X</t-button
                    >
                  </div>
                </div>
                <div class="flex items-center justify-start gap-2">
                  <strong>视图框</strong>
                  <t-switch v-model="localStore.showRect">选择框</t-switch>
                </div>
              </div>
            </t-form-item>
          </t-form>

          <template #footer>
            <div>
              <t-button @click="test" theme="success" class="w-full">保存范围到本地</t-button>
            </div>
          </template>
        </t-card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import EchartGeoJson from "./echartGeoJson/index.vue"
import { useGisApiTabStore, useFileStroe } from "@gisapi/store/index"
import type { TBtnThemeT } from "@gisapi/Types"
import { getDfsuDifferenceToGeoJson } from "@gisapi/utils/server"

const currtRangeGeoJson = ref<any[]>([])
const echartGeoJsonRef = ref<
  HTMLElement & { resize: () => void; addProjectRange: (geojson: any) => void }
>()

const fileStore = useFileStroe()
const tabStore = useGisApiTabStore()
const localStore = reactive({
  width: 520,
  height: 380,
  showRect: true,
  maxLinkPoint: 50,
  currtSelectDfsuName: "",
  currtPaper: "297x210",
  projectRangeLoadding: false,
  projectRangeModel: "auto", // auto | user
})

const paperSizeOptions = [
  { label: "A4", value: "297x210" },
  { label: "A3", value: "420x297" },
  { label: "A2", value: "594x420" },
  { label: "A1", value: "842x594" },
]

const themeListTab = [
  "primary",
  "danger",
  "warning",
  "success",
  "primary",
  "danger",
  "warning",
  "success",
]

async function onProjectRangeModelChange() {
  if (localStore.projectRangeModel == "auto") {
    // 调用远程的接口生成两个dfsu之间的差值
    if (geoJsonOptions.value.length < 2) return

    const diff_geojson = await getDfsuDifferenceToGeoJson(
      tabStore.currtFormData.beDfsuMd5List[0].md5,
      tabStore.currtFormData.afDfsuMd5List[0].md5,
    )

    if (diff_geojson && echartGeoJsonRef.value) {
      echartGeoJsonRef.value.addProjectRange(diff_geojson.geojson)
    }
  }
}

async function test() {}

// 【选择范围】的下拉选项列表，根据当前所选的tab动态生成
const geoJsonOptions = computed<{ value: string; label: string }[]>(() => {
  const options: { value: string; label: string }[] = []

  const fileList = [
    ...tabStore.currtFormData.afDfsuMd5List,
    ...tabStore.currtFormData.beDfsuMd5List,
  ]

  for (const fileInfo of fileList) {
    if (Object.keys(fileStore.dfsuObj).includes(fileInfo.md5)) {
      options.push({
        value: fileInfo.md5,
        label: fileStore.dfsuObj[fileInfo.md5].name,
      })
    }
  }
  return options
})

// 【选择范围】根据选择的范围绘制
async function onSelectRangeFile(md5: string) {
  currtRangeGeoJson.value[0] = await fileStore.getGeoJsonByMd5(md5)
}

onMounted(() => {
  // 初始化时，则默认绘制一个河道
  if (localStore.currtSelectDfsuName == "" && geoJsonOptions.value.length > 0) {
    onSelectRangeFile(geoJsonOptions.value[0].value)
    localStore.currtSelectDfsuName = geoJsonOptions.value[0].label

    onProjectRangeModelChange()
  }
})
</script>

<style lang="stylus">
.fix__t-card-fix-center>.t-card__body{
  flex-grow: 111
}
</style>
