<script setup lang="ts">
// 计数器
// 通过 v-model 解析成 modelValue @update:modelValue
const props = defineProps<{
  modelValue: number
  rect: {
    x: number
    y: number
  }
}>()

const emits = defineEmits<{
  (e: "update:modelValue", count: number): void
  (e: "update:rect", coords: { x: number; y: number }): void
}>()

function test() {
  emits("update:modelValue", props.modelValue + 1)
  emits("update:rect", { x: props.modelValue + 1, y: props.modelValue + 1 })
}
</script>

<template>
  <div class="cp-radio-btn">
    计数器：{{ modelValue }} ----
    <button @click="test">点击加1</button>

    <div>
      {{ rect }}
    </div>
  </div>
</template>
