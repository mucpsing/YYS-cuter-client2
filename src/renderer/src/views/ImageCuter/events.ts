/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-07-25 11:14:11
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-08-19 17:57:49
 * @FilePath: \yys-cuter-client\src\libs\ImageCuterEvents.ts
 * @Description: 存放所有ImageCuter插件的相关事件，然后通过@libs/eventBus.ts进行汇总，
 * ImageCuter插件的所有事件都放在body/index.vue的挂载阶段进行初始化
 */

import type { SettingKeyVal } from "@renderer/global";
import type { ImageCuterExportJsonOptions } from "@renderer/global";

/* 事件声明 */
/** 命名规则 【页面名称-组件文件名-函数】 */
export type IMCEventBusTypes = {
  imageCuterMenuClick: string;
  imageCuterSave: string;
  imageCuterSettings: boolean;
  imageCuterBodyOpenFile: string;
  imageCuterChangeSetting: SettingKeyVal<string>;
  imageCuterExportFile: ImageCuterExportJsonOptions<string>;
  imageCuterToolBarSaveConfig: any;
  "imc-save-data": any;
  "imc-updateCorpInfo": any;
  "imc-tabCrop-draw": any;
  "imc-body-updateCoords": any;
  "imc-body-onResize": any;
  imageCuterTest: any;
};
