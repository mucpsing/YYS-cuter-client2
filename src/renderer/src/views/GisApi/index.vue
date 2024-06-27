<!--
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-06-21 21:40:50
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-06-27 12:52:52
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <section v-if="isReady" :class="['text-xs md:text-md xl:text-xl', 'h-full bg-gray-100']">
    <GisApiHeader></GisApiHeader>
    <GisApiBody></GisApiBody>
  </section>
</template>

<script lang="ts">
import GisApiHeader from "./header.vue"
import GisApiBody from "./body/index.vue"

export default {
  components: { GisApiHeader, GisApiBody },
  data() {
    return {
      isReady: false,
    }
  },
  mounted() {
    setTimeout(() => {
      this.isReady = true
    }, 1000)
  },
  setup() {
    return {}
  },
}
</script>
<style lang="stylus">
.cps__scroll_style{
  &::-webkit-scrollbar {
    width 5px
  }
  &::-webkit-scrollbar-thumb{
    width 2px
    @apply bg-orange-300
  }
}

.GisApi__global{

}
</style>
