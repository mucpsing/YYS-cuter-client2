export const skillResKey = ["使用条件", "最大威力", "技能等级效果", "成功率"]
export type SkillResKeyType = keyof typeof skillResKey

export const SkillTemplate = {
  SkillId: "技能ID",
  Job: "职业代码",
  Skill_Name: "技能名称",
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
  RangeValue_10cm: "释放距离？",
  CastTime_Sec: "施法时间",
  CoolTime_Sec: "冷却时间",
  AttackSpeed_10_Sec: "释放速度",
  DurationTimeSeed_Sec: "用作自身的持续时间",
  DurationTime_Sec: "用作敌方的持续时间",
  Comment: "技能描述",
}

export type SkillItemType = keyof typeof SkillTemplate
