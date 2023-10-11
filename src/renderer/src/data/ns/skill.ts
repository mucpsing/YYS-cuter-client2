import { ref } from "vue"

export const skillResKey = ["使用条件", "最大威力", "技能等级效果", "成功率"]
export type SkillResKeyType = keyof typeof skillResKey

type FilterItemT = { label: string; value?: string; checkAll?: boolean }

/**
 * @description: 打印数据调试使用
 */
export function printDataMap(data) {
  const dataMap = {}
  const res = {}

  data.forEach((item) => {
    for (const [key, value] of Object.entries(item)) {
      if (!Object.hasOwn(dataMap, key)) dataMap[key] = []

      if (!dataMap[key].includes(value)) dataMap[key].push(value)

      dataMap[key].sort((a, b) => parseInt(a) - parseInt(b))
    }
  })

  for (const [key, value] of Object.entries(dataMap)) {
    if (!Object.hasOwn(res, key)) res[key] = {}

    value.forEach((eachVal) => {
      res[key][eachVal] = { value: eachVal, label: "待定", theme: "", icon: "" }
    })
  }
  console.log("dataMap: ", dataMap)
  console.log("res: ", res)

  // const SkillOptionObj = Object.assign({}, res["SkillOption1"], res["SkillOption2"])
  // const SkillOptionMap = Object.keys(SkillOptionObj).map((key) => SkillOptionObj[key])

  const SkillTypeObj = Object.assign({}, res["SkillType1"], res["SkillType2"])

  console.log("SkillTypeObj", SkillTypeObj)
  return res
}

export const SkillTypeMap = {
  Null: { value: "Null", label: "未设定", theme: "", icon: "" },
  Amulet: { value: "Amulet", label: "护符", theme: "", icon: "" },
  BowAttack: { value: "BowAttack", label: "弓箭攻击", theme: "", icon: "" },
  Buff: { value: "Buff", label: "增益", theme: "", icon: "" },
  Cure: { value: "Cure", label: "治愈", theme: "", icon: "" },
  Debuff: { value: "Debuff", label: "减益", theme: "", icon: "" },
  Dummy: { value: "Dummy", label: "假人", theme: "", icon: "" },
  Gel: { value: "Gel", label: "凝胶", theme: "", icon: "" },
  Heal: { value: "Heal", label: "治愈", theme: "", icon: "" },
  MagicAttack: { value: "MagicAttack", label: "魔法攻击", theme: "", icon: "" },
  MagicAttack2: { value: "MagicAttack2", label: "魔法攻击2", theme: "", icon: "" },
  MagicAttack3: { value: "MagicAttack3", label: "魔法攻击3", theme: "", icon: "" },
  MobControl: { value: "MobControl", label: "怪物控制", theme: "", icon: "" },
  NSNormalAttack: { value: "NSNormalAttack", label: "蒸汽普通攻击", theme: "", icon: "" },
  NSSpecialAttack: { value: "NSSpecialAttack", label: "蒸汽特殊攻击", theme: "", icon: "" },
  NormalAttack: { value: "NormalAttack", label: "普通攻击", theme: "", icon: "" },
  Passive: { value: "Passive", label: "被动", theme: "", icon: "" },
  PetControl: { value: "PetControl", label: "宠物控制", theme: "", icon: "" },
  Production: { value: "Production", label: "生产", theme: "", icon: "" },
  Rebirth: { value: "Rebirth", label: "重生", theme: "", icon: "" },
  Resolution: { value: "Resolution", label: "决议", theme: "", icon: "" },
  Spawn: { value: "Spawn", label: "生成", theme: "", icon: "" },
  SpecialAttack: { value: "SpecialAttack", label: "特殊攻击", theme: "", icon: "" },
  Summoning: { value: "Summoning", label: "召唤", theme: "", icon: "" },
  Taming: { value: "Taming", label: "驯服", theme: "", icon: "" },
  Teleport: { value: "Teleport", label: "传送", theme: "", icon: "" },
}

export const SkillTypeFilter = {
  type: "multiple",
  list: [{ label: "All", checkAll: true } as FilterItemT].concat(
    Object.keys(SkillTypeMap).map((key) => ({
      label: SkillTypeMap[key].label as string,
      value: key as string,
    })),
  ),
}

/**
 * @description: SkillOption的所有可选内容
 */
export const SkillOptionMap = {
  "": { value: "", label: "未设定", theme: "", icon: "" },
  Ac: { value: "Ac", label: "物理穿透", theme: "", icon: "" },
  Ap: { value: "Ap", label: "魔法攻击", theme: "", icon: "" },
  ApBeast: { value: "ApBeast", label: "野兽魔法攻击", theme: "", icon: "" },
  ArmorBreak: { value: "ArmorBreak", label: "破甲", theme: "", icon: "" },
  AspecVolition: { value: "AspecVolition", label: "决意光辉", theme: "", icon: "" },
  Berserker: { value: "Berserker", label: "狂战士", theme: "", icon: "" },
  BloodOcean: { value: "BloodOcean", label: "鲜血之海", theme: "", icon: "" },
  BoneBreak: { value: "BoneBreak", label: "骨折", theme: "", icon: "" },
  Clarity: { value: "Clarity", label: "清晰", theme: "", icon: "" },
  CrushDivision: { value: "CrushDivision", label: "碎裂分割", theme: "", icon: "" },
  CurseProperty: { value: "CurseProperty", label: "诅咒属性", theme: "", icon: "" },
  DeathHealing: { value: "DeathHealing", label: "死亡治愈", theme: "", icon: "" },
  DpBeast: { value: "DpBeast", label: "野兽防御", theme: "", icon: "" },
  DpBreak: { value: "DpBreak", label: "防御破甲", theme: "", icon: "" },
  DpPer: { value: "DpPer", label: "每防御点", theme: "", icon: "" },
  Dr: { value: "Dr", label: "治疗减免", theme: "", icon: "" },
  Dump: { value: "Dump", label: "倾泻", theme: "", icon: "" },
  DwellDeity: { value: "DwellDeity", label: "居住神明", theme: "", icon: "" },
  DwellGoat: { value: "DwellGoat", label: "居住山羊", theme: "", icon: "" },
  DwellHero: { value: "DwellHero", label: "居住英雄", theme: "", icon: "" },
  FullBarrel: { value: "FullBarrel", label: "全力一击", theme: "", icon: "" },
  FullSwine: { value: "FullSwine", label: "全力猪突", theme: "", icon: "" },
  Hidden: { value: "Hidden", label: "隐匿", theme: "", icon: "" },
  HolyDefense: { value: "HolyDefense", label: "神圣防御", theme: "", icon: "" },
  HpDrain: { value: "HpDrain", label: "生命吸取", theme: "", icon: "" },
  ImmunPoison: { value: "ImmunPoison", label: "免疫中毒", theme: "", icon: "" },
  ImmunRage: { value: "ImmunRage", label: "免疫愤怒", theme: "", icon: "" },
  ImmunRoot: { value: "ImmunRoot", label: "免疫定身", theme: "", icon: "" },
  ImmunSleep: { value: "ImmunSleep", label: "免疫睡眠", theme: "", icon: "" },
  ImmunSlow: { value: "ImmunSlow", label: "免疫减速", theme: "", icon: "" },
  ImmunStun: { value: "ImmunStun", label: "免疫眩晕", theme: "", icon: "" },
  Inspiration: { value: "Inspiration", label: "灵感", theme: "", icon: "" },
  Kilgician: { value: "Kilgician", label: "杀戮法师", theme: "", icon: "" },
  LimitHpRecovery: { value: "LimitHpRecovery", label: "生命恢复上限", theme: "", icon: "" },
  LowCounter: { value: "LowCounter", label: "低防反击", theme: "", icon: "" },
  MachineProtecter: { value: "MachineProtecter", label: "机械保护者", theme: "", icon: "" },
  MachineShield: { value: "MachineShield", label: "机械护盾", theme: "", icon: "" },
  MaxHp: { value: "MaxHp", label: "最大生命", theme: "", icon: "" },
  MythicBone: { value: "MythicBone", label: "神话之骨", theme: "", icon: "" },
  MythicForce: { value: "MythicForce", label: "神话之力", theme: "", icon: "" },
  MythicOcean: { value: "MythicOcean", label: "神话之海", theme: "", icon: "" },
  NeedleCounter: { value: "NeedleCounter", label: "刺针反击", theme: "", icon: "" },
  NobleShield: { value: "NobleShield", label: "贵族护盾", theme: "", icon: "" },
  Poison: { value: "Poison", label: "中毒", theme: "", icon: "" },
  PowerStaff: { value: "PowerStaff", label: "力量法杖", theme: "", icon: "" },
  Rage: { value: "Rage", label: "愤怒", theme: "", icon: "" },
  RangeBlock: { value: "RangeBlock", label: "远程格挡", theme: "", icon: "" },
  RedPowder: { value: "RedPowder", label: "红色粉末", theme: "", icon: "" },
  Root: { value: "Root", label: "定身", theme: "", icon: "" },
  RsPer: { value: "RsPer", label: "每秒生命恢复", theme: "", icon: "" },
  SaveExp: { value: "SaveExp", label: "经验保护", theme: "", icon: "" },
  SignTarget: { value: "SignTarget", label: "标记目标", theme: "", icon: "" },
  Sleep: { value: "Sleep", label: "睡眠", theme: "", icon: "" },
  Slow: { value: "Slow", label: "减速" },
}

export const SkillOptionFilter = {
  type: "multiple",
  list: [{ label: "All", checkAll: true } as FilterItemT].concat(
    Object.keys(SkillOptionMap).map((key) => ({
      label: SkillOptionMap[key].label as string,
      value: key as string,
    })),
  ),
}
/**
 * @description: 技能id的对应含义
 */
export const JobMap = {
  "0": { value: "0", label: "通用技能", theme: "default", icon: "" },
  "1": { value: "1", label: "武士系", theme: "danger", icon: "" },
  "2": { value: "2", label: "武士(武器大师)", theme: "danger", icon: "" },
  "3": { value: "3", label: "圣骑士(拥护者)", theme: "danger", icon: "" },
  "33": { value: "33", label: "法师系", theme: "primary", icon: "" },
  "34": { value: "34", label: "巫师(吟唱者)", theme: "primary", icon: "" },
  "35": { value: "35", label: "召唤师(元素使)", theme: "primary", icon: "" },
  "65": { value: "65", label: "工程师系", theme: "success", icon: "" },
  "66": { value: "66", label: "工程师 (鼓舞者)", theme: "success", icon: "" },
  "67": { value: "67", label: "工匠 (武器匠)", theme: "success", icon: "" },
  "97": { value: "97", label: "浪子系", theme: "warning", icon: "" },
  "98": { value: "98", label: "猎人 (追踪者)", theme: "warning", icon: "" },
  "99": { value: "99", label: "暗杀者 (黑暗行者)", theme: "warning", icon: "" },
}

export const JobFilter = {
  type: "multiple",
  list: [{ label: "All", checkAll: true } as FilterItemT].concat(
    Object.keys(JobMap).map((key) => ({
      label: JobMap[key].label as string,
      value: key as string,
    })),
  ),
}

export const SkillPointMap = {
  "0": { value: "0", label: "未知", theme: "success", icon: "" },
  "1": { value: "1", label: "未知", theme: "success", icon: "" },
  "2": { value: "2", label: "未知", theme: "success", icon: "" },
  "3": { value: "3", label: "未知", theme: "success", icon: "" },
  "4": { value: "4", label: "未知", theme: "success", icon: "" },
  "15": { value: "15", label: "未知", theme: "success", icon: "" },
}

export const SkillPoint2Map = {
  "0": { value: "0", label: "未知", theme: "success", icon: "" },
  "2": { value: "2", label: "未知", theme: "success", icon: "" },
  "3": { value: "3", label: "未知", theme: "success", icon: "" },
  "4": { value: "4", label: "未知", theme: "success", icon: "" },
  "5": { value: "5", label: "未知", theme: "success", icon: "" },
  "6": { value: "6", label: "未知", theme: "success", icon: "" },
  "7": { value: "7", label: "未知", theme: "success", icon: "" },
  "8": { value: "8", label: "未知", theme: "success", icon: "" },
  "10": { value: "10", label: "未知", theme: "success", icon: "" },
}

/**
 * @description: 一个符合table自带列配置分类的数据格式
 */
export const groupColumns = [
  {
    label: "基础属性",
    value: "base",
    columns: [
      "index",
      "SkillId",
      "Job",
      "Skill Name",
      "SkillPoint",
      "SkillPoint2",
      "LimitLevel",
      "UseKind",
      "UsePoint",
    ],
  },
  {
    label: "技能类型",
    value: "secondary",
    columns: [
      "SkillType1",
      "SkillOption1",
      "SkillValue1",
      "SkillType2",
      "SkillOption2",
      "SkillValue2",
    ],
  },
  {
    label: "其他",
    value: "data",
    columns: [
      "RangeType",
      "RangeValue(10cm)",
      "CastTime(Sec)",
      "CoolTime(Sec)",
      "AttackSpeed(10/Sec)",
      "DurationTimeSeed(Sec)",
      "DurationTime(Sec)",
      "Comment",
    ],
  },
]

/**
 * @description: 技能字段对应的中文解释
 */
export const SkillTemplate = {
  SkillId: "技能ID",
  Job: "职业代码",
  "Skill Name": "技能名称",
  SkillPoint: "SkillPoint",
  SkillPoint2: "SkillPoint2",
  LimitLevel: "最低学习等级",
  UseKind: "消耗类型",
  UsePoint: "消耗值",
  SkillType1: "技能类型1",
  SkillOption1: "技能效果1",
  SkillValue1: "技能数值1",
  SkillType2: "技能类型2",
  SkillOption2: "技能效果2",
  SkillValue2: "技能数值2",
  RangeType: "施法对象",
  "RangeValue(10cm)": "释放距离？",
  "CastTime(Sec)": "施法时间",
  "CoolTime(Sec)": "冷却时间",
  "AttackSpeed(10/Sec)": "释放速度",
  "DurationTimeSeed(Sec)": "用作自身的持续时间",
  "DurationTime(Sec)": "用作敌方的持续时间",
  Comment: "技能描述",
}

export type SkillItemType = keyof typeof SkillTemplate

export const columns = ref([{}])
