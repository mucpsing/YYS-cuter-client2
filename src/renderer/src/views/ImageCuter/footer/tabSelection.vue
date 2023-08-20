<!--
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-12-22 10:20:41.714442
 * @Last Modified by: CPS
 * @Last Modified time: 2022-12-22 10:20:41.714442
 * @Filename main.py
 * @Description: 功能描述
-->

<template>
  <div class="flex flex-row gap-10">
    <div>
      <div>top: {{ localStore.imgElementY }}</div>
      <div>left: {{ localStore.imgElementX }}</div>
      <div>w: {{ localStore.imgElementW }}</div>
      <div>h: {{ localStore.imgElementH }}</div>
    </div>
    <div>
      <div>top: {{ top }}</div>
      <div>left: {{ left }}</div>
      <div>w: {{ width }}</div>
      <div>h: {{ height }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import localStore, { ElementCache } from "../store";
import { useElementBounding } from "@vueuse/core";

const { top, left, width, height } = useElementBounding(
  ElementCache.imgElement
);
</script>
