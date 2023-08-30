<template>
  <div class="h-full testtt">
    <t-tabs class="h-full p2" :value="value">
      <t-tab-panel
        v-for="data in panelData"
        :key="data.value"
        :value="data.value"
        :label="data.label"
      >
        <section :class="['parent', 'h-full', 'flex flex-col']">
          <header class="w-full son">
            <div class="child">
              {{ msg }}
            </div>
          </header>

          <div class="w-full bg-green-200 flex-grow-[2]">{{ data.content }}</div>

          <footer class="w-full bg-orange-200 h-[60px]">footer</footer>
        </section>
      </t-tab-panel>
    </t-tabs>
  </div>

  <!-- <div class="h-full testtt">
    <section :class="['parent', 'h-full', 'flex flex-col']">
      <header class="w-full son">
        <div class="child">
          {{ msg }}
        </div>
      </header>

      <div class="w-full bg-green-200 flex-grow-[2]">{{ msg }}</div>

      <footer class="w-full bg-orange-200 h-[60px]">footer</footer>
    </section>
  </div> -->
</template>

<script lang="ts" setup>
const msg = ref("This is Home header")
// const currtTab = ref("0")
const value = ref("first")
// const pannelCountId = ref(0)

const panelData = ref([
  {
    value: "first",
    label: "原有选项卡1",
    removable: true,
    content: "原有选项卡1内容",
  },
  {
    value: "second",
    label: "原有选项卡2",
    removable: true,
    content: "原有选项卡2内容",
  },
])
</script>

<style lang="stylus">
.parent .child {
  background red
  height 300px
  width  300px
}

.testtt .t-tabs__content{
  height 100%
}

.testtt .t-tab-panel{
  height calc(100% - 64px) /* 因为tdis*/
}

 .testtt .t-tabs{
  height 100%
}
</style>
