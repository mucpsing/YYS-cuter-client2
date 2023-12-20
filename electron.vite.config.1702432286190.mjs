// electron.vite.config.ts
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { TDesignResolver } from "unplugin-vue-components/resolvers";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: { "@main": resolve("./src/main/"), "@": resolve("./src/") }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: { "@preload": resolve("./src/preload/"), "@": resolve("./src/") }
    }
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("./src/renderer/src"),
        "@components": resolve("./src/renderer/src/components"),
        "@views": resolve("./src/renderer/src/views"),
        "@data": resolve("./src/renderer/src/data"),
        "@nsData": resolve("./src/renderer/src/data/ns"),
        "@nsStore": resolve("./src/renderer/src/stores/ns"),
        "@": resolve("./src/")
      }
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
            library: "vue-next"
          })
        ]
      }),
      Components({
        dirs: [resolve("./src/renderer/src/components"), resolve("./src/renderer/src/views")],
        dts: resolve("./src/types/auto-components.d.ts"),
        resolvers: [
          ElementPlusResolver(),
          TDesignResolver({
            library: "vue-next"
          })
        ]
        // 按需引入同时关联自动导入
      })
    ]
  }
});
export {
  electron_vite_config_default as default
};
