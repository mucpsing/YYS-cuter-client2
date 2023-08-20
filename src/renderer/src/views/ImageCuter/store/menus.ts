/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-02-08 17:00:45
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-08-20 12:01:38
 * @FilePath: \yys-cuter-client\src\components\ImageCuter\store\menus.ts
 * @Description: 左边工具条的数据对象，
 * 注意！icon中自动添加了cps-yys的前缀，icon名称需要手动去除该前缀再添加到数据中
 *
 */
import { eventBus, eventBusMain } from "@renderer/libs";
import { SettingPageValue } from "@renderer/stores";
import { openConfigPannelList } from "./index";
import data from "./data";

export const mainMenus = {
  crop: {
    icon: "crop",
    name: "crop",
    title: "裁剪工具",
    id: 1,
  },
  "coords-preview": {
    icon: "full-screen",
    name: "coords-preview",
    title: "预览工具",
    id: 3,
  },
  "picture-info": {
    icon: "picture-outline",
    name: "picture-info",
    title: "图片信息",
    id: 4,
  },
  "data-editor": {
    icon: "json",
    name: "data-editor",
    title: "数据编辑",
    id: 5,
  },
  "server-panel": {
    icon: "API",
    title: "服务器API",
    name: "server-panel",
    id: 2,
  },
};

export const subMenus = [
  {
    icon: "folder-opened",
    name: "read-folder",
    title: "打开图片",
    id: 11,
    onclick: () => {
      eventBus.emit("imageCuterBodyOpenFile", "");
    },
  },
  {
    name: "save",
    icon: "baocun",
    title: "保存配置文件",
    id: 22,
    onclick: () => {
      eventBusMain.emit("exportFile", {
        path: ".",
        data: JSON.stringify(data),
      });
    },
  },
  {
    name: "crop-settings",
    icon: "setting",
    title: "插件配置",
    id: 33,
    onclick: () => {
      // 默认展开 通用配置
      if (openConfigPannelList.value.length == 0) {
        openConfigPannelList.value.push("通用配置");
      }

      eventBus.emit("showSettingsPage", SettingPageValue.IMAGE_CUTER);
    },
  },
];

export type ModesT = keyof typeof mainMenus;
