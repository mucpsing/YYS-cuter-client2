<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-06-28 08:59:23
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-08-08 21:09:14
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\body\SwiperSetp3.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <section
    :class="['flex flex-col w-full gap-2', 'flex-grow-[2]', 'rounded-xl p-2 whitespace-nowrap']"
  >
    <div class="flex flex-row gap-2">
      <!-- echart 范围截取组件 -->
      <div class="flex-col flex-1">
        <t-card title="范围选择">
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
            :draw-rect-size="currtPaper"
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
                :options="fileStore.geoJsonOptions"
                v-model="currtSelectDfsuName"
                class="min-w-[100px] w-full"
                :onChange="(value) => onSelectRangeFile(value as string)"
              >
              </t-select>
            </t-form-item>

            <!-- 稀释折点 -->
            <t-form-item label="稀释折点" name="name" label-align="left" initial-data="TDesign">
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
            </t-form-item>

            <!-- 稀释折点的快捷标签 -->
            <t-form-item label=" " name="name" label-align="left" initial-data="TDesign">
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
            </t-form-item>

            <!-- 输出尺寸 -->
            <t-form-item label="输出尺寸" name="name" label-align="left" initial-data="TDesign">
              <div class="flex flex-wrap flex-row gap-2 max-w-[200px]">
                <template v-for="(item, idx) in paperSizeList" :key="idx">
                  <t-button
                    @click="() => (currtPaper = item.value)"
                    variant="outline"
                    size="small"
                    :theme="(themeList[idx] as TBtnThemeT)"
                  >
                    {{ `${item.label} (${item.value})` }}
                  </t-button>
                </template>
              </div>
            </t-form-item>

            <!-- 输出尺寸 -->
            <t-form-item label="其他操作" name="name" label-align="left" initial-data="TDesign">
              <div class="flex flex-row items-center justify-center gap-2">
                <div class="flex items-center justify-center gap-2">
                  <strong>视图框</strong>
                  <t-switch v-model="localStore.showRect">选择框</t-switch>
                </div>
              </div>
            </t-form-item>
          </t-form>

          <template #footer>
            <div>
              <t-button @click="test" theme="success" class="w-full"> 保存范围到本地</t-button>
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
const fileStore = useFileStroe()
const tabStore = useGisApiTabStore()

const currtSelectDfsuName = ref("")
const currtRangeGeoJson = ref<any[]>([])
const echartGeoJsonRef = ref<HTMLElement & { resize: () => void }>()
function test() {
  console.log(echartGeoJsonRef)
}
const localStore = reactive({
  width: 520,
  height: 380,
  showRect: true,
  maxLinkPoint: 50,
})

const currtPaper = ref("297x210")
const paperSizeList = [
  { label: "A4", value: "297x210" },
  { label: "A3", value: "420x297" },
  { label: "A2", value: "594x420" },
  { label: "A1", value: "842x594" },
]
const themeList = [
  "primary",
  "danger",
  "warning",
  "success",
  "primary",
  "danger",
  "warning",
  "success",
]

async function onSelectRangeFile(md5: string) {
  currtRangeGeoJson.value[0] = await fileStore.getGeoJsonByMd5(md5)
}

onMounted(() => {
  // 初始化时，如果有文件信息，则默认绘制一个
  if (fileStore.geoJsonOptions.length > 0 && currtSelectDfsuName.value == "") {
    let md5 = ""
    if (tabStore.currtFormData.beDfsuInfo) {
      md5 = tabStore.currtFormData.beDfsuInfo.md5
    } else if (tabStore.currtFormData.afDfsuInfo) {
      md5 = tabStore.currtFormData.afDfsuInfo.md5
    } else {
      // 当前所有都为空

      if (Object.keys(fileStore.geoJsonObj).length > 0) {
        md5 = fileStore.geoJsonObj.keys()[0]
      }
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
