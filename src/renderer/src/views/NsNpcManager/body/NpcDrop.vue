<template>
  <section :class="['flex flex-col gap-2 flex-grow-[99]']">
    <!-- 按钮操作区域 -->
    <div class="flex justify-end py-2">
      <t-input-adornment prepend="表格高度">
        <t-input-number :step="50" v-model="tableH" />
      </t-input-adornment>
    </div>

    <!-- 表格分页 :pagination="pagination" -->
    <t-table
      hover
      bordered
      resizable
      size="small"
      :height="tableH"
      paginationAffixedBottom
      rowKey="index"
      :columns="tableColumns"
      :data="tableData"
      lazyLoad
      :onPageChange="onPageChange"
    >
      <template #footerSummary>
        <div class="flex items-center gap-2 t-table__row-filter-inner">
          <div>
            <t-input-adornment prepend="掉落金币" v-if="NpcData[selectDropTable]">
              <t-input-number
                v-model="NpcData[selectDropTable].Gold"
                theme="normal"
                placeholder="请输入内容"
                style="width: 110px"
              />
            </t-input-adornment>
          </div>
          <div>
            <t-input-adornment prepend="掉落蒸汽">
              <t-input-number
                v-model="NpcData[selectNpcTable].Ns"
                theme="normal"
                style="width: 110px"
                placeholder="请输入内容"
              />
            </t-input-adornment>
          </div>
          <div>
            <t-input-adornment prepend="掉落经验">
              <t-input-number
                v-model="NpcData[selectNpcTable].Exp"
                theme="normal"
                style="width: 110px"
                placeholder="请输入内容"
              />
            </t-input-adornment>
          </div>
        </div>
      </template>

      <!-- 【掉落物品】 -->
      <template #itemId="{ row }">
        <div class="flex gap-2">
          <t-select
            v-model="NpcData[selectDropTable][row.itemId]"
            :options="itemListSelectOptions"
            filterable
            :defaultValue="NpcData[selectDropTable][row.itemId]"
            :scroll="{ type: 'virtual' }"
            style="width: 300px"
          />
          <t-button
            variant="outline"
            theme="success"
            @click="updateRow(row.itemId, NpcData[selectDropTable][row.itemId], selectDropTable)"
          ></t-button>
          <t-button variant="outline" theme="danger"></t-button>
        </div>
      </template>

      <!-- 【掉落概率】 -->
      <template #pro="{ row }">
        <t-input-number
          type="number"
          v-model="NpcData[selectDropTable][row.pro]"
          placeholder="请输入内容"
        />
        <span class="px-1"></span>

        <t-link
          theme="primary"
          hover="color"
          @click="updateRow(row.pro, NpcData[selectDropTable][row.pro], selectDropTable)"
        >
          更新
        </t-link>
        <span class="px-1"></span>
        <t-link theme="danger" hover="color" @click="cleanRow(row)"> 清空 </t-link>
      </template>
    </t-table>
  </section>
</template>

<script setup lang="ts">
import { itemListSelectOptions } from "../data/itemList"
import { NpcData } from "../store/data"
import { selectDropTable, selectNpcTable, currtNpcId } from "../store/index"
import { updateNpcInfoById } from "../croe/api"
import type { NpcTableName } from "../types"

const count = computed(() => (selectDropTable.value == "NpcDropItemParams" ? 24 : 48))
const tableH = ref(850)

async function updateRow(key, value, table_name: NpcTableName) {
  const res = await updateNpcInfoById(currtNpcId.value, { [key]: value }, table_name)

  console.log("updateRow: ", res)
}
function cleanRow(row) {
  NpcData[selectDropTable.value][row.pro] = 0
  NpcData[selectDropTable.value][row.itemId] = 0
}

const tableColumns = [
  { colKey: "id", title: "序号", width: "60" },
  { colKey: "itemId", title: "掉落物品", width: "300" },
  { colKey: "pro", title: "掉落概率", width: "200" },
  // { colKey: "edit", title: "操作", width: "60" },
]

const tableData = computed(() => {
  if (!NpcData[selectDropTable.value]) return []
  const res = new Array(count.value).fill(1).map((_v, i) => {
    i += 1
    if (i.toString().length < 2) {
      return {
        pro: `Pro0${i}`,
        itemId: `ItemId0${i}`,
        id: `掉落0${i}`,
      }
    } else {
      return {
        pro: `Pro${i}`,
        itemId: `ItemId${i}`,
        id: `掉落${i}`,
      }
    }
  })
  return res
})

const pagination = { current: 1, pageSize: 50, total: tableData.value.length, showJumper: false }

async function onPageChange(pageInfo) {
  pagination.current = pageInfo.current
  pagination.pageSize = pageInfo.pageSize
}

onMounted(() => {})
</script>

<style scoped></style>
