<template>
  <section
    :class="[
      'ImageReaderCard__toolsBar',
      'flex flex-col flex-grow-0 shrink-0 justify-between',
      'rounded-2xl bg-white/70 w-12',
    ]"
  >
    <!-- 【主】工具 -->
    <ul class="flex flex-col items-center justify-start h-full gap-2 pt-5">
      <template v-for="menu in Object.values(mainMenus)" :key="menu.id">
        <t-tooltip :content="menu.title" placement="left">
          <li
            :class="[
              'hover:text-orange-400',
              localStore.currtSelect == menu.name ? 'text-blue-600' : 'text-black',
            ]"
            class="cursor-pointer"
            @click="
              () => {
                localStore.currtSelect = menu.name
              }
            "
          >
            <c-icon-font class="text-2xl hover:text-3xl" :iconName="menu.icon"></c-icon-font>
          </li>
        </t-tooltip>
      </template>
    </ul>

    <!-- 【副】菜单 -->
    <ul class="flex flex-col items-center justify-end h-full gap-3 pb-5">
      <template v-for="menu in subMenus" :key="menu.id">
        <t-tooltip :content="menu.title" placement="left">
          <li class="text-black cursor-pointer hover:text-sky-400" @click="menu.onclick">
            <c-icon-font class="text-2xl hover:text-3xl" :iconName="menu.icon"></c-icon-font>
          </li>
        </t-tooltip>
      </template>
    </ul>
  </section>
</template>

<script setup lang="ts">
const localStore = reactive({
  currtSelect: "",
})
const mainMenus = {
  crop: {
    icon: "crop",
    name: "crop",
    title: "裁剪工具",
    id: 1,
  },
  "coords-preview": {
    icon: "full-screen",
    name: "coords-preview",
    title: "预览工具",
    id: 3,
  },
  "picture-info": {
    icon: "picture-outline",
    name: "picture-info",
    title: "图片信息",
    id: 4,
  },
  "data-editor": {
    icon: "json",
    name: "data-editor",
    title: "数据编辑",
    id: 5,
  },
  "server-panel": {
    icon: "API",
    title: "服务器API",
    name: "server-panel",
    id: 2,
  },
}

const subMenus = [
  {
    icon: "folder-opened",
    name: "read-folder",
    title: "打开图片",
    id: 11,
    onclick: () => {
      // eventBus.emit("imageCuterBodyOpenFile", "")
    },
  },
  {
    name: "save",
    icon: "icon-yys-daochu2",
    title: "导出数据",
    id: 22,
    onclick: () => {
      // eventBusMain.emit("exportFile", {
      //   path: ".",
      //   data: JSON.stringify(data, null, 4),
      // })
    },
  },
  {
    name: "crop-settings",
    icon: "setting",
    title: "插件配置",
    id: 33,
    onclick: () => {
      // 默认展开 通用配置
      // if (openConfigPannelList.value.length == 0) {
      //   openConfigPannelList.value.push("通用配置")
      // }
      // eventBus.emit("showSettingsPage", SettingPageValue.IMAGE_CUTER)
    },
  },
]
</script>

<style lang="stylus">
.ImageReaderCard__toolsBar *
  transition font-size 0.4s cubic-bezier(0.25, 1, 0.5, 1), color 0.1s cubic-bezier(0.25, 1, 0.5, 1)
</style>
