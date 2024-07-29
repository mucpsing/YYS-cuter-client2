<template>
  <div class="fix__t-card-fix-center flex-grow-[1] flex" :loading="localStore.loading">
    <t-transfer
      class="flex w-full fix__t-transfer-w-full"
      :title="['工程前dfsu', '工程后dfsu']"
      :operation="['往左', '往右']"
      :data="beList"
      :v-model="afList"
      empty="拖拽或点击上传dfsu文件"
      :showCheckAll="false"
    />
  </div>
  <t-button @click="test">test</t-button>
</template>

<script setup lang="ts">
import { useGisApiTabStore, useGisApiStateStore } from "@gisapi/store/index"

const tabStore = useGisApiTabStore()
const glboalStore = useGisApiStateStore()
const localStore = reactive({
  loading: false,
})

const beList = ref([
  { value: "1", label: "工程前dfsu000000000000000000000000" },
  { value: "2", label: "工程前dfsu11111111111111" },
  { value: "3", label: "工程前dfsu222222222222222222222222222" },
  { value: "4", label: "工程前dfsu3333333333333333333333333" },
])
const afList = ref([])

function test() {
  console.log({ afList: afList.value.length, beList: beList.value.length })
  console.log({ afList: afList.value, beList: beList.value })
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
