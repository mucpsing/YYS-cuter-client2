<template>
  <Layout />
  <cps-dialog ref="cpsDialogRef"></cps-dialog>
</template>

<script lang="ts">
import Layout from "@renderer/layout/index.vue"
import cpsDialog from "@renderer/components/global/headLessDialog.vue"
import { eventBus } from "@renderer/libs"
import { CpsDialogElement } from "@renderer/global"

export default defineComponent({
  components: { Layout, cpsDialog },
  setup() {
    const cpsDialogRef = ref<CpsDialogElement>()
    async function eventOpenCpsDialog(opts: any) {
      if (cpsDialogRef && cpsDialogRef.value) {
        cpsDialogRef.value.open(opts)
      }
    }

    onMounted(() => {
      eventBus.on("showDialog", eventOpenCpsDialog)
      console.log("app on load")
    })

    onUnmounted(() => {
      eventBus.off("showDialog", eventOpenCpsDialog)
    })

    return { cpsDialogRef }
  },
})
</script>

<style lang="stylus">
body, html, div, span, p
  margin 0
  padding 0
  box-sizing border-box

body
  overflow hidden

#app
  display flex
</style>
