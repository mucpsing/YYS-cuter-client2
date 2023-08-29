<!--
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2023-08-20 23:21:53
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-08-21 00:21:59
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\ImageCuter\body\pageServices.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div :class="['bg-red-200', 'w-full h-full', 'absolute z-10']">services api</div>
</template>

<script lang="ts" setup>
const serviceApiList = ["/getHwndList", "/getHwndInfo", "/bindHwnd"]
</script>
