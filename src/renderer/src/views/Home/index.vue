<template>
  <div class="h-full testtt">
    <section :class="['parent', 'h-full', 'flex flex-col']">
      <header class="w-full son h-[30px]">头部</header>

      <div class="w-full h-0 bg-green-200 flex-grow-[2]">
        <div class="h-full overflow-auto">
          <!-- 这里的子元素是动态获取，最终导致父级元素被撑开，无法完全使用合适的动态高度 -->
          <p class="h-[200px]" v-for="(i, idex) of [1, 2, 3, 4, 56, 7, 89]" :key="idex">{{ i }}</p>
        </div>
      </div>

      <footer class="w-full bg-orange-200 h-[60px]">footer</footer>
    </section>
  </div>
</template>

<style lang="stylus">
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
