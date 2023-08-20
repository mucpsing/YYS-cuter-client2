/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2023-01-11 11:39:00.460244
 * @Last Modified by: CPS
 * @Last Modified time: 2023-01-11 11:39:00.460244
 * @Projectname
 * @file_path "D:\CPS\IDE\JS_SublmieText\Data\Packages\cps-fileheader"
 * @Filename "main.py"
 * @Description: 功能描述
 */

import localStore from "../store";
import type { CoordsData } from "../imageCuter";

export * from "./api";

export function exportConfigData(id = 0, title = ""): CoordsData {
  return {
    id,
    title,
    fileName: localStore.currtFileName,
    filePath: localStore.currtFilePath,
    coordsList: localStore.currtCoordsList,
  };
}
