/*
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2023-08-15 21:41:21
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-08-25 00:54:56
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\ImageCuter\store\server.ts
 * @Description: 存储所有server后端的相关状态，配置状态存放再 store/config.SERVER_* 里面
 */
import { reactive } from "vue"
import type { HwndInfo } from "../imageCuter"

// 当前服务器的状态（唯一）
export const IS_CONNECT = ref(false)

type ServerStatus = "open" | "checking" | "close"

export default reactive({
  status: "close" as ServerStatus,
  hwndInfoList: [] as HwndInfo[],
  currtHwnd: 0,
})
