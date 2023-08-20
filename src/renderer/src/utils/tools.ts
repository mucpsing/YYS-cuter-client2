/*
 * @Author: CPS-surfacePro7 holy.dandelion@139.com
 * @Date: 2023-01-22 01:33:21
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-08-19 16:34:41
 * @FilePath: \yys-cuter-client\src\utils\tools.ts
 * @Description: 用来存放一些通用的工具函数
 */

import axios from "axios";

export function getObjectKeysWithStart(obj: object, start: string): string[] {
  return Object.keys(obj).filter((key: string) => key.startsWith(start));
}

export const checkUrl = async (url: string) => {
  try {
    const res = await axios.get(url);
    if (res.status == 200) return true;
    return false;
  } catch (e) {
    return false;
  }
};

export function suc<T>(data?: T, msg?: string) {
  return { success: true, data, msg };
}
export function err<T>(data?: T, msg?: string) {
  return { success: false, data, msg };
}

export function Suc<T>({ data, msg }: { data?: T; msg?: string }) {
  return { success: true, data, msg };
}
export function Err<T>({ data, msg }: { data?: T; msg?: string }) {
  return { success: false, data, msg };
}

export const print = (target: string | number) => eval(`\`${target}\``);
