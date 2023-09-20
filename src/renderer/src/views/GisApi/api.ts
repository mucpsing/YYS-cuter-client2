/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-09-20 17:29:22
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-09-20 23:56:32
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\api.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import Axios from "axios"
import config from "./config"

const baseURL = `http://${config.SERVER_IP}:${config.SERVER_PROT}/gis-api/`
const server = Axios.create({ baseURL, timeout: 1000 })

const API = {
  upload: "/upload_file",
  mxd_to_img: "/export_img_by_mxd_template",
}

export async function uploadFile(formData: FormData) {
  return await server.post(API.upload, formData, {
    headers: { "content-type": "multipart/form-data" },
  })
}

export async function mxdToImg() {}
