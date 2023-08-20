<!--
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-11-28 22:49:15.089706
 * @Last Modified by: CPS
 * @Last Modified time: 2022-11-28 22:49:15.089706
 * @Filename main.py
 * @Description: 功能描述
-->

<template>
  <header class="ImageReader__header">
    <headlessSelectInput> </headlessSelectInput>
  </header>
</template>

<script setup lang="ts">
import { Combobox, ComboboxInput } from "@headlessui/vue";
import { ComboboxOptions, ComboboxOption } from "@headlessui/vue";
import { CheckIcon } from "@heroicons/vue/20/solid";
</script>

<style lang="stylus">
.ImageReader__container
  /.ImageReader__header
    height 60px
    width 100%
    flex-shrink 0
    flex-grow 0
    background-color #fff
    text-align center
    padding 5px

  /.ImageReader__header>h2
    font-size 15px
</style>
