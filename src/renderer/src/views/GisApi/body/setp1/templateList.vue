<!--
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-06-30 16:27:17
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-11-27 09:30:38
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\body\SwiperSetp1\templateList.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <t-loading
    text="获取列表中..."
    :loading="localStore.loading"
    size="small"
    :class="['flex-col flex gap-2 flex-1 h-full']"
  >
    <div :class="['mb-[16px] flex flex-row items-center justify-between']">
      <h3 :class="['text-base']">
        <strong>{{ `模板选择(${tabStore.templateInfoList.length})` }}</strong>
      </h3>
      <span>
        <t-button @click="updateTemplateList" variant="text" theme="primary">刷新列表</t-button>
      </span>
    </div>
    <div :class="['__scrollbar-bule', 'flex-col flex gap-4', 'h-full overflow-y-auto', 'pr-[8px]']">
      <template v-if="tabStore.templateInfoList.length > 0">
        <t-card
          v-for="item in tabStore.templateInfoList"
          :key="item.template_id"
          theme="poster2"
          class="cursor-pointer hover:bg-gray-300/10"
          @click="() => onClickTemplate(item)"
        >
          <div :class="['flex gap-4']">
            <t-image
              :key="item.template_name"
              :src="`${currtPreviewUrlHost}${item.preview}`"
              :style="{ height: '80px', width: '200px' }"
              :lazy="true"
              class="hover:opacity-75"
              @click="
                (e) => {
                  e.stopPropagation()
                  globalStore.showPreview(`${currtPreviewUrlHost}${item.preview}`)
                }
              "
            />

            <t-comment
              :author="`${item.template_id}-${item.template_name}`"
              :content="truncateText(item.description, 25)"
              @click="() => onClickTemplate(item)"
            />

            <div :class="['flex flex-col gap-2 items-center justify-center']">
              <t-button
                :style="{ width: '100%', height: '40px' }"
                theme="default"
                size="small"
                @click="() => onClickTemplate(item)"
              >
                选择模板
                <template #icon><GestureClickIcon :style="{ fontSize: '16px' }" /> </template>
              </t-button>
              <t-button
                :style="{ width: '100%' }"
                theme="success"
                disabled
                @click="() => console.log('下载mxd文件: ', item)"
                >下 载
                <template #icon><DownloadIcon :style="{ fontSize: '16px' }" /> </template>
              </t-button>
            </div>
          </div>
        </t-card>
      </template>
      <template v-else>
        <div>暂无模板列表</div>
      </template>
    </div>
  </t-loading>
</template>

<script setup lang="ts">
import { debounce } from "lodash"
import { DownloadIcon, GestureClickIcon } from "tdesign-icons-vue-next"

import { currtPreviewUrlHost } from "@gisapi/store/config"

import { truncateText } from "@gisapi/utils/index"
import { useGisApiTabStore, useGisApiStateStore } from "@gisapi/store/index"

const localStore = reactive({
  loading: false,
})

const tabStore = useGisApiTabStore()
const globalStore = useGisApiStateStore()

async function updateTemplateList() {
  localStore.loading = true

  await tabStore.getTemplateList()

  setTimeout(() => (localStore.loading = false), 1200)
}

const onClickTemplate = debounce((item) => {
  tabStore.setTemplateInfoToFormDataById(item.template_id)
}, 200)
</script>

<style scoped></style>
