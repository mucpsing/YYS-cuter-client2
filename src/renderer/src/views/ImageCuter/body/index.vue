<!--
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-11-28 16:07:33.747583
 * @Last Modified by: CPS
 * @Last Modified time: 2022-11-28 16:07:33.747583
 * @Filename main.py
 * @Description: 截图基础页，打开文件的逻辑，一些插件自带的事件

-->
<template>
  <section
    id="ImageReaderCard__container"
    :class="['ImageReaderCard__container', 'relative flex flex-grow justify-between gap-3']"
  >
    <section id="imgContainerRef" ref="imgContainerRef" :class="['relative flex-grow rounded-2xl bg-white']">
      <!-- 【工具状态页】 -->
      <transition name="ImageReader__footerTab-fade">
        <keep-alive>
          <component :is="page[localStore.currtMode]"></component>
        </keep-alive>
      </transition>

      <!-- 基础拖拽框 -->
      <drag-resize
        v-show="localStore.currtMode == 'crop' && !isOverDropZone"
        :id="localStore.dragResizeID"
        v-model:left="resizeData.left"
        v-model:top="resizeData.top"
        v-model:width="resizeData.width"
        v-model:height="resizeData.height"
        :borderWidth="config.CROP_BORDER_WIDTH"
        :show-info="localStore.DEBUG"
        @on-resize="onDragCoordsResize"
        @on-drag="onDragCoordsResize"
      ></drag-resize>

      <!-- 拖拽激活后的样式遮罩层 -->
      <div class="ImageReader__drapMask" :class="{ 'ImageReader__drapMask-show': isOverDropZone }">
        <div class="ImageReader__drapMaskTip">{{ tip }}</div>
      </div>

      <!-- 图片容器 -->
      <div ref="imgContainerRef" :class="['w-full h-full flex justify-center items-center']">
        <!-- 点击和拖拽激活区域 -->
        <div
          id="clickAndDragArea"
          :class="['absolute w-full h-full z-0', localStore.currtFilePath == '' ? 'cursor-pointer' : 'cursor-auto']"
          @click="openFileDialog('clickAndDragArea')"
        ></div>

        <div
          id="imgBorderRef"
          ref="imgBorderRef"
          :class="[localStore.zoomMode == 'out' ? 'w-full h-full' : '', 'flex justify-center items-center']"
        >
          <img
            id="imgElementRef"
            ref="imgElementRef"
            :class="['object-contain rounded-2xl', 'w-full h-full']"
            :src="localStore.currtFilePath"
            alt="未加载任何图片"
            :style="{
              maxHeight: `${config.SCREEN_MAX_HEIGHT}px`,
              maxWidth: `${config.SCREEN_MAX_WIDTH}px`,
            }"
          />
        </div>

        <!-- input元素，用来调用打开文件 -->
        <input
          ref="selectFileRef"
          type="file"
          :value="currtInputValue"
          :accept="config.IMG_SUPORT_TYPES.join(',')"
          class="hidden"
          @change="openFileOnInput"
        />
      </div>
    </section>

    <!-- 工具栏 -->
    <toolsBar></toolsBar>

    <ToolsMenus v-show="localStore.currtMode == 'crop'"></ToolsMenus>
  </section>
</template>

<script lang="ts">
import history from "./pageHistory.vue"
import coordsPreview from "./pageSelectron.vue"
import dataEditor from "./pageDataEditor.vue"
// import pageServices from "./pageServices.vue"

type ComponentName = "history" | "coordsPreview" | "dataEditor" | "pageServices"

/** 核心页面，各个主要菜单功能页 */
const page: {
  [menuName: string]: ComponentName
} = {
  "coords-preview": "coordsPreview",
  "picture-info": "history",
  "data-editor": "dataEditor",
  // "server-panel": "pageServices",
}

export default { components: { history, coordsPreview, dataEditor } }
</script>

<script setup lang="ts">
import type { Coords } from "../imageCuter"

import config from "../store/config"
import localStore, { ElementCache, currtInputValue } from "../store"

import { throttle as debounce } from "lodash"
import { onMounted, ref, onUnmounted } from "vue"
import { useDropZone, useResizeObserver } from "@vueuse/core"

/* 组件引入 */
import dragResize from "./dragResize_old.vue"
import toolsBar from "./toolsBar.vue"

/* 工具库引入 */
import { eventBus } from "@renderer/libs"
import { Rect, rectWithRect } from "@renderer/utils/Intersect"

const tip = "支持: jpg、bmp、png、gif 文件。"

const imgBorderRef = ref<HTMLDivElement>()
const imgElementRef = ref<HTMLImageElement>() // 图片标签实例
const imgContainerRef = ref<HTMLDivElement>() // 画板实例
const selectFileRef = ref<HTMLInputElement>() // 文件选择框元素实例

const resizeData = reactive({
  top: 0,
  left: 0,
  width: 100,
  height: 100,
})

/**
 *  @Description 所有事件和元素实例在这里获取和缓存，相对的销毁在unMounted钩子进行
 *
 */
function toolCropInit() {
  if (!imgElementRef.value || !imgElementRef.value) return console.log("获取图片元素实例失败")
  if (!imgContainerRef.value || !imgContainerRef.value) return console.log("获取画板元素实例失败")

  // 缓存常用实例
  ElementCache.imgElement = document.getElementById("imgElementRef") as HTMLImageElement
  ElementCache.imgContainer = document.getElementById("imgContainerRef") as HTMLElement
  ElementCache.imgBorder = document.getElementById("imgBorderRef") as HTMLElement
  ElementCache.dragElement = document.getElementById(localStore.dragResizeID) as HTMLElement

  // 清空onload是为了每次刷新不要保留旧的
  ElementCache.imgElement.onload = (_event) => {}

  /* 通过监听图片外容器的尺寸变化来更新图片元素实际尺寸 */
  useResizeObserver(imgContainerRef, onResize)
  useResizeObserver(imgElementRef, onResize)

  // 全局事件声明
  eventBus.on("imc-body-updateCoords", updateReiszeCoords) // 更新裁剪框位置
  eventBus.on("imageCuterBodyOpenFile", openFileDialog) // 打开文件
  eventBus.on("imc-updateCorpInfo", onDragCoordsResize) // 拖动裁剪框
  eventBus.on("imc-body-onResize", onResize)
}

/**
 *  @Description 当触发拖拽动作的时候，触发此函数，入口函数
 */
const { isOverDropZone } = useDropZone(imgContainerRef, onMaskDrop)
function onMaskDrop(files: File[] | null) {
  if (!isOverDropZone || !files) return
  const file = files[0]

  // 校验文件类型
  if (!config.IMG_SUPORT_TYPES.includes(file.type)) {
    return console.log("不支持的文件格式", file.type)
  }

  // 没有path的情况
  if (!file.path) {
    // 通过别的地方拖拽过来的图片一般会叫 download.xxx
    if (file.name.toLowerCase().startsWith("download.")) {
      // 弹出提示框询问是否渲染
      eventBus.emit("showDialog", {
        title: "当前文件路径为空！",
        message: "是否读继续读取此操作",
        acceptMsg: "继  续",
        acceptCallback: () => {
          localStore.setCurrtFile(file)
        },
      })
    } else {
      console.log("无法识别path", { file })
    }
  } else {
    localStore.setCurrtFile(file)
  }
}

/**
 *  @Description 模拟点击input标签，弹出文件选择框，用来选择图片文件
 */
function openFileDialog(flag?: string) {
  if (flag == "clickAndDragArea") {
    if (localStore.currtFilePath != "") {
      return console.log("已经选择文件，请清空文件后在点击打开")
    }
  }

  if (selectFileRef.value && selectFileRef.value) {
    selectFileRef.value.click()
  } else {
    console.log("selectFileRef: 检查失败，文件选择框打开失败")
  }
}

/**
 *  @Description 用来选择指定文件，当前支持图片，后面加入支持json
 */
function openFileOnInput(e: Event) {
  if (e && e.target) {
    const target = e.target as HTMLInputElement
    if (!target.files) return
    if (target.files.length > 0) {
      const file = target.files[0] as File

      localStore.setCurrtFile(file)
    }
  }
}

/**
 *
 *  @Description 更新body内部的裁剪框定位信息，根据真实坐标/相对比例 + 真实偏移,本函数仅更改显示信息，不修改真实数据
 *
 */
const updateReiszeCoords = debounce((_coords: Coords) => {
  const startX = localStore.crop.startX / localStore.imgScale
  const startY = localStore.crop.startY / localStore.imgScale
  const endX = localStore.crop.endX / localStore.imgScale
  const endY = localStore.crop.endY / localStore.imgScale

  resizeData.top = localStore.img_Y_Offset + startY
  resizeData.left = localStore.img_X_Offset + startX
  resizeData.height = endY - startY
  resizeData.width = endX - startX
}, config.GENERAL_DELAY)

/**
 *  @Description 更新截取坐标
 *
 */
const onDragCoordsResize = debounce((_e: Event, _coords?: Coords) => {
  // 获取画板、图片显示、裁剪范围等元素的当前显示尺寸
  const crop = ElementCache.dragElement.getBoundingClientRect()
  const imgBorder = ElementCache.imgBorder.getBoundingClientRect()

  let imgRect
  if (localStore.zoomMode == "out") {
    imgRect = new Rect(localStore.imgElementX, localStore.imgElementY, localStore.imgElementW, localStore.imgElementH)
  } else {
    imgRect = new Rect(imgBorder.x, imgBorder.y, imgBorder.width, imgBorder.height)
  }
  const cropRect = new Rect(crop.x, crop.y, crop.width, crop.height)

  // 记录是否相交的状态
  localStore.isIntersect = rectWithRect(cropRect, imgRect)

  if (!localStore.isIntersect) return

  const borderWidth = config.CROP_BORDER_WIDTH

  const startX = (Math.max(localStore.imgElementX, crop.x) - localStore.imgElementX + borderWidth) * localStore.imgScale // 实际起始位置x，0,0相当于图片左上角
  const startY = (Math.max(localStore.imgElementY, crop.y) - localStore.imgElementY + borderWidth) * localStore.imgScale // 实际起始位置y，0,0相当于图片左上角
  const endX =
    (Math.min(localStore.imgElementX + localStore.imgElementW, crop.right - borderWidth) - localStore.imgElementX) *
    localStore.imgScale // 实际结束位置x,
  const endY =
    (Math.min(localStore.imgElementY + localStore.imgElementH, crop.bottom - borderWidth) - localStore.imgElementY) *
    localStore.imgScale // 实际结束位置y,

  localStore.crop.startX = startX
  localStore.crop.startY = startY
  localStore.crop.endX = endX
  localStore.crop.endY = endY

  // console.log({ crop: localStore.crop });

  if (config.SCREEN_AUTO_DRAW) eventBus.emit("imc-tabCrop-draw", "")
}, config.GENERAL_DELAY)

/**
 *  @Description 更新store里面imgElementRef相关的状态尺寸
 */
const onResize = debounce(() => {
  // console.log("onResize")

  const img = ElementCache.imgElement.getBoundingClientRect()
  const container = ElementCache.imgContainer.getBoundingClientRect()
  const imgBorder = ElementCache.imgBorder.getBoundingClientRect()

  const windowHeight = window.innerHeight
  const maxHeight = windowHeight - config.UI_HEADER_HEIGHT - config.UI_FOOTER_HEIGHT - config.UI_GAP_WIDTH * 2

  localStore.containerW = container.width
  localStore.containerH = container.height

  // 当缩小窗口时，需要重置画板的高度，否则下方的控制台会被顶到窗口外面
  if (container.height > maxHeight) {
    config.SCREEN_MAX_HEIGHT = maxHeight
  } else {
    if (config.AUTO_ZOOM_OUT && localStore.zoomMode == "out") localStore.zoomOut()
  }

  // 当图片被放大时，必须通过图片的真实尺寸计算出真实的裁剪信息
  // 当图片缩小是，外边框元素将会和图片元素尺寸一样，直接获取外边框元素就是裁剪信息
  if (localStore.zoomMode == "out") {
    // 根据当前哪个边长到达最大值来，生成一个假设的宽和高
    let imgTempH, imgTempW
    if (Math.trunc(config.SCREEN_MAX_HEIGHT) == Math.trunc(imgBorder.height)) {
      imgTempH = imgBorder.height
      imgTempW = (localStore.imgWidth / localStore.imgHeight) * imgTempH
    } else {
      imgTempW = imgBorder.width
      imgTempH = (localStore.imgHeight / localStore.imgWidth) * imgTempW
    }

    // 因为图片元素始终居中于画板，其中一边的尺寸
    // 使用不固定长度的一边与假设的宽高进行对比，计算出当前存在左右白边还是上下白边
    if (imgBorder.width < imgTempW) {
      // 以宽为基准
      // img.width = img.width;
      img.height = (localStore.imgHeight / localStore.imgWidth) * img.width
      img.y = (container.height - img.height) / 2 + container.y // 修正高度
    } else {
      // 以高为基准
      // img.height = img.height;
      img.width = (localStore.imgWidth / localStore.imgHeight) * img.height
      img.x = (container.width - img.width) / 2 + container.x
    }

    localStore.imgScale = localStore.imgHeight / img.height
    localStore.img_X_Offset = (imgBorder.width - img.width) / 2
    localStore.img_Y_Offset = (imgBorder.height - img.height) / 2
  } else {
    localStore.imgScale = localStore.imgHeight / imgBorder.height
    localStore.img_X_Offset = imgBorder.x - container.x
    localStore.img_Y_Offset = imgBorder.y - container.y
  }

  localStore.imgElementH = img.height
  localStore.imgElementW = img.width
  localStore.imgElementX = img.x
  localStore.imgElementY = img.y
}, config.GENERAL_DELAY * 2)

onMounted(() => nextTick(() => toolCropInit()))
onUnmounted(() => {
  eventBus.off("imc-body-updateCoords", updateReiszeCoords)
  eventBus.off("imageCuterBodyOpenFile", openFileDialog)
  eventBus.off("imc-updateCorpInfo", onDragCoordsResize)
  eventBus.off("imc-body-onResize", onResize)
})
</script>

<style lang="stylus">
/* 遮罩具体样式 */
.ImageReader__drapMask
  position absolute
  width 100%
  height 100%
  text-align center
  display flex
  align-items center
  justify-content center
  pointer-events none
  color rgba(255, 255, 255, 1)
  background-color rgba(0, 0, 0, 0.2)
  opacity 0
  box-sizing border-box
  border-radius 15px
  backdrop-filter blur(5px)
  transition all 0.6s cubic-bezier(0.25, 1, 0.5, 1)

  .ImageReader__drapMaskTip
    font-size clamp(1rem, 4vh, 2rem)

.ImageReader__drapMask-show
  opacity 1
</style>
