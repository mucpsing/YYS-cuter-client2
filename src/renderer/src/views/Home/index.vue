<script setup lang="ts">
import Son from "./test.vue"

const count = ref(10)

const rect = reactive({
  x: 1,
  y: 1,
})
</script>

<template>
  <div>
    <son
      :rect="rect"
      @update:rect="rect = $event"
      :model-value="count"
      @update:modelValue="count = $event"
    ></son>
  </div>
</template>
