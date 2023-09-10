<template>
  <section :class="['flex flex-row gap-2', 'py-8 px-4']">
    <!-- 【左边】 -->
    <div :class="['bg-red-200', 'flex-grow-[0]']">
      <!--  -->
      <div :class="['flex flex-col justify-between items-center', 'h-full p-4']">
        <div class="rouned-md flex-grow-[1]">
          <img src="" alt="" :class="['min-w-[400px] min-h-[400px] bg-green-300 rouned-md']" />
        </div>

        <div :class="['flex flex-row justify-between', 'w-full mb-2']">
          <h2>{{ CurrtNpcName }}</h2>
          <span>NpcId: {{ CurrtNpcId }}</span>
        </div>
      </div>
      <div></div>
    </div>

    <!-- 【右边】 -->
    <div :class="['bg-red-400', 'flex-grow-[2]']">右边</div>
  </section>
</template>

<script setup lang="ts">
const CurrtNpcId = ref(1000)
const CurrtNpcName = ref("NPC/怪物名称")
</script>
