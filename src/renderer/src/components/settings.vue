<!--
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-12-29 11:19:06.485696
 * @Last Modified by: CPS
 * @Last Modified time: 2022-12-29 11:19:06.485696
 * @Filename main.py
 * @Description: 配置页
 * BUG! TDesignResolver的自动导入无法正确的引入collapse-panel/style, 查看源码得知该目录已经和collapse合并
-->
<template>
  <t-drawer
    v-model:visible="globalStore.settingPageShow"
    size="60%"
    placement="right"
    :on-click-overlay="close"
    :footer="false"
    :closeBtn="true"
    closeOnEscKeydown
    sizeDraggable
    @click-cancel="close"
  >
    <template #header>
      <h3 class="text-xl">
        <c-icon-font class="mr-2" iconName="setting"></c-icon-font>软件配置
      </h3>
    </template>

    <t-tabs
      v-model="globalStore.settingPageSelect"
      default-value="global"
      @onChange="onTabsChange"
    >
      <!-- 全局配置 -->
      <t-tab-panel value="global">
        <template #label>
          <c-icon-font class="mr-2" iconName="kongzhi"></c-icon-font>全局配置
        </template>
        <t-form :data="globalStore.$state" :colon="true">
          {{ globalStore.$state.settingPageShow }}
          <t-switch v-model="globalStore.$state.settingPageShow"></t-switch>

          <t-form-item>
            <t-button @click="testBtn">弹窗测试</t-button>
          </t-form-item>
        </t-form>
      </t-tab-panel>

      <!-- 插件配置【截图插件】 -->
      <t-tab-panel value="imageCuterConfig">
        <template #label>
          <c-icon-font class="mr-2" iconName="caijian"> </c-icon-font>截图插件
        </template>
        <imageCuterSettingPage />
      </t-tab-panel>

      <!-- gis-api配置 -->
      <t-tab-panel value="gisApiConfig">
        <template #label>
          <c-icon-font class="mr-2" iconName="icon-yys-GISguankong"> </c-icon-font>截图插件
        </template>
        <gisApiSettingPage />
      </t-tab-panel>
    </t-tabs>
    <div class="flex justify-center w-full p-2">
      <t-button size="large" theme="success">完 成 配 置</t-button>
    </div>
  </t-drawer>
</template>

<script setup lang="ts">
import { eventBus } from "@renderer/libs";
import { useGlobalStore } from "@renderer/stores";

import imageCuterSettingPage from "@renderer/views/ImageCuter/config/index.vue";
import gisApiSettingPage from "@renderer/views/GisApi/settings/index.vue";

import { openConfigPannelList as IMCPanelList } from "@renderer/views/ImageCuter/store";

const globalStore = useGlobalStore();

function testBtn() {
  eventBus.emit("showDialog", {
    type: "input",
    title: "测试全局弹框",
    message: "测试文本",
  });
}

function onTabsChange(value: string) {
  console.log("onTabsChange: ", { value });
  console.log({ IMCPanelList });
  console.log("当前展开的列表数: ", IMCPanelList.value.length);
}

function close() {
  globalStore.setSettingPageShow(false);
}

onMounted(() => {
  eventBus.on("showSettingsPage", globalStore.switchSettingPage);
});

onUnmounted(() => {
  eventBus.off("showSettingsPage", globalStore.switchSettingPage);
});
</script>

<style lang="stylus">
.collapse-style
  @apply border-2 border-solid border-gray-100 rounded-md my-2 bg-gray-100

.collapse-style:hover
  @apply border-2 border-solid border-blue-500
</style>
