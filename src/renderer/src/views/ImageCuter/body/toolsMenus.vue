<template>
  <div
    id="toolsMenus"
    ref="toolsMenusRef"
    :style="{}"
    :class="[
      'cps-test',
      'cps-mask backdrop-blur-sm bg-gray-300/30',
      'absolute left-1/2 -translate-x-1/2  bottom-4',
      'rounded-[25px]',
      'h-[58px]',
      'pl-2 py-2',
      'min-w-[30px]',
    ]"
    @click="onClick"
  >
    <!-- currtMenus == item.name ? 'w-[120px] border-blue-500 text-gray-800' : 'w-[44px] border-blue-200 text-gray-400' -->
    <div
      v-for="(item, idx) in menus"
      :key="idx"
      :class="[
        'bg-white overflow-hidden',
        'inline-block p-2 mr-2',
        'rounded-[44px] h-[44px] w-[44px]',
        'cursor-pointer',
        'border-2',
        'hover:border-2 hover:border-blue-500 hover:text-gray-800',
        'border-blue-200 text-gray-400',
      ]"
      @click="item.onClick"
    >
      <t-tooltip class="w-[120px] flex items-center" :content="item.title" :theme="(item.theme as Theme)">
        <c-icon-font :class="['text-2xl mr-2', currtMenus == item.name ? '' : '']" :iconName="item.icon"></c-icon-font>
      </t-tooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
import interact from "interactjs"

type Theme = "default" | "success" | "light" | "primary" | "warning" | "danger"
const currtMenus = ref("crop")
const showMask = ref(false)
const toolsMenusRef = ref(null)
const menus = [
  {
    title: "添加坐标",
    icon: "tianjia",
    name: "add",
    theme: "primary",
    onClick: (_e: MouseEvent) => {
      currtMenus.value = "add"

      console.log("添加坐标")
    },
  },
  {
    title: "更新坐标",
    icon: "bianji",
    name: "update",
    theme: "success",
    onClick: (_e: MouseEvent) => {
      currtMenus.value = "update"

      console.log("更新坐标")
    },
  },
  {
    title: "删除坐标",
    icon: "shanchu",
    name: "delete",
    theme: "danger",
    onClick: (_e: MouseEvent) => {
      currtMenus.value = "delete"

      console.log("删除坐标")
    },
  },
]

function onClick(e: MouseEvent) {
  if (e && e.target) {
    const target = e.target as HTMLDivElement

    if (target.className.toString().includes("cps-mask")) {
      console.log("点击了mask")

      showMask.value = !showMask.value
      currtMenus.value = ""
    }
  }
}

onMounted(() => {
  if (toolsMenusRef.value) {
    interact(toolsMenusRef.value).draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: "#ImageReaderCard__container",
          endOnly: true,
        }),
      ],
      listeners: {
        move(event) {
          const target = event.target
          // keep the dragged position in the data-x/data-y attributes
          const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx
          const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy

          // translate the element
          target.style.transform = "translate(" + x + "px, " + y + "px)"

          // update the posiion attributes
          target.setAttribute("data-x", x)
          target.setAttribute("data-y", y)
        },
      },
    })
  }
})
</script>

<style lang="stylus" scoped>
.cps-test, .cps-test *{
  transition all 0.6s cubic-bezier(0.25, 1, 0.5, 1)
}
</style>
