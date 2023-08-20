import type { Ref } from "vue";

export interface Data {
  [imgKey: string]: ImgDataItem;
}

export interface ImgDataItem {
  imgName: string;
  imgPath: string;
  imgW: number;
  imgH: number;
  imgKey: string;
  pageId: number;
  coords: DataItem[];
}

export interface DataItem {
  title: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  xy?: number[];
}

export interface RegionT {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface Coords {
  width: Ref<number> | number;
  height: Ref<number> | number;
  top: Ref<number> | number;
  left: Ref<number> | number;
}

export interface CoordsData {
  id: number;
  title: string;
  fileName: string;
  filePath: string;
  coordsList: CoordItem[];
}

export interface HwndInfo {
  hwnd: number;
  parent_hwnd: number;
  class_name: string;
  window_text: string;
  window_width: number;
  window_height: number;
  context_width: number;
  context_height: number;
  border: number;
  border_top: number;
  window_left: number;
  window_top: number;
  window_right: number;
  window_bottom: number;
  type: string; // "桌面版"
}

export interface CaptrueRes {
  file_path: string;
  dir_path: string;
  url: string;
}
