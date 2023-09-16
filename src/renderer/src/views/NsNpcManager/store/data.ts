import type { NpcInfo } from "../types"

const NpcDataRaw = {
  NpcId: 8888,
  NpcName: "特卢克族贤者",
  NpcLusScript: "",
  NpcDataParams: { NpcId: 8888, Data: "", Data_CN: "" },
  NpcParams: {
    NpcId: 8888,
    Region: 0,
    NpcName_kor: "트루크 현자",
    NpcName: "特卢克族贤者",
    NpcGroup: 7,
    Level: 79,
    Exp: 47660,
    Ns: 69,
    Hp: 37933,
    Str: 196,
    Con: 169,
    Dex: 101,
    Int: 166,
    Rs: 715,
    Sight: 120,
    Size: 10,
    AttackMinDamage: 202,
    AttackMaxDamage: 212,
    AttackSpeed: 15,
    AttackDistance: 160,
    DefenseDamage: 316,
    AttackType: 2,
    MoveType: 0,
    MoveSpeed: 50,
    SkillGroup: 15,
    LimitMoveScope: 250,
  },
  NpcParams2: {
    NpcId: 8888,
    Region: 0,
    NpcName_kor: "트루크 현자",
    NpcName: "特卢克族贤者",
    NpcGroup: 7,
    Level: 79,
    Exp: 32172,
    Ns: 69,
    Hp: 26553,
    Str: 196,
    Con: 169,
    Dex: 101,
    Int: 166,
    Rs: 715,
    Sight: 120,
    Size: 10,
    AttackMinDamage: 202,
    AttackMaxDamage: 212,
    AttackSpeed: 15,
    AttackDistance: 160,
    DefenseDamage: 316,
    AttackType: 2,
    MoveType: 0,
    MoveSpeed: 50,
    SkillGroup: 15,
    LimitMoveScope: 250,
    Attribute: 0,
    AttributeLevel: 0,
  },
  NpcDropItemParams: {
    NpcId: 8888,
    Gold: 14150,
    Pro01: 66820,
    ItemId01: 24700,
    Pro02: 53900,
    ItemId02: 24611,
    Pro03: 88440,
    ItemId03: 20563,
    Pro04: 56600,
    ItemId04: 21008,
    Pro05: 70750,
    ItemId05: 21266,
    Pro06: 64850,
    ItemId06: 16927,
    Pro07: 0,
    ItemId07: 0,
    Pro08: 0,
    ItemId08: 0,
    Pro09: 64850,
    ItemId09: 24700,
    Pro10: 390,
    ItemId10: 8456,
    Pro11: 420,
    ItemId11: 12307,
    Pro12: 500,
    ItemId12: 13582,
    Pro13: 590,
    ItemId13: 17160,
    Pro14: 100,
    ItemId14: 8519,
    Pro15: 120,
    ItemId15: 13648,
    Pro16: 70,
    ItemId16: 12621,
    Pro17: 64850,
    ItemId17: 24700,
    Pro18: 100,
    ItemId18: 8487,
    Pro19: 80,
    ItemId19: 8999,
    Pro20: 150,
    ItemId20: 13358,
    Pro21: 150,
    ItemId21: 12588,
    Pro22: 80,
    ItemId22: 20806,
    Pro23: 120,
    ItemId23: 20805,
    Pro24: 418640,
    ItemId24: 24730,
  },
  NpcDropItemParams2: {
    NpcId: 8888,
    Gold: 7075,
    Pro01: 2500,
    ItemId01: 24700,
    Pro02: 2500,
    ItemId02: 24611,
    Pro03: 2500,
    ItemId03: 20563,
    Pro04: 2500,
    ItemId04: 21008,
    Pro05: 2500,
    ItemId05: 21289,
    Pro06: 2500,
    ItemId06: 16927,
    Pro07: 2500,
    ItemId07: 0,
    Pro08: 2500,
    ItemId08: 0,
    Pro09: 2500,
    ItemId09: 24700,
    Pro10: 2500,
    ItemId10: 8456,
    Pro11: 2500,
    ItemId11: 12307,
    Pro12: 2500,
    ItemId12: 13582,
    Pro13: 2500,
    ItemId13: 17160,
    Pro14: 2500,
    ItemId14: 8519,
    Pro15: 2500,
    ItemId15: 13648,
    Pro16: 2500,
    ItemId16: 12621,
    Pro17: 2500,
    ItemId17: 24700,
    Pro18: 2500,
    ItemId18: 8487,
    Pro19: 2500,
    ItemId19: 8999,
    Pro20: 2500,
    ItemId20: 13358,
    Pro21: 2500,
    ItemId21: 12588,
    Pro22: 2500,
    ItemId22: 20806,
    Pro23: 2500,
    ItemId23: 20805,
    Pro24: 2500,
    ItemId24: 24730,
    Pro25: 2500,
    ItemId25: 12367,
    Pro26: 2500,
    ItemId26: 12368,
    Pro27: 2500,
    ItemId27: 12369,
    Pro28: 2500,
    ItemId28: 12370,
    Pro29: 2500,
    ItemId29: 12371,
    Pro30: 2500,
    ItemId30: 12620,
    Pro31: 2500,
    ItemId31: 12621,
    Pro32: 2500,
    ItemId32: 12622,
    Pro33: 2500,
    ItemId33: 12623,
    Pro34: 2500,
    ItemId34: 12879,
    Pro35: 2500,
    ItemId35: 12880,
    Pro36: 2500,
    ItemId36: 12881,
    Pro37: 2500,
    ItemId37: 12882,
    Pro38: 2500,
    ItemId38: 12883,
    Pro39: 2500,
    ItemId39: 13388,
    Pro40: 2500,
    ItemId40: 13389,
    Pro41: 2500,
    ItemId41: 13390,
    Pro42: 2500,
    ItemId42: 13391,
    Pro43: 2500,
    ItemId43: 13647,
    Pro44: 2500,
    ItemId44: 13648,
    Pro45: 2500,
    ItemId45: 13649,
    Pro46: 2500,
    ItemId46: 13650,
    Pro47: 2500,
    ItemId47: 13651,
    Pro48: 2500,
    ItemId48: 13891,
  },
}

export type NpcDataKeysType = keyof typeof NpcDataRaw

export const NpcData: NpcInfo = reactive(NpcDataRaw)

export async function updateNpcData(newNpcData: NpcInfo) {
  console.log("更新数据1", newNpcData)

  // 更新 NpcParams
  for (let key in newNpcData["NpcParams"]) {
    NpcData["NpcParams"][key] = newNpcData["NpcParams"][key]
  }
  // 更新 NpcParams2
  for (let key in newNpcData["NpcParams2"]) {
    NpcData["NpcParams2"][key] = newNpcData["NpcParams2"][key]
  }

  // 更新 NpcDropItemParams
  if (newNpcData["NpcDropItemParams"]) {
    for (let key in newNpcData["NpcDropItemParams"]) {
      NpcData["NpcDropItemParams"][key] = newNpcData["NpcDropItemParams"][key]
    }
  } else {
    NpcData["NpcDropItemParams"] = {}
  }

  if (newNpcData["NpcDropItemParams2"]) {
    // 更新 NpcDropItemParams2
    for (let key in newNpcData["NpcDropItemParams2"]) {
      NpcData["NpcDropItemParams2"][key] = newNpcData["NpcDropItemParams2"][key]
    }
  } else {
    NpcData["NpcDropItemParams2"] = {}
  }

  if (newNpcData["NpcDataParams"]) {
    // 更新 NpcDataParams
    for (let key in newNpcData["NpcDataParams"]) {
      NpcData["NpcDataParams"][key] = newNpcData["NpcDataParams"][key]
    }
  } else {
    NpcData["NpcDataParams"] = { NpcId: NpcData.NpcId, Data: "", Data_CN: "" }
  }

  // 更新外部
  for (let key of ["NpcId", "NpcName", "NpcLusScript"]) {
    NpcData[key] = newNpcData[key]
  }

  console.log("更新数据2")
}
