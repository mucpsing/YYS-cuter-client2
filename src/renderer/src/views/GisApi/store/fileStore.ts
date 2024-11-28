/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-11-19 09:30:51
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-11-27 10:08:05
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\store\modules\fileStore.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from "pinia"
import type { FileInfoItemT } from "@gisapi/Types"

// 存放文件数据的store
export const useFileStroe = defineStore("fileStore", {
  state: () => ({
    fileReading: false,
    dfsuObj: {} as { [md5: string]: FileInfoItemT },
    shpList: {} as { [md5: string]: FileInfoItemT },
    geoJsonObj: {} as { [md5: string]: any },
  }),

  getters: {
    geoJsonOptions(state) {
      const options: { value: string; label: string }[] = []
      for (const [geoMd5, _geoData] of Object.entries(state.dfsuObj)) {
        if (!Object.keys(state.dfsuObj).includes(geoMd5)) continue

        options.push({
          label: state.dfsuObj[geoMd5].name,
          value: geoMd5,
        })
      }

      return options
    },
  },

  actions: {
    // async selectItemByMd5(md5: string) {
    //   const tabStore = useGisApiTabStore()
    //   if (tabStore.currtFormData.dfsu_md5.length < 2) {
    //     tabStore.currtFormData.dfsu_md5.push(md5)
    //   }
    // },

     getFile(md5: string) {
      if (this.dfsuObj[md5]) {
        return this.dfsuObj[md5]
      }

      return
    },

    async removeDataByMd5(md5: string) {
      delete this.dfsuObj[md5]
      delete this.geoJsonObj[md5]
    },

    async addDfsuItem(item: FileInfoItemT) {
      this.dfsuObj[item.md5] = item

      if (item.geoJson) {
        this.geoJsonObj[item.md5] = item.geoJson
      }

      // const tabStore = useGisApiTabStore()
      // if(tabStore.currtFormData.dfsu_md5.length < 2) {
      //   tabStore.currtFormData.dfsu_md5.push(item.md5)
      // }
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
