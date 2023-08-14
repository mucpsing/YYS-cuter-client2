<script setup lang="ts">
const msg = ref("ccvb");
</script>

<template>
  <div>
    <div>msg: {{ msg }}</div>
    <div class="bg-red-400 w-[100px] h-[100px] text-white">tailwindcss</div>
    <div class="test">stylus</div>
  </div>
</template>

<style lang="stylus">
.test {
  background #000
  color #fff
  width 100px
  height 100px
}
</style>
