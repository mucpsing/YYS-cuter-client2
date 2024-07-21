<!--
 * @Author: CPS-surfacePro7 holy.dandelion@139.com
 * @Date: 2023-01-23 12:24:59
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-08-25 01:54:39
 * @FilePath: \yys-cuter-client\src\components\ImageCuter\footer\serverPanel.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="flex items-center justify-center w-full h-full gap-2">
    <!-- API调用按钮面板 -->
    <section :class="['flex flex-col grow-[999] gap-2 max-w-[300px]']">
      <div
        :class="[
          'cps-test',
          'cps-mask backdrop-blur-sm bg-gray-300/30',
          'h-[45px] min-w-[30px] p-1',
          'rounded-[5px]',
          'flex justify-between items-center gap-1',
        ]"
      >
        <!-- 【按钮】 已连接|未连接  -->
        <div
          :class="[
            'flex gap-2 overflow-hidden justify-start items-center',
            'h-[36px]',
            'cursor-pointer',
            currtClickBtn == 'con' ? 'grow-[999] justify-center' : 'w-[36px]',
            'bg-white border-2 rounded-[5px]',
          ]"
        >
          <div
            :class="['flex-col justify-center', 'w-[20px] items-center pl-1 pt-1']"
            @click="onBtnClick('con')"
          >
            <!-- :iconName="IS_CONNECT ? 'lianjie' : 'duankai'" -->
            <c-icon-font
              :class="['text-2xl', IS_CONNECT ? 'text-green-500' : 'text-red-400']"
              iconName="bangding"
            ></c-icon-font>
          </div>
          <div
            :class="['ml-2', IS_CONNECT ? 'text-green-500' : 'text-red-400']"
            @click="serverSwitch"
          >
            {{ IS_CONNECT ? "已连接" : "未连接" }}
          </div>
        </div>

        <!-- 【按钮】 选择句柄  -->
        <div
          :class="[
            'flex gap-2 overflow-hidden',
            'h-[36px]',
            'cursor-pointer',
            currtClickBtn == 'bing' ? 'grow-[999] justify-center' : 'w-[36px]',
            'bg-white border-2 rounded-[5px]',
          ]"
        >
          <div
            :class="['flex-col justify-center', 'w-[20px] items-center pl-1 pt-1']"
            @click="onBtnClick('bing')"
          >
            <c-icon-font
              :class="['text-2xl', IS_CONNECT ? 'text-green-500' : 'text-gray-300']"
              iconName="icon-yys-chuangkouwindow31"
            ></c-icon-font>
          </div>
          <div :class="['flex items-center justify-center ml-2']">
            <t-dropdown placement="top" maxColumnWidth="200" :options="hwndList" :maxHeight="500">
              选择句柄：{{ currtHwnd }}
            </t-dropdown>
          </div>
        </div>
      </div>

      <!-- 【按钮】 API列表  -->
      <div>
        <t-dropdown
          :hideAfterItemClick="false"
          trigger="click"
          placement="right-bottom"
          :options="apiList"
        >
          <t-button class="w-full" :disabled="!IS_CONNECT">
            <template #icon>
              <cps-icon-font
                iconName="icon-yys-tubiao113"
                :class="[IS_CONNECT ? 'text-green-300' : 'text-red-400', 'text-2xl']"
              ></cps-icon-font>
            </template>
            <span class="ml-2"> API 列表 </span>
            <section size="small" :loading="serverStore.status == 'checking'"></section>
          </t-button>
        </t-dropdown>
      </div>

      <!-- 【按钮】 最后调用 -->
      <div>
        <t-button theme="success" class="w-full" @click="recentApi()" :disabled="!IS_CONNECT">
          <template #icon>
            <cps-icon-font iconName="APIguanli" :class="['text-2xl']"></cps-icon-font>
          </template>
          <span class="ml-2">最后调用 {{ recentAPIName }}</span>
        </t-button>
      </div>
    </section>

    <!-- log 详细信息显示框 -->
    <section
      :class="['grow-[999] shrink-0', 'fkex fex-col justify-center items-center', 'rounded-md']"
    >
      <t-textarea
        v-model="logContent"
        placement="top"
        readonly
        :autosize="{ minRows: 5, maxRows: 5 }"
      ></t-textarea>
    </section>
  </div>
</template>

<script setup lang="ts">
import localStore from "../store"
import * as API from "../core/api"

import { serverSwitch } from "../core/server"
import serverStore, { IS_CONNECT } from "../store/server"

// 多功能按钮
// con:  连接服务器
// bing: 根据窗口句柄绑定窗口
type btnType = "con" | "bing"
const currtClickBtn = ref<btnType>("con")
const onBtnClick = (tag: btnType) => (currtClickBtn.value = tag)

const currtHwnd = ref("023541224")
const hwndList = ref([
  { content: "[1]: 12355514", value: 1 },
  { content: "[2]: 12355514", value: 2 },
])

/** 记录最后一次对用的api名称 */
const recentAPIName = ref("")
const recentApi = () => runAPI(recentAPIName.value)

const currtAPI = ref("")
// const logHistory = ref<string[]>([])
const logContent = ref<string>("")
const logger = {
  info: (msg: string) => (logContent.value += `【info】：${msg}\n`),
}

/**
 * @description: 左下角的api按钮下拉菜单数据
 * @return {*}
 */
const apiList = [
  {
    callback: API.checkAlive,
    content: "检查服务器",
    divider: true,
  },
  {
    callback: () => runAPI("findWindow"),
    content: "查找窗体",
  },
  {
    callback: () => runAPI("capture"),
    content: "窗体截图",
  },
]

/**
 * @description: api菜单的入口，因为以后会越来越多api，所以使用switch的形式
 * @param {*} APIName
 * @return {*}
 */
async function runAPI(APIName: string) {
  if (!IS_CONNECT) return console.log("服务器未链接")

  if (ApiHandler[APIName]) {
    ApiHandler[APIName]()
    recentAPIName.value = APIName
  }
}

const ApiHandler = {
  findWindow: async () => {
    const hendlist = await API.findWindows()

    if (hendlist.length > 0) {
      // 将hwnd保存到stroe中
      let hwndListStr = ""
      hendlist.forEach((item) => {
        hwndListStr += `${item.hwnd},`
      })

      logger.info(`发现窗口句柄[${hendlist.length}]：${hwndListStr}`)
      serverStore.currtHwnd = hendlist[0].hwnd
      serverStore.hwndInfoList = hendlist
    } else {
      serverStore.currtHwnd = 0
      serverStore.hwndInfoList = []
      logger.info(`没有发现有效的窗口句柄`)
    }
  },

  capture: async () => {
    const hwnd = serverStore.currtHwnd

    if (!hwnd) return

    const res = await API.hwndCapture(hwnd)

    if (res) {
      logger.info(`[${hwnd}]句柄截图成功`)
      logger.info(res)

      localStore.setCurrtFile(res)
    }
  },
}

onMounted(() => {
  currtAPI.value = apiList[0].content
})
</script>

<style lang="stylus" scoped>
.cps-test, .cps-test *{
  transition all 0.6s cubic-bezier(0.25, 1, 0.5, 1)
}

.cccc {
  background-color: rgb(34, 156, 212);
}
</style>
