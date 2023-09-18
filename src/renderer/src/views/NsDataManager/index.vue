<template>
  <section class="h-screen flex-grow-[999] flex flex-col">
    <div>
      <t-radio-group v-model="currtPannel" variant="default-filled">
        <t-radio-button v-for="(item, idx) of pannelList" :key="idx" value="item">{{
          item
        }}</t-radio-button>
      </t-radio-group>
    </div>
  </section>
</template>

<script setup lang="ts">
const pannelList = ["NPC", "怪物", "物品"]
const currtPannel = ref("NPC")
</script>

<style scoped></style>
