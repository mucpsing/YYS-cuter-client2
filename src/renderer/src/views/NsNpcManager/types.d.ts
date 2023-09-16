export type NpcParamTable = "NpcParams" | "NpcParams2"
export type NpcDropTable = "NpcDropItemParams" | "NpcDropItemParams2"
export type NpcTableName = NpcParamTable | NpcDropTable

export interface NpcInfo {
  NpcId: number
  NpcLusScript?: any
  NpcName: string
  NpcParams: NpcParams
  NpcParams2: NpcParams
  NpcDropItemParams: NpcDropItemParams | {}
  NpcDropItemParams2: NpcDropItemParams | {}
}

export interface NpcParams {
  AttackDistance: number
  AttackMaxDamage: number
  AttackMinDamage: number
  AttackSpeed: number
  AttackType: number
  Attribute?: number
  AttributeLevel?: number
  Con: number
  DefenseDamage: number
  Dex: number
  Exp: number
  Hp: number
  Int: number
  Level: number
  LimitMoveScope: number
  MoveSpeed: number
  MoveType: number
  NpcGroup: number
  NpcId: number
  NpcName: string
  NpcName_kor: string
  Ns: number
  Region: number
  Rs: number
  Sight: number
  Size: number
  SkillGroup: number
  Str: number
}

export interface NpcDropItemParams {
  NpcId: number
  Gold: number
  Pro01: number
  Pro02: number
  Pro03: number
  Pro04: number
  Pro05: number
  Pro06: number
  Pro07: number
  Pro08: number
  Pro09: number
  Pro10: number
  Pro11: number
  Pro12: number
  Pro13: number
  Pro14: number
  Pro15: number
  Pro16: number
  Pro17: number
  Pro18: number
  Pro19: number
  Pro20: number
  Pro21: number
  Pro22: number
  Pro23: number
  Pro24: number
  ItemId01: number
  ItemId02: number
  ItemId03: number
  ItemId04: number
  ItemId05: number
  ItemId06: number
  ItemId07: number
  ItemId08: number
  ItemId09: number
  ItemId10: number
  ItemId11: number
  ItemId12: number
  ItemId13: number
  ItemId14: number
  ItemId15: number
  ItemId16: number
  ItemId17: number
  ItemId18: number
  ItemId19: number
  ItemId20: number
  ItemId21: number
  ItemId22: number
  ItemId23: number
  ItemId24: number
  ItemId25?: number
  ItemId26?: number
  ItemId27?: number
  ItemId28?: number
  ItemId29?: number
  ItemId30?: number
  ItemId31?: number
  ItemId32?: number
  ItemId33?: number
  ItemId34?: number
  ItemId35?: number
  ItemId36?: number
  ItemId37?: number
  ItemId38?: number
  ItemId39?: number
  ItemId40?: number
  ItemId41?: number
  ItemId42?: number
  ItemId43?: number
  ItemId44?: number
  ItemId45?: number
  ItemId46?: number
  ItemId47?: number
  ItemId48?: number
  Pro25?: number
  Pro26?: number
  Pro27?: number
  Pro28?: number
  Pro29?: number
  Pro30?: number
  Pro31?: number
  Pro32?: number
  Pro33?: number
  Pro34?: number
  Pro35?: number
  Pro36?: number
  Pro37?: number
  Pro38?: number
  Pro39?: number
  Pro40?: number
  Pro41?: number
  Pro42?: number
  Pro43?: number
  Pro44?: number
  Pro45?: number
  Pro46?: number
  Pro47?: number
  Pro48?: number
}
