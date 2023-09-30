<template>
  <header :class="['flex items-center justify-between bg-white', 'h-[60px] w-full p-2']">
    <h2 class="flex items-center justify-center">
      <cps-icon-font class="mx-2 text-3xl" iconName="icon-yys-youxi" color="#31302d" />NS-NPC管理页
    </h2>

    <div class="flex gap-1">
      <t-input-adornment>
        <template #append>
          <t-button variant="outline" :onClick="() => (dataTableShow = !dataTableShow)">
            <template #icon> <SearchIcon /> </template> </t-button
        ></template>
        <t-select
          clearable
          v-model="currtValue"
          :options="currtSelectList"
          placeholder="快速搜索"
          filterable
          :scroll="{ type: 'virtual', threshold: 20 }"
          style="min-width: 280px; padding-left: 0"
          :onChange="onSearchChange"
          :onFocus="(e) => console.log('当前：', e)"
          :onClear="() => (currtValue = 0)"
        >
        </t-select>
      </t-input-adornment>

      <t-button variant="outline" :onClick="() => (dataTableShow = !dataTableShow)">
        <template #icon> <SettingIcon /> </template>
      </t-button>

      <t-dialog
        width="70%"
        :closeBtn="true"
        :visible="dataTableShow"
        :showOverlay="false"
        :closeOnEscKeydown="true"
        :onClose="() => (dataTableShow = false)"
        :footer="false"
      >
        <t-card hoverShadow>
          <div class="flex flex-col gap-2">
            <div class="flex justify-between">
              <div class="flex items-end justify-center gap-2 text-base">
                <strong>{{ searchType }}</strong>
                <p class="text-sm text-gray-400 align-bottom">id xxxxx</p>
              </div>
              <t-radio-group size="medium" v-model="searchType" variant="default-filled">
                <t-radio-button
                  v-for="(item, idx) of ['全部', 'NPC', '怪物', '物品', '技能', '商城']"
                  :key="idx"
                  :value="item"
                  >{{ item }}</t-radio-button
                >
              </t-radio-group>
            </div>

            <t-select
              clearable
              filterable
              v-model="currtValue"
              :options="currtSelectList"
              placeholder="快速搜索"
              style="width: 100%; padding-left: 0"
              :scroll="{ type: 'virtual', threshold: 20 }"
              :onChange="onSearchChange"
              :onFocus="(e) => console.log('当前：', e)"
            >
              <template #suffixIcon> <SearchIcon /> </template>
            </t-select>
          </div>
        </t-card>
        <div class="py-1"></div>
        <t-card hoverShadow :class="['']" title="详细信息">
          <t-table hover :data="tableData"> </t-table>
        </t-card>
      </t-dialog>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { SettingIcon, SearchIcon } from "tdesign-icons-vue-next"
// import { dataManager } from "@components/dataSearchManager.vue"
import { npcListRaw } from "@nsData/npcList"
import { itemListRaw } from "@nsData/itemList"

const NpcDetailList = npcListRaw.map((item) => ({
  label: `${item.NpcName}__${item.NpcId}__0x${item.NpcId.toString(16)}`,
  value: item.NpcId,
}))

const MonsterDetailList = itemListRaw.map((item) => ({
  label: `${item.ItemName}__${item.ItemId}__0x${item.ItemId.toString(16)}`,
  value: item.ItemId,
}))

const dataTableShow = ref(false)
const currtSelectList = [...NpcDetailList, ...MonsterDetailList, { label: "快速搜索", value: 0 }]
const tableData = ref([])
const currtValue = ref(0)
const searchType = ref("全部")

async function onSearchChange() {
  if (currtValue.value != 0) {
    // dataTableShow.value = true
  }
}
</script>
@renderer/data/ns/itemList
