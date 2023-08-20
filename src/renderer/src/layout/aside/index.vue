<!--
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 
 * @Last Modified by: CPS
 * @Last Modified time: 2022-11-13 18:35:26.905430
 * @Filename aside
 * @Description: 边侧栏入口，整体架构文件
-->

<template>
  <aside
    class="relative flex flex-col flex-shrink-0 w-24 h-screen px-4 py-3 overflow-x-hidden text-gray-400 cps__layout-aside group hover:w-56 bg-black-50 opacity-9 rounded-2xl"
  >
    <!-- 按钮部分 -->
    <header>
      <div
        class="flex items-center content-center justify-start w-16 py-2 ml-1"
      >
        <button
          class="rounded-50% flex-shrink-0 mr-2 w-3 h-3 bg-red-500"
        ></button>
        <button
          class="rounded-50% flex-shrink-0 mr-2 w-3 h-3 bg-yellow-400"
        ></button>
        <button
          class="rounded-50% flex-shrink-0 mr-2 w-3 h-3 bg-green-400"
        ></button>
        <button @click="test">
          <c-icon-font
            iconName="zhankai"
            class="flex-shrink-0 w-3 h-3 cursor-pointer ml-28 text-sky-800 hover:text-sky-300"
          ></c-icon-font>
        </button>
      </div>
    </header>

    <!-- 头像部分 -->
    <section class="flex w-16 py-3 profile-picture border-b-gray-400">
      <img
        class="mx-1 mr-5 rounded-50% w-14 border-4 border-solid border-gray-400/30"
        src="mimi.png"
        alt="用户头像"
      />
      <article class="flex flex-col items-center justify-center">
        <h3 class="text-md">power by</h3>
        <h2 class="text-xl">Capsion.top</h2>
      </article>
    </section>

    <!-- 分割线 -->
    <menu-split-line height="10px"></menu-split-line>

    <!-- 主要菜单 -->
    <menuItem class="flex-grow" title="Base Menu" :menus="mainMenus"></menuItem>

    <!-- 分割线 -->
    <menu-split-line height="10px"></menu-split-line>

    <!-- 辅助菜单 -->
    <menuItem
      title="Sub Menu"
      bgColor="rgba(0,0,0,.5)"
      :menus="subMenus"
    ></menuItem>
    <footer></footer>
  </aside>
</template>

<script setup lang="ts">
import menuItem from "@renderer/layout/aside/asideMenuItem.vue";
import menuSplitLine from "@renderer/layout/aside/asideSplitLine.vue";
import { eventBus } from "@renderer/libs";
import { SettingPageValue } from "@renderer/stores";

const router = useRouter();

/* 主要标题 */
const mainMenus = [
  {
    name: "仪表盘",
    icon: "yuzhiyibiaopan",
    iconSub: "home1",
    callback: () => router.push("/home"),
  },
  {
    name: "截图插件",
    icon: "caijian",
    iconSub: "tupiancaijian",
    callback: () => router.push("/plugin/ImageCuter"),
  },
  {
    name: "河道断面图",
    icon: "caijian",
    iconSub: "tupiancaijian",
    callback: () => router.push("/ImageCuter"),
  },
];

/* 下方副标题 */
const subMenus = [
  {
    name: "全局配置",
    icon: "setting",
    iconSub: "s-operation",
    callback: () => {
      eventBus.emit("showSettingsPage", SettingPageValue.GLOBAL);
    },
  },
  { name: "使用说明", icon: "bangzhu1", iconSub: "" },
  { name: "关于作者", icon: "info", iconSub: "link" },
];

async function test() {
  console.log("test");
}
</script>

<style lang="stylus">
/* 设置全局过渡 */
.cps__layout-aside, .cps__layout-aside *
  transition all 0.6s cubic-bezier(0.25, 1, 0.5, 1)

/* 消除滚动条 */
.cps__layout-aside
  /&::-webkit-scrollbar
    width 1px
    height 1px

  /* 滚动槽 */
  /&::-webkit-scrollbar-track
    -webkit-box-shadow inset 0 0 6px rgba(0, 0, 0, 0.3)
    border-radius 10px

  /* 滚动条滑块 */
  /&::-webkit-scrollbar-thumb
    border-radius 10px
    background rgba(0, 0, 0, 0.1)
    -webkit-box-shadow inset 0 0 6px rgba(0, 0, 0, 0.5)
</style>
