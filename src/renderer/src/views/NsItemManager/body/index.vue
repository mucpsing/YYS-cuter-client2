<template>
  <section
    :class="['flex flex-col gap-2 flex-grow-[999] p-2', 'bg-slate-300', 'whitespace-nowrap']"
  >
    <!-- 【上边】 -->
    <div :class="['flex flex-grow-[1] gap-2', 'w-full', 'bg-red-200']">
      <div :class="['flex justify-center items-center flex-grow-[1] p-2']">
        <img src="" class="w-full h-full bg-green-200" alt="" />
      </div>

      <div :class="['flex flex-grow-[2]', 'bg-green-200']"></div>
    </div>

    <!-- 【下边】 -->
    <div :class="['flex-grow-[2]', 'w-full', 'bg-red-200']">
      <t-card>
        <t-table
          hover
          bordered
          resizable
          size="small"
          :data="tableData"
          :columns="tableColumns"
          rowKey="index"
          paginationAffixedBottom
          lazyLoad
        >
          <!-- 【附件属性】 -->
          <template #paramId="{ row }">
            <div class="flex gap-2">
              <t-select
                v-model="ItemData[currtItemTable][row.itemId]"
                :options="[{ label: '未选择', value: 0 }]"
                filterable
                :defaultValue="ItemData[currtItemTable][row.itemId]"
                :scroll="{ type: 'virtual' }"
                style="width: 300px"
              />

              <t-link
                theme="success"
                hover="color"
                @click="updateRow(row.itemId, ItemData[currtItemTable][row.itemId], currtItemTable)"
              >
                更新
              </t-link>

              <!-- <t-link theme="danger" hover="color" @click="cleanRow(row)"> 清空 </t-link> -->
            </div>
          </template>
        </t-table>
      </t-card>
    </div>
  </section>
</template>

<script setup lang="tsx">
import { ItemData } from "../store/data"
import { SearchIcon } from "tdesign-icons-vue-next"
import { ItemTableName } from "../types"
import { getItemInfoById } from "@renderer/api/ns-api"

const currtItemTable = ref<ItemTableName>("ItemParams")
// const ItemTabPanelHeight = ref(800)
const tableColumns = [
  // { colKey: "id", title: "序号", width: "40" },
  { colKey: "paramId", title: "装备属性", width: "260" },
  { colKey: "valueId", title: "属性值", width: "200" },
]

const tableData = computed(() => {
  if (Object.keys(ItemData[currtItemTable.value]).length == 0) return []

  console.log(ItemData[currtItemTable.value])

  return new Array(10).fill(1).map((_v, i) => {
    i += 1
    if (i.toString().length < 2) {
      return {
        paramId: `Param0${i}`,
        valueId: `Value0${i}`,
        id: `0${i}`,
      }
    } else {
      return {
        paramId: `Param${i}`,
        valueId: `Value${i}`,
        id: `${i}`,
      }
    }
  })
})

async function updateBtn() {
  console.log(updateBtn)
  // let table_name: NpcTableName
  // switch (currtPannel.value) {
  //   case "基础属性":
  //     table_name = selectNpcTable.value
  //     break
  //   case "掉落配置":
  //     table_name = selectDropTable.value
  //     break
  //   default:
  //     return
  // }
  // const res = await updateNpcInfoById(currtNpcId.value, NpcData[table_name], table_name, false)
  // console.log("整体更新结果: ", res)

  // updateNpcInfoById(currtNpcId.value, NpcData["NpcParams"], "NpcParams", false)
  // updateNpcInfoById(currtNpcId.value, NpcData["NpcParams2"], "NpcParams2", false)
  // updateNpcInfoById(currtNpcId.value, NpcData["NpcDropItemParams"], "NpcDropItemParams", false)
  // updateNpcInfoById(currtNpcId.value, NpcData["NpcDropItemParams2"], "NpcDropItemParams2", false)
  // updateNpcInfoById(currtNpcId.value, NpcData["NpcDataParams"], "NpcDataParams", false)
}
</script>
