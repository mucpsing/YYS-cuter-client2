/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-09-26 14:23:33
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-06-27 16:03:20
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\store\state.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @Description: 建议所有state变量使用currtXxxxXxxx来命名
 */
/** 关联下面的options.value，用来控制当前组件的setp */
export const currtSetp = ref(1)

export const templateSetpOptions = [
  { title: "选择模板", value: 1 },
  { title: "工程配置", value: 2 },
  // { title: "模板配置", value: 3 },
  // { title: "图片生成", value: 4 },
  { title: "图片生成", value: 3 },
]

export function createFormData(newTabId: number) {
  return {
    id: newTabId,
    setp: 1,
    title: "未命名工况",
    beDfsuInfo: {
      // dfsu 工程前文件信息
      md5: "",
      progress: 0,
      size: 0,
      path: "",
      name: "",
      reading: false,
      file: {} as File,
    },
    afDfsuInfo: {
      // dfsu 工程后文件信息
      md5: "",
      progress: 0,
      size: 0,
      path: "",
      name: "",
      reading: false,
      file: {} as File, // 文件实例，已缓存在浏览器
    },
    projectRange: {
      // 项目范围 shp文件信息
      md5: "",
      path: "",
      size: 0,
      name: "",
      reading: false,
      fileCount: 0,
      fileList: [] as { file: File; ext: string; name: string }[],
      shpList: [] as string[],
    },
    outputName: "",
    riverRange: "工程前" as "工程前" | "工程后",
    mxdId: -1, // 要使用的mxd模板id
    mxdName: "",
    projectRangeType: "shp" as "point" | "shp",
    projectPoints: { x: -1, y: -1 },
    radian_or_angle: "弧度" as `弧度` | `角度`,
    show_range: 600,
    mesh_size: 25,
    contour_range: 200, // 大于这个长度的流速等值线才会被显示
    contour_setp: [] as number[], // 等值线要显示哪些值
  }
}
const defaultFormData = createFormData(0)

export type FormDataItemT = typeof defaultFormData
export const currtFormDataId = ref(0)
export const formDataList = ref([defaultFormData])

export const formCount = ref(1)
export const currtTemplateId = ref(0)
export const currtExtendId = ref(-1) // 记录要继承哪个模板的下标

export const showAddTapDialog = ref(false)

export const isGisServerConnected = ref(false)