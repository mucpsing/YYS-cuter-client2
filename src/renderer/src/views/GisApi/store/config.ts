/*
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-06-21 21:40:50
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2025-07-02 16:01:03
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\store\config.ts
 * @Description: 这里存放页面所有静态配置
 */
import { ref } from "vue"
import API from "./API"
export const baseSize = ref<"small" | "large" | "medium">("large")

export const UP_FILE_ACCEPT_TYPE = {
  dfsu: ".dfsu",
  shp: ".cpg,.dbf,.sbn,.sbx,.shp,.shx,.shp.xml",
  txt: ".txt",
}

export const DEFAULT_SERVER_IP_LIST = [
  "localhost",
  "127.0.0.1",
  "192.168.100.37",
  "CPS-OFFICE-WIN10",
]

export const SETP_OPTIONS_LIST = [
  { title: "选择模板", value: 1 },
  { title: "工程配置", value: 2 },
  { title: "视图配置", value: 3 },
  { title: "图片生成", value: 4 },
]

export const config = reactive({
  // http协议
  SERVER_PROTOCOL: window.location.protocol,

  // 服务器IP
  SERVER_IP: window.location.hostname,

  // 服务器端口
  SERVER_PROT: "4040",

  SERVER_API: "gisArcMapApi/v1", // API前缀

  DEFAULT_RADIAN_OR_ANGLE: "弧度" as "弧度" | "角度",

  DEFAULT_RIVER_RANGE: "工程后" as "工程前" | "工程后",

  DEFAULT_MESH_DISTANCE: "25",

  DEFAULT_CONTOUR_RANGE: 200,

  DEFAULT_TEST_API: API.test,
})

export const currtPreviewUrlHost = computed(
  () => `${config.SERVER_PROTOCOL}//${config.SERVER_IP}:${config.SERVER_PROT}`,
)
export default config
