<template>
  <div :class="['flex flex-col h-full px-2 gap-4']">
    <header :class="['flex justify-between items-center', 'py-6 px-6 gap-8', 'min-w-[250px]']">
      <t-tooltip content="添加工况">
        <t-button :onClick="() => (showAddTapDialog = true)"
          ><template #icon><AddIcon /></template
        ></t-button>
      </t-tooltip>

      <t-dialog
        header="创建工况配置"
        body="对话框内容"
        :visible="showAddTapDialog"
        :on-close="() => (showAddTapDialog = false)"
        :on-confirm="onAddTap"
      >
        <ul class="p-1">
          <li class="flex gap-2 py-1">
            <h3><strong>继承工况配置生成：</strong></h3>
            <t-dropdown
              :options="selectTemplateExtendIdOptions"
              @click="(data) => {
                currtExtendId = data.value as number
                currtExtendValue = data.content as string
              }"
            >
              <t-button size="small" variant="outline"
                >{{ currtExtendValue }}
                <template #suffix><ChevronDownIcon /> </template>
              </t-button>
            </t-dropdown>
          </li>
        </ul>
      </t-dialog>

      <t-steps
        size="small"
        v-model="formDataList[currtFormDataId].setp"
        layout="horizontal"
        :readonly="false"
        :options="Sopts"
      />
    </header>

    <transition name="GisApi__body-fade">
      <KeepAlive>
        <component :is="SwiperComponentList[formDataList[currtFormDataId].setp]"></component>
      </KeepAlive>
    </transition>

    <footer :class="['flex gap-1', 'mt-4', 'flex-grow-0']">
      <t-button
        class="flex-[1]"
        :disabled="formDataList[currtFormDataId].setp == 1"
        @click="swtichSetp('back')"
        size="medium"
        >上一步<template #icon>
          <c-icon-font
            iconName="icon-yys-xiayiye"
            :rotate="180"
            color="white"
            :class="['text-white mr-2']"
          ></c-icon-font> </template
      ></t-button>
      <t-button
        :on-click="() => mxdToImg(formDataList[currtFormDataId])"
        class="flex-[1]"
        :disabled="formDataList[currtFormDataId].setp != 3"
        theme="success"
        size="medium"
        :loading="loading"
        >生成图片 (1/4)
        <template #icon>
          <c-icon-font
            iconName="icon-yys-picture"
            color="white"
            :class="['text-white mr-2']"
          ></c-icon-font>
        </template>
      </t-button>
      <t-button
        class="flex-[1]"
        :disabled="formDataList[currtFormDataId].setp == Sopts.length"
        @click="swtichSetp('next')"
        size="medium"
        >下一步<template #suffix>
          <c-icon-font
            iconName="icon-yys-xiayiye"
            color="white"
            :rotate="0"
            :class="['text-white mr-2']"
          ></c-icon-font> </template
      ></t-button>
    </footer>

    <GuideSetp ref="GuideSetpRef" />
  </div>
</template>
<script lang="ts">
import SwiperSetp1 from "./SwiperSetp1/index.vue"
import SwiperSetp2 from "./SwiperSetp2.vue"
import SwiperSetp3 from "./SwiperSetp3.vue"
import SwiperSetp4 from "./SwiperSetp4.vue"

const SwiperComponentList = {
  "1": "SwiperSetp3",
  "2": "SwiperSetp2",
  "3": "SwiperSetp3",
  "4": "SwiperSetp4",
}
export default { components: { SwiperSetp1, SwiperSetp2, SwiperSetp4, SwiperSetp3 } }
</script>

<script setup lang="ts">
import { templateSetpOptions } from "../store/state"
import { AddIcon, ChevronDownIcon } from "tdesign-icons-vue-next"
import { formDataList, currtFormDataId, currtExtendId, showAddTapDialog } from "../store/state"

import { uploadFileApi, mxdToImgApi } from "../api"
import type { MxdToImgFormT } from "../api"
import type { FormDataItemT } from "../store/state"
import { NotifyPlugin } from "tdesign-vue-next"

import GuideSetp from "../_components/guide.vue"
import { isGisServerConnected } from "../store/state"

const GuideSetpRef = ref<InstanceType<typeof GuideSetp> | null>(null)
const loading = ref(false)

const tabControler = inject("tabControler") as {
  addTab: (e: any, extendId: number) => void
  removeTab: () => void
}

const Sopts = computed(() => templateSetpOptions)

const currtExtendValue = ref("不继承")
const selectTemplateExtendIdOptions = computed(() => {
  const res = [{ content: `不继承`, value: -1 }]

  formDataList.value.forEach((item, idx) => {
    res.push({ content: item.title, value: idx })
  })

  return res
})

async function onAddTap() {
  console.log("onAddTap...", { extendId: currtExtendId.value })

  tabControler.addTab({}, currtExtendId.value)

  showAddTapDialog.value = false
}

function nextCheck(currtSetp: number): boolean {
  const data = formDataList.value[currtFormDataId.value]

  if (!isGisServerConnected.value) {
    if (GuideSetpRef.value) {
      GuideSetpRef.value.show("header", 0)
    } else {
      NotifyPlugin("error", {
        title: `合成服务端口未连接，请手动配置服务器重新连接`,
        duration: 2000,
      })
    }

    return false
  }

  switch (currtSetp) {
    case 1:
      // 【1】检查是否已设置输入名称
      if (data.title.length == 0 || data.title == "未命名工况") {
        if (GuideSetpRef.value) {
          GuideSetpRef.value.show("setp1", 0)
        } else {
          NotifyPlugin("error", {
            title: `未指定的输出名称（必须）`,
            duration: 2000,
          })
        }

        return false
      }

      // 【2】检查是否已选择mxd模板
      else if (data.mxdId < 0) {
        console.log(data.mxdId)
        if (GuideSetpRef.value) {
          GuideSetpRef.value.show("setp1", 1)
        } else {
          NotifyPlugin("error", {
            title: `未选择mxd文件模板（输出类型：采样点、流速、流场）`,
            duration: 2000,
          })
        }

        return false
      }

      break
    case 2:
      break
    case 3:
      break
  }

  return true
}

/**
 * @description: 点击下一步，上一步按钮的中转函数
 */
function swtichSetp(setp: "next" | "back") {
  switch (setp) {
    case "next":
      if (formDataList.value[currtFormDataId.value].setp == Sopts.value.length) return

      if (!nextCheck(formDataList.value[currtFormDataId.value].setp)) return

      formDataList.value[currtFormDataId.value].setp += 1

      break

    case "back":
      if (formDataList.value[currtFormDataId.value].setp == 0) return
      formDataList.value[currtFormDataId.value].setp -= 1
  }
}

/**
 * @description: 最终调用接口的函数，首先将文件上传，确保文件都存在后则调用导出函数
 * @param {*} data
 * @return {*}
 */
async function mxdToImg(data: FormDataItemT) {
  loading.value = true
  console.log({ data })

  // 创建上传列表
  const upload_list = [
    uploadFileApi(`${data.beDfsuInfo.md5}.dfsu`, data.beDfsuInfo.file), // 上传工程前 dfsu
    uploadFileApi(`${data.afDfsuInfo.md5}.dfsu`, data.afDfsuInfo.file), // 上传工程后 dfsu
  ]

  // 如果存在
  if (data.projectRange.fileList.length > 0) {
    data.projectRange.fileList.map((eachFile) => {
      upload_list.push(uploadFileApi(`${data.projectRange.md5}${eachFile.ext}`, eachFile.file))
    })
  }

  console.log("开始上传文件，数量: ", upload_list.length)
  console.log({ upload_list })
  const file_upload_res_list = await Promise.all(upload_list)

  // 检查是否上传成功
  if (!file_upload_res_list.every((res) => res)) {
    console.log("有文件上传失败")
    console.log(file_upload_res_list)
  } else {
    console.log("所有文件上传成功")
  }

  // 拼接api所需要的参数格式body
  const body: MxdToImgFormT = {
    template_id: data.mxdId,
    dfsu_be_md5: data.beDfsuInfo.md5,
    dfsu_af_md5: data.afDfsuInfo.md5,
    output_name: data.title,
    river_range: data.riverRange,
    radian_or_angle: data.radian_or_angle == "弧度" ? "radian" : "angle",
  }

  // 项目范围或者点
  if (data.projectRangeType == "point") {
    body["project_point"] = `${data.projectPoints.x},${data.projectPoints.y}`
  } else {
    body["project_md5"] = data.projectRange.md5
  }

  console.log("## 开始调用合成接口")

  console.log({ body })
  const res = await mxdToImgApi(body)
  console.log({ res })

  loading.value = false

  // return res
}
</script>

<style lang="stylus">
/* 面板切换过渡动效 */
.GisApi__body-fade-enter-active
  position relative
  opacity 1
  transition all 0.3s ease-out 0.3s

.GisApi__body-fade-leave-active
  position relative
  opacity 1
  transition all 0.3s cubic-bezier(1, 0.5, 0.8, 1)

.GisApi__body-fade-enter-from, .GisApi__body-fade-leave-to
  position relative
  opacity 0
</style>
