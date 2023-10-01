<template>
  <section
    :class="[
      'h-screen flex-grow-[999] flex flex-col',
      'md:text-sm xl:text-md',
      'whitespace-nowrap',
    ]"
  >
    <NsHeader></NsHeader>
    <NsBody></NsBody>
  </section>
</template>

<script setup lang="ts">
import NsHeader from "@components/ns-header/index.vue"
import NsBody from "./body/index.vue"
</script>
