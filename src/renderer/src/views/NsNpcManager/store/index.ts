import { NpcData, type NpcDataKeysType } from "../store/data"
import type { NpcParamTable, NpcDropTable } from "../../../../../types/npc"

export const tableList = [
  { label: "表1", value: "NpcParams" },
  { label: "表2", value: "NpcParams2" },
]
export const tableIndex = ref(0)

export const selectNpcTable = ref<NpcParamTable>("NpcParams")

export const selectDropTable = ref<NpcDropTable>("NpcDropItemParams")

export const isRequesting = ref(false)

export const currtNpcId = ref(1000)

export const updateWithBothTable = ref(false)

export const NpcTabPanelHeight = ref(550)
