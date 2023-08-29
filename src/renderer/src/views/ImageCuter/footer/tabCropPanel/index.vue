<!--
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-12-02 09:32:44.152917
 * @Last Modified by: CPS
 * @Last Modified time: 2022-12-02 09:32:44.152917
 * @Filename main.py
 * @Description: 裁剪控制面板，主要用来修改当前的裁剪信息，
-->

<template>
  <section class="flex flex-row w-full h-full gap-4 text-white ImageReader__informationCrop justify-evenly rounded-xl">
    <div
      id="canvasContainer"
      ref="canvasContainer"
      :class="['relative', 'w-56 h-full', 'rounded-xl border-dashed border-2 border-gray-600/70']"
    >
      <!-- 预览img元素 -->
      <img
        :class="['object-contain w-full h-full', 'absolute top-1/2 translate-x-1/2 right-1/2 -translate-y-1/2']"
        :src="imgPreviewSrc"
      />
    </div>

    <!-- 文件具体信息 -->
    <div :class="['flex flex-col gap-2 justify-start items-start', 'w-60 text-md text-black']">
      <!-- ---------------------------------------- 标题 输入框 ---------------------------------------- -->
      <c-input v-model:value="localStore.crop.title" :auto-focus="localStore.autoFcous"></c-input>

      <!-- 坐标信息 -->
      <section class="text-sm">
        <!-- ---------------------------------------- startX - startY ---------------------------------------- -->
        <div class="flex flex-row h-8 gap-1 text-white">
          <div class="relative w-3/5 group">
            <!-- BUG! 因为编辑器的stylus使用@apply会失去智能提示，这里第一个元素主要用于编辑，共用的属性在更新到对应的class上 -->
            <c-icon-font
              :class="[
                'text-gray-500 absolute left-0 text-xl top-1/2 -translate-y-1/2 ml-2',
                '-rotate-90 group-hover:text-blue-400',
              ]"
              iconName="top"
            ></c-icon-font>

            <!-- BUG! 因为编辑器的stylus使用@apply会失去智能提示，这里第一个元素主要用于编辑，共用的属性在更新到对应的class上 -->
            <!-- @input="updateCoords($event.target as HTMLInputElement, 'startX')" -->

            <input
              :value="startX"
              onfocus="this.select()"
              onmouseenter="this.focus()"
              :class="[
                'h-full text-center w-full rounded-md text-black border-2 border-solid border-gray-200',
                'group-hover:border-gray-400',
              ]"
              placeholder="start X"
              type="text"
              @input="updateCoords($event.target as HTMLInputElement, 'startX')"
            />
          </div>
          <div class="relative w-3/5 group">
            <c-icon-font
              class="ImageReader__informationCropInput-icon group-hover:text-blue-400"
              iconName="top"
            ></c-icon-font>
            <input
              :value="startY"
              onfocus="this.select()"
              onmouseenter="this.focus()"
              class="ImageReader__informationCrop-input group-hover:border-gray-400"
              placeholder="start Y"
              type="text"
            />
          </div>
          <div
            class="relative flex flex-row items-center justify-center w-1/5 group"
            @click="localStore.lockXY = !localStore.lockXY"
          >
            <c-icon-font
              :class="[
                'cursor-pointer hover:text-blue-300 text-xl',
                localStore.lockXY ? 'text-orange-500' : 'text-gray-700',
              ]"
              iconName="jiesuo"
            ></c-icon-font>
          </div>
        </div>

        <!-- ---------------------------------------- endX - endY v-model.number="localStore.crop.endY" ---------------------------------------- -->
        <div class="flex flex-row h-8 gap-1 mt-1 text-white">
          <div class="relative w-3/5 group">
            <c-icon-font
              class="-rotate-90 ImageReader__informationCropInput-icon group-hover:text-blue-400"
              iconName="gaodu"
            ></c-icon-font>
            <input
              :value="endX"
              onfocus="this.select()"
              onmouseenter="this.focus()"
              class="ImageReader__informationCrop-input group-hover:border-gray-400"
              placeholder="end X"
              type="text"
            />
          </div>
          <div class="relative w-3/5 group">
            <c-icon-font
              class="ImageReader__informationCropInput-icon group-hover:text-blue-400"
              iconName="gaodu"
            ></c-icon-font>
            <input
              :value="endY"
              onfocus="this.select()"
              onmouseenter="this.focus()"
              class="ImageReader__informationCrop-input group-hover:border-gray-400"
              placeholder="end Y"
              type="text"
            />
          </div>

          <div
            class="relative flex flex-row items-center justify-center w-1/5 group"
            @click="localStore.lockSize = !localStore.lockSize"
          >
            <c-icon-font
              :class="[
                'cursor-pointer hover:text-blue-300 text-xl',
                localStore.lockSize ? 'text-orange-500' : 'text-gray-700',
              ]"
              iconName="jiesuo"
            ></c-icon-font>
          </div>
        </div>

        <!-- ---------------------------------------- 页码 ---------------------------------------- -->
        <div class="flex justify-between w-full px-1 mt-4">
          <div class="flex items-center content-center justify-between w-2/3 gap-6 text-sm">
            <!-- 【左】切换按键 -->
            <button @click="localStore.switchCoords(localStore.currtCoordsIndex - 1)">
              <c-icon-font
                :class="['text-gray-700', 'hover:text-blue-500 hover:scale-150', 'rotate-180']"
                iconName="xiayiye"
              ></c-icon-font>
            </button>

            <!-- 【中】页码显示 -->
            <p :class="['text-black text-sm']">
              {{ localStore.currtCoordsIndex + 1 }}/{{ localStore.currtCoordsList.length }}
            </p>

            <!-- 【右】切换按键 -->
            <button @click="localStore.switchCoords(localStore.currtCoordsIndex + 1)">
              <c-icon-font
                :class="['text-gray-700', 'hover:text-blue-500 hover:scale-150']"
                iconName="xiayiye"
              ></c-icon-font>
            </button>
          </div>

          <!-- 【最右】添加按钮 -->
          <button @click="localStore.addCoords('add')">
            <c-icon-font
              :class="['text-gray-700 text-xl', 'hover:text-blue-500 hover:scale-150']"
              iconName="zhuijia"
            ></c-icon-font>
          </button>
        </div>
      </section>
    </div>

    <!-- 裁剪按钮上方组合菜单 -->
    <div :class="['flex flex-col justify-start items-start gap-3', 'text-red-500']">
      <p class="text-sm">
        图片尺寸：
        <span>{{ localStore.imgWidth }}x{{ localStore.imgHeight }}</span>
      </p>

      <ul :class="['w-full', 'flex flex-row justify-around items-center gap-2']">
        <li v-for="item in subBtnList" :key="item.iconName" @click="item.onClick">
          <c-icon-font
            :class="['hover:text-blue-500 hover:scale-125', 'text-gray-400 rounded-sm cursor-pointer']"
            :iconName="item.iconName"
          ></c-icon-font>
        </li>
      </ul>

      <!-- 裁剪按钮 -->
      <c-button :class="['flex flex-row justify-center items-center gap-2', 'w-full h-full']" @on-click="onClick"
        ><c-icon-font class="text-2xl" iconName="crop"></c-icon-font>
        <span>裁 剪 {{ localStore.imgScale.toFixed(2) }}</span>
      </c-button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { eventBus } from "@renderer/libs"
import config from "../../store/config"
import localStore, { ElementCache, startX, startY, endX, endY } from "../../store"

import cButton from "@renderer/components/global/cpsButton.vue"
import cInput from "./cropInput.vue"

let canvas: HTMLCanvasElement
let canvasCtx: CanvasRenderingContext2D | null | undefined

const imgPreviewSrc = ref("")
const canvasContainer = ref<HTMLElement>()

const subBtnList = [
  {
    iconName: "suoxiao",
    onClick: () => localStore.zoomIn(),
  },
  {
    iconName: "huifuxitongmoren",
    onClick: () => localStore.zoomInit(),
  },
  {
    iconName: "fangda",
    onClick: () => localStore.zoomOut(),
  },
  {
    iconName: "lajitong",
    onClick: () => localStore.removeCoords(),
  },
]

/**
 * @description: 根据输入重新更新内部坐标
 * @param {*} target
 * @param {*} witchKey
 * @return {*}
 */
const updateCoords = (target: HTMLInputElement, witchKey: keyof typeof localStore.crop) => {
  if (target && target.value) {
    console.log("需要更新1: ", witchKey)
    console.log("需要更新2: ", target.value)

    switch (witchKey) {
      case "startX":
        break
      case "startY":
        break
      case "endX":
        break
      case "endY":
        break
    }
  }
}

/**
 *  @Description 组件挂载完成后，创建一个canvas作为主要渲染器
 */
function initCanvas() {
  canvas = document.createElement("canvas")
  canvasCtx = canvas.getContext("2d")

  if (!canvas) return console.log("canvas 初始化失败")
  if (!canvasContainer || !canvasContainer.value) return console.log("canvasContainer 初始化失败")
}

async function onClick() {
  localStore.addCoords()

  // 防止重复绘制
  if (!config.AUTO_DRAW) eventBus.emit("imc-tabCrop-draw")
}

async function draw() {
  if (!canvasCtx) return
  const img = localStore.currtImgObj.image
  // const dragElement = ElementCache.dragElement;

  canvas.width = localStore.imgWidth
  canvas.height = localStore.imgHeight

  const startX = localStore.crop.startX
  const startY = localStore.crop.startY
  const endX = localStore.crop.endX
  const endY = localStore.crop.endY

  canvasCtx.drawImage(img, 0, 0)
  const imgClipData = canvasCtx.getImageData(startX, startY, endX, endY)

  canvas.width = endX - startX
  canvas.height = endY - startY
  canvasCtx.putImageData(imgClipData, 0, 0)

  imgPreviewSrc.value = canvas.toDataURL()
}

onMounted(() =>
  nextTick(() => {
    initCanvas()
    eventBus.on("imc-tabCrop-draw", draw)

    // //键盘监听回车
    // document.onkeydown = function (event_e:Event) {
    //   if (window.event) {
    //     event_e = window.event;
    //   }
    //   var int_keycode = event_e?.charCode || event_e?.keyCode;
    //   if (int_keycode == "13") {
    //     //回车键：13

    //     if (localStore.crop.mod) console.log("点击回车了");
    //   }
    // };
  }),
)
onUnmounted(() => {
  // cleanWatchEvent();
  eventBus.off("imc-tabCrop-draw", draw)
})
</script>

<style lang="stylus">
/* 上面类名太长不好维护，放到这里 */
.ImageReader__informationCrop-input
  @apply h-full text-center w-full rounded-md text-black border-2 border-solid border-gray-200

.ImageReader__informationCropInput-icon
  @apply text-gray-500 absolute left-0 text-xl top-1 / 2 -translate-y-1 / 2 ml-2
</style>
