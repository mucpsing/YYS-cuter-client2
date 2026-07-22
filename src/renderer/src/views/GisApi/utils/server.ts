/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-09-20 17:29:22
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2026-01-13 15:23:57
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\api.ts
 * @Description: 所有API的包装工具类，所有外部要调用服务器都要引入这个类，实际的API保存在store/API中
 */

import Axios from "axios"
import config from "../store/config"
import API from "../store/API"
import type { TemplateInfo, FileInfoBase } from "@gisapi/Types"
import type { FileInfoItemBaseT, TaskItemT, MxdToImgFormBase } from "@gisapi/Types"

const DEFAULT_AXIOS_TIMEOUT = 6000
const FILE_UPLOAD_TIMEOUT = 300000

const DEFAULT_BASE_URL = `${config.SERVER_PROTOCOL}//${config.SERVER_IP}:${config.SERVER_PROT}`
let BASE_URL = `${DEFAULT_BASE_URL}`
let SERVER = Axios.create({ baseURL: BASE_URL, timeout: DEFAULT_AXIOS_TIMEOUT })

/**
 * @description: 首先检查当前的url是否有被更改，如果更改了就重新创建axios，否则返回原始的axios
 */
const server = (timeout = DEFAULT_AXIOS_TIMEOUT) => {
    let baseURL = `${config.SERVER_PROTOCOL}//${config.SERVER_IP}:${config.SERVER_PROT}`

    if (baseURL != BASE_URL || !SERVER) {
        // console.log("重新创建baseURL：", baseURL)
        SERVER = Axios.create({ baseURL, timeout })
        BASE_URL = baseURL
    }

    return SERVER
}

export async function getTemplateList() {
    console.log("getTemplateList:")

    try {
        const { status, data } = await server().get(API.getTemplateList)

        if (status == 200) return data.res as TemplateInfo[]

        console.warn("getTemplateList fail:", data)
        return []
    } catch (err) {
        console.log(err)
        return []
    }
}

export async function uploadCheck(fineMd5WithExtName: any): Promise<FileInfoBase | undefined> {
    try {
        const res = await server().get(`${API.uploadCheck}/${fineMd5WithExtName}`)
        console.log("fineMd5WithExtName: ", fineMd5WithExtName)
        if (res.status == 200 && res.data.success) {
            if (fineMd5WithExtName.endsWith(".dfsu") || fineMd5WithExtName.endsWith(".shp")) {
                // console.log("文件已经存在，返回服务器缓存", res.data.res)
                return res.data.res.file_info as FileInfoBase
            }
            return undefined
        }
        return undefined
    } catch (err) {
        console.log("文件上传失败: ", { err })
        return undefined
    }
}

type UploadResT = FileInfoBase | false

export async function uploadFile(
    file: File,
    fileInfo: FileInfoItemBaseT,
    updateProgressCallback: ((progress: number) => void) | undefined = undefined,
): Promise<UploadResT> {
    try {
        // 检查文件
        const upload_check_res = await uploadCheck(fileInfo.md5Name)
        if (upload_check_res) {
            console.log("文件已经存在，返回服务器缓存", upload_check_res)
            return upload_check_res
        } else {
            console.log("文件不存在，开始上传")
        }

        const formData = new FormData()
        formData.append("file_name_md5", fileInfo.md5Name as string)
        formData.append("file_source_name", fileInfo.name as string)
        formData.append("file", file as File)

        try {
            const res = await server().post(API.upload, formData, {
                headers: { "content-type": "multipart/form-data" },
                timeout: FILE_UPLOAD_TIMEOUT,

                // 通过回调函数来将上传进度传出去
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        if (updateProgressCallback) updateProgressCallback(percentCompleted)
                    }
                },
            })

            if (res.status == 200 && res.data.success) {
                if (fileInfo.name.endsWith(".dfsu") || fileInfo.name.endsWith(".shp")) {
                    // console.log("上传文件成功：", res.data.res)
                    return res.data.res.file_info as FileInfoBase
                }
                return false
            }
        } catch (err) {
            // console.log("文件上传失败: ", { err, fileInfo })
            return false
        }

        return false
    } catch (error) {
        // console.log("uploadFile: ", { error })
        return false
    }
}

export async function uploadFileApi(filen_name_md5: string, file: File): Promise<FileInfoBase | boolean> {
    const formData = new FormData()
    formData.append("filen_name_md5", filen_name_md5)
    formData.append("file", file)

    try {
        const res = await server().post(API.upload, formData, {
            headers: { "content-type": "multipart/form-data" },
            timeout: FILE_UPLOAD_TIMEOUT,
        })

        // console.log({ res })

        if (res.status == 200 && res.data.success) {
            if (file.name.endsWith(".dfsu") || file.name.endsWith(".shp")) {
                // console.log("上传dfsu或者shp文件")
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

/**
 * @description: 计算两个已存在服务器的dfsu文件的几何面积差值，返回geojson
 * @param {string} dfsu1Md5
 * @param {string} dfsu2Md5
 * @return {*}
 */
export async function getDfsuDifferenceToGeoJson(dfsu1Md5: string, dfsu2Md5: string) {
    try {
        const res = await server().post(
            API.iGeometryDifference,
            { md5_1: dfsu1Md5, md5_2: dfsu2Md5, output_format: "geojson" },
            { timeout: 60000 },
        )

        if (res.status == 200 && res.data.success) return res.data.res

        return undefined
    } catch (err) {
        console.log(err)
        return undefined
    }
}
export async function getAllTask(): Promise<undefined | TaskItemT[]> {
    try {
        const res = await server().get(API.getAllTask, { timeout: 3000 })

        console.log("getAllTask: ", res)

        if (res.status == 200 && res.data.success) return res.data.res

        return undefined
    } catch (err) {
        console.log(err)
        return undefined
    }
}
export async function getTaskById(task_id: string): Promise<undefined | TaskItemT> {
    try {
        const res = await server().get(API.getTaskById, {
            params: { task_id },
            timeout: 3000,
        })

        console.log("getTaskById: ", res)

        if (res.status == 200 && res.data.success) return res.data.res

        return undefined
    } catch (err) {
        console.log(err)
        return undefined
    }
}

export async function taskTest(body: MxdToImgFormBase): Promise<undefined | TaskItemT> {
    try {
        const res = await server().get(API.getTaskById, {
            params: { task_id: "server_start" },
            timeout: 3000,
        })

        console.log("taskTest: ", res)

        if (res.status == 200 && res.data.success) return res.data.res

        return undefined
    } catch (err) {
        console.log(err)
        return undefined
    }
}
export async function mxdToImgApi(body: MxdToImgFormBase): Promise<undefined | TaskItemT> {
    try {
        const res = await server().post(API.mxdToImg, body, { timeout: 30000 })


        if (res.status == 200 && res.data.success) return res.data.res

        return
    } catch (err) {
        console.log(err)
        return
    }
}

export async function mxdToImgApiByTask(body: MxdToImgFormBase): Promise<undefined | TaskItemT> {
    try {
        const res = await server().post(API.mxdToImgByTask, body, { timeout: 3000 })

        console.log({ res })

        if (res.status == 200 && res.data.success) return res.data.res

        return
    } catch (err) {
        console.log(err)
        return
    }
}

export async function serverCheckApi(timeout = DEFAULT_AXIOS_TIMEOUT): Promise<boolean> {
    try {
        const res = await server(timeout).get(API.test)

        if (res.status == 200 && res.data.success) return true
        return false
    } catch (err) {
        // console.log("serverCheckApi err:", err)
        return false
    }
}
