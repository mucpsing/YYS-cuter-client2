<template>
  <div class="flex flex-col gap-2 whitespace-nowrap">
    <!-- 血量 -->
    <div :class="['npc__baseinfo-item']">
      <h3>
        <strong>{{ NpcInfoFieldName.Hp }}</strong>
      </h3>
      <t-slider v-model="NpcInfo.Hp" />
      <t-input-number
        type="number"
        theme="normal"
        v-model="NpcInfo.Hp"
        align="center"
        class="w-[50px]"
        placeholder=""
      ></t-input-number>
    </div>

    <!-- 力量 -->
    <div :class="['npc__baseinfo-item']">
      <h3>
        <strong>{{ NpcInfoFieldName.Str }}</strong>
      </h3>
      <t-slider v-model="NpcInfo.Str" :max="255" />
      <t-input-number
        type="number"
        theme="normal"
        v-model="NpcInfo.Str"
        align="center"
        class="w-[50px]"
        placeholder=""
      ></t-input-number>
    </div>

    <!-- 敏捷 -->
    <div :class="['npc__baseinfo-item']">
      <h3>
        <strong>{{ NpcInfoFieldName.Dex }}</strong>
      </h3>
      <t-slider v-model="NpcInfo.Dex" :max="255" />
      <t-input-number
        type="number"
        theme="normal"
        v-model="NpcInfo.Dex"
        align="center"
        class="w-[50px]"
        placeholder=""
      ></t-input-number>
    </div>

    <div :class="['npc__baseinfo-item']">
      <h3>
        <strong>{{ NpcInfoFieldName.Con }}</strong>
      </h3>
      <t-slider v-model="NpcInfo.Con" :max="255" />
      <t-input-number
        v-model="NpcInfo.Con"
        theme="normal"
        align="center"
        class="w-[50px]"
        placeholder=""
      ></t-input-number>
    </div>

    <div :class="['npc__baseinfo-item']">
      <h3>
        <strong>{{ NpcInfoFieldName.Int }}</strong>
      </h3>
      <t-slider v-model="NpcInfo.Int" :max="255" />
      <t-input-number
        v-model="NpcInfo.Int"
        theme="normal"
        align="center"
        class="w-[50px]"
        placeholder=""
      ></t-input-number>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NpcInfoFieldName } from "../data/template"
const NpcInfo = reactive({
  Hp: 200,
  Str: 50,
  Dex: 20,
  Int: 20,
  Con: 30,
})
</script>

<style lang="stylus" scoped>
.npc__baseinfo-item {
  @apply flex justify-between items-center gap-4
}
</style>
