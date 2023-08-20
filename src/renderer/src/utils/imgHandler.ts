/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-11-25 16:03:39.383287
 * @Last Modified by: CPS
 * @Last Modified time: 2022-11-25 16:03:39.503391
 * @Projectname
 * @file_path "W:\CPS\MyProject\github\electron-vite-vue\src\utils"
 * @Filename "fileHandler.ts"
 * @Description: 功能描述
 */

import { ImageSizeReader } from "@renderer/utils/imgSizeReader";
import type { ImgSize } from "@renderer/utils/imgSizeReader";

export class FileReadSizeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FileReadSizeError";
  }
}

export interface fileInfo {
  fileName: string;
  fileSize: number;
}

export async function imgReader(file: File): Promise<ImgSize> {
  // 获取高宽
  try {
    const imgBaseObj = new ImageSizeReader(file);
    const imgSize = await imgBaseObj.getSize();
    if (!imgBaseObj || !imgSize) {
      // 尝试调用node获取
      // 判断是否本地文件
      throw new FileReadSizeError("无法正确读取文件尺寸信息");
    }
    return imgSize;
    // const imgRender = new ImgRender(imgBaseObj.base64, imgSize.width, imgSize.height);
  } catch (err) {
    console.log(err);
    throw new FileReadSizeError("无法正确读取文件尺寸信息");
  }
}

/**
 * @description 转合base64，读取宽高，
 */
export class ImgRender {
  public image: HTMLImageElement;
  public offCanvas: OffscreenCanvas | null = null;
  public canvas: OffscreenCanvasRenderingContext2D | null = null;
  private target: string | File;

  public width = 0;
  public height = 0;

  constructor(target: string | File) {
    // 创建一个原始图象大小的离屏canvas实例
    // this.offCanvas = new OffscreenCanvas(width, height);
    // this.canvas = this.offCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
    // if (!this.canvas) throw Error('创建2d失败');
    const that = this;

    this.image = new Image();
    this.image.onload = (res) => {
      // 读取完成后，渲染到canvas
      console.log("image on load: ", { res });
      console.log("image on load: ", {
        w: this.image.width,
        h: this.image.height,
      });
    };
    this.target = target;
  }

  public async parser(width: number, height: number) {
    const target = this.target;

    // base64
    if (typeof target == "string") {
      // File(blob)
      this.image.src = target;
    } else if (target instanceof File) {
      const bitMap = await createImageBitmap(target);

      this.image.src = await fileToBase64(target);

      if (this.canvas) {
        this.canvas.drawImage(bitMap, width, height);
      }
    }

    return this.canvas;
  }

  public async renderImgToBase64() {}
}

/**
 * 图像转Base64
 */
export function getBase64FromImage(img: HTMLImageElement) {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d");

  if (!ctx) throw Error("canvas 获取2D失败");
  ctx.drawImage(img, 0, 0, img.width, img.height);

  const ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
  const dataURL = canvas.toDataURL("image/" + ext);
  return dataURL;
}

/**
 * @Description - 文件转base64（file：用户选择的文件e.target.files[0]，或下载的blob对象）
 *
 * @param {File} file  - {description}
 *
 * @returns {Promise<string> } - base64字符串
 *
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = function (e) {
      if (e.target && e.target.result) {
        resolve(e.target.result as string);
      }
    };
  });
}

export interface imgInfo {
  image: HTMLImageElement;
  width: number;
  height: number;
}

export async function getImageInfo(
  file: File | string
): Promise<imgInfo | null> {
  let src = "";

  if (file instanceof File) {
    src = await fileToBase64(file);
  } else if (typeof file == "string") {
    src = file;
  } else {
    console.log("不支持的类型");
    return null;
  }

  const img = new Image();
  return new Promise((resolve) => {
    img.onload = (e) => {
      resolve({ image: img, width: img.width, height: img.height });
    };

    img.src = src;
  });
}

export async function getImageInfoFromFile(file: File): Promise<imgInfo> {
  const img = new Image();
  img.src = await fileToBase64(file);
  return new Promise((resolve) => {
    img.onload = (_e) => {
      resolve({ image: img, width: img.width, height: img.height });
    };
  });
}
