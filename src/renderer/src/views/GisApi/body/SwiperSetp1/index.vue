<!--
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-06-30 16:27:08
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-07-22 10:23:31
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\body\SwiperSetp1\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-09-26 14:23:33
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-06-30 16:38:36
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\body\SwiperSetp1.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <section :class="['flex flex-col w-full', 'flex-grow-[2]', 'overflow-hidden', ' rounded-md p-2']">
    <section :class="['parent', 'h-full', 'flex flex-row gap-4 ', 'bg-white']">
      <div :class="['flex flex-col gap-4 flex-1 h-full']">
        <t-card title="模板配置" :bordered="true" :style="{ flex: 1 }">
          <template #actions>
            <t-button @click="selectLocalTemplate" variant="text" theme="primary"
              >使用本地mxd</t-button
            >
          </template>

          <div :class="['flex-col flex-[111] flex gap-8 justify-around', 'h-full']">
            <div :class="['flex flex-col', 'flex-1  flex-grow-[11]']">
              <div
                :class="[
                  'border-2 border-sky-400',
                  'h-full w-full',
                  'flex-[111] flex-grow-[11] p-4',
                ]"
              >
                <t-image
                  :class="['min-w-[200px] min-h-[200px]']"
                  :error="'未选择任何模板'"
                ></t-image>
              </div>

              <h3>{{ currtMxdName }}</h3>
              <p>{{ currtMxdDocs }}</p>
            </div>

            <t-space direction="vertical" size="10px">
              <t-input-adornment prepend="1、输出名称：">
                <t-select-input
                  :id="`Gis-Api__template_input_mxd_name_${currtFormDataList[currtFormDataId].id}`"
                  :value="currtFormDataList[currtFormDataId].title"
                  :popup-visible="tipWrodsPopupVisible"
                  :popup-props="{ overlayInnerStyle: { padding: '0px' } }"
                  placeholder="点击列出常用命名推荐"
                  allow-input
                  clearable
                  @input-change="onTitleChange"
                  @popup-visible-change="(val) => (tipWrodsPopupVisible = val)"
                >
                  <template #panel>
                    <ul class="">
                      <li
                        class="w-full p-2 cursor-pointer hover:bg-gray-200"
                        v-for="item in outNameTipWordsList"
                        :key="item"
                        @click="() => onTitleWithPopupChange(item)"
                      >
                        {{ item }}
                      </li>
                    </ul>
                  </template>
                </t-select-input>
              </t-input-adornment>

              <div class="flex flex-wrap gap-2 mb-4 whitespace-nowrap">
                <template v-for="(item, idx) of outNameTipWordsList" :key="idx">
                  <t-tag
                    @click="() => onTitleWithPopupChange(outNameTipWordsList[idx])"
                    class="cursor-pointer"
                    size="small"
                    :theme="outputNameTagList[idx].theme"
                    :variant="outputNameTagList[idx].variant"
                    >{{ item }}</t-tag
                  >
                </template>
              </div>

              <t-input-adornment prepend="2、选择模板：">
                <t-auto-complete
                  class="Gis-Api__template_input_select"
                  v-model="currtFormDataList[currtFormDataId].mxdName"
                  :options="template_name_list"
                  placeholder="从右方【模板列表】中选择"
                  clearable
                  highlight-keyword
                  filterable
                  @change="onSelectInputHandler"
                  @clear="
                    () => {
                      console.log('clear')
                      currtFormDataList[currtFormDataId].mxdId = -1
                      currtFormDataList[currtFormDataId].mxdName = ''
                    }
                  "
                >
                  <template #suffixIcon><SearchIcon /></template>
                </t-auto-complete>
              </t-input-adornment>
            </t-space>
          </div>
        </t-card>
      </div>

      <div :class="['flex-1 h-full', 'py-[16px] px-[16px] border-1 border rounded-md']">
        <TemplateList />
      </div>

      <!-- <GuideSetp></GuideSetp> -->
    </section>
  </section>
</template>

<script setup lang="tsx">
import { SearchIcon } from "tdesign-icons-vue-next"
// import GuideSetp from "@gisapi/_components/guide.vue"

import { templateInfo, keyWord, data } from "@gisapi/store/data"
import { currtFormDataId, currtMxdName } from "@gisapi/store/state"
import { formDataList as currtFormDataList, DEFAULT_TEMPLATE_OUTNAME } from "@gisapi/store/state"

import { isGisServerConnected } from "@gisapi/store/state"

import { swtichCommonTemplate } from "./event"

import TemplateList from "./templateList.vue"

onMounted(() => {
  console.log("setp1 on mounted")
  if (isGisServerConnected.value) {
  }
})

const outNameTipWordsList = ref(keyWord) // 提示词列表
const tipWrodsPopupVisible = ref(false) // 是否显示提示列表的状态

const template_name_list = computed(() =>
  templateInfo.value.map((item) => `${item.template_id}-${item.template_name}`),
)

const currtMxdDocs = ref("")

const variantList = ["dark", "light", "outline", "light-outline"]
const themeList = ["primary", "warning", "danger", "success"]
function crossCombineThemesAndVariants(
  themeList: string[],
  variantList: string[],
): { theme: string; variant: string }[] {
  return variantList.flatMap((variant) => themeList.map((theme) => ({ theme, variant })))
}

const outputNameTagList = crossCombineThemesAndVariants(themeList, variantList)

const selectLocalTemplate = () => {
  // 选择本地模板，弹出文件选择
  // 校验文件
}

const onSelectInputHandler = (s: string) => {
  // console.log(s)
  if (!s) return

  // 假设模板ID和模板名称之间只有一个中文字符的顿号
  const parts = s.trim().split("-")

  // 检查是否只有两个部分（ID和名称）
  if (parts.length !== 2) {
    throw new Error(`无效的输入字符串格式: ${s}, 预期格式为 'ID-Name'。`)
  }

  // 尝试将ID部分转换为整数
  const template_id = parseInt(parts[0], 10)
  if (isNaN(template_id)) {
    throw new Error("无效的模板ID。预期为整数。")
  }

  // 名称部分直接作为字符串使用
  const template_name = parts[1]

  // 构造并返回对象
  swtichCommonTemplate({ template_id, template_name })
}

/**
 * @description: 输入新标题时，同步tab标题显示的函数
 */
async function onTitleChange(newTitle: string) {
  currtFormDataList.value[currtFormDataId.value].title = newTitle
  data.value[currtFormDataId.value].label = newTitle
}

/**
 * @description: 选择了常用后缀的触发函数
 */
async function onTitleWithPopupChange(new_popup: string) {
  let newTitle: string
  if (
    ["", DEFAULT_TEMPLATE_OUTNAME].includes(currtFormDataList.value[currtFormDataId.value].title)
  ) {
    newTitle = new_popup
  } else {
    newTitle = `${currtFormDataList.value[currtFormDataId.value].title}_${new_popup}`
  }

  currtFormDataList.value[currtFormDataId.value].title = newTitle
  data.value[currtFormDataId.value].label = newTitle
  tipWrodsPopupVisible.value = false
}
</script>
