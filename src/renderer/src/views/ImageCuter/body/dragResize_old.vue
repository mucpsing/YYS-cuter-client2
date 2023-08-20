<!--
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-11-30 16:03:56.099670
 * @Last Modified by: CPS
 * @Last Modified time: 2022-11-30 16:03:56.099670
 * @Filename main.py
 * @Description: 基于interact插件创建的一个拖拽缩放对象
-->

<template>
  <!-- 拖拽框本体 -->
  <div
    :id="props.id"
    :style="{
      width: width + 'px',
      height: height + 'px',
      transform: transform,
      borderWidth: `${borderWidth}px`,
      borderColor: config.CROP_BORDER_COLOR,
    }"
    :class="[
      'text-gray-600',
      'text-center align-middle',
      'cps__dragResizeContainer',
      'absolute w-20 h-20 z-50',
      'border-solid border-sky-500 touch-none text-white font-sans',
      props.class,
    ]"
  >
    <div
      v-show="props.showInfo"
      :class="[
        'absolute min-w-[300px] w-full h-full left-1/2 -translate-x-[50%] translate-y-[100%] box-border p-2 align-middle',
      ]"
    >
      <strong class="box-border block w-full bg-red-200/75"
        >裁剪范围: {{ Math.trunc(currtW) }} x {{ Math.trunc(currtH) }}</strong
      >
      <strong class="box-border block w-full bg-red-200/75"
        >真实尺寸: {{ endX - startX }} x {{ endY - startY }}</strong
      >
      <strong class="box-border block w-full bg-red-200/75"
        >缩放比例: {{ localStore.imgScale.toFixed(2) }}</strong
      >
      <strong class="box-border block w-full bg-red-200/75"
        >左右偏离: {{ localStore.img_X_Offset.toFixed(2) }} -
        {{ localStore.img_Y_Offset.toFixed(2) }}</strong
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import interact from "interactjs";
import localStore, { startX, startY, endX, endY } from "../store";
import config from "../store/config";
import type { Coords } from "../imageCuter";

const currtW = ref(0);
const currtH = ref(0);

const emit = defineEmits<{
  (e: "update:width", coordValue: number): void;
  (e: "update:height", coordValue: number): void;
  (e: "update:top", coordValue: number): void;
  (e: "update:left", coordValue: number): void;
  (e: "onResize", event: Event, coords: Coords): void;
  (e: "onDrag", event: Event, coords: Coords): void;
}>();

const props = withDefaults(
  defineProps<{
    id: string; // 唯一ID
    class?: string; // 自定义样式
    width: number; // 以下四个属性提供一个响应式对象 ref/reactive 用来绑定对应属性
    height: number;
    top: number;
    left: number;
    showInfo?: boolean;
    borderWidth?: number;
  }>(),
  {
    id: "",
    class: "",
    showInfo: false,
    borderWidth: 2,
  }
);
const transform = computed(() => `translate(${props.left}px, ${props.top}px`);

// function updateCoords(key: keyof typeof localStore.crop) {}

function init(_id: string): void {
  const element = document.getElementById(props.id);

  if (!element) return;

  interact(element)
    .resizable({
      // resize from all edges and corners
      edges: { left: true, right: true, bottom: true, top: true },

      modifiers: [
        interact.modifiers.restrictEdges({ outer: "#imgContainerRef" }),
        interact.modifiers.restrictSize({ min: { width: 1, height: 1 } }),
      ],

      listeners: {
        move(event) {
          const top = props.top + event.deltaRect.top;
          const left = props.left + event.deltaRect.left;
          const width = event.rect.width;
          const height = event.rect.height;

          currtW.value = width;
          currtH.value = height;

          emit("update:top", top);
          emit("update:left", left);
          emit("update:width", width);
          emit("update:height", height);
          emit("onResize", event, { width, height, top, left });
        },
      },
    })

    .draggable({
      listeners: {
        move(event) {
          const top = props.top + event.dy;
          const left = props.left + event.dx;
          const width = event.rect.width;
          const height = event.rect.height;

          currtW.value = width;
          currtH.value = height;

          emit("update:top", top);
          emit("update:left", left);
          emit("onDrag", event, { width, height, top, left });
        },
      },
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: "#imgContainerRef",
          endOnly: true,
        }),
      ],
    });
}

onMounted(() => init(props.id));
</script>
