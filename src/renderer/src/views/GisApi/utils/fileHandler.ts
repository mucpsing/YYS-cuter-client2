/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-07-26 16:11:19
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-07-26 16:30:59
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\utils\fileHandler.ts
 * @Description: 处理上文件
 */

import { getMd5 } from "@renderer/utils/calculateMd5"

export async function getMd5FromFile(file: File): Promise<string> {
  return await getMd5(file)
}

export const UP_FILE_ACCEPT_TYPE = {
  dfsu: ".dfsu",
  shp: ".cpg,.dbf,.sbn,.sbx,.shp,.shx,.shp.xml",
}

export class FileReaderHelper {
  private file: File | null = null
  private onDoneCallback: (() => void) | null = null

  // 设置文件
  withFile(file: File): this {
    this.file = file
    return this
  }

  // 设置读取完成后的回调函数
  onDone(callback: () => void): this {
    this.onDoneCallback = callback
    return this
  }

  // 读取文件内容
  readAsText(): this {
    if (this.file) {
      const reader = new FileReader()
      reader.onload = () => {
        if (this.onDoneCallback) {
          this.onDoneCallback()
        }
      }
      reader.readAsText(this.file)
    }
    return this
  }

  // 读取文件为ArrayBuffer
  readAsArrayBuffer(): this {
    if (this.file) {
      const reader = new FileReader()
      reader.onload = () => {
        if (this.onDoneCallback) {
          this.onDoneCallback()
        }
      }
      reader.readAsArrayBuffer(this.file)
    }
    return this
  }

  // 可以在这里添加更多的读取方法

  // 示例使用
  static exampleUsage(): void {
    const inputElement = document.createElement("input")
    inputElement.type = "file"

    inputElement.addEventListener("change", (event) => {
      const file = event.target.files?.[0]
      if (file) {
        new FileReaderHelper()
          .withFile(file)
          .onDone(() => {
            console.log("文件读取完成")
            // 在这里处理读取完成后的逻辑
          })
          .readAsText() // 或者使用 readAsArrayBuffer
      }
    })

    document.body.appendChild(inputElement)
  }
}

// 调用示例方法来测试
// FileReaderHelper.exampleUsage()
