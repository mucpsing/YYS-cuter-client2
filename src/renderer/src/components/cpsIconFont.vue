<!--
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-11-06 14:04:15.473252
 * @Last Modified by: CPS
 * @Last Modified time: 2022-11-06 14:04:15.473252
 * @Description: 对iconfont的一个打包，可以设定默认的前缀，同时自动识别iconName是否带前缀
 * ```html
 * <template>
 *   <IconFont iconName="crop"></IconFont>
 * </template>
 *
 *
 * <template>
 *   <IconFont iconName="icon-yys-crop"></IconFont>
 * </template>
 * ```
-->

<template>
  <svg :class="svgClass" aria-hidden="true" :style="{ transform: `rotate(${rotate}deg)` }">
    <use :xlink:href="iconClassName" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
import "@renderer/assets/icons/iconfont.js"
const props = withDefaults(
  defineProps<{
    iconName: string
    className?: string
    color?: string
    iconPrefix?: string
    rotate?: number
  }>(),
  {
    className: "",
    color: "currentColor",
    iconPrefix: "icon-yys-",
    rotate: 0,
  },
)

// 图标在 iconfont 中的名字
const iconClassName = computed(() => {
  // 如果已经带了前缀
  if (props.iconName.startsWith(props.iconPrefix)) return `#${props.iconName}`

  return `#${props.iconPrefix}${props.iconName}`
})

// 给图标添加上其他自定义类名，进行自定义样式
const svgClass = computed(() => `cps-iconFont-svg ${props.className}`)
</script>

<style scoped>
.cps-iconFont-svg {
  width: 1em;
  height: 1em;
  /*  position: relative;*/
  fill: currentColor;
  vertical-align: -2px;
  display: inline-block;
}
</style>
