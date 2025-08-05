<template>
  <t-sticky-tool
    :style="{ zIndex: 100 }"
    :offset="[-50, 80]"
    placement="right-bottom"
    @click="handleClick"
    @hover="handleHover"
  >
    <t-sticky-item label="chat">
      <template #icon><chat-icon /></template>
    </t-sticky-item>
    <t-sticky-item label="新建工况">
      <template #icon><add-icon /></template>
    </t-sticky-item>
  </t-sticky-tool>
</template>

<script lang="ts" setup>
import { h } from "vue"
import { StickyItemProps, StickyToolProps } from "tdesign-vue-next"
import { ChatIcon, AddIcon, QrcodeIcon } from "tdesign-icons-vue-next"

const showAddDia = defineModel("showAddDia", { type: Boolean })
const renderQrIcon: StickyItemProps["icon"] = () => {
  return h(QrcodeIcon)
}

const handleClick: StickyToolProps["onClick"] = ({ e, item }) => {
  console.log(item)
  switch (item.label) {
    case "新建工况":
      console.log("新建工况")
      showAddDia.value = true
      break
    case "popup":
      console.log("popup")
      break
    default:
      break
  }
}

const handleHover: StickyToolProps["onHover"] = (context) => {
  // console.log("hover", context)
}
</script>
