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
        <layoutNav ref="layoutNavRef" />
        <main ref="mainRef" class="w-full cps__layout-main">
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
import settingsPage from "@renderer/layout/settings.vue"
import { lastRouterPath } from "@renderer/router/routerList"

const router = useRouter()

const mainRef = ref<HTMLElement | null>(null)
const layoutNavRef = ref<InstanceType<typeof layoutNav> | null>(null)
let fixedNavWidth = 0
let rafId: number | null = null
const updateMainMaxWidth = () => {
    if (!mainRef.value) return
    const maxWidth = Math.max(0, window.innerWidth - fixedNavWidth)
    mainRef.value.style.maxWidth = `${maxWidth}px`
}

// 带 requestAnimationFrame 的 resize 处理
const handleResize = () => {
    if (rafId) cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(() => {
        updateMainMaxWidth()
        rafId = null
    })
}

// 重新获取导航栏宽度并更新布局
const initLayout = () => {
    const navElement = layoutNavRef.value?.$el as HTMLElement | undefined
    const newWidth = navElement?.offsetWidth ?? 0
    if (newWidth > 0) {
        fixedNavWidth = newWidth
    } else {
        // 退化处理：若获取不到宽度，可尝试默认值或保留上次有效值
        if (fixedNavWidth === 0) fixedNavWidth = 200 // 根据实际侧边栏默认宽度调整
    }
    updateMainMaxWidth()
}

onMounted(async () => {
    console.log("布局加载完成，加载路由")
    // router.push("/home")
    // router.push("/TyphoonUI")
    await router.push(lastRouterPath)

    await nextTick()

    initLayout()
    window.addEventListener("resize", handleResize)
})

onUnmounted(() => {
    window.removeEventListener("resize", handleResize)
    if (rafId) cancelAnimationFrame(rafId)
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
