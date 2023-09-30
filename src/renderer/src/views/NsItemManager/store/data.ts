import type { ItemDataType } from "../../../../../types/item"

const ItemDataRaw = {
  ItemId: 0,
  ItemParams: {},
  ItemExtParams: {},
}

export const ItemData = reactive<ItemDataType>(ItemDataRaw)
