<!--
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-11-07 23:17:36.201746
 * @Last Modified by: CPS
 * @Last Modified time: 2022-11-07 23:17:36.201746
 * @Filename asideMenuItem.vue
 * @Description: 菜单的按钮列表部分，提取成组件复用
-->

<template>
  <section>
    <header :class="['py-2 mb-2 text-xs text-center']">
      {{ title }}
    </header>
    <ul
      class="mx-1 rounded-md whitespace-nowrap border-gray-500/10"
      :style="{ 'background-color': props.bgColor }"
    >
      <template v-for="item in props.menus" :key="item.name">
        <li
          class="menu-item relative flex flex-nowrap my-1 py-2 px-4 hover:bg-gray-200/[0.1] rounded-md cursor-pointer justify-between items-center"
          @click="onMenuItemClick(item)"
        >
          <span class="flex items-center flex-nowrap">
            <c-icon-font class="mr-3 text-2xl" color="#409eff" :iconName="item.icon"></c-icon-font>
            <span
              :class="[
                props.autoHide
                  ? '-translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                  : 'translate-x-0 opacity-100',
              ]"
              >{{ item.name }}</span
            >
          </span>

          <c-icon-font
            v-if="item.iconSub"
            :class="[props.autoHide ? 'opacity-0 text-md group-hover:opacity-100' : 'opacity-100']"
            :iconName="item.iconSub"
            color="green"
          ></c-icon-font>

          <div
            class="absolute w-1 h-full bg-red-400 rounded-sm opacity-0 menu-item-light -left-5"
          ></div>
        </li>
      </template>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { debounce } from "lodash"
interface menuItemsType {
  name: string
  icon: string
  iconSub?: string
  callback?: Function | null
}

interface menuProps {
  title: string // 菜单栏的名称
  menus?: menuItemsType[]
  bgColor?: string
  autoHide?: boolean // 自动隐藏
}

const props = withDefaults(defineProps<menuProps>(), {
  title: "插件库",
  bgColor: "",
  autoHide: true,
  menus: () => [
    { name: "截图插件", icon: "crop", iconSub: "setting" },
    { name: "截图插件", icon: "crop", iconSub: "setting" },
    { name: "截图插件", icon: "crop", iconSub: "setting" },
  ],
})

/**
 *  @Description 如果存在callback字段，在点击时进行调用
 *
 *  @param {string} itemName  菜单名
 *
 */
const onMenuItemClick = debounce((menuItem) => {
  if (menuItem.callback) menuItem.callback()
}, 100)
</script>

<style lang="stylus">
.cps__layout-aside .menu-item:hover .menu-item-light
  @apply opacity-90
</style>
