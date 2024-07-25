<!--
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-06-21 21:40:50
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-07-25 09:47:16
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <section :class="['text-xs md:text-md xl:text-xl', 'h-full bg-gray-100']">
    <!-- header 头部组件，主要调用settings和触发一些全局前置事件（获取数据，检查服务器等） -->
    <GisApiHeader></GisApiHeader>

    <!-- 内容，目前主要使用tab组件来管理切换 -->
    <GisApiBody></GisApiBody>

    <!-- guid引导全局组件，使用eventBus.emit(guid-xxx)来调用，事件注册在event.ts -->
    <GuideSetp></GuideSetp>
  </section>
</template>

<script lang="ts">
import "./index.stylus"

import GisApiHeader from "./header.vue"
import GisApiBody from "./body/index.vue"
import GuideSetp from "@gisapi/_components/guide.vue"
import eventBus from "@renderer/libs/eventBus"

export default {
  components: { GisApiHeader, GisApiBody, GuideSetp },

  mounted() {
    eventBus.on("gis-api:init", () => console.log("gis-api init event"))
  },
}
</script>
