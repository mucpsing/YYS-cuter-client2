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
    <div :class="['flex-grow-[2]', 'w-full', 'bg-red-200']"></div>
  </section>
</template>

<script setup lang="tsx">
import { SearchIcon } from "tdesign-icons-vue-next"

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
