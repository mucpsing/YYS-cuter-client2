<!--
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-12-22 10:20:41.714442
 * @Last Modified by: CPS
 * @Last Modified time: 2022-12-22 10:20:41.714442
 * @Filename main.py
 * @Description: 以序号和线框列出所有坐标和对应的范围
-->

<template>
  <!-- 预览 -->
  <ul class="absolute z-10 ImageReaderCard__preview">
    <template v-if="localStore.currtMode == 'coords-preview'">
      <li
        v-for="(style, idx) in coordsList"
        :key="idx"
        :class="[
          idx === localStore.currtCoordsIndex
            ? 'text-black before:bg-yellow-300 border-yellow-300'
            : 'text-yellow-300 border-while',
          'absolute flex justify-center items-center cursor-pointer',
          'border-2 border-dashed before:-z-10',
          'before:hover:bg-yellow-300 hover:text-black ',
          'before:absolute before:w-7 before:h-7 before:rounded-50% before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2',
          'before:border-2 before:border-solid before:border-while',
        ]"
        :style="style"
        @click="localStore.switchCoords(idx)"
      >
        <strong>{{ idx + 1 }}</strong>
      </li>
    </template>
  </ul>
</template>

<script setup lang="ts">
import localStore from "../store";

const coordsList = computed(() => {
  const scale = localStore.imgScale;
  const offsetTop = localStore.img_Y_Offset;
  const offsetLeft = localStore.img_X_Offset;

  return localStore.currtCoordsList.map((each) => ({
    left: `${offsetLeft + each.startX / scale}px`,
    top: `${offsetTop + each.startY / scale}px`,
    width: `${(each.endX - each.startX) / scale}px`,
    height: `${(each.endY - each.startY) / scale}px`,
  }));
});
</script>

<style lang="stylus">
.ImageReaderCard__preview *
  transition all 0.4s cubic-bezier(0.25, 1, 0.5, 1)
</style>
