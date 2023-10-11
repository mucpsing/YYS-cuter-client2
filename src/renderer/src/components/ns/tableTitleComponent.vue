<template>
  <div>{{ props.value }}</div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (event: "onChange", newValue: string, ctx: any): void
}>()

const props = withDefaults(
  defineProps<{
    value?: string
  }>(),
  { value: "" },
)
</script>

<style scoped></style>
