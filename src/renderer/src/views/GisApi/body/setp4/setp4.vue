<template>
  <section :class="['p-10 w-full h-full', 'flex gap-2 flex-col']">
    <img src="" alt="生成结果.jpg" class="w-full h-full bg-red-200" />
    <t-button class="" size="large" disabled theme="success">
      <template #icon>
        <c-icon-font
          iconName="icon-yys-xiazai"
          color="white"
          :class="['text-white mr-2']"
        ></c-icon-font
      ></template>
      下载图片
    </t-button>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped></style>
