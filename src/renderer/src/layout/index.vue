<!--
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-02-14 06:05:24.812112
 * @Last Modified by: CPS
 * @Last Modified time: 2022-02-14 06:05:24.813058
 * @Filename layout
 * @Description: 功能描述
-->

<template>
  <div class="flex w-screen h-screen cps__layout">
    <layoutNav />
    <main class="w-full cps__layout-main">
      <router-view v-slot="{ Component }">
        <transition name="scale-slide">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </main>
    <settingsPage />
  </div>
</template>

<script setup lang="ts">
import layoutNav from "@renderer/layout/aside/index.vue"
import settingsPage from "@renderer/components/settings.vue"
import { lastRouterPath } from "@renderer/router/routerList"
const router = useRouter()

onMounted(() => {
  router.push(lastRouterPath)
})
</script>

<style lang="stylus" scoped>
.cps__layout, cps__layout-main
  position relative
  height 100vh

.scale-slide-enter-active, .scale-slide-leave-active
  position absolute
  transition all 0.6s ease

.scale-slide-enter-from
  transform translateX(100vh)
  opacity 0.5

.scale-slide-enter-to
  transform translateX(0)
  opacity 1

.scale-slide-leave-from
  transform scale(1)
  opacity 1

.scale-slide-leave-to
  transform scale(0.8)
  opacity 0
</style>
