<template>
  <section>
    <header></header>
    <div>
      <t-table :data="tableData"></t-table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { npcListRaw } from "@nsData/npcList"
import { itemListRaw } from "@nsData/itemList"

import { useNsSkillStore } from "@nsStore/index"

const tableData = computed(() => {
  return []
})
const store = useNsSkillStore()
</script>

<style></style>
