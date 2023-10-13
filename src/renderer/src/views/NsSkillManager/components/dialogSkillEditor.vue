<!--
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2023-10-12 10:48:15
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-10-12 22:25:46
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\NsSkillManager\components\dialogSkillEditor.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div :class="props.class">
    <t-dialog
      :header="props.data['Skill Name']"
      :closeOnEscKeydown="true"
      :closeBtn="true"
      :visible="props.show"
      :onClose="() => $emit('update:show', false)"
      :footer="false"
      width="70%"
    >
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { SkillTemplate, type SkillItemType } from "@nsData/skill"

const emit = defineEmits<{
  (event: "update:show", showFlag): void
  (event: "update:data", newData): void
}>()

const props = withDefaults(
  defineProps<{
    show: boolean
    title?: string
    class?: string[]
    data: SkillItemType
  }>(),
  {
    title: "数据编辑",
    data: () => SkillTemplate,
  },
)

onMounted(() => {})
</script>

<style lang="stylus"></style>
