<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-end py-2">
      <t-input-adornment prepend="表格高度">
        <t-input-number :step="50" v-model="NpcTabPanelHeight" />
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
    <div class="flex w-full gap-2 py-2">
      <t-select :optons="[]">常用MSG</t-select>
      <t-select :optons="[]">常用方法</t-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Codemirror } from "vue-codemirror"
import { StreamLanguage } from "@codemirror/language"
import { lua } from "@codemirror/legacy-modes/mode/lua"
import { NpcTabPanelHeight } from "../store/index"
import { NpcData } from "../store/data"
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
</script>

<style scoped></style>
