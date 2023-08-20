<!--
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-11-30 22:42:43.707155
 * @Last Modified by: CPS
 * @Last Modified time: 2022-11-30 22:42:43.707155
 * @Filename main.py
 * @Description: 控制台部分
-->

<template>
  <div
    class="relative flex gap-2 p-1 ImageReader__footerTabNav rounded-xl bg-blue-900/20"
  >
    <!-- 白色的按钮遮罩 -->
    <div
      :style="{ width: lineWidth, left: lineLeft, height: lineHeight }"
      :class="[
        'ImageReader__footer-buttonMask',
        'font-medium text-sm leading-5 text-center text-blue-700',
        'hover:text-blue-600',
        'shadow rounded-lg ring-opacity-60 ring-offset-blue-600',
        'absolute z-10 py-2  w-2 h-1 bg-white',
        'cursor-pointer',
      ]"
    >
      {{ mainMenus[localStore.currtMode].title }}
    </div>

    <!-- 【面板切换按钮】 根据toolBar的key来切换不同的控制面板 【面板切换按钮】 -->
    <template v-for="(info, idx) in Object.values(mainMenus)" :key="idx">
      <button
        ref="btns"
        :class="[
          'ImageReader__footer-button',
          'w-full rounded-lg py-2 text-sm font-medium leading-5 text-blue-700',
          'ring-white ring-opacity-60 ring-offset-blue-600 focus:outline-none focus:ring-2',
          'text-blue-100 hover:bg-white/[0.12] hover:text-white',
        ]"
        @click="onTabClick($event, info.name, idx)"
      >
        {{ info.title }}
      </button>
    </template>
  </div>

  <!-- 【各个控制面板】 -->
  <div
    :class="[
      'ImageReader__footerTabList',
      'h-full rounded-xl bg-white p-3',
      'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400',
      'focus:outline-none focus:ring-2',
    ]"
  >
    <transition name="ImageReader__footerTab-fade">
      <keep-alive>
        <component :is="tabMap[localStore.currtMode]"></component>
      </keep-alive>
    </transition>
  </div>
</template>

<!-- 导出要切换的 tab 面板 -->
<script lang="ts">
import TabCrop from "./tabCropPanel/index.vue";
import TabPictureInfo from "./tabPictureInfo.vue";
import TabSelection from "./tabSelection.vue";
import TabServerPanel from "./tabServerPanel.vue";
import TabDataEditor from "../body/pageDataEditor.vue";

import type { StringObj } from "@renderer/global";

/**
 * @description: 这里分成了两个 <script>是为了能在component的is中直接使用vue组件
 */
const tabMap: StringObj = {
  crop: "TabCrop",
  "server-panel": "TabServerPanel",
  "picture-info": "TabPictureInfo",
  "coords-preview": "TabSelection",
  // "data-editor": "TabDataEditor",
};

export default {
  components: {
    TabCrop,
    TabPictureInfo,
    TabSelection,
    TabServerPanel,
    TabDataEditor,
  },
};
</script>

<!-- 其他逻辑 -->
<script setup lang="ts">
import { eventBus } from "@renderer/libs";
import { useResizeObserver } from "@vueuse/core";

import localStore from "../store";
import { mainMenus, type ModesT } from "../store/menus";

const btns = ref<HTMLElement[] | null>([]);
const btnIndex = ref(0); // 对应当前模式数据的索引
const lineWidth = ref("0");
const lineLeft = ref("4px");
const lineHeight = ref("0");

/**
 * @Description 监听`localStore.currtMode`数据的变化，表示当前插件的模式
 */
// const stopModeWatch = watch(
//   () => localStore.currtMode,
//   (oldV, newV) => {
//     Object.values(mainMenus).forEach((eachInfo, index) => {
//       if (eachInfo.name == localStore.currtMode) {
//         btnIndex.value = index;
//         updateBtnMask();
//       }
//     });
//     console.log("mode发生了变化", `${oldV} => ${newV}`);
//   }
// );

/**
 *  @Description 移动tab按钮的白色遮罩位置
 */
function updateBtnMask(target: HTMLElement | null = null): void {
  if (btns && btns.value) {
    if (!target) {
      target = btns.value[btnIndex.value];
    }

    lineWidth.value = `${target.offsetWidth}px`;
    lineLeft.value = `${target.offsetLeft}px`;
    lineHeight.value = `${target.offsetHeight}px`;
  }
}

/**
 *  @Description tab菜单点击事件，通过传入模式名，改变当前tab显示的内容
 *
 *  @param {MouseEvent} e         {description}
 *  @param {string}     modeName  菜单对应的模式
 *  @param {number}     idx=-1    按钮的索引，因为通过v-for生成的按钮，用来明确具体按钮位置
 */
function onTabClick(e: MouseEvent, modeName: ModesT, idx = -1): void {
  if (e && e.target) updateBtnMask(e.target as HTMLElement);

  /* 切换模式 */
  if (modeName !== localStore.currtMode) {
    /**
     * btnIndex 关联updateBtnMask()函数，用来给按钮的mask跟踪具体位置
     */
    if (idx == -1) {
      idx = btnIndex.value;
    } else {
      btnIndex.value = idx;
    }

    localStore.setMode(modeName);
  } else {
    console.log(modeName);
  }
}

onMounted(() => {
  /* 执行下划线的动画 */
  if (btns && btns.value) {
    /* 监听元素 */
    useResizeObserver(btns.value[0], () => updateBtnMask());
  }

  nextTick(() => updateBtnMask());
});

// onUnmounted(()=> )

onDeactivated(() => {
  // stopModeWatch();
});
</script>

<style lang="stylus">
.ImageReader__footer-buttonMask
  transition all 0.7s

/* tabList 面板切换过渡动效 */
.ImageReader__footerTab-fade-enter-active
  position absolute
  transition all 0.4s ease-out 0.4s

.ImageReader__footerTab-fade-leave-active
  position absolute
  transition all 0.4s cubic-bezier(1, 0.5, 0.8, 1)

.ImageReader__footerTab-fade-enter-from, .ImageReader__footerTab-fade-leave-to
  transition all 0.4s ease-out 0.4s
  transform translateX(200px)
</style>
