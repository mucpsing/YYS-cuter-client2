import { defineStore } from "pinia"
import { getMd5 } from "@renderer/utils/calculateMd5"
import { parserDataFromTxt } from "@Typhoon/utils"
import { type DataObjItemT } from "@Typhoon/utils"

export interface DataObjT {
  md5: string
  filename: string
  file: File
  parserData: DataObjItemT[]
  echartsData?: any
}

export const useTyphoonChartStore = defineStore("typhoonChartStore", {
  state: () => ({
    renderData: [] as any[],
  }),
})

export const useTyphoonFileStore = defineStore("typhoonFileStore", {
  state: () => ({
    currtFileMd5: [] as string[], // 当前选择的文件
    fileObj: {} as { [md5: string]: DataObjT },
  }),

  getters: {
    fileMd5List: (state) => Object.keys(state.fileObj),

    fileMd5Options: (state) => {
      return Object.values(state.fileObj).map((item) => ({ label: item.filename, value: item.md5 }))
    },

    currtSelectDataList: (state) => {
      const res = [] as DataObjItemT[]
      state.currtFileMd5.forEach((md5) => {
        res.push(...state.fileObj[md5].parserData)
      })
      return res
    },

    currtTpyhoonNameList: (state) => {
      const res: string[] = []
      state.currtFileMd5.forEach((md5) => {
        state.fileObj[md5].parserData.map((item, idx) => {
          res.push(`${idx}) ${item.英文名称}_${item.id}`)
        })
      })
      return res
    },
    currtTpyhoonDataList: (state) => {
      const res: { label: string; data: string[][]; value: string }[] = []
      state.currtFileMd5.forEach((md5) => {
        state.fileObj[md5].parserData.map((item, idx) => {
          res.push({
            label: `${idx}) ${item.英文名称}_${item.id}`,
            data: item.RAW,
            value: `${md5}_${item.英文名称}_${item.id}`,
          })
        })
      })
      return res
    },
  },

  actions: {
    async unSelectFIle(md5: string) {
      const index = this.currtFileMd5.indexOf(md5)
      if (index !== -1) this.currtFileMd5.splice(index, 1)
    },
    async selectFile(md5: string) {
      if (!Object.hasOwn(this.fileObj, md5)) return

      // 因为 state.currtFileMd5 是一个多选的数组，判断是否已经存在，不存才进行添加
      if (!Object.hasOwn(this.currtFileMd5, md5)) this.currtFileMd5.push(md5)
    },

    async clearSelect() {
      this.currtFileMd5.length = 0
    },

    async addFile(file: File) {
      console.log(file)
      const md5 = await getMd5(file)
      if (Object.hasOwn(this.fileObj, md5)) return console.warn("文件已存在")

      // TODO 需要添加txt和excel，或者在线拉取数据等数据获取方式，目前先实现txt
      const fileInfo: DataObjT = {
        md5,
        filename: file.name,
        file,
        parserData: await parserDataFromTxt(file),
      }

      this.fileObj[md5] = fileInfo

      return fileInfo
    },
  },
})
