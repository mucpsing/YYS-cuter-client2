<!--
 * @Author: CPS-surfacePro7 holy.dandelion@139.com
 * @Date: 2023-01-24 23:51:30
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2025-06-30 09:48:08
 * @FilePath: \yys-cuter-client\src\components\ImageCuter\config\panelScreen.vue
 * @Description: 截图插件的【显示配置】部分
-->

<template>
  <t-collapse-panel value="显示配置" header="显示配置" class="collapse-style">
    <template #expandIcon>
      <c-icon-font class="text-xl" iconName="xianshi" color="#31302d"></c-icon-font>
    </template>
    <template #headerRightContent>
      <t-button size="small" theme="danger" @click="resetConfigData(SCREEN_KEYS)">
        <template #icon>
          <c-icon-font class="mr-2 text-white" iconName="huifu"> </c-icon-font>
        </template>
        重置
      </t-button>
    </template>

    <t-form-item label="最大尺寸" name="SCREEN_MAX">
      <div class="flex gap-2">
        <t-input-number
          v-model="config.SCREEN_MAX_HEIGHT"
          label="高度："
          suffix="px"
          theme="normal"
          style="min-width: 120px"
        ></t-input-number>
        <t-input-number
          v-model="config.SCREEN_MAX_WIDTH"
          theme="normal"
          label="宽度："
          suffix="px"
          style="min-width: 120px"
        ></t-input-number>
      </div>
    </t-form-item>

    <t-form-item label="裁剪框宽度" name="CROP_BORDER_WIDTH">
      <t-row :gutter="16">
        <t-col :span="6">
          <t-input-number
            v-model="config.CROP_BORDER_WIDTH"
            label="边框："
            suffix="px"
            theme="normal"
            align="center"
          ></t-input-number>
        </t-col>
      </t-row>
    </t-form-item>

    <t-form-item label="裁剪框颜色" name="CROP_BORDER_COLOR">
      <t-row :gutter="16">
        <t-col :span="6">
          <input v-model="config.CROP_BORDER_COLOR" type="color" />
        </t-col>
      </t-row>
    </t-form-item>

    <!-- 自动加载粘贴板图片 -->
    <t-form-item label="监听粘贴板" name="WATCH_CHIPBOARD_IMG">
      <t-switch v-model="config.SCREEN_WATCH_CHIPBOARD" :label="['图片', '图片']"></t-switch>

      <!-- 实时预览 -->
      <div class="mx-2"></div>
      <div class="ml-2 mr-4">实时预览:</div>
      <t-switch v-model="config.SCREEN_AUTO_DRAW"></t-switch>
    </t-form-item>
  </t-collapse-panel>
</template>

<script lang="ts" setup>
import localStore from "../store"
import config, { defaultConfig } from "../store/config"

import { getObjectKeysWithStart } from "@renderer/utils/tools"

const resetConfigData = inject("resetConfigData") as (configItemKey: string[]) => void

const SCREEN_KEYS = getObjectKeysWithStart(config, "SCREEN_")
</script>
