/*
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2023-08-11 18:24:34
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-08-12 01:48:23
 * @FilePath: \YYS-cuter-client2\src\main\index.ts
 * @Description: 主程序入口
 */
import process from "process";
import { app, BrowserWindow } from "electron";

import { optimizer } from "@electron-toolkit/utils";
import { createWindow } from "./window";

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
if (process.platform === "win32") app.setAppUserModelId(app.getName());

// 保证当前应用单例
if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

app.whenReady().then(() => {
  app.setAppUserModelId("com.electron");

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
