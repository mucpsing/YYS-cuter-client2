<template>
  <section :class="['flex flex-col gap-2 p-2']">
    <t-card title="头部">
      <div :class="['bg-slate-200', 'p-2']">12313213</div>
    </t-card>
    <t-card title="技能数据">
      <div class="flex items-center justify-end gap-2">
        <t-button size="medium" theme="success">刷新</t-button>

        <ColConfig
          size="medium"
          :groupColumns="GROUP_COLUMNS"
          :columns="(tableColumns as TableRowData[])"
          :columnsNameMap="SkillTemplate"
          @addCol="addColItem"
          @delCol="delColItem"
        ></ColConfig>
      </div>

      <t-table
        size="small"
        hover
        :data="store.data"
        :columns="(tableColumns as TableRowData[])"
        rowKey="index"
      ></t-table>
    </t-card>
  </section>
</template>

<script setup lang="ts">
// import { npcListRaw } from "@nsData/npcList"
// import { itemListRaw } from "@nsData/itemList"
// import { SettingIcon, SearchIcon } from "tdesign-icons-vue-next"
// import { getSkilleList, updateSkillById } from "@renderer/api/ns-api"

import type { TableRowData } from "tdesign-vue-next"

import { useNsSkillStore } from "@nsStore/index"
import { SkillTemplate } from "@data/ns/skill"
import ColConfig from "@components/global/t-table-col-controler.vue"

const store = useNsSkillStore()

const defaultColumns = ["index", "SkillId", "Job", "Skill_Name"]

const tableColumnsBase: { colKey: string; title: string; width?: string }[] = [
  { colKey: "index", title: "序号", width: "50" },
]

Object.keys(SkillTemplate).forEach((key) => {
  tableColumnsBase.push({
    colKey: key,
    title: SkillTemplate[key],
  })
})

const tableColumns = ref(
  defaultColumns.map((colName) => {
    for (let index = 0; index < tableColumnsBase.length; index++) {
      if (colName == tableColumnsBase[index].colKey) {
        return tableColumnsBase[index]
      }
    }
  }),
)

const GROUP_COLUMNS = [
  {
    label: "基础资料",
    value: "index",
    columns: [
      "index",
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
  {
    label: "技能类型",
    value: "secondary",
    columns: [
      "SkillType1",
      "SkillOption1",
      "SkillValue1",
      "SkillType2",
      "SkillOption2",
      "SkillValue2",
    ],
  },
  {
    label: "其他",
    value: "data",
    columns: [
      "RangeType",
      "RangeValue_10cm",
      "CastTime_Sec",
      "CoolTime_Sec",
      "AttackSpeed_10_Sec",
      "DurationTimeSeed_Sec",
      "DurationTime_Sec",
      "Comment",
    ],
  },
]

// 动态添加列
async function addColItem(colKey: string) {
  for (let index = 0; index < tableColumnsBase.length; index++) {
    if (tableColumnsBase[index].colKey == colKey) {
      tableColumns.value.push(tableColumnsBase[index])
      break
    }
  }
}
// 删除添加列
async function delColItem(colKey: string) {
  for (let index = 0; index < tableColumns.value.length; index++) {
    if (tableColumns.value[index].colKey == colKey) {
      tableColumns.value.splice(index, 1)
    }
  }
}
</script>
