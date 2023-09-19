import type { ItemDataType } from "../types"

const ItemDataRaw = {
  ItemId: 0,
  ItemParams: {},
  ItemExtParams: {},
}

export const ItemData = reactive<ItemDataType>(ItemDataRaw)
