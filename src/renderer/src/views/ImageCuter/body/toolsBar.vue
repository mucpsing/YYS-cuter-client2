<!--
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-11-29 15:18:08.765064
 * @Last Modified by: CPS
 * @Last Modified time: 2022-11-29 15:18:08.765064
 * @Filename main.py
 * @Description: 插件的右侧工具栏，主要菜单数据存放在./store/menus.ts中
-->

<template>
  <section
    :class="[
      'ImageReaderCard__toolsBar',
      'flex flex-col flex-grow-0 shrink-0 justify-between',
      'rounded-2xl bg-white w-12',
    ]"
  >
    <!-- 【主】工具 -->
    <ul class="flex flex-col items-center justify-start h-full gap-2 pt-5">
      <template v-for="menu in Object.values(mainMenus)" :key="menu.id">
        <t-tooltip :content="menu.title" placement="left">
          <li
            :class="[
              'hover:text-orange-400',
              localStore.currtMode == menu.name
                ? 'text-blue-600'
                : 'text-black',
            ]"
            class="cursor-pointer"
            @click="localStore.setMode(menu.name as ModesT)"
          >
            <c-icon-font
              class="text-2xl hover:text-3xl"
              :iconName="menu.icon"
            ></c-icon-font>
          </li>
        </t-tooltip>
      </template>
    </ul>

    <!-- 【副】菜单 -->
    <ul class="flex flex-col items-center justify-end h-full gap-3 pb-5">
      <template v-for="menu in subMenus" :key="menu.id">
        <t-tooltip :content="menu.title" placement="left">
          <li
            class="text-black cursor-pointer hover:text-sky-400"
            @click="menu.onclick"
          >
            <c-icon-font
              class="text-2xl hover:text-3xl"
              :iconName="menu.icon"
            ></c-icon-font>
          </li>
        </t-tooltip>
      </template>
    </ul>
  </section>
</template>

<script setup lang="ts">
import localStore from "../store";
import { subMenus, mainMenus, type ModesT } from "../store/menus";

// import config from "../store/config";
// import { eventBus } from "@renderer/libs";
// import { exportConfigData } from "../core";

// import type { SaveDialogReturnValue } from "electron";

/**
 * @description: 菜单事件，让用户指定一个文件导出位置，并根据不同环境讲文件保存到本地
 */
// async function saveConfigFileDialog() {
//   // 检测是否有合法的导出路径
//   if (!localStore.setCurrtFile) return console.log("当前未打开任何文件");

//   /* 如果没有导出路径，弹出让用户指定一个导出位置 */
//   if (!config.JSON_EXPORT_PATH) {
//     // 弹出提示框让用户指定输出位置
//     const res: SaveDialogReturnValue = await window.electron.send(
//       "selectSaveFile",
//       {
//         buttonLabel: "确定保存",
//         title: "请指定一个导出位置（无需添加后缀名）",
//         message: "请指定一个导出位置（无需添加后缀名）",
//         filters: [{ name: "json文件", extensions: ["json", "json5"] }],
//       }
//     );

//     if (!res.canceled && res.filePath) {
//       config.JSON_EXPORT_PATH = res.filePath;
//     } else {
//       return;
//     }
//   }

//   /* 文件保存前的最终确认 */
//   eventBus.emit("showDialog", {
//     title: "导出json配置文件到本地",
//     message: `保存路径: ${config.JSON_EXPORT_PATH}`,
//     acceptMsg: "确定保存",
//     acceptCallback: async () => {
//       const data = exportConfigData();
//       const path = config.JSON_EXPORT_PATH;
//       const saveOptsString = JSON.stringify({ path, data });

//       // TODO 这里添加判断是否存在electron环境，如果不存在，则调用浏览器的下载api，讲文件以text文件的方式下载到本地
//       // 发送数据给主进程，让主进程进行保存
//       const ret: boolean = await window.electron.send(
//         "exportJsonFile",
//         saveOptsString
//       );

//       /* 保存文件失败提示框 */
//       if (!ret) {
//         eventBus.emit("showDialog", {
//           title: "导出json配置文件失败",
//           message: `导出路径: ${config.JSON_EXPORT_PATH}，文件保存失败`,
//         });
//       }
//     },
//   });
// }

onMounted(() => {
  // eventBus.on("imageCuterToolBarSaveConfig", saveConfigFileDialog);
});
</script>
<style lang="stylus">
.ImageReaderCard__toolsBar *
  transition font-size 0.4s cubic-bezier(0.25, 1, 0.5, 1), color 0.1s cubic-bezier(0.25, 1, 0.5, 1)
</style>
