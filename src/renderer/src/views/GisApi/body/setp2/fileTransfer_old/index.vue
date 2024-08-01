<!--
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-07-29 22:52:35
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-07-30 21:55:59
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\body\setp2\fileTransfer\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="fix__t-card-fix-center flex-grow-[1] flex" :loading="localStore.loading">
    <t-transfer
      v-model="localStore.options"
      class="flex w-full fix__t-transfer-w-full"
      :title="['工程前dfsu', '工程后dfsu']"
      :operation="['往左', '往右']"
      :data="beList"
      empty="拖拽或点击上传dfsu文件"
      :showCheckAll="false"
      @change="onChange"
    />
  </div>
  <t-button @click="test">test</t-button>
  
</template>

<script setup lang="ts">
import { useGisApiTabStore, useGisApiStateStore } from "@gisapi/store/index"
import type { TransferProps } from "tdesign-vue-next"
const tabStore = useGisApiTabStore()
const glboalStore = useGisApiStateStore()
const localStore = reactive({
  loading: false,
  options: [],
})

const beList = ref([
  { value: "1.dfsu", label: "工程前dfsu000000000000000000000000" },
  { value: "2.dfsu", label: "工程前dfsu11111111111111" },
  { value: "3.dfsu", label: "工程前dfsu222222222222222222222222222" },
  { value: "4.dfsu", label: "工程前dfsu3333333333333333333333333" },
])
const afList = ref([])
const checked = ref(["2"])

const onChange: TransferProps["onChange"] = (newTargetValue) => {
  console.log("newTargetValue", newTargetValue)
}
function test() {
  console.log({ afList: afList.value.length, beList: beList.value.length })
  console.log({ afList: afList.value, beList: beList.value })
  console.log({ checked })
}
</script>

<style lang="stylus">
.fix__t-transfer-w-full{
  &>.t-transfer__operations{
    flex-grow 0
    flex-shrink 0
    width 10%
  }

  &>.t-transfer__list{
    flex-grow 1
    width 40%
    // min-width 46%
  }
}
</style>
