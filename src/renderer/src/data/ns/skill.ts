export const skillResKey = ["使用条件", "最大威力", "技能等级效果", "成功率"]
export type SkillResKeyType = keyof typeof skillResKey

/**
 * @description: 技能id的对应含义
 */
export const SkillIdMap = {
  "0": { label: "通用技能", theme: "default", icon: "" },
  "1": { label: "武士系", theme: "danger", icon: "" },
  "2": { label: "武士(武器大师)", theme: "danger", icon: "" },
  "3": { label: "圣骑士(拥护者)", theme: "danger", icon: "" },
  "33": { label: "法师系", theme: "primary", icon: "" },
  "34": { label: "巫师(吟唱者)", theme: "primary", icon: "" },
  "35": { label: "召唤师(元素使)", theme: "primary", icon: "" },
  "65": { label: "工程师系", theme: "success", icon: "" },
  "66": { label: "工程师 (鼓舞者)", theme: "success", icon: "" },
  "67": { label: "工匠 (武器匠)", theme: "success", icon: "" },
  "97": { label: "浪子系", theme: "warning", icon: "" },
  "98": { label: "猎人 (追踪者)", theme: "warning", icon: "" },
  "99": { label: "暗杀者 (黑暗行者)", theme: "warning", icon: "" },
}

export const SkillPointMap = {
  "0": { label: "通用技能", theme: "default", icon: "" },
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
