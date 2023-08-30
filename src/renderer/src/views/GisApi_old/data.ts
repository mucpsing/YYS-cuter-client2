import { reactive } from "vue"

/** 关联下面的options.value，用来控制当前组件的setp */
export const currtSetp = ref(1)
export const templateSetpOptions = [
  { title: "上传工程文件", value: 1, content: "上传工程前后的DFSU文件" },
  { title: "配置工程信息", value: 2, content: "工况选择、" },
  { title: "图片输出配置", value: 3, content: () => "数据点间隔、等值线值" },
  { title: "生成图片", value: 4, content: "点击切换步骤" },
]

export const templateInfo = ref([
  {
    template_id: 1,
    template_name: "采样点",
    mxd_name: "采样点_template.mxd",
    preview: "./采样点_template.png",
  },
  {
    template_id: 2,
    template_name: "流速",
    mxd_name: "流速_template.mxd",
    preview: "./流速_template.png",
  },
  {
    template_id: 3,
    template_name: "流向",
    mxd_name: "流向_template.mxd",
    preview: "./流向_template.png",
  },
])

export const formDataList = ref([])

export default reactive({})
