import { reactive } from "vue";

export const defaultConfig = {
  AUTO_DRAW: false,
  AUTO_ZOOM_OUT: true,
  WORK_SPACE: "",
  JSON_EXPORT_PATH: "",
  JSON_EXPORT_PATH_HISTORY: [""],
  IMG_MAX_SIZE: 1024 * 1024 * 100, // 图片尺寸，默认100mb
  IMG_SUPORT_TYPES: [
    // 当前插件支持拖拽的文件格式
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/bmp",
    "image/gif",
    "image/webp",
  ],

  SCREEN_AUTO_DRAW: false, // 移动移动框后，是否自动更新预览
  SCREEN_WATCH_CHIPBOARD: false, // 监听粘贴板，如果是图片，自动更新，不弹出提示
  SCREEN_MAX_HEIGHT: 720, // 图片裁剪区的最大高度,因为采用flex布局，高度如果不指定，宽度会溢出，导致整体布局异常
  SCREEN_MAX_WIDTH: 1280, //图片裁剪区的最大宽度,因为采用flex布局，高度如果不指定，宽度会溢出，导致整体布局异常
  CROP_BORDER_WIDTH: 2,
  CROP_BORDER_COLOR: "rgb(14 165 233)",

  SERVER_IP: "127.0.0.1",
  SERVER_PROT: 4040,
  SERVER_CHECK: false,
  SERVER_STATUS: "close",
  SERVER_HTTPS_FLAG: false,
  SERVER_EXE_PATH: "",
  SERVER_AUTO_CONNEXT: true,
  SERVER_AUTO_CONNEXT_TIMEOUT: 60 * 1000, // 1分钟

  ZOOM_IN: 0.85,
  ZOOM_OUT: 1.15,

  UI_HEADER_HEIGHT: 60,
  UI_FOOTER_HEIGHT: 220,
  UI_GAP_WIDTH: 10,

  GENERAL_DELAY: 50,
};

export default reactive(defaultConfig);
