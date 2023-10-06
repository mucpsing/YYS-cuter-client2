<!--
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2023-10-04 10:23:03
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-10-06 11:21:31
 * @FilePath: \YYS-cuter-client2\src\renderer\src\components\global\t-table-col-controler.vue
 * @Description: 这是模拟官方列配置的弹出框组件，暂时每个键值都需要分组，而且全选功能没实现
-->
<template>
  <div :class="class">
    <t-button :size="props.size" :on-click="() => (show = !show)">
      {{ props.title }}
      <template #icon> <SettingIcon /> </template>
    </t-button>
    <t-dialog
      :header="props.title"
      :closeOnEscKeydown="true"
      :closeBtn="true"
      :visible="show"
      :onClose="() => (show = false)"
      :footer="false"
      width="70%"
    >
      <div class="flex flex-col gap-4">
        <p>请选择需要在表格中显示的数据列</p>

        <template v-for="(item, idx) of props.groupColumns" :key="idx">
          <t-table rowKey="index" :data="[item.columns]" :columns="[columnsList[idx]]" bordered>
            <template #index="{ row }">
              <div class="flex flex-wrap gap-2">
                <t-checkbox
                  v-for="(colKey, index) of row"
                  :key="index"
                  :checked="props.columns.some((item) => item.colKey == colKey)"
                  :onChange="(checked) => onChange(checked, colKey)"
                  >{{ getColKeyName(colKey) }}</t-checkbox
                >
              </div>
            </template>
          </t-table>
        </template>
      </div>
    </t-dialog>
  </div>
</template>

<script setup lang="tsx">
import { SettingIcon } from "tdesign-icons-vue-next"
import type { TableRowData } from "tdesign-vue-next"

const show = ref(false)

const emit = defineEmits<{
  (event: "addCol", colKey: string): void
  (event: "delCol", colKey: string): void
}>()

const props = withDefaults(
  defineProps<{
    title?: string
    class?: string
    size?: "small" | "medium" | "large"
    data?: {}[]
    groupColumns?: { label: string; value: string; columns: string[] }[]
    columns?: TableRowData[]
    columnsNameMap?: { [colKey: string]: string }
  }>(),
  {
    title: "列配置",
    size: "medium",
    data: () => [],
    columns: () => [],
    columnsNameMap: () => ({}),
    groupColumns: () => [
      {
        label: "label - 选项名称",
        value: "value - 暂时没用",
        columns: [
          "SkillId",
          "Job",
          "Skill_Name",
          "SkillPoint",
          "SkillPoint2",
          "LimitLevel",
          "UseKind",
          "UsePoint",
        ],
      },
    ],
  },
)

// 从columnsNameMap查找列名，如果存在，否则返回本身colKey
const getColKeyName = (colKey: string) => {
  let res = colKey

  for (const [key, value] of Object.entries(props.columnsNameMap)) {
    if (key == colKey) res = value
  }

  return res
}

// 根据groupColumns来生成不同的分类分组表格
const columnsList = computed(() => {
  return props.groupColumns.map((item) => ({
    colKey: "index",
    title: () => <t-checkbox>{item.label}</t-checkbox>,
  }))
})

async function onChange(checked: boolean, colKey: string) {
  if (checked) {
    // 显示
    emit("addCol", colKey)
    console.log("增加: ", colKey)
  } else {
    // 隐藏
    emit("delCol", colKey)
    console.log("删除: ", colKey)
  }
}
</script>
