/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2023-01-22 01:28:45.735160
 * @Last Modified by: CPS
 * @Last Modified time: 2023-01-22 01:28:45.735160
 * @Projectname
 * @file_path "D:\CPS\MyProject\YYS\yys-cuter-client\src\components\ImageCuter\utils"
 * @Filename "api.ts"
 * @Description: 存放一些服务器相关的接口，对调用接口的结果进行处理，并返回
 */
import Axios from "axios";
import localStore from "../store";
import config from "../store/config";
import type { HwndInfo, CaptrueRes } from "../imageCuter";

const baseURL = `http://${config.SERVER_IP}:${config.SERVER_PROT}`;
const server = Axios.create({ baseURL });

const API = {
  checkAlive: "/test/get/yys-client-check",
  findWindows: "/v1/find_windows",
  capture: "/v1/capture",
};

/**
 * @description: 检查服务器是否已开启
 */
export async function checkAlive() {
  try {
    const res = await server.get(API.checkAlive, {
      params: { t: new Date() },
      timeout: 1200,
    });

    if (res.status == 200) return true;

    return false;
  } catch (e) {
    console.log("isAlive fail:", e);

    return false;
  }
}

/**
 * @description: 调用服务器接口，查找可支持的窗体句柄
 */
export async function findWindows(): Promise<HwndInfo[]> {
  try {
    const res = await server.get(API.findWindows, {
      params: { t: new Date() },
    });

    console.log("findWindows: ", res.data);

    if (res.status == 200 && res.data.success && res.data.res.length > 0) {
      return res.data.res;
    }

    return [];
  } catch (e) {
    console.log("findWindows fail:", e);

    return [];
  }
}

/**
 * @description: 对指定的窗口句柄进行截图
 * @param {number} hwnd
 */
export async function hwndCapture(hwnd: number) {
  try {
    const res = await server.get(`${API.capture}/${hwnd}`, {
      params: { output_name: "md5" },
    });

    console.log("hwndCapture:", res.data);

    if (res.status == 200 && res.data.success) {
      const ret = res.data.res as CaptrueRes;
      return ret.file_path;
    }

    return "";
  } catch (e) {
    console.log("hwndCapture fail: ", { e });

    return "";
  }
}
