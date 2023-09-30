<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-between gap-2 py-2">
      <div class="flex gap-2 flex-grow-[999]">
        <t-select
          size="small"
          style="max-width: 400px"
          v-model="currtNpcId"
          :options="NpcList"
          filterable
          :scroll="{ type: 'virtual', threshold: 20 }"
          :onChange="() => onNpcIdChange(currtNpcId)"
          :onFocus="(e) => console.log('当前：', e)"
        >
          <template #suffixIcon> <SearchIcon /> </template>
        </t-select>

        <t-button size="small" :onClick="() => onNpcIdChange(currtNpcId)">刷新</t-button>
      </div>

      <t-input-adornment prepend="编辑区高度">
        <t-input-number size="small" align="center" :step="50" v-model="NpcTabPanelHeight" />
      </t-input-adornment>
    </div>
    <codemirror
      v-model="NpcData['NpcDataParams'].Data"
      placeholder="Code goes here..."
      :style="{ height: `${NpcTabPanelHeight}px` }"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="4"
      :extensions="extensions"
      @ready="handleReady"
      @change="console.log('change', $event)"
      @focus="console.log('focus', $event)"
      @blur="console.log('blur', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { Codemirror } from "vue-codemirror"
import { lua } from "@codemirror/legacy-modes/mode/lua"
import { StreamLanguage } from "@codemirror/language"
import { SearchIcon } from "tdesign-icons-vue-next"

import { NpcData, updateNpcData } from "../store/data"
import { NpcList } from "../data/npcList"
import { NpcTabPanelHeight, isRequesting, currtNpcId } from "../store/index"
import { getNpcInfoById } from "@renderer/api/ns-api"

// import { json } from "@codemirror/lang-json"
// import { sql } from "@codemirror/lang-sql"

const extensions = [StreamLanguage.define(lua)]

//* 以下是【支持多种语言的写法】，暂时用不到 */
// 皮肤加载在extensions[1]的位置
// import { oneDark } from "@codemirror/theme-one-dark"
// const languageObj = {
//   lua: () => StreamLanguage.define(lua),
//   sql: sql,
//   json: json,
// }
// const currtLanguage = ref<keyof typeof languageObj>("json")
// const languageOptions = Object.keys(languageObj).map((item) => ({ label: item, value: item }))
// const extensions = computed(() => {
//   const new_extensions = []

//   new_extensions.push(languageObj[currtLanguage.value]())

//   return new_extensions
// })

// Codemirror EditorView instance ref
const view = shallowRef()
const handleReady = (payload) => {
  view.value = payload.view
}

// Status is available at all times via Codemirror EditorView
const getCodemirrorStates = () => {
  const state = view.value.state
  const ranges = state.selection.ranges
  const selected = ranges.reduce((r, range) => r + range.to - range.from, 0)
  const cursor = ranges[0].anchor
  const length = state.doc.length
  const lines = state.doc.lines

  console.log({ state, ranges, selected, cursor, length, lines })
}

async function onNpcIdChange(NpcId: number) {
  if (isRequesting.value) return // 这里请求中
  // 更新 data
  isRequesting.value = true
  const new_data = await getNpcInfoById(NpcId)

  if (new_data) await updateNpcData(new_data)

  setTimeout(() => (isRequesting.value = false), 1000)
}
</script>
