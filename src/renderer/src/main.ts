/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-09-20 17:21:48
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-07-08 12:29:32
 * @FilePath: \yys-cuter-client2\src\renderer\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from "vue"
import App from "./App.vue"
import { createPinia } from "pinia"

// import { basicSetup } from "codemirror"
import VueCodemirror from "vue-codemirror"

import cIconFont from "@renderer/components/cpsIconFont.vue"
import { IconFont } from "tdesign-icons-vue-next"
import TDesign from "tdesign-vue-next"

import "./tailwindCSS.css"
import router from "./router"

import "tdesign-vue-next/es/style/index.css"

// fix echarts import 'default-passive-events'
// 修复echarts报[Violation]Added non-passive event listener to a scroll-blocking 'wheel' event. Consider marking event handler as 'passive' to make the page more responsive.错误
import "default-passive-events"

createApp(App)
  .component("c-icon-font", cIconFont)
  .component("icon-font", IconFont)
  .use(router)
  .use(createPinia())
  .use(TDesign)
  .use(VueCodemirror)
  .mount("#app")
