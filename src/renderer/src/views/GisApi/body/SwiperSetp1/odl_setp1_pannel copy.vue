<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-06-21 16:10:44
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-06-21 22:40:21
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\_components\test.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @Description: 样式不太好看，保留这个样式暂不使用。
-->
<template>
  <section :class="['parent', 'h-full', 'flex flex-col', 'bg-white']">
    <div class="w-full h-0 flex-grow-[2]">
      <!-- 设置了height 0 的元素内部元素要设置可以滚动 -->
      <div class="h-full overflow-auto">
        <!-- 这里的子元素是动态获取，最终导致父级元素被撑开，无法完全使用合适的动态高度 -->
        <!-- 多包一层div是因为button使用flex后内容的布局特性不能跟div一样，所以这里套多一层 -->
        <div
          :class="['p-1 my-2']"
          v-for="(item, idx) of templateInfo"
          :key="idx"
          @click="() => clickHandler(item)"
        >
          <!-- 这里使用button是为了可以对已选择模板固定一个样式 -->
          <!-- 样式通过 focus: 来实现已选状态记录 -->
          <button
            :class="[
              'w-full px-2',
              'h-[150px]  bg-white  rounded-md',
              'flex items-center gap-4',
              'outline outline-offset-2 outline-1 outline-blue-100',
              'focus:outline-red-400 focus:outline-2',
              'hover:outline-blue-500 hover:outline-2',
              'hover:cursor-pointer',
            ]"
          >
            <img
              :src="item.preview"
              :class="['object-cover max-h-[100px]']"
              alt="请选择一个要导出的类型"
            />

            <div :class="['flex flex-col justify-start items-start']">
              <span>
                <strong>{{ `${item.template_id} - ${item.template_name}` }}</strong>
              </span>
              <p class="text-left">{{ item.description }}</p>
            </div>

            <span>1</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { templateInfo } from "../store/data"
import { currtFormDataId, currtTemplateId, formDataList } from "../store/state"

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
