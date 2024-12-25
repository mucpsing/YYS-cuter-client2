<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-12-24 17:03:36
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-12-25 16:20:40
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\TyphoonUI\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-12-24 17:03:36
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-12-25 15:18:17
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\TyphoonUI\index.vue
 * @Description: 这是一个台风动态展示组件
-->
<template>
  <div :class="['flex w-full h-full', 'bg-orange-300 p-5 rounded-md']">
    <div id="amapRef"></div>

    <div id="echartsMapRef"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts"
import { initWebAmap, initJSAmap } from "./_components/amap"

let map: AMap.Map | null = null

onMounted(async () => {
  // map = await initJSAmap(
  //   "ceec0c8cc35492b2a7e83f5be1043de0",
  //   "7251d0b718d553b688c54e86ee39a662",
  //   "mapRef",
  // )

  map = await initWebAmap("5a0c9bd829d2c5f203330fc94c9f0dfc", "amapRef")

  const chart = echarts.init(document.getElementById("echartsMapRef") as HTMLDivElement)
})

onUnmounted(() => {
  map?.destroy()
})
</script>

<style lang="scss" scoped></style>
