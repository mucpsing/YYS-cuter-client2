<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-06-21 16:10:44
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-06-25 10:57:30
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\_components\test.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @Description: 样式不太好看，保留这个样式暂不使用。
-->
<template>
  <div class="mt-4 mb-3">
    <h3 :class="['text-base', 'font-bold']">模板列表({{ templateInfo.length }})</h3>
  </div>
  <section :class="['parent', 'h-full', 'flex flex-col', 'bg-white', 'border border-l']">
    <div class="w-full h-0 flex-grow-[2]">
      <!-- 设置了height 0 的元素内部元素要设置可以滚动 -->
      <div class="h-full overflow-auto">
        <div
          :size="10"
          direction="vertical"
          :style="{
            width: '100%',
            'padding-top': '12px',
            'padding-button': '12px',
            'padding-left': '20px',
            'padding-right': '8px',
          }"
        >
          <template v-for="(item, idx) in templateInfo" :key="idx">
            <t-card theme="poster2">
              <div
                :class="['flex gap-4', 'cursor-pointer', 'hover:bg-red-100/10']"
                @click="() => clickHandler(item)"
              >
                <t-image
                  :key="item.template_name"
                  :src="item.preview"
                  :style="{ height: '120px', width: '200px' }"
                  :lazy="true"
                />
                <t-comment
                  :author="item.template_name"
                  :content="item.description"
                  @click="() => console.log(123)"
                />
                <div :class="['flex flex-col gap-2 items-center justify-center']">
                  <t-button
                    :style="{ width: '100%', height: '40px' }"
                    theme="default"
                    class="form-submit"
                    @click="() => clickHandler(item)"
                    >点击选择<template #icon
                      ><GestureClickIcon :style="{ fontSize: '16px' }" /> </template
                  ></t-button>
                  <t-button
                    :style="{ width: '100%' }"
                    theme="success"
                    disabled
                    class="form-submit"
                    @click="() => clickHandler(item)"
                    >下 载
                    <template #icon><DownloadIcon :style="{ fontSize: '16px' }" /> </template>
                  </t-button>
                </div>
              </div>
            </t-card>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { templateInfo } from "@renderer/views/GisApi/store/data"
import { currtFormDataId, currtTemplateId, formDataList } from "@renderer/views/GisApi/store/state"
import { SearchIcon, DownloadIcon, GestureClickIcon } from "tdesign-icons-vue-next"
const template_name_list = computed(() =>
  templateInfo.value.map((item, idx) => `${idx}.${item.template_name}`),
)

/**
 * @description: 选择模板的处理函数
 */
const clickHandler = (item) => {
  if (item.template_id) {
    currtTemplateId.value = item.template_id
    formDataList.value[currtFormDataId.value].mxdId = item.template_id
    formDataList.value[
      currtFormDataId.value
    ].mxdName = `${item.template_id} - ${item.template_name} `
  }
}
</script>

<style scoped></style>
