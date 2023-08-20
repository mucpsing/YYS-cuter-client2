<!--
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-12-08 22:59:42.112214
 * @Last Modified by: CPS
 * @Last Modified time: 2022-12-08 22:59:42.112214
 * @Filename main.py
 * @Description: headless 官方样式中的dialog
 * @example 使用方式
 * dialogRef.value.open() // 
 *
 * dialogRef.value.open({
     title: '当前文件路径为空！',
     message: '是否读继续读取彼此操作',
     acceptMsg: '继  续',
     acceptCallback: () => {
       localStore.setCurrtFile(files[0]);
     },
   });
-->

<template>
  <TransitionRoot appear :show="show" as="template">
    <Dialog as="div" class="relative z-[2000]" @close="close">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 z-50 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-full p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900"
              >
                <slot name="title">{{ title }}</slot>
              </DialogTitle>

              <!-- 弹出框body 通过dialogType来决定渲染的类型 -->
              <div class="mt-2">
                <div v-if="dialogType == 'text'">
                  <p class="text-sm text-gray-500">
                    <slot name="context">{{ message }}</slot>
                  </p>
                </div>
                <div v-else-if="dialogType == 'input'">
                  <p class="text-sm text-gray-500">
                    <slot name="context">
                      <cps-input
                        v-model:value="inputContext"
                        :label="message"
                      ></cps-input>
                    </slot>
                  </p>
                </div>
              </div>

              <!-- 弹出 按钮1和按钮2 -->
              <div class="flex flex-row justify-end gap-4 mt-4">
                <button
                  type="button"
                  :class="[
                    'inline-flex justify-center px-4 py-2',
                    'rounded-md border border-transparent',
                    'text-sm font-medium text-blue-900 bg-blue-100 hover:bg-blue-200',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                  ]"
                  @click="accept"
                >
                  {{ acceptMsg }}
                </button>
                <button
                  type="button"
                  :class="[
                    'inline-flex justify-center px-4 py-2',
                    'rounded-md border border-transparent',
                    'text-sm font-medium text-red-900 bg-red-100 hover:bg-red-200',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                  ]"
                  @click="reject"
                >
                  {{ rejectMsg }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { TransitionRoot, TransitionChild } from "@headlessui/vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
// import CpsInput from "@/components/global/cpsInput.vue";
import type { DialogOpenOptions } from "@renderer/global";

// export type DialogElement = Ref<HTMLElement & { open: (options: any) => void }>;

const emit = defineEmits(["on-accept", "on-reject"]);

/* 默认不显示，外部通过ref.show=xxx 来控制是否显示*/
const show = ref(false);
const title = ref("弹出框标题");
const message = ref("弹出框内容");
const inputContext = ref("输入框内容");

/**
 * @description 弹出框的类型，当前支持: text|input
 */
const dialogType = ref("text");

const acceptMsg = ref("确  认");
const rejectMsg = ref("取  消");

let ACCEPT_CALLBACK: Function | null;
let REJECT_CALLBACK: Function | null;

const close = () => (show.value = false);

function open(options: DialogOpenOptions) {
  // 默认配置
  options = Object.assign(
    {
      title: "",
      message: "",
      type: "text",
      acceptMsg: "确 定",
      rejectMsg: "取 消",
      acceptCallback: null,
      rejectCallback: null,
    } as DialogOpenOptions,
    options
  );

  if (options) {
    if (options.type) dialogType.value = options.type;
    if (options.message) message.value = options.message;
    if (options.title) title.value = options.title;
    if (options.acceptMsg) acceptMsg.value = options.acceptMsg;
    if (options.rejectMsg) rejectMsg.value = options.rejectMsg;

    if (options.acceptCallback) {
      ACCEPT_CALLBACK = options.acceptCallback;
    } else {
      // 因为可能存在全局调用，所以确保该回调函数始终为最新
      ACCEPT_CALLBACK = null;
    }

    if (options.rejectCallback) {
      REJECT_CALLBACK = options.rejectCallback;
    } else {
      // 因为可能存在全局调用，所以确保该回调函数始终为最新
      REJECT_CALLBACK = null;
    }
  }

  show.value = true;
}

async function accept() {
  emit("on-accept");

  /* 如果传入了回调，则执行回调函数 */
  if (ACCEPT_CALLBACK) ACCEPT_CALLBACK();
  close();
}

async function reject() {
  emit("on-reject");
  if (REJECT_CALLBACK) REJECT_CALLBACK();
  close();
}

defineExpose({ show, close, open, title, message });
</script>
