<template>
  <section :class="['npc__NpcParamsItem-container', 'flex flex-col gap-2']">
    <t-collapse v-model="currentPanel" borderless>
      <!-- 【攻击范围】 -->
      <t-collapse-panel
        value="攻击相关"
        header="攻击相关"
        :class="['collapse-style', 'text-black shadow-sm']"
      >
        <template #expandIcon>
          <c-icon-font class="text-xl" iconName="daochu" color="#31302d" />
        </template>
        <div :class="['npc__NpcParams-Item']">
          <div>
            <h3>
              <strong>伤害范围</strong>
              <span class="ml-2 text-ss">(Attack[*]Damage)</span>
            </h3>
            <p>设置NPC/怪物的大小大小攻击范围</p>
          </div>
          <div class="flex flex-col">
            <div class="flex gap-2">
              <t-input-number
                size="small"
                v-model="NpcData[selectNpcTable].AttackMinDamage"
                theme="normal"
                align="center"
                :max="NpcData[selectNpcTable].AttackMaxDamage"
                :min="0"
                :label="NpcInfoFieldName.AttackMinDamage.text"
                style="width: 80px"
              ></t-input-number>

              <strong> - </strong>

              <t-input-number
                size="small"
                v-model="NpcData[selectNpcTable].AttackMaxDamage"
                theme="normal"
                align="center"
                :max="NpcInfoFieldName.AttackMaxDamage.max"
                :min="NpcData[selectNpcTable].AttackMinDamage"
                :label="NpcInfoFieldName.AttackMaxDamage.text"
                style="width: 80px"
              ></t-input-number>
            </div>
            <div class="flex gap-2 py-1">
              <t-slider
                v-model="NpcData[selectNpcTable].AttackMinDamage"
                :max="NpcData[selectNpcTable].AttackMaxDamage"
                :min="0"
              />
              <strong> - </strong>
              <t-slider
                v-model="NpcData[selectNpcTable].AttackMaxDamage"
                :max="NpcInfoFieldName.AttackMaxDamage.max"
                :min="NpcData[selectNpcTable].AttackMinDamage"
              />
            </div>
          </div>
        </div>

        <!-- 【攻击相关】 -->
        <div v-for="(key, idx) of attackPraams" :key="idx" :class="['npc__NpcParams-Item']">
          <div>
            <h3>
              <strong>{{ NpcInfoFieldName[key].text }}</strong>
              <span class="ml-2 text-ss">({{ key }})</span>
            </h3>
            <p>{{ NpcInfoFieldName[key].tip }}</p>
          </div>

          <div class="flex items-center justify-end w-2/3 gap-3">
            <template v-if="NpcInfoFieldName[key].selectOptions">
              <t-select
                size="small"
                v-model="NpcData[selectNpcTable][key]"
                style="max-width: 80px"
                :options="NpcInfoFieldName[key].selectOptions"
                align="center"
              >
              </t-select>
            </template>
            <template v-else>
              <t-slider v-model="NpcData[selectNpcTable][key]" :max="NpcInfoFieldName[key].max" />
              <div class="px-2"></div>
              <t-input-number
                size="small"
                v-model="NpcData[selectNpcTable][key]"
                theme="normal"
                align="center"
                :max="NpcInfoFieldName[key].max"
                :min="0"
                style="max-width: 80px"
              ></t-input-number>
            </template>
          </div>
        </div>
      </t-collapse-panel>

      <!-- 【其他属性】 -->
      <t-collapse-panel
        value="其他属性"
        header="其他属性"
        :class="['collapse-style', 'text-black shadow-sm']"
      >
        <template #expandIcon>
          <c-icon-font class="text-xl" iconName="daochu" color="#31302d" />
        </template>
        <div v-for="(key, idx) of otherParams" :key="idx" :class="['npc__NpcParams-Item']">
          <div>
            <h3>
              <strong>{{ NpcInfoFieldName[key].text }}</strong>
              <span class="ml-2 text-ss">({{ key }})</span>
            </h3>
            <p>{{ NpcInfoFieldName[key].tip }}</p>
          </div>

          <div class="flex items-center justify-end w-2/3 gap-3">
            <template v-if="NpcInfoFieldName[key].selectOptions">
              <t-select
                v-model="NpcData[selectNpcTable][key]"
                style="max-width: 80px"
                size="small"
                :options="NpcInfoFieldName[key].selectOptions"
              >
              </t-select>
            </template>

            <template v-else>
              <t-slider v-model="NpcData[selectNpcTable][key]" :max="NpcInfoFieldName[key].max" />
              <t-input-number
                size="small"
                v-model="NpcData[selectNpcTable][key]"
                theme="normal"
                align="center"
                :max="NpcInfoFieldName[key].max"
                :min="0"
                style="max-width: 80px"
              ></t-input-number>
            </template>
          </div>
        </div>
      </t-collapse-panel>
    </t-collapse>
  </section>
</template>

<script setup lang="ts">
import { NpcInfoFieldName } from "../data/template"
import { selectNpcTable } from "../store/index"
import { NpcData } from "../store/data"

const currentPanel = ref(["攻击相关", "其他属性"])

const attackPraams = [
  "AttackSpeed",
  "AttackType",
  "AttackDistance",
  "DefenseDamage",
  "MoveSpeed",
  "MoveType",
  "LimitMoveScope",
]

const otherParams = ["Size", "Sight", "Region", "NpcGroup", "Attribute", "AttributeLevel"]

async function resetData(tableName: string, keyName: string) {
  console.log({ tableName, keyName })
}
</script>

<style lang="stylus">
/** 容器样式 */
.npc__NpcParamsItem-container {
  @apply whitespace-nowrap

  & h3{
    @apply text-sm
  }
}

/** 内部样式 */
.npc__NpcParams-Item {
  @apply flex flex-row justify-between items-center py-1 gap-2
}

.npc__NpcParamsItem-container .t-collapse-panel__content{
  @apply px-1 py-1
}
</style>
