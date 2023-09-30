export type ItemTableName = "ItemParams" | "ItemExtParams"

export interface ItemDataType {
  ItemId: number
  ItemParams: ItemParamsTable | {}
  ItemExtParams: ItemExtParamsTable | {}
}

export interface ItemExtParamsTable {
  ItemId: number
  Description_kor: string
  Description: string
  Seq: number
  AttackMinDamage: number
  AttackMaxDamage: number
  Param01: number
  Value01: number
  Param02: number
  Value02: number
  Param03: number
  Value03: number
  Param04: number
  Value04: number
  Param05: number
  Value05: number
  Param06: number
  Value06: number
  Param07: number
  Value07: number
  Param08: number
  Value08: number
  Param09: number
  Value09: number
  Param10: number
  Value10: number
}

export interface ItemParamsTable {
  ItemId: number
  ItemName_kor: string
  ItemName: string
  Gold: number
  Rare: number
  Kind: number
  Type: number
  LimitLevel: number
  LimitRace: number
  LimitJob01: number
  LimitJob02: number
  LimitJob03: number
  LimitJob04: number
  EquipmentPart: number
  AttackMinDamage: number
  AttackMaxDamage: number
  AttackSpeed: number
  AttackDistance: number
  DefenseDamage: number
  QuestId: number
  Param01: number
  Value01: number
  Param02: number
  Value02: number
  Param03: number
  Value03: number
  Param04: number
  Value04: number
  Param05: number
  Value05: number
  Param06: number
  Value06: number
  Param07: number
  Value07: number
  Param08: number
  Value08: number
  Param09: number
  Value09: number
  Param10: number
  Value10: number
}
