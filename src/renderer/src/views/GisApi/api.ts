/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-09-20 17:29:22
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-08-02 17:11:02
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\api.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import Axios from "axios"
import config, { API } from "./store/config"
import type { TemplateInfo, FileInfoBase } from "@gisapi/Types"
import type { FileInfoItemT } from "@gisapi/Types"

const DEFAULT_AXIOS_TIMEOUT = 6000
const FILE_UPLOAD_TIMEOUT = 300000
let BASE_URL = `${config.SERVER_PROTOCOL}//${config.SERVER_IP}:${config.SERVER_PROT}/${config.SERVER_API}`
let SERVER = Axios.create({ baseURL: BASE_URL, timeout: DEFAULT_AXIOS_TIMEOUT })

/**
 * @description: 首先检查当前的url是否有被更改，如果更改了就重新创建axios，否则返回原始的axios
 * @return {*}
 */
const server = (timeout = DEFAULT_AXIOS_TIMEOUT) => {
  let baseURL = `${config.SERVER_PROTOCOL}//${config.SERVER_IP}:${config.SERVER_PROT}/${config.SERVER_API}`

  if (baseURL != BASE_URL || !SERVER) {
    console.log("重新创建baseURL：", baseURL)
    SERVER = Axios.create({ baseURL, timeout })
    BASE_URL = baseURL
  }

  return SERVER
}

export type MxdToImgFormBase = {
  template_id: number
  dfsu_be_md5: string
  dfsu_af_md5: string
  output_name: string
  river_range?: "工程前" | "工程后"
  show_range?: number
  radian_or_angle?: "radian" | "angle"
}

export type MxdToImgFormProjectShp = {
  project_md5?: string
} & MxdToImgFormBase

export type MxdToImgFormProjectPoints = {
  project_point?: string
} & MxdToImgFormBase

export type MxdToImgFormT = MxdToImgFormProjectShp | MxdToImgFormProjectPoints

export async function getTemplateList() {
  try {
    const { status, data } = await server().get(API.getTemplateList)
    if (status == 200) {
      return data.res as TemplateInfo[]
    }

    return []
  } catch (err) {
    console.log(err)
    return []
  }
}

export async function uploadCheck(fineMd5WithExtName: any): Promise<FileInfoBase | boolean> {
  try {
    const res = await server().get(`${API.uploadCheck}/${fineMd5WithExtName}`)

    if (res.status == 200 && res.data.success) {
      if (fineMd5WithExtName.endsWith(".dfsu") || fineMd5WithExtName.endsWith(".shp")) {
        console.log("文件已经存在，返回服务器缓存", res.data.res)
        return res.data.res.file_info as FileInfoBase
      }
      return false
    }
    return false
  } catch (err) {
    console.log("文件上传失败: ", { err })
    return false
  }
}

export async function uploadFile(
  fileInfo: FileInfoItemT,
  updateProgressCallback: ((progress: number) => void) | undefined = undefined,
): Promise<FileInfoBase | boolean> {
  try {
    const upload_check_res = await uploadCheck(fileInfo.md5Name)
    if (upload_check_res) {
      console.log("文件已存在")
      return upload_check_res
    }

    const formData = new FormData()
    formData.append("file_name_md5", fileInfo.md5Name)
    formData.append("file", fileInfo.file)

    console.log("文件不存在，进行上传", formData)

    try {
      const res = await server().post(API.upload, formData, {
        headers: { "content-type": "multipart/form-data" },
        timeout: FILE_UPLOAD_TIMEOUT,

        // 通过回调函数来将上传进度传出去
        onUploadProgress: (progressEvent) => {
          let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          if (updateProgressCallback) updateProgressCallback(percentCompleted)
        },
      })

      if (res.status == 200 && res.data.success) {
        if (fileInfo.name.endsWith(".dfsu") || fileInfo.name.endsWith(".shp")) {
          console.log("上传文件成功：", res.data.res)
          return res.data.res.file_info as FileInfoBase
        }
        return false
      }
    } catch (err) {
      console.log("文件上传失败: ", { err, fileInfo })
      return false
    }

    return false
  } catch (error) {
    console.log("uploadFile: ", { error })
    return false
  }
}

export async function uploadFileApi(
  filen_name_md5: string,
  file: File,
): Promise<FileInfoBase | boolean> {
  const formData = new FormData()
  formData.append("filen_name_md5", filen_name_md5)
  formData.append("file", file)

  try {
    const res = await server().post(API.upload, formData, {
      headers: { "content-type": "multipart/form-data" },
      timeout: FILE_UPLOAD_TIMEOUT,
    })

    console.log({ res })

    if (res.status == 200 && res.data.success) {
      if (file.name.endsWith(".dfsu") || file.name.endsWith(".shp")) {
        console.log("上传dfsu或者shp文件")
        return res.data.res.file_info as FileInfoBase
      }
      return res.data.res
    }
  } catch (err) {
    console.log("文件上传失败: ", { err, file, filen_name_md5 })
    return false
  }
  return false
}

export async function mxdToImgApi(body: MxdToImgFormBase): Promise<boolean> {
  try {
    const res = await server().post(API.mxdToImg, body, { timeout: 60000 })
    console.log({ res })

    if (res.status == 200 && res.data.success) {
      return true
    }

    return false
  } catch (err) {
    console.log(err)
    return false
  }
}

export async function serverCheckApi(timeout = DEFAULT_AXIOS_TIMEOUT): Promise<boolean> {
  try {
    const res = await server(timeout).get(API.test)

    if (res.status == 200 && res.data.success) {
      return true
    }
    return false
  } catch (err) {
    console.log("serverCheckApi err:", err)
    return false
  }
}
