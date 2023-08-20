<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-07-25 17:10:17
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-08-19 16:57:41
 * @FilePath: \yys-cuter-client\src\components\ImageCuter\body\pageDataEditor.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
       maxHeight: localStore.config.SCREEN_MAX_HEIGHT + 'px',
      maxWidth: localStore.config.SCREEN_MAX_WIDTH + 'px',
            width: localStore.config.SCREEN_MAX_WIDTH + 'px',
      height: localStore.config.SCREEN_MAX_HEIGHT + 'px',
-->

<template>
  <div
    id="jsonEditorContainer"
    ref="jsonEditorContainer"
    :style="{
      maxHeight: config.SCREEN_MAX_HEIGHT + 'px',
      maxWidth: config.SCREEN_MAX_WIDTH + 'px',
    }"
    :class="['json-editor-container', 'absolute z-10 rounded-md h-full w-full']"
  ></div>
</template>

<script setup lang="ts">
import localStore from "../store";
import config from "../store/config";

// import data from "../store/data";
// import { PropType } from "vue";

import { JSONEditor, JSONEditorPropsOptional, Mode } from "vanilla-jsoneditor";

// interface testDataItem {
//   name: string;
//   id: number;
// }

// const props = defineProps({
//   jsonData: {
//     type: Array as PropType<testDataItem[]>,
//     default: () => [
//       { name: "1", id: 1 },
//       { name: "2", id: 2 },
//     ],
//   },
// });

// const emit = defineEmits<{
//   (e: "update:data", data: any): void;
// }>();

const jsonEditorContainer = ref<HTMLDivElement | null>(null);
let content = {
  text: undefined,
  json: localStore.currtCoordsList,
};

let jsonEditor: typeof JSONEditor;

onMounted(() => {
  initJSONEditor();
});

onActivated(() => {
  if (localStore.currtMode == "data-editor") {
    console.log("onActivated: ", localStore.currtMode);
  }
});

onDeactivated(() => {
  console.log("onDeactivated");
});

const onDataChange = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updatedContent: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  previousContent: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { contentErrors, patchResult }: any
) => {
  console.log("onChange", {
    updatedContent,
    previousContent,
    contentErrors,
    patchResult,
  });
  content = updatedContent;
};

function initJSONEditor() {
  const element = document.getElementById("jsonEditorContainer") as HTMLElement;

  const options: JSONEditorPropsOptional = {
    mode: Mode.table,
    mainMenuBar: true,
    content,
    onChange: onDataChange,
  };

  if (jsonEditorContainer.value) {
    const editor = new JSONEditor({
      target: element,
      props: options,
    });
  }
}

function handleJSONChange() {
  if (jsonEditor) {
    // emit("update:jsonData", jsonEditor.get());
  }
}

onBeforeUnmount(() => {
  if (jsonEditor) jsonEditor.destroy();
});
</script>

<style lang="styl">
#jsonEditorContainer {
  /* define a custom theme color and font size */
  --jse-theme-color: #ec1897;
  --jse-theme-color-highlight: #f553b5;
  --jse-font-size: 18px;
  --jse-font-size-mono: 20px;
}
</style>
