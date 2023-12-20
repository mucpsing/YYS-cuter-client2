/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-08-29 10:39:32
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2023-12-13 10:21:23
 * @FilePath: \yys-cuter-client2\src\renderer\src\stores\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-11-28 18:11:46.454972
 * @Last Modified by: CPS
 * @Last Modified time: 2022-11-28 18:11:46.454972
 * @Projectname
 * @file_path "D:\CPS\IDE\JS_SublmieText\Data\Packages\cps-fileheader"
 * @Filename "main.py"
 * @Description: 全局的状态存储位置
 */

import { defineStore } from "pinia"

export enum SettingPageValue {
  GLOBAL = "global",
  IMAGE_CUTER = "imageCuterConfig",
}

type PagesType = "ImageCuter" | "Home"

export const useGlobalStore = defineStore("global", {
  state: () => ({
    settingPageShow: false,
    settingPageSelect: "global" as SettingPageValue,

    currtPage: "ImageCuter" as PagesType,
    DEBUG: false,
  }),

  getters: {
    currtSettingPage(state) {
      return state.settingPageSelect
    },
  },

  actions: {
    setSettingPageShow(flag: boolean) {
      this.settingPageShow = flag
    },
    switchSettingPage(pageKey: SettingPageValue = SettingPageValue.GLOBAL) {
      this.settingPageShow = true
      this.settingPageSelect = pageKey
    },
  },
})
