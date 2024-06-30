/*
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-06-21 21:40:50
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-06-30 22:05:17
 * @FilePath: \YYS-cuter-client2\electron.vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { resolve } from "path"
import { defineConfig, externalizeDepsPlugin } from "electron-vite"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"

import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { TDesignResolver } from "unplugin-vue-components/resolvers"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: { "@main": resolve("./src/main/"), "@": resolve("./src/") },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: { "@preload": resolve("./src/preload/"), "@": resolve("./src/") },
    },
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("./src/renderer/src"),
        "@components": resolve("./src/renderer/src/components"),
        "@views": resolve("./src/renderer/src/views"),
        "@gisapi": resolve("./src/renderer/src/views/GisApi"),
        "@data": resolve("./src/renderer/src/data"),
        "@nsData": resolve("./src/renderer/src/data/ns"),
        "@nsStore": resolve("./src/renderer/src/stores/ns"),
        "@": resolve("./src/"),
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        imports: ["vue", "vue-router"],
        dts: resolve("./src/types/auto-imports.d.ts"),
        resolvers: [
          ElementPlusResolver(),
          TDesignResolver({
            library: "vue-next",
          }),
        ],
      }),
      Components({
        dirs: [resolve("./src/renderer/src/components"), resolve("./src/renderer/src/views")],
        dts: resolve("./src/types/auto-components.d.ts"),
        resolvers: [
          ElementPlusResolver(),
          TDesignResolver({
            library: "vue-next",
          }),
        ], // 按需引入同时关联自动导入
      }),
    ],
  },
})
