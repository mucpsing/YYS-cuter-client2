export const skillResKey = ["使用条件", "最大威力", "技能等级效果", "成功率"]
export type SkillResKeyType = keyof typeof skillResKey

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
  return res
}

/**
 * @description: 技能id的对应含义
 */
export const SkillIdMap = {
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

export const SkillTypeMap = {
  "0": { label: "通用技能", theme: "default", icon: "" },
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
