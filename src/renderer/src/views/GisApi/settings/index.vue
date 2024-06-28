<!--
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-06-27 20:58:58
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-06-28 10:20:08
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\settings\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <t-form :data="config" :colon="true">
    <t-collapse v-model="currtOpenSettingsPageNames" borderless :change="onPanelChange">
      <GeneralPanel />
    </t-collapse>
  </t-form>
</template>

<script setup lang="ts">
import config from "../store/config"
import { currtOpenSettingsPageNames } from "../store/state"

import GeneralPanel from "./generalSetting.vue"

const onPanelChange = (page: number | string) => page

</script>
