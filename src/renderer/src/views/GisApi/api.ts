/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-09-20 17:29:22
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2023-09-27 16:18:09
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

export interface MxdToImgForm {
  dfsu_be: string
  dfsu_af: string
  project_range: string
  river_range: "工程前" | "工程后"
}

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

export async function uploadFile(filename: string, file: File) {
  const formData = new FormData()
  formData.append("filename", filename)
  formData.append("file", file)

  try {
    const res = await server.post(API.upload, formData, {
      headers: { "content-type": "multipart/form-data" },
    })

    if (res.status == 200 && res.data.success) return res.data.res
  } catch (err) {
    console.log(err)
    return false
  }
  return false
}

export async function mxdToImg(data: FormDataItemT) {
  const body = {
    dfsu_be_md5: data.beDfsuInfo.md5,
    dfsu_af_md5: data.afDfsuInfo.md5,
    output_name: data.outputName,
    river_range: data.riverRange,
  }

  console.log(body)

  // try {
  //   const res = await server.post(API.mxdToImg, data)

  //   if (res.status == 200 && res.data.success) return res.data.res
  // } catch (err) {
  //   console.log(err)
  //   return false
  // }
  // return false
}
