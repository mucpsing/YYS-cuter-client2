<template>
  <section class="h-screen flex-grow-[999] flex flex-col">
    <NsHeader></NsHeader>
    <NsBody></NsBody>
  </section>
</template>

<script setup lang="ts">
import NsHeader from "./n-header.vue"
import NsBody from "./body/index.vue"
</script>

<style scoped></style>
