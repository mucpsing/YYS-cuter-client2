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
        readonly
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
  </div>
</template>
<script lang="ts">
import SwiperSetp1 from "./SwiperSetp1.vue"
import SwiperSetp2 from "./SwiperSetp2.vue"
// import SwiperSetp3 from "./SwiperSetp3.vue"
import SwiperSetp4 from "./SwiperSetp4.vue"

const SwiperComponentList = {
  "1": "SwiperSetp1",
  "2": "SwiperSetp2",
  // "3": "SwiperSetp3",
  "3": "SwiperSetp4",
}
export default { components: { SwiperSetp1, SwiperSetp2, SwiperSetp4 } }
</script>

<script setup lang="ts">
import { templateSetpOptions } from "../store/state"
import { AddIcon, ChevronDownIcon } from "tdesign-icons-vue-next"
import { formDataList, currtFormDataId, currtExtendId, showAddTapDialog } from "../store/state"

import { uploadFile } from "../api"
import type { FormDataItemT } from "../store/state"
import { NotifyPlugin } from "tdesign-vue-next"

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

  switch (currtSetp) {
    case 1:
      // 【1】检查是否已设置输入名称
      if (data.title.length == 0) {
        NotifyPlugin("error", {
          title: `当前未指定正确的输出名称`,
          duration: 2000,
        })
        return false
      }
      if (data.title == "未命名工况") {
        NotifyPlugin("error", {
          title: `当前未指定正确的输出名称`,
          duration: 2000,
        })
        return false
      }

      // 【2】检查是否已选择mxd模板
      if (data.mxdId < 0) {
        NotifyPlugin("error", {
          title: `未选择mxd文件模板（输出类型：采样点、流速、流场）`,
          duration: 2000,
        })
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
  console.log(Sopts.value.length)
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
  console.log("mxdToImg: -->")

  loading.value = true

  // 上传文件
  const resList = await Promise.all([
    uploadFile(`${data.beDfsuInfo.md5}.dfsu`, data.beDfsuInfo.file), // 上传工程前 dfsu
    uploadFile(`${data.afDfsuInfo.md5}.dfsu`, data.afDfsuInfo.file), // 上传工厂吧 dfsu
    ...data.projectRange.fileList.map((eachFile) =>
      uploadFile(`${data.projectRange.md5}${eachFile.ext}`, eachFile.file),
    ),
  ])

  if (!resList.every((res) => res)) {
    console.log("有文件上传失败")
  } else {
    console.log("所有文件上传成功")
  }

  // 创建post请求体
  const body = {
    dfsu_be_md5: data.beDfsuInfo.md5,
    dfsu_af_md5: data.afDfsuInfo.md5,
    output_name: data.title,
    river_range: data.riverRange,
  }

  console.log({ body })
  console.log({ data })

  // try {
  //   const res = await server.post(API.mxdToImg, data)

  //   if (res.status == 200 && res.data.success) return res.data.res
  // } catch (err) {
  //   console.log(err)
  //   return false
  // }
  // return false

  loading.value = false
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
