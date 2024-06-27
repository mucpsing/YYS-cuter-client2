/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-09-20 17:29:22
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-06-27 10:39:51
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\api.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import Axios from "axios"
import config from "./config"
import type { FormDataItemT } from "./store/state"

const baseURL = `http://${config.SERVER_IP}:${config.SERVER_PROT}/gis-api/`
const server = Axios.create({ baseURL, timeout: 1000 })

const API = {
  getTemplateList: "/mxd_template_list",
  upload: "/upload_file",
  mxdToImg: "/mxd_to_img",
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

// export async function uploadShpFile(md5Filename:string, fileList:File[]){
//   for (let each of fileList){
//     const formData = new FormData()
//     formData.append("filename", filename)
//     formData.append("file", file)
//   }

//   Promise.all()
// }

export async function getTemplateList() {
  try {
    const { status, data } = await server.get(API.getTemplateList)
    if (status == 200) {
      return data.res as string[]
    }

    return []
  } catch (err) {
    console.log(err)
    return []
  }
}

export async function uploadFileApi(filen_name_md5: string, file: File) {
  const formData = new FormData()
  formData.append("filen_name_md5", filen_name_md5)
  formData.append("file", file)

  // console.log("file: ", filen_name_md5)

  try {
    const res = await server.post(API.upload, formData, {
      headers: { "content-type": "multipart/form-data" },
    })

    if (res.status == 200 && res.data.success) {
      // return res.data.res
      return true
    }
  } catch (err) {
    console.log("文件上传失败: ", { err, file, filen_name_md5 })
    return false
  }
  return false
}

export async function mxdToImgApi(body: MxdToImgFormBase): Promise<boolean> {
  try {
    const res = await server.post(API.mxdToImg, body, { timeout: 60000 })
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
