/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-09-20 17:29:22
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-09-24 19:01:25
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\api.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import Axios from "axios"
import config from "./config"
import type { FormDataItemT } from "./store/state"

const baseURL = `http://${config.SERVER_IP}:${config.SERVER_PROT}/gis-api/`
const server = Axios.create({ baseURL, timeout: 1000 })

const API = {
  getTemplateList: "/get_template_list",
  upload: "/upload_file",
  mxdToImg: "/mxt_to_img",
}

export interface MxdToImgForm {
  dfsu_be: string
  dfsu_af: string
  project_range: string
  river_range: "工程前" | "工程后"
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
