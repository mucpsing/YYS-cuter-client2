<!--
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2023-10-11 21:04:11
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-10-11 23:08:17
 * @FilePath: \YYS-cuter-client2\src\renderer\src\components\global\t-table-col-controler.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
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
              <div class="flex flex-row justify-between gap-4">
                <div class="flex flex-wrap gap-2">
                  <t-checkbox
                    v-for="(colKey, index) of row"
                    :key="index"
                    :checked="props.columns.some((item) => item.colKey == colKey)"
                    :onChange="(checked) => onChange(checked, colKey, item.value)"
                  >
                    {{ getColKeyName(colKey) }}
                  </t-checkbox>
                </div>
                <t-button size="small" :on-click="() => onChanges(item.value)">全选</t-button>
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
const checkObj = reactive<{ [key: string]: string[] }>({})

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
    title: item.label,
  }))
})

async function onChange(checked: boolean, colKey: string, groupName: string) {
  if (!Object.hasOwn(checkObj, groupName)) checkObj[groupName] = []

  if (checked) {
    // 显示
    emit("addCol", colKey)

    checkObj[groupName].push(colKey)
  } else {
    // 隐藏
    emit("delCol", colKey)

    if (checkObj[groupName].includes(colKey)) {
      const delIdx = checkObj[groupName].indexOf(colKey)
      checkObj[groupName].splice(delIdx, 1)
    } else {
      console.log("查找不到要删除的key")
    }
  }
}

async function onChanges(groupName: string) {
  if (!Object.hasOwn(checkObj, groupName)) checkObj[groupName] = []

  let targetGroup: string[] = []

  props.groupColumns.forEach((item) => {
    if (item.value == groupName) {
      targetGroup = item.columns
    }
  })

  if (targetGroup.length == checkObj[groupName].length) {
    // 数量想等，进行清空
    targetGroup.forEach((colKey) => {
      onChange(false, colKey, groupName)
    })
  } else {
    // 将不存在的添加进

    targetGroup.forEach((colKey) => {
      if (!checkObj[groupName].includes(colKey)) onChange(true, colKey, groupName)
    })
  }
}

onMounted(() => {
  props.groupColumns.forEach((item) => {
    checkObj[item.value] = []
    props.columns.forEach((colItem) => {
      if (item.columns.includes(colItem.colKey)) {
        checkObj[item.value].push(colItem.colKey)
      }
    })
  })
})
</script>
