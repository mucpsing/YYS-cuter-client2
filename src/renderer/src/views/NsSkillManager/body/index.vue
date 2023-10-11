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

      <!-- :columns="(tableColumns as TableRowData[])" -->
      <div :class="['border-0 border-indigo-400 rounded-md']">
        <t-table
          class="ns__skill_table"
          size="small"
          hover
          stripe
          bordered
          :data="data"
          rowKey="index"
          :loading="loading"
          :maxHeight="maxHeight"
          :filter-value="filterValue"
          :onCellClick="(item) => console.log(item)"
          :columns="(tableColumns as TableRowData[])"
          @filter-change="onFilterChange"
        >
          <template #Job="{ row }">
            <t-tag
              shape="round"
              :theme="JobMap[row.Job] ? JobMap[row.Job].theme : 'default'"
              variant="light-outline"
            >
              {{ JobMap[row.Job] ? JobMap[row.Job].label : row.Job }}
            </t-tag>
          </template>

          <template #SkillType1="{ row }">
            <!-- <t-tag size="small" theme="primary" variant="outline"> -->
            <t-tooltip :content="row.SkillType1">
              <span>
                {{ SkillTypeMap[row.SkillType1] ? SkillTypeMap[row.SkillType1].label : "" }}
              </span>
            </t-tooltip>
            <!-- </t-tag> -->
          </template>
          <template #SkillOption1="{ row }">
            <t-tooltip :content="row.SkillOption1">
              <span>
                {{ SkillOptionMap[row.SkillOption1] ? SkillOptionMap[row.SkillOption1].label : "" }}
              </span>
            </t-tooltip>
          </template>

          <template #SkillType2="{ row }">
            <!-- <t-tag size="small" theme="primary" variant="outline"> -->
            <t-tooltip :content="row.SkillType2">
              <span>
                {{ SkillTypeMap[row.SkillType2] ? SkillTypeMap[row.SkillType2].label : "" }}
              </span>
            </t-tooltip>
            <!-- </t-tag> -->
          </template>
          <template #SkillOption2="{ row }">
            <t-tooltip :content="row.SkillOption2">
              <span>
                {{ SkillOptionMap[row.SkillOption2] ? SkillOptionMap[row.SkillOption2].label : "" }}
              </span>
            </t-tooltip>
          </template>
        </t-table>
      </div>
    </t-card>
  </section>
</template>

<script setup lang="tsx">
// import { npcListRaw } from "@nsData/npcList"
// import { itemListRaw } from "@nsData/itemList"
// import { SettingIcon, SearchIcon } from "tdesign-icons-vue-next"

import type { TableRowData } from "tdesign-vue-next"

import tableTitleComponent from "@renderer/components/ns/tableTitleComponent.vue"
import { useNsSkillStore } from "@nsStore/index"
import { SkillTemplate, groupColumns } from "@data/ns/skill"
import { JobMap, SkillOptionMap, SkillTypeMap } from "@data/ns/skill"
import { JobFilter, SkillOptionFilter, SkillTypeFilter } from "@data/ns/skill"
import ColConfig from "@components/global/t-table-col-controler.vue"

const store = useNsSkillStore()
const data = ref([...store.data])

const loading = ref(false)
const maxHeight = ref(550)
const defaultColumns = ["index", "Skill Name", "SkillType1", "SkillOption1", "SkillValue1"]

const tableColumnsBase: {
  colKey: string
  title: string
  width?: string
  filter?: {}
  fixed?: string
}[] = [{ colKey: "index", title: "序号", width: "50" }]

const filterObj = {
  Job: JobFilter,
  SkillType1: Object.assign({ component: tableTitleComponent }, SkillTypeFilter),
  SkillType2: SkillTypeFilter,
  SkillOption1: SkillOptionFilter,
  SkillOption2: SkillOptionFilter,
}

/**
 * @description: 根据SkillTemplate替换表头字段为中文
 */
Object.keys(SkillTemplate).forEach((key) => {
  tableColumnsBase.push({
    colKey: key,
    title: SkillTemplate[key],
    filter: Object.hasOwn(filterObj, key) ? filterObj[key] : {},
  })
})

const tableColumns = ref(
  defaultColumns.map((colName) => {
    for (let index = 0; index < tableColumnsBase.length; index++) {
      if (colName == tableColumnsBase[index].colKey) {
        return tableColumnsBase[index]
      }
    }
    throw new Error(`Column "${colName}" not found in tableColumnsBase.`)
  }),
)

// const columns = computed(() => {
//   tableColumns.value.forEach(item=>{
//     if(Object.hasOwn(filterObj,item.colKey))
//   })
//   return tableColumns.value
// })

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

  await store.dataUpdateByApi()

  data.value = [...store.data]

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

const filterValue = ref({ Job: [] })
const onFilterChange = (filters, ctx) => {
  console.log("filter-change", filters, ctx)
  const newData = store.data.filter((item) => {
    let result = true
    if (filters.Job) {
      result = filters.Job.includes(item.Job)
    }

    if (filters.SkillType1) {
      result = filters.SkillType1.includes(item.SkillType1)
    }

    if (filters.SkillOption1) {
      result = filters.SkillOption1.includes(item.SkillOption1)
    }

    return result
  })
  console.log(newData.length)

  data.value = [...newData]
}

onMounted(() => {
  // 调用api获取技能信息
  dataInit()
})
</script>

<style lang="stylus">
/** 因为自带的筛选太长不会出现滚动条，这里强制出现滚动条 */
.ns__skill_table .t-checkbox-group{
  max-height 300px
  overflow-y scroll
}
</style>
