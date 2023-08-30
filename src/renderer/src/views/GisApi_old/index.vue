<template>
  <section :class="['h-full bg-yellow-100']">
    <GisApiHeader></GisApiHeader>
    <GisApiBody></GisApiBody>
  </section>
</template>

<script lang="ts">
import GisApiHeader from "./header.vue"
import GisApiBody from "./body.vue"
export default {
  components: { GisApiHeader, GisApiBody },
  setup() {
    return {}
  },
}
</script>

<style lang="scss" scoped></style>
