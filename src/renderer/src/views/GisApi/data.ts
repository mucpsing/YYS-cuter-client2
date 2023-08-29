import { reactive } from "vue"

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
