/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-08-11 11:32:29
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-08-19 17:38:40
 * @FilePath: \yys-cuter-client\src\libs\eventBusMain.ts
 * @Description: 触发主进程的事件
 */
import type { OpenDialogReturnValue, SaveDialogSyncOptions } from "electron";
import type { SaveDialogOptions, OpenDialogOptions } from "electron";

export interface electronAPI {
  startDrag: (filename: string) => void;
  openDialog: (opts: SaveDialogOptions | OpenDialogOptions) => Promise<string>;

  invoke: <T, R>(channel: string, opts: T) => Promise<R | undefined>;
  send: <T, R>(channel: string, opts: T) => Promise<R>;

  sendSync: (channel: string, callback: Function) => Promise<string | boolean>;
  receive: (channel: string, callback: Function) => Promise<string | boolean>;
  receiveOnce: (
    channel: string,
    callback: Function
  ) => Promise<string | boolean>;
}

/**
 * @description: 页面调用主进程事件时调用本模块
 * @return {*}
 */
export const eventBusMain = {
  emit: async <T, R>(event: string, data: T): Promise<R | undefined> => {
    return await window.electron.invoke<T, R>(event, data);
  },

  selectFolder: async (opts: SaveDialogSyncOptions) => {
    if (!window.electron) return "";

    const res: OpenDialogReturnValue = await window.electron.send(
      "selectFolder",
      opts
    );

    if (!res.canceled && res.filePaths && res.filePaths.length > 0)
      return res.filePaths[0];

    return "";
  },

  selectFile: async (opts) => {
    return;
  },
};
