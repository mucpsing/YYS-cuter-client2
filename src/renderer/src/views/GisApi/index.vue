<!--
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-06-21 21:40:50
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-07-22 10:39:07
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <section :class="['text-xs md:text-md xl:text-xl', 'h-full bg-gray-100']">
    <GisApiHeader></GisApiHeader>

    <GisApiBody></GisApiBody>

    <!-- <GuideSetp></GuideSetp> -->
  </section>
</template>

<script lang="ts">
import "./index.stylus"

import GisApiHeader from "./header.vue"
import GisApiBody from "./body/index.vue"
// import GuideSetp from "@gisapi/_components/guide.vue"

import "./_components/guide"

import { eventBus } from "@renderer/libs"

export default {
  components: { GisApiHeader, GisApiBody },
  // components: { GisApiHeader, GisApiBody, GuideSetp },

  onMount() {
    eventBus.on("GisApi:init", () => {
      console.log("GisApi init event")
    })
  },
}
</script>
