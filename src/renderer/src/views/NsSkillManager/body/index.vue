<template>
  <section :class="['flex flex-col gap-2 p-2']">
    <t-card title="头部">
      <div :class="['bg-slate-200', 'p-2']">12313213</div>
    </t-card>
    <t-card>
      <div :class="['flex justify-between']">
        <div>
          <h2><strong>技能数据</strong></h2>
        </div>
        <div></div>
        <div class="flex items-center justify-end gap-2 pb-2">
          <ColConfig
            size="medium"
            :groupColumns="GROUP_COLUMNS"
            :columns="(tableColumns as TableRowData[])"
            :columnsNameMap="SkillTemplate"
            @addCol="addColItem"
            @delCol="delColItem"
          ></ColConfig>
          <t-input-number size="medium" :step="50" v-model="maxHeight" />
          <t-button size="medium" theme="success">刷新</t-button>
        </div>
      </div>

      <!-- :pagination="pagination" -->
      <!-- @page-change="onPageChange" -->
      <!-- :maxHeight="maxHeight" -->
      <!-- resizable -->
      <div ref="resizeDivRef" :class="['border-4 border-indigo-400 rounded-md']">
        <t-table
          size="small"
          hover
          stripe
          bordered
          :height="maxHeight"
          :data="store.data"
          :columns="(tableColumns as TableRowData[])"
          rowKey="index"
        >
          <template #Job="{ row }">
            <t-tag
              shape="round"
              :theme="SkillIdMap[row.Job] ? SkillIdMap[row.Job].theme : 'default'"
              variant="light-outline"
            >
              {{ SkillIdMap[row.Job] ? SkillIdMap[row.Job].label : row.Job }}
            </t-tag>
          </template>
        </t-table>
      </div>
    </t-card>
  </section>
</template>

<script setup lang="ts">
// import { npcListRaw } from "@nsData/npcList"
// import { itemListRaw } from "@nsData/itemList"
// import { SettingIcon, SearchIcon } from "tdesign-icons-vue-next"

import type { TableRowData } from "tdesign-vue-next"

import { useNsSkillStore } from "@nsStore/index"
import { SkillTemplate } from "@data/ns/skill"
import ColConfig from "@components/global/t-table-col-controler.vue"

const resizeDivRef = ref<HTMLDivElement>()

const maxHeight = ref(400)
const store = useNsSkillStore()
const defaultColumns = ["index", "SkillId", "Job", "Skill Name"]

const SkillIdMap = {
  "0": { label: "通用技能", theme: "default", icon: "" },
  "1": { label: "武士系", theme: "danger", icon: "" },
  "2": { label: "武士(武器大师)", theme: "danger", icon: "" },
  "3": { label: "圣骑士(拥护者)", theme: "danger", icon: "" },
  "33": { label: "法师系", theme: "primary", icon: "" },
  "34": { label: "巫师(吟唱者)", theme: "primary", icon: "" },
  "35": { label: "召唤师(元素使)", theme: "primary", icon: "" },
  "65": { label: "工程师系", theme: "success", icon: "" },
  "66": { label: "工程师 (鼓舞者)", theme: "success", icon: "" },
  "67": { label: "工匠 (武器匠)", theme: "success", icon: "" },
  "97": { label: "浪子系", theme: "warning", icon: "" },
  "98": { label: "猎人 (追踪者)", theme: "warning", icon: "" },
  "99": { label: "暗杀者 (黑暗行者)", theme: "warning", icon: "" },
}

const GROUP_COLUMNS = [
  {
    label: "基础属性",
    value: "base",
    columns: [
      "index",
      "SkillId",
      "Job",
      "Skill Name",
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
      "RangeValue(10cm)",
      "CastTime(Sec)",
      "CoolTime(Sec)",
      "AttackSpeed(10/Sec)",
      "DurationTimeSeed(Sec)",
      "DurationTime(Sec)",
      "Comment",
    ],
  },
]

const tableColumnsBase: { colKey: string; title: string; width?: string }[] = [
  { colKey: "index", title: "序号", width: "50" },
]

Object.keys(SkillTemplate).forEach((key) => {
  tableColumnsBase.push({
    colKey: key,
    title: SkillTemplate[key],
  })
})

const pagination = computed(() => {
  return {
    current: 1,
    pageSize: 15,
    showJumper: true,
    total: store.data.length,
    onChange: (pageInfo) => {
      console.log("pagination.onChange", pageInfo)
    },
  }
})

async function onPageChange(pageInfo) {
  console.log("page-change", pageInfo)
  pagination.value.current = pageInfo.current
  pagination.value.pageSize = pageInfo.pageSize
}

const tableColumns = ref(
  defaultColumns.map((colName) => {
    for (let index = 0; index < tableColumnsBase.length; index++) {
      if (colName == tableColumnsBase[index].colKey) {
        return tableColumnsBase[index]
      }
    }
  }),
)

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

onMounted(() => {
  // 调用api获取技能信息
  store.getSkillDataFromApi()

  // if (resizeDivRef.value)
  //   interact(resizeDivRef.value).resizable({
  //     edges: { left: false, right: false, bottom: true, top: false },
  //     modifiers: [
  //       interact.modifiers.restrictEdges({ outer: "parent" }),
  //       interact.modifiers.restrictSize({ min: { width: 1, height: 1 } }),
  //     ],
  //     listeners: {
  //       move(event) {
  //         const target = event.target
  //         let y = parseFloat(target.getAttribute("data-y")) || 0
  //         target.style.height = event.rect.height + "px"
  //         maxHeight.value = event.rect.height - 10
  //         target.setAttribute("data-y", y)
  //       },
  //     },
  //   })
})
</script>
