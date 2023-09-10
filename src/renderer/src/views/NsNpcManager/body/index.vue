<template>
  <section :class="['flex flex-row gap-2', 'h-full', 'py-10']">
    <!-- 【左边】 -->
    <div :class="['w-full h-full', 'bg-red-200']">
      <div :class="['flex justify-center items-center']">
        <img src="" alt="" :class="['w-[400px] h-[400px]']" />
      </div>
      <div></div>
    </div>

    <!-- 【右边】 -->
    <div :class="['w-full h-full', 'bg-red-400', 'flex-grow-[999]']">右边</div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped></style>
