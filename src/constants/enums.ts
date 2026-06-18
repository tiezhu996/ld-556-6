export const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER'
} as const

export type Gender = (typeof Gender)[keyof typeof Gender]

export const StoryCategory = {
  MEMORY: 'MEMORY',
  ACHIEVEMENT: 'ACHIEVEMENT',
  ANECDOTE: 'ANECDOTE',
  TRADITION: 'TRADITION'
} as const

export type StoryCategory = (typeof StoryCategory)[keyof typeof StoryCategory]

export const LegacyType = {
  WILL: 'WILL',
  DIGITAL_ASSET: 'DIGITAL_ASSET',
  KEEPSAKE: 'KEEPSAKE',
  LETTER: 'LETTER'
} as const

export type LegacyType = (typeof LegacyType)[keyof typeof LegacyType]

export const MemberStatus = {
  LIVING: 'LIVING',
  DECEASED: 'DECEASED',
  UNKNOWN: 'UNKNOWN'
} as const

export type MemberStatus = (typeof MemberStatus)[keyof typeof MemberStatus]

export const genderLabels: Record<Gender, string> = {
  [Gender.MALE]: '男',
  [Gender.FEMALE]: '女',
  [Gender.OTHER]: '其他'
}

export const storyCategoryLabels: Record<StoryCategory, string> = {
  [StoryCategory.MEMORY]: '回忆',
  [StoryCategory.ACHIEVEMENT]: '成就',
  [StoryCategory.ANECDOTE]: '趣事',
  [StoryCategory.TRADITION]: '家训'
}

export const legacyTypeLabels: Record<LegacyType, string> = {
  [LegacyType.WILL]: '遗嘱意向',
  [LegacyType.DIGITAL_ASSET]: '数字资产',
  [LegacyType.KEEPSAKE]: '纪念品',
  [LegacyType.LETTER]: '信件'
}

export const memberStatusLabels: Record<MemberStatus, string> = {
  [MemberStatus.LIVING]: '在世',
  [MemberStatus.DECEASED]: '已故',
  [MemberStatus.UNKNOWN]: '未知'
}
