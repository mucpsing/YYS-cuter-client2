/** 关联下面的options.value，用来控制当前组件的setp */
export const currtSetp = ref(1)

export const templateSetpOptions = [
  { title: "选择模板", value: 1 },
  { title: "工程配置", value: 2 },
  // { title: "模板配置", value: 3 },
  { title: "图片生成", value: 4 },
]

export function createFormData(newTabId: number) {
  return {
    id: newTabId,
    setp: 1,
    title: "未命名",
    beDfsuInfo: {
      md5: "",
      progress: 0,
      size: 0,
      path: "",
      name: "",
      reading: false,
      file: {} as File,
    },
    afDfsuInfo: {
      md5: "",
      progress: 0,
      size: 0,
      path: "",
      name: "",
      reading: false,
      file: {} as File,
    },
    projectRange: {
      md5: "",
      path: "",
      size: 0,
      name: "",
      reading: false,
      fileCount: 0,
      fileList: [] as File[],
    },
    outputName: "",
    riverRange: "工程前" as "工程前" | "工程后",
    // counterSetp: "",
  }
}
const defaultFormData = createFormData(0)

export type FormDataItemT = typeof defaultFormData
export const currtFormDataId = ref(0)
export const formDataList = ref([defaultFormData])
export const formCount = ref(1)
