<script setup lang="ts">
import type { TagTheme, TagVariant } from 'naive-ui' // 或你自己的类型

interface TagStyle {
  theme?: TagTheme
  variant?: TagVariant
}

const props = withDefaults(
  defineProps<{
    /** 每行的分母，决定量级：1 → 1~9，10 → 0.1~0.9 ... */
    scales?: number[]
    /** 每行标签数 */
    countPerRow?: number
    /** 按「行优先」的扁平索引对齐的样式 */
    outputNameTagList?: TagStyle[]
  }>(),
  {
    scales: () => [1, 10, 100, 1000],
    countPerRow: 9,
    outputNameTagList: () => [],
  },
)

const emit = defineEmits<{ (e: 'contour-tip-click', value: number): void }>()
</script>

<template>
  <div class="grid grid-cols-9 gap-2">
    <!-- 一行 scales = 一层循环，内层只写一遍 -->
    <template v-for="(scale, row) of scales" :key="`row-${row}`">
      <template v-for="i of countPerRow" :key="`${row}-${i}`">
        <t-tag
          class="justify-center cursor-pointer"
          size="medium"
          :theme="
            (outputNameTagList[row * countPerRow + (i - 1)]?.theme as TagTheme) || 'default'
          "
          :variant="
            (outputNameTagList[row * countPerRow + (i - 1)]?.variant as TagVariant) || 'outline'
          "
          @click="() => emit('contour-tip-click', i / scale)"
        >
          {{ i / scale }}
        </t-tag>
      </template>
    </template>
  </div>
</template>
