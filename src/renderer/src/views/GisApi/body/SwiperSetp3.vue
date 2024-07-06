<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-06-28 08:59:23
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-07-05 16:16:23
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\body\SwiperSetp3.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <section
    :class="['flex flex-col w-full gap-2', 'flex-grow-[2]', 'rounded-xl p-2 whitespace-nowrap']"
  >
    <div>
      <t-card title="范围选择">
        <EchartGeoJson />
        <t-button>本地文件</t-button>
      </t-card>
    </div>
  </section>
</template>

<script setup lang="ts">
import EchartGeoJson from "@gisapi/_components/echartGeoJson.vue"
</script>
