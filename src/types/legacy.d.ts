import type { LegacyType } from '@/constants/enums'

export type LegacyStatus = 'draft' | 'finalized' | 'archived'

export interface LegacyPlan {
  id: string
  memberId: string
  type: LegacyType
  content: string
  beneficiaries: string[]
  status: LegacyStatus
  createdAt: string
}
