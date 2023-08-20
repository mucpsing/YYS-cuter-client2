/*
 * @Author: CPS-surfacePro7 holy.dandelion@139.com
 * @Date: 2023-01-22 18:50:48
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-08-19 18:07:40
 * @FilePath: \yys-cuter-client\src\components\ImageCuter\core\server.ts
 * @Description: 存放一些与服务器相关的工具函数
 */

import { ref } from "vue";
import { checkAlive } from "./api";
import { eventBus } from "@renderer/libs";
import { SettingPageValue } from "@renderer/stores";

import localStore, { openConfigPannelList } from "../store";
import config from "../store/config";
import exeConfig from "../config/exeConfig";

import type { OpenDialogReturnValue, OpenDialogOptions } from "electron";

export const SERVER_IS_START = ref(false);
/**
 * @description: 调用config.SERVER_FILE_PATH对应的exe文件，
 */
export async function serverStart(): Promise<boolean> {
  const config = {};

  const res = await window.electron.send("openExe", config);

  return res;
}

/**
 * @description: 检测服务器是否接通，更新config的状态
 */
export async function serverCheck() {
  config.SERVER_STATUS = "checking";

  SERVER_IS_START.value = await checkAlive();

  if (SERVER_IS_START.value) {
    config.SERVER_STATUS = "open";
    SERVER_IS_START.value = true;
  } else {
    config.SERVER_STATUS = "close";
    SERVER_IS_START.value = false;
  }

  console.log("serverCheck: ", SERVER_IS_START.value);

  return SERVER_IS_START.value;
}

/**
 * @description: 服务器开关控制函数，主要控制服务器的启停
 */
export async function serverSwitch(): Promise<void> {
  config.SERVER_STATUS = "checking";

  if (!SERVER_IS_START.value) {
    // 检查是否已开启链接
    await serverCheck();

    // 尝试链接
    await serverRun();

    if (!SERVER_IS_START.value) {
      config.SERVER_STATUS = "close";
      return;
    } else {
      config.SERVER_STATUS = "open";
    }
  } else {
    config.SERVER_STATUS = "open";
  }
}

/**
 * @description: 通过设定的exe路径，开启服务器本地文件
 */
export async function serverRun() {
  if (SERVER_IS_START.value) {
    console.log("serverRun: 服务器已开启");
    return SERVER_IS_START.value;
  }

  // 浏览器环境，弹出提示让用户
  if (!window.electron) return SERVER_IS_START.value;

  // exe文件路径为空，弹出提示，让用户设置
  if (!config.SERVER_EXE_PATH) {
    eventBus.emit("showDialog", {
      title: "服务器启动失败",
      message: "当前未指定截图服务器文件路径",
      rejectMsg: "关闭",
      acceptMsg: "去配置",
      type: "text",
      acceptCallback: () => {
        eventBus.emit("showSettingsPage", SettingPageValue.IMAGE_CUTER);
        while (openConfigPannelList.value.length > 0)
          openConfigPannelList.value.pop();
        openConfigPannelList.value.push("服务器配置");
      },
    });

    return SERVER_IS_START.value;
  }

  // 呼叫主进程调用
  const path: string = config.SERVER_EXE_PATH; // exe文件路径
  const argvs = {}; // 可以是配置对象，也可以是配置文件路径（json、json5）
  const res = await window.electron.send("runExe", { path, argvs });

  // 启动失败
  if (!res.success) {
    console.log("启动失败: ", res);
    return false;
  }

  // 延迟一点，然后检测接口是否能接通
  return await new Promise((resolve) => {
    setTimeout(async () => {
      SERVER_IS_START.value = await checkAlive();
      resolve(SERVER_IS_START.value);
    }, 1000);
  });
}

/**
 * @description: 选择打包好后的后端可执行文件，exe格式
 */
export async function serverSelectFilePath(): Promise<string> {
  if (!window.electron) return "";

  const opts: OpenDialogOptions = {
    title: "选择一个文件",
    properties: ["openDirectory"],
    filters: [{ name: "服务器执行文件", extensions: ["exe", "cps"] }],
  };
  const res: OpenDialogReturnValue = await window.electron.send(
    "selectSaveFile",
    opts
  );

  if (res.filePaths && res.filePaths.length > 0) return res.filePaths[0];

  return "";
}
