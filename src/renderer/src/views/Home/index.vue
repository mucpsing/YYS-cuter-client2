<template>
  <section class="parent">
    <div class="son">
      <div class="child">
        {{ msg }}
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const msg = ref("This is Home Page")
</script>

<style lang="stylus">
.parent .child {
  background red
  height 300px
  width  300px
}
</style>
