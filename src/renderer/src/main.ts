import { createApp } from "vue"
import App from "./App.vue"
import { createPinia } from "pinia"

import { basicSetup } from "codemirror"
import VueCodemirror from "vue-codemirror"

import cIconFont from "@renderer/components/cpsIconFont.vue"
import { IconFont } from "tdesign-icons-vue-next"
import TDesign from "tdesign-vue-next"

import "./tailwindCSS.css"
import router from "./router"

createApp(App)
  .component("c-icon-font", cIconFont)
  .component("icon-font", IconFont)
  .use(router)
  .use(createPinia())
  .use(TDesign)
  .use(VueCodemirror)
  .mount("#app")
