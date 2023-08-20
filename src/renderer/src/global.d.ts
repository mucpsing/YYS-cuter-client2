import type { SaveDialogOptions, OpenDialogOptions } from "electron";
import { electronAPI } from "@renderer/libs/eventBusMain";

export type CpsDialogElement = HTMLElement & { open: (options?: any) => void };
export type StringObj = { [key: string]: string };

export interface SettingKeyVal<T> {
  key: string;
  val: T;
}

export interface ImageCuterExportJsonOptions<T> {
  path: string;
  data: T;
  name?: string;
  overwrite?: boolean;
}

declare global {
  interface Window {
    // Expose some Api through preload script
    fs: typeof import("fs");
    ipcRenderer: import("electron").IpcRenderer;
    electron: electronAPI;
    eventBus: typeof import("@/libs").eventBus;
    removeLoading: () => void;
  }
}

export interface DialogOpenOptions {
  title?: string; // 弹出框标题
  message?: string; // 提示框文本内容
  acceptMsg?: string; // 确认按钮文案
  rejectMsg?: string; // 取消按钮文案
  acceptCallback?: Function | null; // 确认按钮回调函数
  rejectCallback?: Function | null; // 取消按钮回调函数
  type?: string; // 'text'|'input' 弹出框的类型
}

export interface ExportFileOptions<T> {
  path: string;
  data: T;
  overwrite?: boolean;
  work_space?: string;
}

export {};
