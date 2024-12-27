/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-02-08 17:00:45
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-12-27 09:10:59
 * @FilePath: \yys-cuter-client\src\libs\eventBus.ts
 * @Description: 事件加载器入口，汇总所有插件的事件，全局事件也在这里声明
 */
import mitt from "mitt"

import type { SettingPageValue } from "@renderer/stores"
import type { DialogOpenOptions } from "@renderer/global"
import type { SaveDialogOptions, OpenDialogOptions } from "electron"

import type { IMCEventBusTypes } from "@renderer/views/ImageCuter/events"
import type { GisApiEventBusTypes } from "@renderer/views/GisApi/eventRegister"
import type { TyphoonEventTypes } from "@renderer/views/TyphoonUI/events"

export type EventBus = {
  bodyUpdateReiszeCoords: string
  showDialog: DialogOpenOptions
  showSettingsPage: SettingPageValue
  mainOpenFolder: SaveDialogOptions | OpenDialogOptions
} & IMCEventBusTypes &
  GisApiEventBusTypes &
  TyphoonEventTypes

export const eventBus = mitt<EventBus>()

// 在导出时使用旧的 API 名称去调用 mitt 的 API
export default eventBus
