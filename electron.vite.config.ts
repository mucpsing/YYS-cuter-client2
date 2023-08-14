import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import {
  ElementPlusResolver,
  TDesignResolver,
} from "unplugin-vue-components/resolvers";

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
        dirs: [
          resolve("./src/renderer/src/components"),
          resolve("./src/renderer/src/views"),
        ],
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
});
