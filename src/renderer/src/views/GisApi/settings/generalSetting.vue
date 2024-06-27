<!--
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-06-27 22:05:24
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-06-27 23:10:44
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\settings\generalSettingl.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <t-collapse-panel value="服务器配置" header="服务器配置" class="collapse-style">
    <template #expandIcon>
      <c-icon-font class="text-xl" iconName="fuwuqi-shouye"></c-icon-font>
    </template>

    <template #headerRightContent>
      <t-button size="small" theme="danger" @click="resetConfigData(SERVER_KEYS)">
        <template #icon>
          <c-icon-font class="mr-2 text-white" iconName="huifu"> </c-icon-font>
        </template>
        重置
      </t-button>
    </template>

    <t-form-item label="服务器IP" name="SERVER_IP">
      <t-input v-model="config.SERVER_IP"></t-input>
    </t-form-item>

    <t-form-item label="服务器端口" name="SERVER_PROT">
      <t-input v-model="config.SERVER_PROT" type="number"></t-input>
    </t-form-item>

    <t-form-item label="HTTP协议" name="SERVER_PROTOCOL">
      <t-select
        v-model="config.SERVER_PROTOCOL"
        :options="[
          { label: 'HTTP', value: 'http' },
          { label: 'HTTPS', value: 'https' },
        ]"
        @onChange="(item) => (config.SERVER_PROTOCOL = item.value)"
      ></t-select>
    </t-form-item>

    <t-form-item label="重新连接" name="SERVER_PROTOCOL">
      <t-button class="w-full">{{ V }}</t-button>
    </t-form-item>
  </t-collapse-panel>
</template>

<script setup lang="ts">
import config from "../store/config"

const V = computed(
  () =>
    `${config.SERVER_PROTOCOL}://${config.SERVER_IP}:${config.SERVER_PROT}/${config.SERVER_API}/`,
)
const resetConfigData = inject("resetConfigData") as (configItemKey: string[]) => void
const SERVER_KEYS = ["SERVER_IP", "SERVER_PROT"]
</script>
