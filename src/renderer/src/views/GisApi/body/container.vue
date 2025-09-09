<template>
  <div :class="['flex flex-col h-full px-2 gap-1']">
    <!-- 浮动工具条，整合了一些前置功能，添加工况、历史任务等 -->
    <TopToolBar />

    <header :class="['flex justify-between items-center', 'py-6 px-6 gap-8', 'min-w-[250px]']">
      <!-- 【按钮】添加工况 -->
      <t-tooltip content="添加工况">
        <t-button :onClick="() => tabStore.closeAddTabDialog()"
          ><template #icon><AddIcon /> </template
        ></t-button>
      </t-tooltip>

      <!-- 【步骤条】 -->
      <!-- 步骤条不进行事件hook，生产环境禁止通过点击跳过步骤，所有hook操作都在【上一步】和【下一步】两个点击按钮事件进行控制 -->
      <!-- 所有hook事件都在 onSwtichSetp() 和 nextSetpCheck() 中进行控制 -->
      <t-steps
        size="small"
        v-model="formDataList[currtTabId].setp"
        layout="horizontal"
        :readonly="localStore.readOnly"
        :options="Sopts"
      />
    </header>

    <transition name="GisApi__body-fade">
      <KeepAlive>
        <component :is="SwiperComponentList[formDataList[currtTabId].setp]"></component>
      </KeepAlive>
    </transition>

    <footer :class="['flex gap-1', 'mt-4', 'flex-grow-0']">
      <t-button
        class="flex-[1]"
        :disabled="formDataList[currtTabId].setp == 1"
        @click="onSwtichSetp('back')"
        size="medium"
        >上一步<template #icon>
          <c-icon-font
            iconName="icon-yys-xiayiye"
            :rotate="180"
            color="white"
            :class="['text-white mr-2']"
          ></c-icon-font> </template
      ></t-button>

      <!-- :disabled="formDataList[currtTabId].setp != 3" -->
      <t-button
        :on-click="() => mxdToImg()"
        class="flex-[1]"
        theme="success"
        size="medium"
        :loading="localStore.loading"
        >添加并开始任务
        <template #icon>
          <TaskDoubleIcon />
        </template>
      </t-button>
      <t-button
        class="flex-[1]"
        :disabled="formDataList[currtTabId].setp == Sopts.length"
        @click="onSwtichSetp('next')"
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

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { GUIDE_EVENTS } from "@gisapi/_components/guideEvents"

import { eventBus } from "@renderer/libs"
import { mxdToImgApi, taskTest, mxdToImgApiByTask } from "@gisapi/utils/server"

import { SETP_OPTIONS_LIST } from "@gisapi/store/config"

import { useGisApiTabStore, useGisApiStateStore } from "@gisapi/store/index"
import { useTaskStore } from "@gisapi/store/index"

import type { MxdToImgFormT } from "@gisapi/Types"
import { TaskDoubleIcon, AddIcon } from "tdesign-icons-vue-next"

import TopToolBar from "./topToolBar/index.vue"

const SwiperComponentList = {
  "1": defineAsyncComponent(() => import("./setp1/setp1.vue")),
  "2": defineAsyncComponent(() => import("./setp2/setp2.vue")),
  "3": defineAsyncComponent(() => import("./setp3/setp3.vue")),
  "4": defineAsyncComponent(() => import("./setp4/setp4.vue")),
}

const tabStore = useGisApiTabStore()
const taskStore = useTaskStore()
const globalStore = useGisApiStateStore()

const { formDataList, currtTabId } = storeToRefs(tabStore)

const localStore = reactive({
  loading: false,
  // showAddTapDialog: false,
  readOnly: import.meta.env.DEV ? false : true,
})

const Sopts = computed(() => SETP_OPTIONS_LIST)

/**
 * @description: 点击下一步，上一步按钮的中转函数
 */
function onSwtichSetp(setp: "next" | "back") {
  const currtdata = tabStore.currtFormData

  switch (setp) {
    case "next":
      if (currtdata.setp == Sopts.value.length) return

      // 进行校验，如果不满足则进行提示并不进行跳转
      if (!nextSetpCheck(currtdata.setp)) return

      currtdata.setp += 1
      break

    case "back":
      if (currtdata.setp == 0) return
      currtdata.setp -= 1
  }
}
/**
 * @description: 点击下一步时触发的检查器，检查是否满足进入下一setp的必要条件
 * @param {*} currtSetp 当前step
 * @return {*}
 */
function nextSetpCheck(currtSetp: number): boolean {
  // const data = formDataList.value[currtTabId.value]
  const data = tabStore.currtFormData
  console.log("nextSetpCheck...", { currtSetp, data })

  if (!globalStore.isGisServerConnected) {
    eventBus.emit(GUIDE_EVENTS.SHOW, ["header", 0])

    return false
  }

  switch (currtSetp) {
    case 1:
      // 【1】检查是否已设置输入名称
      if (data.title.length == 0 || data.title == "未命名工况") {
        eventBus.emit(GUIDE_EVENTS.SHOW, ["setp1", 0, data.id])

        return false
      }

      // 【2】检查是否已选择mxd模板
      if (data.mxdId < 0) {
        console.log({ data })
        eventBus.emit(GUIDE_EVENTS.SHOW, ["setp1", 1, data.id])

        return false
      }

      break
    case 2:
      // 【1】检查是否以上传文件但没选中
      eventBus.emit("gis-api:fileTransfer-default-checked")

      // 【2】检查是否已经上传文件，确保工程前后都至少选择一个工况文件
      const hasBeDfsu = Boolean(data.beDfsuMd5List.length == 0)
      const hasAfDfsu = Boolean(data.afDfsuMd5List.length == 0)
      if (hasBeDfsu || hasAfDfsu) {
        console.warn("多个dfsu文件的情况下需要指定")
        eventBus.emit(GUIDE_EVENTS.SHOW, ["setp2", 0, data.id])

        return false
      }

      break
    case 3:
      console.log("3")
      if (tabStore.currtFormData.afDfsuMd5List) {
      }
      break
  }

  return true
}

/**
 * @description: 最终调用接口的函数，首先将文件上传，确保文件都存在后则调用导出函数
 * @param {*} data
 * @return {*}
 */
async function mxdToImg() {
  const data = tabStore.currtFormData

  // 获取已经选择的文件md5
  let dfsu_be_md5 = data.beDfsuMd5List.find((item) => item.checked)
  let dfsu_af_md5 = data.afDfsuMd5List.find((item) => item.checked)

  if (!dfsu_be_md5 || !dfsu_af_md5) return console.warn("请选择文件")

  // 拼接api所需要的参数格式body
  const body: MxdToImgFormT = {
    template_id: data.mxdId,
    dfsu_be_md5: dfsu_be_md5.md5,
    dfsu_af_md5: dfsu_af_md5.md5,
    output_name: data.title,
    river_range: data.riverRange,
    // radian_or_angle: data.radian_or_angle == "弧度" ? "radian" : "angle",
    show_range: data.projectPoints,
    crs: "auto",
    time_step: data.timeStep,
    sub_title: data.outputName,
  }

  // 调用后台合成接口
  localStore.loading = true
  const taskRes = await mxdToImgApiByTask(body)

  if (!taskRes) return (localStore.loading = false)
  eventBus.emit("gis-api:setp2:create-preview-to-task", taskRes.task_id)

  taskStore.addTask(taskRes)
  console.log({ body, taskRes })

  setTimeout(() => (localStore.loading = false), 1000)
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
