<template>
  <div class="flex flex-col w-full gap-2">
    <t-divider><strong>基础属性</strong></t-divider>

    <div class="flex items-center justify-between">
      <h3>
        <strong>{{ NpcInfoFieldName["Level"].text }}</strong>
      </h3>
      <t-input-number theme="column" v-model="NpcData[selectNpcTable]['Level']"> </t-input-number>
    </div>

    <div
      v-for="(key, idx) of ['Hp', 'Str', 'Con', 'Dex', 'Int']"
      :key="idx"
      :class="['npc__baseinfo-item']"
    >
      <h3>
        <strong>{{ NpcInfoFieldName[key].text }}</strong>
      </h3>
      <t-slider v-model="NpcData[selectNpcTable][key]" :max="NpcInfoFieldName[key].max" />
      <t-input-number
        type="number"
        theme="normal"
        v-model="NpcData[selectNpcTable][key]"
        align="center"
        :class="[key == 'Hp' ? 'w-[100px]' : 'w-[60px]']"
        placeholder=""
      ></t-input-number>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { NpcInfoFieldName } from "../data/template"
import { NpcData } from "../store/data"
import { selectNpcTable } from "../store/index"
</script>

<style lang="stylus" scoped>
.npc__baseinfo-item {
  @apply flex justify-between items-center gap-4
}
</style>
