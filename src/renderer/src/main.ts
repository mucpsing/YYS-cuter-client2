import { createApp } from "vue"
import App from "./App.vue"
import { createPinia } from "pinia"

import cIconFont from "@renderer/components/cpsIconFont.vue"
import { IconFont } from "tdesign-icons-vue-next"
import TDesign from "tdesign-vue-next"

import "./tailwindCSS.css"
import router from "./router"

console.log(window.electron)

const app = createApp(App)
app.component("c-icon-font", cIconFont)
app.component("icon-font", IconFont)
app.use(router)
app.use(createPinia())
app.use(TDesign)
app.mount("#app")
