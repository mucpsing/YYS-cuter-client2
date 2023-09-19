<template>
  <section class="flex-grow-[999] flex flex-col items-center py-5 gap-4">
    <t-card hoverShadow class="flex flex-col justify-center w-full max-w-[800px]">
      <div :class="['flex justify-between', 'pb-2']">
        <div class="flex items-end justify-center gap-2 text-base">
          <strong>{{ searchType }}</strong>
          <p class="text-sm text-gray-400 align-bottom">id xxxxx</p>
        </div>

        <t-radio-group v-model="searchType" variant="default-filled" size="large">
          <t-radio-button v-for="(item, idx) of searchTypeList" :key="idx" :value="item">{{
            item
          }}</t-radio-button>
        </t-radio-group>
      </div>

      <div>
        <t-select
          v-model="currtValue"
          :options="currtSelectList"
          filterable
          :scroll="{ type: 'virtual', threshold: 20 }"
          style="width: 100%; padding-left: 0"
          :change="onSearchChange"
          :onFocus="
            (e) => {
              console.log('当前：', e)
            }
          "
        >
          <template #suffixIcon> <SearchIcon /> </template>
        </t-select>
      </div>
    </t-card>

    <t-card hoverShadow :class="['w-full max-w-[800px] min-h-[600px']" title="详细信息">
      <t-table hover :data="tableData"> </t-table>
    </t-card>
  </section>
</template>

<script setup lang="ts">
import { SearchIcon } from "tdesign-icons-vue-next"

import { npcListRaw } from "../data/npcList"
import { itemListRaw } from "../data/itemList"

const NpcDetailList = npcListRaw.map((item) => ({
  label: `${item.NpcName}__${item.NpcId}__0x${item.NpcId.toString(16)}`,
  value: item.NpcId,
}))
// NpcDetailList.push({ label: "未选择", value: 0 })

const MonsterDetailList = itemListRaw.map((item) => ({
  label: `${item.ItemName}__${item.ItemId}__0x${item.ItemId.toString(16)}`,
  value: item.ItemId,
}))
// MonsterDetailList.push({ label: "未选择", value: 0 })

const currtSelectList = [...NpcDetailList, ...MonsterDetailList, { label: "未选择", value: 0 }]

const currtValue = ref(0)
const searchType = ref("物品")
const searchTypeList = ["NPC", "怪物", "物品"]

const tableData = computed(() => {
  if (currtValue.value == 0) return []
})

async function onSearchChange() {}
</script>

<style scoped></style>
