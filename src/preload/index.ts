import { contextBridge, ipcRenderer } from "electron"
import type { SaveDialogOptions, OpenDialogReturnValue } from "electron"

console.log("加载preload")

window.addEventListener("load", (_event) => {
  contextBridge.exposeInMainWorld("electron", {
    openDialog: async (opts: SaveDialogOptions): Promise<string> => {
      const res: OpenDialogReturnValue = await ipcRenderer.invoke("selectFolder", opts)

      if (res.canceled) return ""

      if (res.filePaths && res.filePaths.length > 0) return res.filePaths[0]

      return ""
    },

    /* 发送一个异步事件请求到主进程 */
    invoke: async <T, R>(channel: string, data: T): Promise<R | undefined> => {
      try {
        return await ipcRenderer.invoke(channel, data)
      } catch {
        return
      }
    },

    /* 发送一个同步事件请求到主进程 */
    send: async <T>(channel: string, data: T) => {
      try {
        return await ipcRenderer.invoke(channel, data)
      } catch {
        return ""
      }
    },

    /* 发送一个异步事件请求道主进程 */
    sendSync: <T>(channel: string, data: T) => {
      try {
        return ipcRenderer.send(channel, data)
      } catch {
        return ""
      }
    },

    /* 注册事件，通过同时注册一个回调函数来处理结果 */
    // eslint-disable-next-line @typescript-eslint/ban-types
    receive: async (channel: string, callback: Function) => {
      try {
        ipcRenderer.on(channel, (_event, ...args) => callback(...args))
        return true
      } catch {
        return ""
      }
    },

    /* 注册一次性事件，通过同时注册一个回调函数来处理结果 */
    // eslint-disable-next-line @typescript-eslint/ban-types
    receiveOnce: async (channel: string, callback: Function) => {
      try {
        ipcRenderer.once(channel, (_event, ...args) => callback(...args))
        return true
      } catch {
        return ""
      }
    },
  })
})
