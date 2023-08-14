import type { SaveDialogOptions, OpenDialogOptions } from "electron";

export interface ImageCuterExportJsonOptions<T> {
  path: string;
  data: T;
  name?: string;
  overwrite?: boolean;
}

export interface electronAPI {
  startDrag: (filename: string) => void;
  openDialog: (opts: SaveDialogOptions | OpenDialogOptions) => Promise<string>;

  invoke: <T>(channel: string, opts: T) => Promise<boolean>;
  send: <T>(channel: string, opts: T) => Promise<boolean>;
  sendSync: (channel: string, callback: Function) => Promise<string | boolean>;
  receive: (channel: string, callback: Function) => Promise<string | boolean>;
  receiveOnce: (
    channel: string,
    callback: Function
  ) => Promise<string | boolean>;
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
