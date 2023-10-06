import { SkillTemplate, type SkillItemType } from "@nsData"
export type { SkillItemType } from "@nsData"

export type SkillType = "BowAttack" | "SpecialAttack" | "Buff" | "NormalAttack"
export type SkillOption = ""
export type RangeType = "Self" | "Skill" | "Weapon"

// export interface SkillItemType {
//   SkillId: string // 技能ID
//   Job: number // 职业代码
//   Skill_Name: string // 技能名称
//   SkillPoint: number // 1
//   SkillPoint2: number // 1
//   LimitLevel: number // 最低学习等级
//   UseKind: number // 消耗类型
//   UsePoint: number // 消耗值
//   SkillType1: SkillType // 技能类型1
//   SkillOption1: SkillOption // 技能效果1
//   SkillValue1: string // 技能数值1
//   SkillType2: SkillType // 技能类型2
//   SkillOption2: SkillOption // 技能效果2
//   SkillValue2: string // 技能数值2
//   RangeType: RangeType // 施法对象
//   RangeValue_10cm: number // 释放距离？
//   CastTime_Sec: number // 施法时间
//   CoolTime_Sec: number // 冷却时间
//   AttackSpeed_10_Sec: number // 释放速度
//   DurationTimeSeed_Sec: number // 用作自身的持续时间
//   DurationTime_Sec: string // 用作敌方的持续时间
//   Comment: string // 技能描述
// }

type SkillResKey = "技能说明"
type SkillResKeyList = "使用条件" | "最大威力" | "技能等级效果" | "成功率"
export interface SkillListResItem {
  [skillName: string]: SkillItemType
  [skillDesc: SkillResKey]: { [key: SkillResKeyList]: string }
}
