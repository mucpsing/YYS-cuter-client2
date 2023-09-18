<template>
  <header :class="['flex items-center content-center justify-center bg-white', 'h-[60px] w-full']">
    <c-icon-font class="mx-2 text-3xl" iconName="icon-yys-youxi" color="#31302d"></c-icon-font>
    <h2>NS-NPC管理页</h2>

    <div class="absolute mr-2 right-2">
      <t-button variant="outline">
        <template #icon> <SettingIcon /> </template>

        配置
      </t-button>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { SettingIcon } from "tdesign-icons-vue-next"
</script>
