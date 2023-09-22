/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-09-20 17:29:22
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2023-09-21 08:38:09
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\api.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import Axios from "axios"
import config from "./config"

const baseURL = `http://${config.SERVER_IP}:${config.SERVER_PROT}/gis-api/`
const server = Axios.create({ baseURL, timeout: 1000 })

const API = {
  getTemplateList: "/get_template_list",
  upload: "/upload_file",
  mxdToImg: "/export_img_by_mxd_template",
}

export interface MxdToImgForm {
  dfsu_be: string
  dfsu_af: string
  project_range: string
  river_range: "工程前" | "工程后"
}

export async function uploadFile(formData: FormData) {
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

export async function mxdToImg() {}
