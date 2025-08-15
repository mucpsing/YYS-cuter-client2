/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-11-19 09:30:51
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2025-08-15 09:32:03
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\store\modules\fileStore.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from "pinia"

import { getMd5 } from "@renderer/utils/calculateMd5"
import { file } from "jszip"
export interface FileInfoItemT {
  id: string
  name: string
  md5: string
  md5Name: string
  size: number
  // file: File
  // checked?: boolean
  // loading?: boolean
  // disabled?: boolean
  // uploadProgress?: number
  // uploadStatus?: string
  // geoJson?: any[]
}

// 记录到tabData内的beDfsuMd5List和afDfsuMd5List
export interface FileTabInfoItemT extends FileInfoItemT {
  checked: boolean
  loading?: boolean
  disabled: boolean
  uploadProgress?: number
  // uploadStatus?: string
}

// 存放文件数据的store
export const useFileStroe = defineStore("fileStore", {
  state: () => ({
    fileReading: false,
    dfsuObj: {} as { [md5: string]: FileInfoItemT },
    shpList: {} as { [md5: string]: FileInfoItemT },
    geoJsonObj: {} as { [md5: string]: any },
    fileList: [] as File[],
  }),

  getters: {
    // BUG 不好用，当前是所有geojson，需要修改为指定tabID的文件列表
    // geoJsonOptions(state) {
    //   const options: { value: string; label: string }[] = []
    //   for (const [geoMd5, _geoData] of Object.entries(state.dfsuObj)) {
    //     if (!Object.keys(state.dfsuObj).includes(geoMd5)) continue
    //     options.push({
    //       label: state.dfsuObj[geoMd5].name,
    //       value: geoMd5,
    //     })
    //   }
    //   return options
    // },
  },

  actions: {
    // async selectItemByMd5(md5: string) {
    //   const tabStore = useGisApiTabStore()
    //   if (tabStore.currtFormData.dfsu_md5.length < 2) {
    //     tabStore.currtFormData.dfsu_md5.push(md5)
    //   }
    // },

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

      const fileInfo: FileInfoItemT = {
        id: new Date().getTime().toString(36),
        name: file.name,
        md5,
        md5Name: `${md5}.dfsu`,
        size: file.size / 1024 / 1024,
        // checked: false,
        // disabled: false,
        // uploadProgress: 0,
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
