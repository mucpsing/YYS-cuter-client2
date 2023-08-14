/*
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2023-08-12 01:43:45
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-08-12 01:52:45
 * @FilePath: \YYS-cuter-client2\src\main\window.ts
 * @Description: 处理一些窗口相关的事件和生命周期
 */

import { join } from "path";

import { is } from "@electron-toolkit/utils";
import { shell, BrowserWindow } from "electron";
import icon from "../../resources/icon.png?asset";

import { ipcMainEventsInit } from "./event";

let win: BrowserWindow | null = null;
const preload = join(__dirname, "../preload/index.js");

export async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload,
      sandbox: true,
      webSecurity: false,
      nodeIntegration: false,
      contextIsolation: true,
      allowRunningInsecureContent: true,
    },
  });

  /* 加载一些窗口生命周期 */
  winEventInit(win);

  /* 加载一些全局事件 */
  ipcMainEventsInit(win);
}

export function winEventInit(win: BrowserWindow) {
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    win.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  }

  win.on("ready-to-show", () => {
    win.show();
  });

  win.webContents.setWindowOpenHandler((details) => {
    // 是否仅访问https的url，或者全部都不访问
    // if (details.url.startsWith("https:")) shell.openExternal(details.url);

    // 默认打开所有url
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });
}
