<!--
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-12-09 21:06:12.836304
 * @Last Modified by: CPS
 * @Last Modified time: 2022-12-09 21:06:12.836304
 * @Filename main.py
 * @Description: 功能描述
-->

<template>
  <button
    class="cps-btn-base"
    :class="props.class"
    :style="{ backgroundColor: props.btnBgColor, color: props.btnTextColor }"
    @click="emit('on-click')"
  >
    <slot>Click me!</slot>
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits(["on-click"]);
const props = withDefaults(
  defineProps<{
    btnBgColor?: string;
    btnTextColor?: string;
    class?: string | string[];
  }>(),
  {
    btnBgColor: "#ff0081",
    btnTextColor: "#fff",
    class: "",
  }
);
</script>

<style lang="stylus" scoped>
.cps-btn-base
  text-align center
  font-family 'Helvetica', 'Arial', sans-serif
  padding 0.5em 1em
  -webkit-appearance none
  appearance none
  background-color var(--cpsBtnBg)
  color var(--cpsBtnTextColor)
  border-radius 4px
  border none
  cursor pointer
  position relative
  transition transform ease-in 0.1s, box-shadow ease-in 0.25s
  /* box-shadow 0 2px 25px rgba(255, 0, 130, 0.5) */
  box-shadow 0 2px 25px color(rgba(255, 0, 130, 0.5))

  &:focus
    outline 0

  &:before, &:after
    position absolute
    content ''
    display block
    width 120%
    height 100%
    left -20%
    z-index -1000
    transition all ease-in-out 0.5s
    background-repeat no-repeat

  &:active
    transform scale(0.9)
    background-color color(currentColor b(5%))

    /* box-shadow 0 2px 25px rgba(255, 0, 130, 0.2) */
    /* box-shadow 0 2px 25px color(rgba(255, 0, 130, 0.2)) */
</style>
