/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2022-12-01 09:58:31
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-08-24 22:15:58
 * @FilePath: \yys-cuter-client\src\components\ImageCuter\EventBus\index.ts
 * @Description: 一些插件自身的状态和对状态修改的api
 */

import path from "path-browserify"
import { eventBus } from "@renderer/libs"
import { FileReadSizeError, getImageInfo } from "@renderer/utils/imgHandler"
import data from "./data"

import config from "./config"
import { mainMenus, type ModesT } from "./menus"

import type { ImgDataItem } from "../imageCuter"

export interface ResizeItem {
  id: string
}

/* 真正导出为json的数据 */
export interface FileCropInfo {
  fileName: string
  filePath: string
  width: number
  height: number

  cropArea: {
    title: string
    startX: number
    startY: number
    endX: number
    endY: number
  }[]
}

/* 这里的数据在导出时需删除 */
export type HistoryFileInfoItem = {
  image: HTMLImageElement
  imgKey: string
} & FileCropInfo

/* 当前配置页打开的折叠项 */
export const openConfigPannelList = ref<string[]>([])
export const currtInputValue = ref<string>("")

export const ElementCache = {
  imgBorder: {} as HTMLElement,
  imgElement: {} as HTMLElement,
  imgContainer: {} as HTMLElement,
  dragElement: {} as HTMLElement,
}

type ZoomMode = "in" | "out" | "init"

export const localStore = reactive({
  showSettingsPage: false,
  DEBUG: false,

  isIntersect: false, // 是否相交
  acrossBorder: false,
  zoomMode: "in" as ZoomMode,

  currtFileName: "未添加任何文件", // 存储当前打开的文件名，作为title显示
  currtFilePath: "" /* 当前修改的图片链接 */,
  currtJsonFilePath: "", // 当前指定的json配置文件

  autoFcous: true,

  /* 插件模式 */
  currtMode: "crop" as ModesT,
  currtModeInfo: {},
  currtImgObj: {} as HistoryFileInfoItem,
  currtCoordsIndex: 0,
  currtCoordsList: data[0].coords,

  historyFileInfoObj: {} as { [imgKey: string]: HistoryFileInfoItem },

  /* cropMode 裁剪模式的数据状态 */
  crop: { title: "", startX: 0, startY: 0, endX: 50, endY: 50 },

  lockSize: false,
  lockXY: false,

  dragResizeID: "cps-drag-resize-id", // 拖拽元素的id，暂时没什么用

  imgElementX: 0, // 图片元素的实时尺寸信息
  imgElementY: 0, // 图片元素的实时尺寸信息
  imgElementW: 0, // 图片元素的实时尺寸信息
  imgElementH: 0, // 图片元素的实时尺寸信息

  img_X_Offset: 0, // 图片img标签的真实偏移值，这个是个动态值
  img_Y_Offset: 0, // 图片img标签的真实偏移值，这个是个动态值

  /* 文件信息 */
  imgWidth: 0, // 文件实际尺寸
  imgHeight: 0, // 文件实际尺寸
  imgScale: 1, // 图片与img元素的比例，图片大于则比例大，图片小则比例小

  containerW: 1000, // 工作区的大小
  containerH: 1000, // 工作区的大小

  /* 裁剪工具相关状态 */
  resizeItems: [] as ResizeItem[],
  resizeIdList: [], // 裁剪框

  /* 通过方法来设置状态 */
  setMessage(msg: string): void {
    this.currtFileName = msg
  },

  /* 切换工具（模式） */
  setMode(modeName: ModesT): void {
    if (modeName == this.currtMode) return console.log("不需要更新")

    if (Object.keys(mainMenus).includes(modeName)) {
      this.currtMode = modeName
      this.currtModeInfo = mainMenus[modeName]
      return
    }

    console.log(`数据【${modeName}】不存在`)
  },

  /* 更新截取插件的四角坐标 */
  setCropCoords(coordKey: string, newCoord: number | string): void {
    if (Object.keys(this.crop).includes(coordKey)) {
      Object.assign(this.crop, { [coordKey]: Math.trunc(newCoord as number) })
    }
  },

  coordsInit(imgName?: string) {
    console.log("coordsInit:")

    let imgItem: ImgDataItem | undefined
    if (imgName) {
      // 从data中查找是否已经存在，不存在则创建
      imgItem = data.find((item) => item.imgName == imgName)
    }

    this.crop = imgItem?.coords[0] || {
      title: "新建数据",
      startX: 0,
      startY: 0,
      endX: 50,
      endY: 50,
    }
  },

  addCoords(mode: "add" | "update" | "auto" = "auto"): boolean {
    if (!this.crop.title) {
      console.log("title为空，无法保存新坐标")
      return false
    }
    let sameTitle = false,
      hasTitle = false

    if (mode == "auto") {
      sameTitle = this.crop.title == this.currtCoordsList[this.currtCoordsIndex].title
      hasTitle = Boolean(this.currtCoordsList.find((item) => item.title == this.crop.title))

      if (sameTitle || hasTitle) {
        mode = "update"
      } else {
        mode = "add"
      }
    }

    let res: boolean
    switch (mode) {
      case "add":
        if (hasTitle) console.log("注意！存在相同的title")

        // 新增坐标
        this.currtCoordsList.push({
          title: this.crop.title,
          // xy: [this.crop.startX, this.crop.startY, this.crop.endX, this.crop.endY],
          startX: this.crop.startX,
          startY: this.crop.startY,
          endX: this.crop.endX,
          endY: this.crop.endY,
        })

        this.currtCoordsIndex = this.currtCoordsList.length > 0 ? this.currtCoordsList.length - 1 : 0
        res = true

      case "update":
        // 当前选中的修改坐标
        this.currtCoordsList[this.currtCoordsIndex].title = this.crop.title.toString()
        this.currtCoordsList[this.currtCoordsIndex].startX = Math.trunc(this.crop.startX)
        this.currtCoordsList[this.currtCoordsIndex].startY = Math.trunc(this.crop.startY)
        this.currtCoordsList[this.currtCoordsIndex].endX = Math.trunc(this.crop.endX)
        this.currtCoordsList[this.currtCoordsIndex].endY = Math.trunc(this.crop.endY)

        res = true

      default:
        res = false
    }

    if (res && config.AUTO_DRAW) eventBus.emit("imc-tabCrop-draw")

    return res
  },

  /**
   * @Description - 删除当前选择的coords
   *
   */
  removeCoords(index?: number) {
    if (index) {
      this.currtCoordsList.splice(index, 1)
    } else {
      this.currtCoordsList.splice(this.currtCoordsIndex, 1)
    }
  },

  /**
   * @Description - 切换|新增坐标函数，切换this.currtCoordsList的内容，
   *
   * @param {number} index  - {description}
   */
  async switchCoords(index: number) {
    // 在打开文件前限制切换坐标
    // BUG 否则裁剪框会无法移动
    if (!this.currtFilePath) return console.log("未打开任何文件，无法进行切换")

    // 循环
    // if (index >= this.currtCoordsList.length) {
    //   index = 0;
    // } else if (index < 0) {
    //   index = this.currtCoordsList.length - 1;
    // }

    // 限制
    if (index >= this.currtCoordsList.length - 1) {
      index = this.currtCoordsList.length - 1
    } else if (index <= 0) {
      index = 0
    }

    this.currtCoordsIndex = index
    this.crop.title = this.currtCoordsList[this.currtCoordsIndex].title.toString()
    this.crop.startX = Math.trunc(this.currtCoordsList[this.currtCoordsIndex].startX)
    this.crop.startY = Math.trunc(this.currtCoordsList[this.currtCoordsIndex].startY)
    this.crop.endX = Math.trunc(this.currtCoordsList[this.currtCoordsIndex].endX)
    this.crop.endY = Math.trunc(this.currtCoordsList[this.currtCoordsIndex].endY)

    eventBus.emit("imc-body-updateCoords")
  },

  async zoomInit() {
    this.zoomMode = "init"
    if (
      this.imgWidth > ElementCache.imgContainer.clientWidth ||
      this.imgHeight > ElementCache.imgContainer.clientHeight
    ) {
      config.SCREEN_MAX_HEIGHT = 500
      config.SCREEN_MAX_WIDTH = 500
    } else {
      config.SCREEN_MAX_HEIGHT = this.imgHeight
      config.SCREEN_MAX_WIDTH = this.imgWidth
    }
  },

  async zoomIn() {
    this.zoomMode = "in"
    config.SCREEN_MAX_HEIGHT *= 0.85
    config.SCREEN_MAX_WIDTH *= 0.85
  },

  async zoomOut() {
    this.zoomMode = "out"
    config.SCREEN_MAX_HEIGHT = ElementCache.imgContainer.clientHeight
    config.SCREEN_MAX_WIDTH = ElementCache.imgContainer.clientWidth
  },

  /* 切换文件 */
  // BUG 当前读取文件的逻辑因为使用了path，仅electron的状态下可以使用，需要添加一个纯浏览器逻辑
  /**
   * @Description - 图片改变时的调用入口，文件检测->文件读取->文件记录
   *
   * @param {File|string} file  - File对象获取图片的绝对地址
   */
  async setCurrtFile(file: File | string) {
    console.log({ file })

    /* 通过基本信息验证文件 */
    let filePath
    if (typeof file == "string") {
      filePath = file
    } else {
      filePath = file.path.toString().replaceAll("\\", "/")
    }
    const fileName = path.basename(filePath) || ""

    try {
      /* 通过 image 读取文件尺寸和base64 */
      const imgInfo = await getImageInfo(file)

      if (!imgInfo) return console.error("读取文件key失败，无法获取尺寸信息")

      /* 通过 文件名_长x宽 来记录每个文件的信息 */
      const imgKey = `${fileName}_${imgInfo.width}x${imgInfo.height}`

      if (Object.keys(this.historyFileInfoObj).includes(imgKey)) {
        // 已存在，从历史对象中获取信息
        this.currtImgObj = this.historyFileInfoObj[imgKey]
      } else {
        // 不存在，创建新记录
        const fileInfo: HistoryFileInfoItem = {
          fileName,
          filePath,
          imgKey,
          cropArea: [],
          width: imgInfo.width,
          height: imgInfo.height,
          image: imgInfo.image,
        }

        this.historyFileInfoObj[imgKey] = fileInfo
        this.currtImgObj = fileInfo
      }

      /* 每次都要更新的数据 */
      this.imgWidth = this.currtImgObj.width
      this.imgHeight = this.currtImgObj.height
      this.imgScale = this.imgHeight / this.imgElementH
      this.currtFilePath = filePath || this.currtImgObj.image.src
      this.currtFileName = fileName || imgKey

      // 创建新的数据
      this.coordsInit()

      eventBus.emit("imc-body-onResize")

      setTimeout(() => eventBus.emit("imc-body-updateCoords"), 500)
    } catch (e) {
      if (e instanceof FileReadSizeError) {
        return console.log(`setCurrtFile 读取文件错误: ${fileName}`)
      }
      return
    }
  },

  async setCurrtTitle(newTitle?: string) {
    if (!newTitle) newTitle = this.crop.title

    if (this.currtCoordsList.length > 0) {
      newTitle = newTitle.toString()

      this.crop.title = newTitle
      this.currtCoordsList[this.currtCoordsIndex].title = newTitle

      return true
    } else {
      return console.log("当前没有数据")
    }
  },
})

export const startX = computed(() => Math.trunc(localStore.crop.startX))
export const startY = computed(() => Math.trunc(localStore.crop.startY))
export const endX = computed(() => Math.trunc(localStore.crop.endX))
export const endY = computed(() => Math.trunc(localStore.crop.endY))

export default localStore
