/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-02-08 17:00:45
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-08-20 22:44:50
 * @FilePath: \yys-cuter-client\src\libs\eventBus.ts
 * @Description: 事件加载器入口，汇总所有插件的事件，全局事件也在这里声明
 */
import mitt from "mitt"

import type { SettingPageValue } from "@renderer/stores"
import type { DialogOpenOptions } from "@renderer/global"
import type { SaveDialogOptions, OpenDialogOptions } from "electron"
import type { IMCEventBusTypes } from "@renderer/views/ImageCuter/events"

export type EventBus = {
  bodyUpdateReiszeCoords: string
  showDialog: DialogOpenOptions
  showSettingsPage: SettingPageValue
  mainOpenFolder: SaveDialogOptions | OpenDialogOptions
} & IMCEventBusTypes

// 初始化一个 mitt 实例
export const eventBus = mitt<EventBus>()

// 在导出时使用旧的 API 名称去调用 mitt 的 API
export default eventBus
