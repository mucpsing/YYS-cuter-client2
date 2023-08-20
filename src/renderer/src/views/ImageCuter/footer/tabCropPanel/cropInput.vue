<!--
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-12-27 13:50:10.196566
 * @Last Modified by: CPS
 * @Last Modified time: 2022-12-27 13:50:10.196566
 * @Filename main.py
 * @Description: 
-->

<template>
  <div class="relative w-full cps-input-container">
    <label :class="['inline']" for="cropTitle">{{ props.label }}</label>
    <input
      :id="props.id"
      ref="inputRef"
      :class="[
        'text-sm text-red-500 w-4/5',
        'border-none outline-none shadow-none',
      ]"
      name="cropTitle"
      :value="props.value"
      type="text"
      required
      onfocus="this.select()"
      onmouseenter="this.focus()"
      @input="onInput"
    />
    <span :class="['hidden', 'absolute top-0 left-0']">{{ props.label }}</span>
    <i
      :class="[
        'cps-input-bgline',
        'absolute bottom-0 left-0 w-1/5 h-0.5',
        'bg-red-500',
      ]"
    ></i>
  </div>
</template>

<script setup lang="ts">
import { eventBus } from "@renderer/libs";
import localStore from "../../store";
import config from "../../store/config";

const inputRef = ref<HTMLInputElement>();

const props = withDefaults(
  defineProps<{
    id?: string;
    autoFocus: boolean;
    label?: string;
    value: string;
  }>(),
  {
    id: "",
    autoFocus: false,
    label: () => "标题: ",
  }
);

const emit = defineEmits<{
  (event: "update:value", newValue: string): void;
  (e: "onblur"): void;
}>();

const onInput = (e: any) => {
  console.log("update:value");

  emit("update:value", e.target.value);

  // let newValue = e.target.value;

  // if (newValue.toString().endsWith("+")) {
  //   console.log("发现结尾+号，进行替换");

  //   newValue.replace(/\+$/g, "");
  // }

  // emit("update:value", newValue);
};

let autoFocusID;
let inputElement: HTMLInputElement;

function onEnterKey(event: KeyboardEvent) {
  //

  if (event.key === "Enter" && localStore.currtMode === "crop") {
    console.log("更新title");
    localStore.setCurrtTitle();

    // 更新预览
    if (!config.AUTO_DRAW) eventBus.emit("imc-tabCrop-draw");
  } else if (event.key === "+") {
    if (inputRef.value) {
      console.log("更新数据: ", inputRef.value.value);
      localStore.addCoords("add");
    }
  }
}

onMounted(() => {
  // inputElement = document.getElementById(props.id) as HTMLInputElement;
  inputElement = inputRef.value as HTMLInputElement;

  /** 【loop】 自动聚焦*/
  if (inputElement) {
    autoFocusID = setInterval(() => {
      if (!inputElement || !props.id) return;
      if (!document.activeElement) return; // 当前没有激活的元素
      if (document.activeElement.tagName.toLowerCase() == "input") return; // 正在其他input中输入数据
      if (props.autoFocus) {
        // console.log("重新聚焦1");
        if (inputElement.value.length > 0) {
          inputElement.select();
        }

        inputElement.focus();
      }
    }, 1000);
  }

  /** 【evet】 Enter键监听*/
  inputElement.addEventListener("keydown", onEnterKey);
});

onUnmounted(() => {
  if (autoFocusID) clearInterval(autoFocusID);

  inputElement.removeEventListener("keydown", onEnterKey);
});
</script>

<style lang="stylus">
.cps-input-container *
  transition 0.3s

.cps-input-container input:valid ~ span, input:focus ~ span
  color blue
  transform translateY(-1em)
  font-size 0.8em

.cps-input-container input:valid ~ .cps-input-bgline, input:focus ~ .cps-input-bgline
  width 80%
</style>
