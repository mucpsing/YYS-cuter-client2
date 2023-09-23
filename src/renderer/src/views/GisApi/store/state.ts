/** 关联下面的options.value，用来控制当前组件的setp */
export const currtSetp = ref(1)

export const templateSetpOptions = [
  { title: "选择模板", value: 1 },
  { title: "模型配置", value: 2 },
  { title: "模板配置", value: 3 },
  { title: "图片下载", value: 4 },
]

export function createFormData(newTabId: number) {
  return reactive({
    id: newTabId,
    setp: 1,
    title: "未命名",
    beDfsuInfo: { md5: "", progress: 0, size: 0, path: "", name: "", reading: false },
    afDfsuInfo: { md5: "", progress: 0, size: 0, path: "", name: "", reading: false },
    outputName: "",
  })
}

export const currtFormDataId = ref(0)
export const formDataList = ref([createFormData(0)])
