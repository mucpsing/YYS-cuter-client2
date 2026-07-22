/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-11-19 09:30:51
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2026-07-22 14:53:32
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\store\modules\fileStore.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from "pinia"

import { getMd5 } from "@renderer/utils/calculateMd5"

export interface FileInfoItemBaseT {
    id: string
    name: string
    md5: string
    md5Name: string
    size: number
    // file: File
}

// 记录到tabData内的beDfsuMd5List和afDfsuMd5List
export interface FileTabInfoItemT extends FileInfoItemBaseT {
    checked: boolean
    loading: boolean
    disabled: boolean
    uploadProgress: number
}

// 存放文件数据的store
export const useFileStroe = defineStore("fileStore", {
    state: () => ({
        fileReading: false,
        dfsuObj: {} as { [md5: string]: FileInfoItemBaseT },
        shpList: {} as { [md5: string]: FileInfoItemBaseT },
        geoJsonObj: {} as { [md5: string]: any },
        fileList: [] as File[],
    }),

    actions: {
        getFile(md5: string) {
            // TODO 是否需要从服务器获取信息？
            if (this.dfsuObj[md5]) {
                return this.dfsuObj[md5]
            }

            return
        },

        async removeDataByMd5(md5: string) {
            delete this.dfsuObj[md5]
            delete this.geoJsonObj[md5]
        },

        async addDfsuItem(file: File) {
            const md5 = await getMd5(file)

            if (Object.hasOwn(this.dfsuObj, md5)) {
                console.warn("文件已存在，将从缓存中添加", this.dfsuObj[md5])
                return this.dfsuObj[md5]
            }

            const fileInfo: FileInfoItemBaseT = {
                id: new Date().getTime().toString(36),
                name: file.name,
                md5,
                md5Name: `${md5}.dfsu`,
                size: file.size / 1024 / 1024,
                // file,
            }

            this.dfsuObj[md5] = fileInfo
            return fileInfo
        },

        async addGelJsonItem(item) {
            this.geoJsonObj[item.md5] = item
        },

        async getGeoJsonByMd5(md5: string) {
            if (this.geoJsonObj[md5]) {
                return this.geoJsonObj[md5]
            }
            return []
        },
    },
})
