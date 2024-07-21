<template>
  <section :class="['flex flex-row gap-2 flex-grow-[999]', 'p-2']">
    <!-- 【左边】 -->
    <div :class="['flex-grow-[0]']" v-show="currtPannel != '事件编辑'">
      <div>
        <div :class="['flex justify-between', 'p-2']">
          <h2>
            名称:
            <strong>{{ NpcData[selectNpcTable].NpcName }}</strong>
          </h2>
          <span
            >NpcId: <strong class="text-red-500">{{ NpcData[selectNpcTable].NpcId }}</strong></span
          >
        </div>
      </div>

      <div :class="['flex flex-col flex-grow-[999] gap-4', 'h-full', 'p-3']">
        <div class="rouned-md">
          <img :class="['w-[220px] h-[220px] bg-green-300 rouned-md']" />

          <NpcBaseInfo />

          <div :class="['flex flex-col w-full']">
            <div :class="['flex flex-col']">
              <t-divider class=""> <strong> NPC/怪物选择</strong></t-divider>

              <div class="flex flex-col gap-2">
                <t-select
                  :loading="isRequesting"
                  v-model="currtNpcId"
                  :options="NpcList"
                  filterable
                  :scroll="{ type: 'virtual', threshold: 20 }"
                  :change="onNpcIdChange"
                  :onFocus="
                    (e) => {
                      console.log('当前：', e)
                    }
                  "
                >
                  <template #suffixIcon> <SearchIcon /> </template>
                </t-select>
                <div class="flex gap-1">
                  <t-button size="small">{{ "<" }}</t-button>
                  <t-button
                    size="small"
                    :class="['flex-grow-[999]']"
                    theme="success"
                    @click="onNpcIdChange(currtNpcId)"
                  >
                    <template #icon>
                      <c-icon-font :v-show="isRequesting" iconName="huifu"></c-icon-font
                    ></template>
                    <span class="ml-2">刷新</span>
                  </t-button>
                  <t-button size="small">{{ ">" }}</t-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div :class="['flex-col justify-between items-center', 'gap-2', 'max-w-[820px]']">
          <!-- <t-divider class=""><strong>表格选择</strong></t-divider> -->
          <div class="flex items-center justify-between py-2">
            <h4>双表同步修改</h4>
            <t-switch size="large" v-model="updateWithBothTable">
              <template v-slot:label="slotProps">{{ slotProps.value ? "开" : "关" }}</template>
            </t-switch>
          </div>
          <t-button
            variant="outline"
            @click="
              () => {
                selectNpcTable = selectNpcTable == 'NpcParams' ? 'NpcParams2' : 'NpcParams'
              }
            "
            size="small"
            theme="primary"
            style="width: 100%"
            ><strong>NPC表格：</strong>{{ selectNpcTable }}</t-button
          >
          <div class="py-2">
            <t-button
              size="small"
              variant="outline"
              style="width: 100%"
              @click="
                () => {
                  selectDropTable =
                    selectDropTable == 'NpcDropItemParams'
                      ? 'NpcDropItemParams2'
                      : 'NpcDropItemParams'
                }
              "
              theme="primary"
              ><strong>掉落物表格：</strong>{{ selectDropTable }}</t-button
            >
          </div>
        </div>
      </div>
    </div>

    <!-- 【右边】 -->
    <div :class="['flex-grow-[2]']">
      <section :loading="loading">
        <t-tabs v-model="currtPannel" theme="normal" size="medium" :onChange="loadingWait">
          <t-tab-panel value="基础属性" label="基础属性">
            <NpcParams />
          </t-tab-panel>

          <t-tab-panel value="掉落配置" label="掉落配置">
            <NpcDrop />
          </t-tab-panel>

          <t-tab-panel value="事件编辑" label="事件编辑">
            <NpcScriptEditor />
          </t-tab-panel>
        </t-tabs>
      </section>

      <div class="flex gap-2 py-2">
        <t-button class="flex-grow-[1]" theme="success" @click="updateBtn">
          <template #icon>
            <c-icon-font class="mr-2 text-md" iconName="huifu" />
          </template>
          更新数据
        </t-button>
        <t-button class="flex-grow-[1]" theme="danger">
          恢复默认
          <template #suffix>
            <c-icon-font class="text-md" iconName="huifu" :rotate="180" />
          </template>
        </t-button>
      </div>
    </div>
  </section>
</template>

<script setup lang="tsx">
import { SearchIcon } from "tdesign-icons-vue-next"

import NpcBaseInfo from "./NpcBaseInfo.vue"
import NpcParams from "./NpcParams.vue"
import NpcDrop from "./NpcDrop.vue"
import NpcScriptEditor from "./NpcScriptEditor.vue"

import { getNpcInfoById, updateNpcInfoById } from "@renderer/api/ns-api"

import { updateWithBothTable } from "../store/index"
import { selectNpcTable, selectDropTable, isRequesting, currtNpcId } from "../store/index"
import { NpcData, updateNpcData } from "../store/data"

import { NpcList } from "@nsData/npcList"

const currtPannel = ref("基础属性")
const loading = ref(false)

const loadingWait = () => {
  console.log("loadingWait...")
  if (loading.value) return
  loading.value = true
  setTimeout(() => (loading.value = false), 300)

  console.log(currtPannel.value)
}

async function onNpcIdChange(NpcId: number) {
  if (isRequesting.value) return // 这里请求中
  // 更新 data
  isRequesting.value = true
  const new_data = await getNpcInfoById(NpcId)

  if (new_data) await updateNpcData(new_data)

  setTimeout(() => (isRequesting.value = false), 1000)
}

async function updateBtn() {
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

  updateNpcInfoById(currtNpcId.value, NpcData["NpcParams"], "NpcParams", false)
  updateNpcInfoById(currtNpcId.value, NpcData["NpcParams2"], "NpcParams2", false)
  updateNpcInfoById(currtNpcId.value, NpcData["NpcDropItemParams"], "NpcDropItemParams", false)
  updateNpcInfoById(currtNpcId.value, NpcData["NpcDropItemParams2"], "NpcDropItemParams2", false)
  updateNpcInfoById(currtNpcId.value, NpcData["NpcDataParams"], "NpcDataParams", false)
}
</script>
