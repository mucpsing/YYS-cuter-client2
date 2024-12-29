<!--
 * @Author: Capsion 373704015@qq.com
 * @Date: 2024-12-27 21:09:01
 * @LastEditors: Capsion 373704015@qq.com
 * @LastEditTime: 2024-12-28 22:31:11
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\TyphoonUI\_components\TyphoonTable.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <t-card :title="tableTitle">
    <t-base-table
      :class="['rounded-md']"
      :pagination="pagination"
      size="small"
      row-key="index"
      :data="data"
      :columns="columns"
    ></t-base-table>
  </t-card>
</template>

<script setup lang="ts">
import { type TableProps } from "tdesign-vue-next"
import { useTyphoonFileStore, type DataObjItemT } from "@Typhoon/store"
import { TyphoonDataItemColumns } from "@Typhoon/_components/DataTable/TableColumns"

const tableTitle = ref("台风列表")

const fileStore = useTyphoonFileStore()

// 展示错了，
const columns = ref([
  // { colKey: "分类标志", title: "分类标志", width: "80" },
  { colKey: "英文名称", title: "英文名称", width: "120" },
  { colKey: "国际编号", title: "国际编号", width: "80" },
  { colKey: "路径记录", title: "路径记录", width: "80" },
  { colKey: "热带低压", title: "热带低压", width: "80" },
  { colKey: "热带气旋", title: "热带气旋", width: "80" },
  { colKey: "终结记录", title: "终结记录", width: "80" },
  { colKey: "路径间隔", title: "路径间隔", width: "80" },
  { colKey: "生成日期", title: "生成日期", width: "120" },
])

const pagination: TableProps["pagination"] = {
  defaultCurrent: 1,
  defaultPageSize: 5,
  total: 0,
  size: "small",
}

const data = computed(() => {
  const res = [] as DataObjItemT[]
  fileStore.currtFileMd5.forEach((md5) => {
    res.push(...fileStore.fileObj[md5].parserData)
  })
  pagination.total = res.length
  tableTitle.value = `台风列表(${res.length})`
  return res
})

onMounted(() => {
  console.log(fileStore.currtTpyhoonDataList)
})
</script>

<style scoped></style>
