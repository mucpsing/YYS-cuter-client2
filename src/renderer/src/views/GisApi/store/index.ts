import { defineStore } from "pinia"

export const useGlobalStore = defineStore("gisapi", {
  state: () => ({
    // 地图加载状态
    mapLoad: false,
    // 地图
    map: null as any,
  }),
})
