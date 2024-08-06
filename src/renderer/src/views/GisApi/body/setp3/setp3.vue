<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-06-28 08:59:23
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-08-06 16:14:05
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
          <p>{{}}</p>
          <EchartGeoJson
            :show="true"
            v-model:rect="currtRect"
            :geo-json="currtRangeGeoJson"
            :maxLinkPoint="maxLinkPoint"
            :draw-rect-size="currtPaper"
            :width="localStore.width"
            :height="localStore.height"
          />
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
                :options="fileStore.geoJsonOptions"
                v-model="currtSelectDfsuName"
                class="min-w-[100px] w-full"
                :onChange="(value) => onSelectRangeFile(value)"
              >
              </t-select>
            </t-form-item>

            <t-form-item label="稀释折点" name="name" label-align="left" initial-data="TDesign">
              <t-slider
                :max="600"
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
              <div class="flex flex-row gap-[5px]">
                <template
                  v-for="(theme, idx) in ['primary', 'danger', 'warning', 'success']"
                  :key="theme"
                >
                  <t-button
                    @click="() => (maxLinkPoint = 100 * (1 + idx))"
                    variant="outline"
                    size="small"
                    :theme="theme"
                  >
                    {{ 100 * (1 + idx) }}
                  </t-button>
                </template>
              </div>
            </t-form-item>

            <t-form-item label="输出尺寸" name="name" label-align="left" initial-data="TDesign">
              <div class="flex flex-row justify-start w-full h-full gap-2 p-2">
                <div
                  :class="[
                    'border-2 border-yellow-400 ',
                    'w-[148.5px] h-[105px] bg-red-300',
                    'text-center flex flex-col justify-center items-center',
                  ]"
                >
                  <strong>{{ currtPaper }}</strong>
                </div>

                <div class="flex flex-col gap-1">
                  <template v-for="(item, idx) in paperSizeList" :key="idx">
                    <t-button
                      @click="() => (currtPaper = item.value)"
                      variant="outline"
                      size="small"
                      :theme="themeList[idx]"
                      class="w-12"
                    >
                      {{ item.label }}
                    </t-button>
                  </template>
                </div>
              </div>
            </t-form-item>
          </t-form>

          <template #footer>
            <div>
              <t-input-number :setp="20" v-model="localStore.width"></t-input-number>
              <t-input-number :setp="20" v-model="localStore.height"></t-input-number>
            </div>
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
import EchartGeoJson from "./echartGeoJson.vue"
import { useGisApiTabStore, useFileStroe } from "@gisapi/store/index"

const fileStore = useFileStroe()
const tabStore = useGisApiTabStore()
const maxLinkPoint = ref(50)
const currtSelectDfsuName = ref("")
const currtRangeGeoJson = ref<any[]>([])
const currtRect = ref([])

const localStore = reactive({
  width: 520,
  height: 380,
})

watch(currtRect, (n, o) => {
  console.log("触发更新")
  console.log({ n, o })
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
function test() {
  console.log(tabStore.formDataList)
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
