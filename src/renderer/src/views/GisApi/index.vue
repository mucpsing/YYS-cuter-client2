<template>
  <section :class="['text-xs md:text-md xl:text-xl', 'h-full bg-yellow-100']">
    <GisApiHeader></GisApiHeader>
    <GisApiBody></GisApiBody>
  </section>
</template>

<script lang="ts">
import GisApiHeader from "./header.vue"
import GisApiBody from "./body/index.vue"
export default {
  components: { GisApiHeader, GisApiBody },
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
