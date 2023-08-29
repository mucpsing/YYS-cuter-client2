/*
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2023-08-12 00:00:08
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-08-20 23:04:34
 * @FilePath: \YYS-cuter-client2\src\main\even.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import path from "path"
import { dialog, ipcMain, app } from "electron"

import { sleep } from "./utils"
import logger from "@/main/logger"

import type FseType from "fs-extra"
import type TomlType from "@ltd/j-toml"
import type { BrowserWindow } from "electron"
import type { SaveDialogOptions, OpenDialogOptions } from "electron"

import type { ExportFileOptions } from "@renderer/global"

import "@/main/config"

// const defaultJsonWriteOptions = { spaces: "    " };

const defaultSelectFolderOpts: OpenDialogOptions = {
  properties: ["openDirectory"],
}
const defaultselectSaveFileOpts: SaveDialogOptions = {
  properties: ["dontAddToRecent"],
}

export function ipcMainEventsInit(_win: BrowserWindow): void {
  /* 调用系统文件夹选择框，返回用户选择的目录 */
  ipcMain.handle("selectFolder", async (_event, opts: OpenDialogOptions) => {
    return await dialog.showOpenDialog(Object.assign(defaultSelectFolderOpts, opts))
  })

  /* 保存文件指定一个位置，可以时目录，也可以是文件 */
  ipcMain.handle("selectSaveFile", async (_event, opts: SaveDialogOptions) => {
    return await dialog.showSaveDialog(Object.assign(defaultselectSaveFileOpts, opts))
  })

  ipcMain.handle("selectJsonFile", async (_event, opts: SaveDialogOptions) => {
    return await dialog.showSaveDialog(Object.assign(defaultselectSaveFileOpts, opts))
  })

  /* 导出一个数据文件，默认使用json格式 */
  ipcMain.handle("exportFile", async (_event, opts: ExportFileOptions<any>) => {
    // 弹出文件选择框，指定一个保存位置
    const dialogRes = await dialog.showSaveDialog(
      Object.assign(defaultselectSaveFileOpts, {
        title: "导出数据",
        message: "指定一个位置保存配置文件",
        buttonLabel: "确定保存",
        defaultPath: opts.work_space || app.getAppPath(),
        filters: [{ name: "配置文件", extensions: ["json", "json5", "toml"] }],
        properties: [],
      } as SaveDialogOptions),
    )

    if (dialogRes.canceled) return false
    if (dialogRes.filePath && opts.data) {
      const ext = path.extname(dialogRes.filePath)
      let outputFilePath = dialogRes.filePath

      await sleep(5000)

      try {
        const fse = require("fs-extra") as typeof FseType
        let outputStr

        if (ext == ".toml") {
          const { stringify, Section } = require("@ltd/j-toml") as typeof TomlType

          const tomlData = {}
          Object.keys(opts.data).forEach((key) => (tomlData[key] = Section(opts.data[key])))
          const tomlStr = stringify(opts.data, {
            indent: 2,
            newline: "\n",
            xNull: true,
            newlineAround: "section",
          })
          outputStr = tomlStr
        } else if (ext == ".json") {
          outputStr = opts.data
        } else {
          outputFilePath = `${outputFilePath}.json`
          outputStr = opts.data
        }

        // 保存本地
        await fse.outputFile(dialogRes.filePath, outputStr)
        return await fse.exists(dialogRes.filePath)
      } catch (err) {
        logger.error(`导出数据失败`)
        return false
      }
    }
  })

  // ImageCuterEventInit();
}
