/*
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2023-08-12 00:00:08
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-08-12 01:10:34
 * @FilePath: \YYS-cuter-client2\src\main\even.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import path from "path";
import fs from "fs";
import fse from "fs-extra";
import { dialog, ipcMain } from "electron";
// import ImageCuterEventInit from "./ImageCuter/event";

// import type { JsonWriteOptions } from "@types/node";
import type {
  BrowserWindow,
  SaveDialogOptions,
  OpenDialogOptions,
} from "electron";
import type { ImageCuterExportJsonOptions } from "@/types/global";

import "@/main/config";

const defaultJsonWriteOptions = { spaces: "    " };

// const chennelList = ["selectFolder", "selectSaveFile", "exportJsonFile"];

const defaultSelectFolderOpts: OpenDialogOptions = {
  properties: ["openDirectory"],
};
const defaultselectSaveFileOpts: SaveDialogOptions = {
  properties: ["dontAddToRecent"],
};

export function ipcMainEventsInit(_win: BrowserWindow): void {
  /* 打开选择框 */
  ipcMain.handle("selectFolder", async (_event, opts: OpenDialogOptions) => {
    return await dialog.showOpenDialog(
      Object.assign(defaultSelectFolderOpts, opts)
    );
  });

  /* 保存文件指定一个位置，可以时目录，也可以是文件 */
  ipcMain.handle("selectSaveFile", async (_event, opts: SaveDialogOptions) => {
    return await dialog.showSaveDialog(
      Object.assign(defaultselectSaveFileOpts, opts)
    );
  });

  /* 导出一个JSON文件 */
  ipcMain.handle(
    "exportJsonFile",
    async (_event, opts: string): Promise<boolean> => {
      const options: ImageCuterExportJsonOptions<string> = JSON.parse(opts);
      const dirname = path.dirname(options.path);
      const extname = path.extname(options.path);
      const basename = path.basename(options.path, extname);

      // const folderCheck = await ensureDir(dirname);
      // console.log('folderCheck: ', folderCheck);
      // const fileCheck = await ensureFile(options.path); // 文件是否已存在
      // console.log('fileCheck: ', fileCheck);

      const output = path.join(dirname, `${basename}.json`);

      await fse.writeJson(output, options.data, defaultJsonWriteOptions);

      return fs.existsSync(output);
    }
  );

  // ImageCuterEventInit();
}
