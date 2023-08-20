<!--
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-12-02 09:32:44.152917
 * @Last Modified by: CPS
 * @Last Modified time: 2022-12-02 09:32:44.152917
 * @Filename main.py
 * @Description: 功能描述
-->

<template>
  <div>
    <div>图片img元素:</div>
    <div>上下: {{ localStore.imgElementX }} , {{ localStore.imgElementY }}</div>
    <div>长宽: {{ localStore.imgElementW }} x {{ localStore.imgElementH }}</div>
    <br />
    <div>图片实际尺寸</div>
    <div>长宽: {{ localStore.imgWidth }} x {{ localStore.imgHeight }}</div>
    <div>尺寸比例: {{ localStore.imgScale }}</div>
    <div>拉伸锁定： {{ localStore.lockSize }}</div>
  </div>
</template>

<script setup lang="ts">
import localStore from "../store";
</script>

<style lang="stylus" scoped></style>
