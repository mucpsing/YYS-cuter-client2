/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-12-06 18:40:58.452133
 * @Last Modified by: CPS
 * @Last Modified time: 2022-12-06 18:40:58.452133
 * @Projectname
 * @file_path "D:\CPS\IDE\JS_SublmieText\Data\Packages\cps-fileheader"
 * @Filename "main.py"
 * @Description: 通过文件头读取该文件的尺寸，当前支持jpg、png、bmp、gif 部分jpg读取异常
 */

// 设置图片信息对应的内存记录地址
// 对应各个格式的文件头,识别格式
export interface ImgSize {
  width: number;
  height: number;
}

const IMAGE_HEAD_SIGS = {
  GIF: [0x47, 0x49, 0x46], //'G' 'I' 'F' ascii
  PNG: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  JPG: [0xff, 0xd8, 0xff],
  BMP: [0x42, 0x4d],
};

export class ImageSizeReader {
  //头部标识符
  private target: File;
  public result: ArrayBuffer;
  public base64: string;

  constructor(target: File) {
    this.target = target;
    this.base64 = "";
    this.result = new ArrayBuffer(0);
  }

  /**
   * @description 有一些文件无法正确获取，比如手机通过qq，微信发送的照片，通过adobe api 生成的照片
   */
  public async getSize() {
    if (this.target instanceof File) {
      let parserFunc: (bytes: Uint8Array) => ImgSize | null;

      switch (this.target.type) {
        case "image/png":
          parserFunc = this.readPNG;
          break;

        case "image/jpg":
        case "image/jpeg":
          parserFunc = this.readJPG;
          break;

        case "image/bmp":
          parserFunc = this.readBMP;
          break;

        case "image/gif":
          parserFunc = this.readGIF;
          break;

        default:
          return null;
      }

      const bast64 = await this.fileToBase64(this.target);
      const bytes = base64ToBytes(bast64);
      return new Promise((resolve) => resolve(parserFunc(bytes)));
    }
  }

  public async fileToBase64(file: File): Promise<string> {
    const reader = new FileReader();
    reader.readAsDataURL(file || this.target);

    return new Promise((resolve) => {
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          this.base64 = e.target.result as string;
          resolve(this.base64);
        }
      };
    });
  }

  public async fileToArrayBuffer(
    file: File | null
  ): Promise<ArrayBuffer | string | null> {
    const reader = new FileReader();
    reader.readAsDataURL(file || this.target);

    return new Promise((resolve) => {
      reader.onload = async (file) => {
        this.result = reader.result as ArrayBuffer;
        resolve(this.result);
      };
    });
  }

  public readPNG(bytes: Uint8Array): ImgSize | null {
    //获取文件头特征
    const h = new Uint8Array(bytes.slice(0, 8));

    // 将特征与设置好的进行比较
    if (h.toString() === IMAGE_HEAD_SIGS.PNG.toString()) {
      const width = readUint32BE(bytes, 16);
      const height = readUint32BE(bytes, 20);

      return { width, height };
    }

    return null;
  }

  public readBMP(bytes: Uint8Array): ImgSize | null {
    // 主要修改了这里
    // 获取文件头特征
    const h = new Uint8Array(bytes.slice(0, 2));

    if (h.toString() === IMAGE_HEAD_SIGS.BMP.toString()) {
      //虽然格式为4字节，这里只取2字节，确保height为正数。为负数时，图像为倒置图像。
      const height = readUint16LE(bytes, 22);
      const width = readUint16LE(bytes, 18);

      return { width, height };
    }

    return null;
  }

  public readGIF(bytes: Uint8Array): ImgSize | null {
    if (bytes.slice(0, 3).toString() === IMAGE_HEAD_SIGS.GIF.toString()) {
      const width = readUint16LE(bytes, 6);
      const height = readUint16LE(bytes, 8);

      return { width, height };
    }

    return null;
  }

  public readJPG(bytes: Uint8Array): ImgSize | null {
    //获取文件头特征进行比对，判断是否jpg文件
    const h = new Uint8Array(bytes.slice(0, 3));
    if (h.toString() === IMAGE_HEAD_SIGS.JPG.toString()) {
      const M_SOF0 = 0xc0; /* Start Of Frame N */
      const M_SOF1 = 0xc1; /* N indicates which compression process */
      const M_SOF2 = 0xc2; /* Only SOF0-SOF2 are now in common use */
      const M_SOF3 = 0xc3;
      const M_SOF5 = 0xc5; /* NB: codes C4 and CC are NOT SOF markers */
      const M_SOF6 = 0xc6;
      const M_SOF7 = 0xc7;
      const M_SOF9 = 0xc9;
      const M_SOF10 = 0xca;
      const M_SOF11 = 0xcb;
      const M_SOF13 = 0xcd;
      const M_SOF14 = 0xce;
      const M_SOF15 = 0xcf;

      for (let i = 0; i < bytes.length; i++) {
        if (bytes[i] === 0xff) {
          switch (bytes[i + 1]) {
            case M_SOF0:
            case M_SOF1:
            case M_SOF2:
            case M_SOF3:
            case M_SOF5:
            case M_SOF6:
            case M_SOF7:
            case M_SOF9:
            case M_SOF10:
            case M_SOF11:
            case M_SOF13:
            case M_SOF14:
            case M_SOF15: {
              //高在前，宽在后。
              const width = readUint16BE(bytes, i + 7);
              const height = readUint16BE(bytes, i + 5);
              return { width, height };
            }
            default:
              break;
          }
        }
      }
    }
    return null;
  }
}

function readUint32BE(bytes: Uint8Array, start: number) {
  const uarr = new Uint32Array(1);
  uarr[0] = (bytes[start + 0] & 0xff) << 24;
  uarr[0] = uarr[0] | ((bytes[start + 1] & 0xff) << 16);
  uarr[0] = uarr[0] | ((bytes[start + 2] & 0xff) << 8);
  uarr[0] = uarr[0] | (bytes[start + 3] & 0xff);
  return uarr[0];
}

function readUint16BE(bytes: Uint8Array, start: number) {
  const uarr = new Uint32Array(1);
  uarr[0] = (bytes[start + 0] & 0xff) << 8;
  uarr[0] = uarr[0] | (bytes[start + 1] & 0xff);
  return uarr[0];
}

//LE [0x01,0x02,0x03,0x04] -> 0x04030201
function readUint32LE(bytes: Uint8Array, start: number) {
  const uarr = new Uint32Array(1);
  uarr[0] = (bytes[start + 3] & 0xff) << 24;
  uarr[0] = uarr[0] | ((bytes[start + 2] & 0xff) << 16);
  uarr[0] = uarr[0] | ((bytes[start + 1] & 0xff) << 8);
  uarr[0] = uarr[0] | (bytes[start + 0] & 0xff);
  return uarr[0];
}

function readUint16LE(bytes: Uint8Array, start: number) {
  const uarr = new Uint32Array(1);
  uarr[0] = (bytes[start + 1] & 0xff) << 8;
  uarr[0] = uarr[0] | (bytes[start + 0] & 0xff);
  return uarr[0];
}

function base64ToBytes(base64: string) {
  const baseSplit = base64.split(",");
  // let mime = arr[0].match(/:(.*?);/)[1] || type;
  // 去掉url的头，并转化为byte
  const strArray = window.atob(baseSplit[1]);
  // 处理异常,将ascii码小于0的转换为大于0
  const buffer = new ArrayBuffer(strArray.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < strArray.length; i++) {
    bytes[i] = strArray.charCodeAt(i);
  }
  return bytes;
}

// /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&‘,()*+;=\-._~:@\/?%\s]*?)\s*$/i;
const IS_BASE64_REG =
  /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&‘,()*+;=\-._~:@\\/?%\s]*?)\s*$/i;

export function isBase64Img(str: string): boolean {
  return IS_BASE64_REG.test(str);
}

const base64Pattern = /^data:image\/([a-zA-Z]+);base64,/;
export function isBase64Image(input: string): string {
  try {
    const match = input.match(base64Pattern);

    if (match) return match[1];

    return "";
  } catch (err) {
    console.log("isBase64Image error: ", err);
    return "";
  }
}

export function isBase64(str: string): boolean {
  if (str === "" || str.trim() === "") return false;

  try {
    return btoa(atob(str)) == str;
  } catch (err) {
    console.log("err: ", err);
    return false;
  }
}
