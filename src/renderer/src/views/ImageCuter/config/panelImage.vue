<!--
 * @Author: CPS-surfacePro7 holy.dandelion@139.com
 * @Date: 2023-01-24 23:53:09
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-08-19 17:58:05
 * @FilePath: \yys-cuter-client\src\components\ImageCuter\config\paneImage.vue
 * @Description: 截图插件的图片配置折叠栏
-->
<template>
  <t-collapse-panel value="图片配置" header="图片配置" class="collapse-style">
    <template #expandIcon>
      <c-icon-font class="text-xl" iconName="tupian-tongyong"></c-icon-font>
    </template>
    <template #headerRightContent>
      <t-button size="small" theme="danger" @click="resetConfigData(IMG_KEYS)">
        <template #icon>
          <c-icon-font class="mr-2 text-white" iconName="huifu"> </c-icon-font>
        </template>
        重置
      </t-button>
    </template>

    <t-form-item label="文件大小" name="IMG_MAX_SIZE">
      <t-row :gutter="16">
        <t-col :span="8">
          <t-input
            type="number"
            :value="fileMaxSize"
            :suffix="`(${config.IMG_MAX_SIZE})`"
            @change="onSizeUnitInputChange"
          ></t-input>
        </t-col>
        <t-col :span="4">
          <t-select
            v-model="sizeUnit"
            :options="sizeOptions"
            @change="onSizeUnitSelectChange"
          ></t-select>
        </t-col>
      </t-row>
    </t-form-item>

    <t-form-item label="支持格式" name="IMG_SUPORT_TYPES">
      <t-select
        v-model="config.IMG_SUPORT_TYPES"
        :options="options1"
        placeholder="mime-type"
        multiple
      >
        <template #panelTopContent>
          <div style="padding: 6px 6px 0 6px">
            <t-input
              v-model="searchMimeType"
              placeholder="请输入关键词搜索"
              @change="onSearchMimeType"
            />
          </div>
        </template>
      </t-select>
    </t-form-item>
  </t-collapse-panel>
</template>

<script lang="ts" setup>
import localStore from "../store";
import config, { defaultConfig } from "../store/config";

import { MIME_TYPE_LIST } from "@renderer/utils/mime-type";
import { getObjectKeysWithStart } from "@renderer/utils/tools";

const IMG_KEYS = getObjectKeysWithStart(config, "SCREEN_");

const resetConfigData = inject("resetConfigData") as (
  configItemKey: string[]
) => void;

const sizeUnit = ref(1024 * 1024);
const fileMaxSize = ref(config.IMG_MAX_SIZE / sizeUnit.value);

const onSizeUnitInputChange = (input: number) => {
  fileMaxSize.value = input;
  config.IMG_MAX_SIZE = fileMaxSize.value * sizeUnit.value;
};

const onSizeUnitSelectChange = (newSizeUnit: number) => {
  fileMaxSize.value = config.IMG_MAX_SIZE / newSizeUnit;
};

type SelectOptions = { value: string | number; label: string }[];
const mimeTypeOptions: SelectOptions = [];
MIME_TYPE_LIST.forEach((item) => {
  mimeTypeOptions.push({ label: item.ext, value: item.contentType });
});
const options1 = ref(mimeTypeOptions);
const searchMimeType = ref("");
const onSearchMimeType = () => {
  options1.value = mimeTypeOptions.filter(
    (item) => item.label.indexOf(searchMimeType.value) !== -1
  );
};

const sizeOptions: SelectOptions = [
  { label: "MB", value: 1024 * 1024 },
  { label: "KB", value: 1024 },
];
</script>
