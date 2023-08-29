/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-08-11 11:32:29
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-08-24 00:22:43
 * @FilePath: \yys-cuter-client\src\libs\eventBusMain.ts
 * @Description: 触发主进程的事件
 */
import type { OpenDialogReturnValue, SaveDialogSyncOptions } from "electron"
import type { SaveDialogOptions, OpenDialogOptions } from "electron"
import { isElectron } from "@renderer/utils/tools"
import { EventList } from "@/types/global"
export interface electronAPI {
  startDrag: (filename: string) => void
  openDialog: (opts: SaveDialogOptions | OpenDialogOptions) => Promise<string>

  invoke: <T, R>(channel: string, opts: T) => Promise<R | undefined>
  send: <T, R>(channel: string, opts: T) => Promise<R>

  sendSync: (channel: string, callback: Function) => Promise<string | boolean>
  receive: (channel: string, callback: Function) => Promise<string | boolean>
  receiveOnce: (channel: string, callback: Function) => Promise<string | boolean>
}

/**
 * @description: 页面调用主进程事件时调用本模块
 * @return {*}
 */
export const eventBusMain = {
  emit: async <T, R>(event: string, data: T): Promise<R | void> => {
    // 所有事件需要在 src/types/global.EventList中声明，否则无法使用
    if (!EventList.includes(event)) {
      console.log("当前事件不在注册列表中: ", event)
      return
    }

    // 调用主进程实现
    if (isElectron()) return await window.electron.invoke<T, R>(event, data)

    // 调用浏览器实现
    switch (event) {
      case "exportFile":
        console.log("出发浏览器导出文件")

      default:
        console.log("当前事件未在浏览器实现: ", event)
    }

    return
  },

  selectFolder: async (opts: SaveDialogSyncOptions) => {
    if (!window.electron) return ""

    const res: OpenDialogReturnValue = await window.electron.send("selectFolder", opts)

    if (!res.canceled && res.filePaths && res.filePaths.length > 0) return res.filePaths[0]

    return ""
  },

  selectFile: async (opts) => {
    return
  },
}
