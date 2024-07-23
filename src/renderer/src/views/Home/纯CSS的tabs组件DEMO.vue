<!--
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-07-23 22:28:12
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-07-23 22:45:41
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\Home\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="container p-4 mx-auto">
    <input type="radio" name="tab" id="iphone-12-pro" class="hidden" checked />
    <input type="radio" name="tab" id="iphone-12" class="hidden" />

    <div class="my-4 nav">
      <label for="iphone-12-pro">
        <span class="inline-block px-5 py-2 rounded-full">iphone 12 Pro</span>
      </label>
      <label for="iphone-12">
        <span class="inline-block px-5 py-2 rounded-full">iphone 12</span>
      </label>
    </div>

    <div class="hidden p-8 shadow-md rounded-xl tab-iphone-12-pro">
      <div class="flex flex-col justify-center w-3/5">
        <div>
          <h2 class="text-2xl font-bold">iPhone 12 Pro</h2>
          <p class="mt-3">
            {{ data[0] }}
          </p>
          <button
            class="px-5 py-2 mt-6 text-lg text-white transition transform bg-black rounded-full shadow hover:scale-110 hover:bg-blue-600"
          >
            Shop Now
          </button>
        </div>
      </div>
      <div class="w-2/5">
        <img src="points_template.png" alt="error" />
      </div>
    </div>

    <div class="hidden p-8 shadow-md rounded-xl tab-iphone-12">
      <div class="flex flex-col justify-center w-3/5">
        <div>
          <h2 class="text-2xl font-bold">iPhone 12</h2>
          <p class="mt-3">
            {{ data[1] }}
          </p>
          <button
            class="px-5 py-2 mt-6 text-lg text-white transition transform bg-black rounded-full shadow hover:scale-110 hover:bg-blue-600"
          >
            Shop Now
          </button>
        </div>
      </div>
      <div class="w-2/5">
        <img src="speed_template.png" alt="error" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const data = ref([
  "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus reprehenderit,voluptatibus suscipit doloremque accusamus, officiis ducimus, sequi nemo id quam qui distinctio animi. Quisquam, dignissimos! Illo provident corporis quia nostrum.",
  "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim, magnam voluptas facilisnam excepturi placeat, laborum sed, perferendis esse obcaecati corrupti sit praesentiumadipisci provident odio natus fuga aliquid hic!",
  "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Assumenda eaque deleniti quos.Ratione corporis voluptas numquam vel? Impedit, doloribus tempora suscipit quidemconsectetur possimus esse nostrum, blanditiis, perferendis accusantium nihil.",
])
</script>

<style lang="stylus" scoped>
#iphone-12-pro:checked ~ .tab-iphone-12-pro {
  @apply flex;
}

#iphone-12-pro:checked ~ .nav label[for="iphone-12-pro"] span {
  @apply bg-gray-200;
}

#iphone-12:checked ~ .tab-iphone-12 {
  @apply flex;
}

#iphone-12:checked ~ .nav label[for="iphone-12"] span {
  @apply bg-gray-200;
}

#iphone-se:checked ~ .tab-iphone-se {
  @apply flex;
}

#iphone-se:checked ~ .nav label[for="iphone-se"] span {
  @apply bg-gray-200;
}
</style>
