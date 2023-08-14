<script setup lang="ts">
import { ref } from "vue";

const msg = ref("ccvb");
</script>

<template>
  <div>
    <div>{{ msg }}</div>
    <div class="bg-red-200 w-[100px] h-[100px]">2</div>
    <div class="test"></div>
  </div>
</template>

<style lang="stylus">
.test {
  background #000
  width 100px
  height 100px
}
</style>
