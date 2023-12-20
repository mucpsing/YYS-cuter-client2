/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-11-23 15:54:42
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2023-11-23 15:57:28
 * @FilePath: \yys-cuter-client2\src\renderer\src\utils\zip.ts
 * @Description: 将文件进行压缩，并返回
 * @example
    const filesToCompress: File[] = [...]; // 从文件输入框或其他地方获取文件
    try {
        const compressedBlob: Blob = await compressAndUpload(filesToCompress);
        // 使用compressedBlob进行进一步的操作，例如上传到后端
        uploadToBackend(compressedBlob);
    } catch (error) {
        // 处理压缩错误
        console.error('Compression failed:', error);
    }
 */

import JSZip from "jszip"

export async function compressFilesToBlob(filesToZip: File[]): Promise<Blob> {
  try {
    // 创建一个新的 ZIP 实例
    const zip = new JSZip()

    // 将每个文件添加到 ZIP 中
    filesToZip.forEach((file) => {
      zip.file(file.name, file)
    })

    // 生成 ZIP Blob
    const zipBlob: Blob = await zip.generateAsync({ type: "blob" })

    // 返回生成的 ZIP Blob
    return zipBlob
  } catch (error) {
    // 处理错误
    console.error("Error during compression:", error)
    throw error
  }
}
