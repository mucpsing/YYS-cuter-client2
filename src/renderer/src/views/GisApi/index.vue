<!--
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-06-21 21:40:50
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-07-23 10:02:52
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <section :class="['text-xs md:text-md xl:text-xl', 'h-full bg-gray-100']">
    <GisApiHeader></GisApiHeader>

    <a id="12221" data-intro="Hello step one!" @click="test">aa</a>

    <GisApiBody></GisApiBody>

    <!-- <GuideSetp></GuideSetp> -->
  </section>
</template>

<script lang="ts">
import "./index.stylus"

import GisApiHeader from "./header.vue"
import GisApiBody from "./body/index.vue"
// import GuideSetp from "@gisapi/_components/guide.vue"
import eventBus from "@renderer/libs/eventBus"

import introJs from "intro.js"
import "intro.js/introjs.css"
import "intro.js/themes/introjs-dark.css"
// import "./_components/guide"

export default {
  components: { GisApiHeader, GisApiBody },
  // components: { GisApiHeader, GisApiBody, GuideSetp },

  methods: {
    test: function () {
      eventBus.emit("show-guide", ["123"])
    },
  },

  mounted() {
    console.log("GisApi init")

    eventBus.on("GisApi:init", () => {
      console.log("GisApi init event")
    })

    eventBus.on("show-guide", (args) => {
      console.log("show-guide")

      const targetName = `#Gis-Api__template_input_mxd_name_${args[2]}`
      console.log("show-guide", targetName)

      introJs("#12221").start()
    })
  },
}
</script>
