<template>
  <section :class="['flex flex-row gap-2 flex-grow-[999]', 'pt-2 px-4']">
    <!-- 【左边】 -->
    <div :class="['bg-red-200', 'flex-grow-[0]']">
      <!--  -->
      <div :class="['flex flex-col justify-between items-center', 'h-full p-4']">
        <div class="rouned-md flex-grow-[1]">
          <img src="" alt="" :class="['min-w-[300px] min-h-[300px] bg-green-300 rouned-md']" />
          <div :class="['flex flex-row justify-between', ' mb-2 py-2']">
            <h2>{{ currtNpcName }}</h2>
            <span>NpcId: {{ currtNpcId }}</span>
          </div>

          <div class="py-2"></div>

          <div class="flex flex-col gap-2 whitespace-nowrap">
            <div :class="['flex justify-between items-center', 'gap-4']">
              <h3>
                <strong>{{ NpcInfoFieldName.Hp }}</strong>
              </h3>
              <t-slider v-model="NpcInfo.Hp" />
              <t-input v-model="NpcInfo.Hp" class="w-[40px]" placeholder=""></t-input>
            </div>

            <div :class="['flex justify-between items-center', 'gap-4']">
              <h3>
                <strong>{{ NpcInfoFieldName.Str }}</strong>
              </h3>
              <t-slider v-model="NpcInfo.Str" />
              <span>{{ NpcInfo.Str }}</span>
            </div>

            <div :class="['flex justify-between items-center', 'gap-4']">
              <h3>
                <strong>{{ NpcInfoFieldName.Dex }}</strong>
              </h3>
              <t-slider v-model="NpcInfo.Dex" />
              <span>{{ NpcInfo.Dex }}</span>
            </div>

            <div :class="['flex justify-between items-center', 'gap-4']">
              <h3>
                <strong>{{ NpcInfoFieldName.Con }}</strong>
              </h3>
              <t-slider v-model="NpcInfo.Con" />
              <span>{{ NpcInfo.Con }}</span>
            </div>

            <div :class="['flex justify-between items-center', 'gap-4']">
              <h3>
                <strong>{{ NpcInfoFieldName.Int }}</strong>
              </h3>
              <t-slider v-model="NpcInfo.Int" />
              <span>{{ NpcInfo.Int }}</span>
            </div>
          </div>
        </div>

        <div :class="['flex flex-col w-full']">
          <div :class="['flex flex-col']">
            <t-divider class=""><strong>NPC/怪物选择</strong></t-divider>
            <t-select v-model="currtNpcId" :options="npcOptions" placeholder="请选择" filterable />
          </div>
        </div>
      </div>
    </div>

    <!-- 【右边】 -->
    <div :class="['bg-red-400', 'flex-grow-[2]']">
      <div>
        <t-tabs v-model="currtPannel" theme="normal" size="large">
          <t-tab-panel
            v-for="(data, idx) of panelList"
            :key="idx"
            :value="data.label"
            :label="data.label"
          >
            <div class="p-2">{{ data }}</div>
          </t-tab-panel>
        </t-tabs>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { NpcInfoFieldName } from "../data/template"

const NpcInfo = reactive({
  Hp: 200,
  Str: 50,
  Dex: 20,
  Int: 20,
  Con: 30,
})

const currtNpcId = ref(0)
const currtNpcName = ref("NPC/怪物名称")

const npcList = [
  { label: "未选择", value: 0 },
  { label: "NPC名称1<ID>", value: 1000 },
  { label: "NPC名称2<ID>", value: 5121 },
]
const monsterList = [
  { label: "怪物名称1<ID>", value: 1000 },
  { label: "怪物名称2<ID>", value: 5121 },
]

const npcOptions = [
  { group: "NPC 列表(90)", children: npcList },
  { group: "怪物列表(20)", children: monsterList },
]

const currtPannel = ref("基础属性")
const panelList = ref([{ label: "基础属性" }, { label: "掉落配置" }, { label: "事件编辑" }])

let id = 0
// const addTab = () => {
//   panelList.value.push({
//     value: `${id}`,
//     label: `新选项卡${id}`,
//     removable: true,
//     content: "新选项卡内容",
//   })
//   currtPannel.value = `${id}`
//   id += 1
// }

// const removeTab = ({ value: val, index }) => {
//   if (index < 0) return false
//   panelList.value.splice(index, 1)
//   if (panelList.value.length === 0) return
//   if (currtPannel.value === val) {
//     currtPannel.value = panelList.value[Math.max(index - 1, 0)].value
//   }
// }
</script>
