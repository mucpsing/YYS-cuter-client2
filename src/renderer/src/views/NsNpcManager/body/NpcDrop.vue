<template>
  <section :class="['flex flex-col gap-2 flex-grow-[99]']">
    <!-- 按钮操作区域 -->
    <div class="flex justify-end py-2">
      <t-input-adornment prepend="表格高度">
        <t-input-number size="small" align="center" :step="50" v-model="NpcTabPanelHeight" />
      </t-input-adornment>
    </div>

    <!-- 表格分页 :pagination="pagination" -->
    <t-table
      hover
      bordered
      resizable
      size="small"
      :height="NpcTabPanelHeight"
      paginationAffixedBottom
      rowKey="index"
      :columns="tableColumns"
      :data="tableData"
      lazyLoad
      :onPageChange="onPageChange"
    >
      <template #footerSummary>
        <div class="flex items-center gap-1">
          <div>
            <t-input-adornment prepend="金币" v-if="NpcData[selectDropTable]">
              <t-input-number
                v-model="NpcData[selectDropTable].Gold"
                size="small"
                theme="normal"
                placeholder="请输入内容"
                align="center"
                style="width: 90px"
              />
            </t-input-adornment>
          </div>
          <div>
            <t-input-adornment prepend="蒸汽">
              <t-input-number
                v-model="NpcData[selectNpcTable].Ns"
                size="small"
                align="center"
                theme="normal"
                style="width: 90px"
                placeholder="请输入内容"
              />
            </t-input-adornment>
          </div>
          <div>
            <t-input-adornment prepend="经验">
              <t-input-number
                v-model="NpcData[selectNpcTable].Exp"
                align="center"
                theme="normal"
                size="small"
                style="width: 90px"
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
            size="small"
            v-model="NpcData[selectDropTable][row.itemId]"
            :options="itemListSelectOptions"
            filterable
            :defaultValue="NpcData[selectDropTable][row.itemId]"
            :scroll="{ type: 'virtual' }"
            style="width: 250px"
          />

          <!-- <t-link
            theme="success"
            hover="color"
            @click="updateRow(row.itemId, NpcData[selectDropTable][row.itemId], selectDropTable)"
          >
            更新
          </t-link> -->

          <!-- <t-link theme="danger" hover="color" @click="cleanRow(row)"> 清空 </t-link> -->
        </div>
      </template>

      <!-- 【掉落概率】 -->
      <template #pro="{ row }">
        <t-input-number
          size="small"
          type="number"
          style="width: 120px"
          align="center"
          v-model="NpcData[selectDropTable][row.pro]"
          placeholder="请输入内容"
        />
        <span class="px-1"></span>

        <!-- <t-link
          theme="primary"
          hover="color"
          @click="updateRow(row.pro, NpcData[selectDropTable][row.pro], selectDropTable)"
        >
          更新
        </t-link>
        <span class="px-1"></span>
        <t-link theme="danger" hover="color" @click="cleanRow(row)"> 清空 </t-link> -->
      </template>

      <template #edit="{ row }">
        <t-link
          theme="primary"
          hover="color"
          size="small"
          @click="updateRow(row.pro, NpcData[selectDropTable][row.pro], selectDropTable)"
        >
          更新
        </t-link>
        <span class="px-1"></span>
        <t-link size="small" theme="danger" hover="color" @click="cleanRow(row)"> 清空 </t-link>
      </template>
    </t-table>
  </section>
</template>

<script setup lang="ts">
import { itemListRaw } from "../data/itemList"
import { NpcData } from "../store/data"
import { selectDropTable, selectNpcTable, currtNpcId, NpcTabPanelHeight } from "../store/index"
import { updateNpcInfoById } from "@renderer/api/ns-api"
import type { NpcTableName } from "../types"

const itemListSelectOptions = itemListRaw
  .map((item, idx) => ({
    label: `${item.ItemId}_${item.ItemName}`,
    value: item.ItemId,
    index: idx + 1,
  }))
  .sort((a, b) => a.value - b.value)
itemListSelectOptions.push({ label: "0000000_无掉落", index: 0, value: 0 })

async function updateRow(key, value, table_name: NpcTableName) {
  const res = await updateNpcInfoById(currtNpcId.value, { [key]: value }, table_name)

  console.log("updateRow: ", res)
}

function cleanRow(row) {
  NpcData[selectDropTable.value][row.pro] = 0
  NpcData[selectDropTable.value][row.itemId] = 0
}

const tableColumns = [
  { colKey: "id", title: "序号", width: "30" },
  { colKey: "itemId", title: "掉落物品", width: "180" },
  { colKey: "pro", title: "掉落概率", width: "100" },
  // { colKey: "edit", title: "操作", width: "40" },
]

// const count = computed(() => (selectDropTable.value == "NpcDropItemParams" ? 24 : 48))

const tableData = computed(() => {
  if (!NpcData[selectDropTable.value]) return []
  const count = selectDropTable.value == "NpcDropItemParams" ? 24 : 48
  const res = new Array(count).fill(1).map((_v, i) => {
    i += 1
    if (i.toString().length < 2) {
      return {
        pro: `Pro0${i}`,
        itemId: `ItemId0${i}`,
        id: `0${i}`,
      }
    } else {
      return {
        pro: `Pro${i}`,
        itemId: `ItemId${i}`,
        id: `${i}`,
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
../npc
