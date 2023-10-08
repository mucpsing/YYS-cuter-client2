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
            :groupColumns="groupColumns"
            :columns="(tableColumns as TableRowData[])"
            :columnsNameMap="SkillTemplate"
            @addCol="addColItem"
            @delCol="delColItem"
          ></ColConfig>
          <t-input-number size="medium" :step="50" v-model="maxHeight" />
          <t-button :loading="loading" :on-click="dataInit" size="medium" theme="success"
            >刷新</t-button
          >
        </div>
      </div>

      <div ref="resizeDivRef" :class="['border-0 border-indigo-400 rounded-md']">
        <t-table
          size="small"
          hover
          stripe
          bordered
          :loading="loading"
          :maxHeight="maxHeight"
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
import { SkillTemplate, groupColumns } from "@data/ns/skill"
import { SkillIdMap } from "@data/ns/skill"
import ColConfig from "@components/global/t-table-col-controler.vue"

const resizeDivRef = ref<HTMLDivElement>()
const loading = ref(false)
const maxHeight = ref(550)
const store = useNsSkillStore()
const defaultColumns = ["index", "SkillId", "Job", "Skill Name"]

const tableColumnsBase: { colKey: string; title: string; width?: string }[] = [
  { colKey: "index", title: "序号", width: "50" },
]

const filterObj = {
  SkillId: {
    type: "single",
    list: Object.keys(SkillIdMap).map((key) => ({ label: SkillIdMap[key], value: key })),
    // [
    //   { label: "审批通过", value: 1 },
    //   { label: "已过期", value: 2 },
    //   { label: "审批失败", value: 3 },
    // ],
  },
}

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
// const pagination = computed(() => {
//   return {
//     current: 1,
//     pageSize: 15,
//     showJumper: true,
//     total: store.data.length,
//     onChange: (pageInfo) => {
//       console.log("pagination.onChange", pageInfo)
//     },
//   }
// })

// async function onPageChange(pageInfo) {
//   console.log("page-change", pageInfo)
//   pagination.value.current = pageInfo.current
//   pagination.value.pageSize = pageInfo.pageSize
// }

async function dataInit() {
  loading.value = true
  await store.getSkillDataFromApi()

  setTimeout(() => (loading.value = false), 600)
}

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
  dataInit()
})
</script>
