<!--
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-12-17 15:31:29.881627
 * @Last Modified by: CPS
 * @Last Modified time: 2022-12-17 15:31:29.881627
 * @Filename main.py
 * @Description: 功能描述
-->

<template>
  <section
    :class="[
      'ImageReaderCard__history',
      'absolute overflow-y-auto z-10',
      'w-full h-full overflow-hidden backdrop-blur-sm py-5',
    ]"
  >
    <!--     <ul :class="['relative flex flex-row gap-3 flex-wrap justify-around']">
      <li
        v-for="key in Object.keys(localStore.historyFileInfoObj)"
        :key="key"
        :class="['box-border bg-white w-2/5 h-32 rounded-md']"
      >
        <div class="flex justify-center">
          <img loading="lazy" :src="localStore.historyFileInfoObj[key].image.src" alt="" />
        </div>
        <p>
          {{ localStore.historyFileInfoObj[key].width }} x
          {{ localStore.historyFileInfoObj[key].height }}
        </p>
      </li>
    </ul> -->

    <div :class="['relative flex flex-row gap-10 flex-wrap justify-center']">
      <div
        v-for="(key, idx) in imgList"
        :key="idx"
        :class="[
          'relative group box-border bg-white w-64 h-44 rounded-xl overflow-hidden',
        ]"
      >
        <div
          :class="[
            'group-hover:cursor-pointer',
            'before:bg-pink-500 before:w-full before:h-full',
            'after:bg-pink-500',
            'flex justify-center w-full h-full',
          ]"
        >
          <img
            class="object-cover w-full h-full"
            loading="lazy"
            :src="key"
            alt=""
          />
        </div>

        <div
          :class="[
            'group-hover:-translate-y-14 group-hover:opacity-100',
            'opacity-0 absolute ml-2 text-white',
          ]"
        >
          <span>图片名</span>
          <p>5000 x 1200</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const imgList = [
  "C:/Users/M2-WIN10/Pictures/test1.jpg",
  "C:/Users/M2-WIN10/Pictures/test2.jpg",
  "C:/Users/M2-WIN10/Pictures/test3.jpg",
  "C:/Users/M2-WIN10/Pictures/test5.jpg",
  "C:/Users/M2-WIN10/Pictures/test6.jpg",
  "C:/Users/M2-WIN10/Pictures/test7.jpg",
  "C:/Users/M2-WIN10/Pictures/mimi.png",
  "C:/Users/M2-WIN10/Pictures/test.jpg",
];
</script>

<style lang="stylus" scoped>
.ImageReaderCard__history *
  transition all 0.4s

.img-container
  max-width 612px
  column-count 3
  column-gap 10px

  /.img-li
    margin-bottom 15px
</style>
