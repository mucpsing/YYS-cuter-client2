/*
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-06-21 21:40:50
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-07-24 10:05:49
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\store\config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ref } from "vue"

export const baseSize = ref<"small" | "large" | "medium">("large")

export const UP_FILE_ACCEPT_TYPE = {
  dfsu: ".dfsu",
  shp: ".cpg,.dbf,.sbn,.sbx,.shp,.shx,.shp.xml",
}

export const DEFAULT_SERVER_IP_LIST = [
  "localhost",
  "127.0.0.1",
  "192.168.100.37",
  "DESKTOP-0ROH1ER",
]
export const API = {
  getTemplateList: "/mxd_template_list",
  upload: "/upload_file",
  mxdToImg: "/mxd_to_img",
  test: "/serverCheck",
}

export const config = reactive({
  // http协议
  SERVER_PROTOCOL: window.location.protocol,

  // 服务器IP
  SERVER_IP: window.location.hostname,

  // 服务器端口
  SERVER_PROT: "4040",

  SERVER_API: "gis-api",

  DEFAULT_RADIAN_OR_ANGLE: "弧度" as "弧度" | "角度",

  DEFAULT_RIVER_RANGE: "工程后" as "工程前" | "工程后",

  DEFAULT_MESH_DISTANCE: "25",

  DEFAULT_CONTOUR_RANGE: 200,

  DEFAULT_TEST_API: API.test,
})

export const currtPreviewUrl = computed(
  () => `${config.SERVER_PROTOCOL}//${config.SERVER_IP}:${config.SERVER_PROT}`,
)
export default config
