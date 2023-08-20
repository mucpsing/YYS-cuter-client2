<!--
 * @Author: CPS-surfacePro7 holy.dandelion@139.com
 * @Date: 2023-01-24 23:51:02
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-08-19 17:58:53
 * @FilePath: \yys-cuter-client\src\components\ImageCuter\config\panelServer.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <t-collapse-panel
    value="服务器配置"
    header="服务器配置"
    class="collapse-style"
  >
    <template #expandIcon>
      <c-icon-font class="text-xl" iconName="fuwuqi-shouye"></c-icon-font>
    </template>

    <template #headerRightContent>
      <t-button
        size="small"
        theme="danger"
        @click="resetConfigData(SERVER_KEYS)"
      >
        <template #icon>
          <c-icon-font class="mr-2 text-white" iconName="huifu"> </c-icon-font>
        </template>
        重置
      </t-button>
    </template>

    <t-form-item label="服务器路径" name="SERVER_EXE_PATH">
      <t-input v-model="config.SERVER_EXE_PATH" type="number" status="warning">
      </t-input>
      <div class="px-2"></div>
      <t-button variant="outline" @click="serverSelectFilePath">
        更改路径
      </t-button>
    </t-form-item>

    <t-form-item label="自动重连" name="SERVER_STATUS">
      <t-switch
        v-model="SERVER_IS_START"
        size="large"
        :label="['关', '开']"
        :loading="config.SERVER_STATUS == 'checking'"
        @change="serverSwitch"
      >
      </t-switch>
      <div class="mx-2"></div>
    </t-form-item>

    <t-form-item label="服务器IP" name="SERVER_IP">
      <t-input v-model="config.SERVER_IP"></t-input>
    </t-form-item>

    <t-form-item label="服务器端口" name="SERVER_PROT">
      <t-input v-model="config.SERVER_PROT" type="number"></t-input>
    </t-form-item>
  </t-collapse-panel>
</template>

<script lang="ts" setup>
import localStore from "../store";
import config, { defaultConfig } from "../store/config";
import { getObjectKeysWithStart } from "@renderer/utils/tools";

import {
  serverSwitch,
  serverSelectFilePath,
  SERVER_IS_START,
} from "../core/server";

const resetConfigData = inject("resetConfigData") as (
  configItemKey: string[]
) => void;

const SERVER_KEYS = getObjectKeysWithStart(config, "SERVER_");
</script>
