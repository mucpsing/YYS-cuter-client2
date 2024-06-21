<template>
  <t-collapse-panel value="通用配置" header="通用配置" class="collapse-style">
    <template #expandIcon>
      <c-icon-font class="text-xl" iconName="daochu" color="#31302d"></c-icon-font>
    </template>
    <template #headerRightContent>
      <t-button size="small" theme="danger" @click="resetConfigData(GENERAL_KEYS)">
        <template #icon>
          <c-icon-font class="mr-2 text-white" iconName="huifu"> </c-icon-font>
        </template>
        重置
      </t-button>
    </template>

    <!-- 工作目录 -->
    <t-form-item label="工作目录" name="WORK_SPACE">
      <t-input-number v-model="config.WORK_SPACE" status="warning"> </t-input-number>
      <div class="px-2"></div>
      <t-button variant="outline" @click="setWorkSpace"> 更改路径 </t-button>
    </t-form-item>

    <t-form-item label="配置文件" name="JSON_EXPORT_PATH">
      <t-input-number v-model="config.JSON_EXPORT_PATH" status="warning"> </t-input-number>
      <div class="px-2"></div>
      <t-button variant="outline" @click="setConfigJson"> 更改路径 </t-button>
    </t-form-item>

    <t-form-item label="常用操作" name="">
      <t-space>
        <t-button theme="primary">
          <template #icon>
            <c-icon-font iconName="baocun" class="mr-2 text-xl" />
          </template>
          导出
        </t-button>
      </t-space>

      <t-space>
        <div class="ml-4">自动聚焦:</div>
        <t-switch v-model="localStore.autoFcous"></t-switch>
      </t-space>
    </t-form-item>

    <t-form-item label="调式模式" name="">
      <t-switch v-model="localStore.DEBUG"></t-switch>
    </t-form-item>
  </t-collapse-panel>
</template>

<script lang="ts" setup>
import localData from "../store/jsonData"
import localStore from "../store"
import config from "../store/config"
import type { OpenDialogReturnValue, OpenDialogOptions } from "electron"

import { eventBusMain } from "@renderer/libs"

const configSuffix = ["SERVER_", "IMG_", "SCREEN_"]
const GENERAL_KEYS: string[] = []
Object.keys(config).filter((keyName: string) => {
  let isGeneralConfig = true
  configSuffix.forEach((item: string) => {
    if (keyName.startsWith(item)) isGeneralConfig = false
  })

  if (isGeneralConfig) GENERAL_KEYS.push(keyName)
})
const resetConfigData = inject("resetConfigData") as (configItemKey: string[]) => void

/**
 * 指定一个目录作为工作空间，所有操作都会基于这个路径
 */
async function setWorkSpace() {
  // 在浏览器中
  // const userSelectFolder = await eventBusMain.selectFolder({
  //   title: "设置工作目录",
  //   buttonLabel: "确定选择",
  //   message: "选择一个目录作为软件默认的工作目录",
  // });

  // 在浏览器中
  const userSelectFolder = await eventBusMain.emit("", {
    title: "设置工作目录",
    buttonLabel: "确定选择",
    message: "选择一个目录作为软件默认的工作目录",
  })

  console.log({ userSelectFolder })

  // if (userSelectFolder) config.WORK_SPACE = userSelectFolder;

  // if (!window.electron) return;

  // const res: SaveOpt = await window.electron.send("selectFolder", {
  //   title: "请指工作目录, 所有图片文件将会存储到该目录",
  //   buttonLabel: "确定保存",
  //   message: "请指工作目录, 所有图片文件将会存储到该目录",
  // });

  // if (!res.canceled && res.filePaths && res.filePaths.length > 0) {
  //   config.WORK_SPACE = res.filePaths[0];
  // }
}

/**
 * 指定一个配置文件，如果不存在，则创建，具体逻辑在主进程进行
 */
async function setConfigJson() {
  console.log("setConfigJson ->")

  // // 在浏览器中
  // if (!window.electron) return;

  // const res = await window.electron.send("selectSaveFile", {
  //   work_space: config.WORK_SPACE,
  // });

  // if (!res) return console.log("选择配置文件失败");

  // // 配置文件的绝对路径
  // if (res.path) config.JSON_EXPORT_PATH = res.path;

  // // 配置文件已经存在，则同时读取该数据
  // if (res.data) localData.setData(res.data);
}
</script>
