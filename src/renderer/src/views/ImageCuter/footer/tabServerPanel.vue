<!--
 * @Author: CPS-surfacePro7 holy.dandelion@139.com
 * @Date: 2023-01-23 12:24:59
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-08-19 18:16:46
 * @FilePath: \yys-cuter-client\src\components\ImageCuter\footer\serverPanel.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="flex items-center justify-center w-full h-full gap-2">
    <!-- API调用按钮面板 -->
    <section :class="['grow-[999]']">
      <div class="flex items-center justify-around">
        <h3 class="items-center">服务器：</h3>
        <t-tag
          variant="light"
          shape="round"
          :theme="SERVER_IS_START ? 'success' : 'danger'"
          size="large"
          @click="serverSwitch"
        >
          <template #icon>
            <cps-icon-font
              :iconName="SERVER_IS_START ? 'lianjie' : 'duankai'"
              :class="[
                'cursor-pointer text-xl mr-2 rounded-md',
                'hover:bg-gray-300 hover:rounded-sm',
                SERVER_IS_START ? 'text-green-300' : 'text-red-400',
              ]"
            ></cps-icon-font>
          </template>
          <t-divider layout="vertical" />
          {{ SERVER_IS_START ? "已连接" : "未连接" }}
        </t-tag>
      </div>

      <div class="mt-3">
        <t-dropdown
          :hideAfterItemClick="false"
          trigger="click"
          placement="right-bottom"
          :options="API"
        >
          <t-button class="w-full" :disabled="config.SERVER_STATUS != 'open'">
            <template #icon>
              <cps-icon-font
                iconName="APIguanli"
                :class="SERVER_IS_START ? 'text-green-300' : 'text-red-400'"
              ></cps-icon-font>
            </template>
            <span class="ml-2"> API 列表 </span>
            <t-loading
              size="small"
              :loading="config.SERVER_STATUS == 'checking'"
            ></t-loading>
          </t-button>
        </t-dropdown>
      </div>

      <div class="mt-3">
        <t-button theme="success" class="w-full" @click="recentApi">
          <template #icon>
            <cps-icon-font
              iconName="APIguanli"
              :class="SERVER_IS_START ? 'text-green-300' : 'text-red-400'"
            ></cps-icon-font>
          </template>
          <span class="ml-2">最后调用 {{ recentAPIName }}</span>
        </t-button>
      </div>
    </section>

    <!-- log 详细信息显示框 -->
    <section
      :class="[
        'grow-0 shrink-0 w-9/12',
        'fkex fex-col justify-center items-center',
        'rounded-md',
      ]"
    >
      <t-textarea
        v-model="logContent"
        readonly
        :autosize="{ minRows: 5, maxRows: 5 }"
      ></t-textarea>
    </section>
  </div>
</template>

<script setup lang="ts">
import serverStore from "../store/server";
import localStore from "../store";
import config from "../store/config";
import { checkAlive, hwndCapture, findWindows } from "../core/api";
import { serverSwitch, SERVER_IS_START } from "../core/server";

let recentApi: Function;

const recentAPIName = ref("");
const currtAPI = ref("");
const logHistory = ref<string[]>([]);
const logContent = ref<string>("");
const logger = {
  info: (msg: string) => (logContent.value += `【info】：${msg}\n`),
};

const API = [
  {
    onClick: () => runAPI(checkAlive),
    content: "检查服务器",
    divider: true,
  },
  {
    onClick: () => runAPI(onFindWindows),
    content: "查找窗体",
  },
  {
    onClick: () => runAPI(onHwndCapture),
    content: "窗体截图",
  },
];

async function runAPI(APIName: string | Function) {
  if (config.SERVER_STATUS == "close" || !SERVER_IS_START) {
    return console.log("服务器未链接");
  }

  if (APIName instanceof Function) {
    recentApi = APIName;
  } else {
    API.forEach((item) => {
      if (item.content == APIName) {
        recentApi = item.onClick;
        recentAPIName.value = item.content;
      }
    });
  }

  recentApi();
}

async function onFindWindows() {
  const hendlist = await findWindows();

  if (hendlist.length > 0) {
    // 将hwnd保存到stroe中
    let hwndListStr = "";
    hendlist.forEach((item) => {
      hwndListStr += `${item.hwnd},`;
    });

    logger.info(`发现窗口句柄[${hendlist.length}]：${hwndListStr}`);
    serverStore.currtHwnd = hendlist[0].hwnd;
    serverStore.hwndInfoList = hendlist;
  } else {
    serverStore.currtHwnd = 0;
    serverStore.hwndInfoList = [];
    logger.info(`没有发现有效的窗口句柄`);
  }
}

async function onHwndCapture() {
  const hwnd = serverStore.currtHwnd;

  if (!hwnd) return;

  const res = await hwndCapture(hwnd);

  if (res) {
    logger.info(`[${hwnd}]句柄截图成功`);
    logger.info(res);

    localStore.setCurrtFile(res);
  }
}

onMounted(() => {
  currtAPI.value = API[0].content;
});
</script>

<style>
.cccc {
  background-color: rgb(34, 156, 212);
}
</style>
