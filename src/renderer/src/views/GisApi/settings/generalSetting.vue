<!--
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-06-27 22:05:24
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2026-03-04 10:34:49
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\settings\generalSettingl.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <t-collapse-panel value="GisAPI" header="GisAPI" class="collapse-style">
        <template #expandIcon>
            <c-icon-font class="text-xl" iconName="fuwuqi-shouye"></c-icon-font>
        </template>

        <template #headerRightContent>
            <div class="flex items-center justify-center flec-row">
                <t-button size="small" theme="danger" @click="resetConfigData(SERVER_KEYS)">
                    <template #icon>
                        <c-icon-font class="mr-2 text-xl text-white" iconName="huifu"> </c-icon-font>
                    </template>
                    重置
                </t-button>
            </div>
        </template>

        <t-form-item label="服务器IP" name="SERVER_IP">
            <t-auto-complete
                v-model="config.SERVER_IP"
                :options="DEFAULT_SERVER_IP_LIST"
                highlight-keyword
                :filterable="false"
                placeholder="请输入关键词搜索"
                clearable
                @select="() => checkServer()"
            />
        </t-form-item>

        <t-form-item label="服务器端口" name="SERVER_PROT">
            <t-input-number v-model="config.SERVER_PROT" @blur="() => checkServer()" theme="column"></t-input-number>
        </t-form-item>

        <t-form-item label="HTTP协议" name="SERVER_PROTOCOL">
            <t-select
                v-model="config.SERVER_PROTOCOL"
                :options="[
                    { label: 'HTTP', value: 'http:' },
                    { label: 'HTTPS', value: 'https:' },
                ]"
                @onChange="(item) => (config.SERVER_PROTOCOL = item.value)"
            ></t-select>
        </t-form-item>

        <t-form-item label="测试API" name="DEFAULT_TEST_API">
            <t-input v-model="config.DEFAULT_TEST_API" :placeholder="config.DEFAULT_TEST_API.toString()"></t-input>
        </t-form-item>

        <t-form-item label="使用任务队列" name="DEFAULT_USE_TASK_QUEUE">
            <t-switch v-model="config.DEFAULT_USE_TASK_QUEUE"></t-switch>
        </t-form-item>

        <t-form-item label="体例名称提示" name="DEFAULT_USE_TASK_QUEUE">
            <t-tag-input v-model="config.SETP_1_SETTINGS.outNameTipWordsList" clearable />
        </t-form-item>

        <div class="w-full mx-2 text-xs text-center text-gray-400">当前服务器： {{ V }}</div>

        <t-button class="w-full my-4 text-sm" @click="checkServer" :loading="btnLoading" :theme="btnTheme"
            >{{ glboalStore.isGisServerConnected ? "测试连接" : "点击重连" }}
        </t-button>
    </t-collapse-panel>
</template>

<script setup lang="ts">
import config, { DEFAULT_SERVER_IP_LIST } from "../store/config"
import { useGisApiStateStore } from "@gisapi/store/index"
const glboalStore = useGisApiStateStore()

const btnLoading = ref(false)
const btnTheme = computed(() => (glboalStore.isGisServerConnected ? "success" : "danger"))
const SERVER_KEYS = ["SERVER_IP", "SERVER_PROT"]

const V = computed(() => `${config.SERVER_PROTOCOL}//${config.SERVER_IP}:${config.SERVER_PROT}/`)

const resetConfigData = (item) => {
    console.log("resetConfigData: ", item)
}

async function checkServer() {
    btnLoading.value = true
    await glboalStore.checkoutServerOnReady()
    setTimeout(() => {
        btnLoading.value = false
    }, 500)
}
</script>
