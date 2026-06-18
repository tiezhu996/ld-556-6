import type { FamilyMember } from './family'
import type { LegacyPlan } from './legacy'
import type { Photo } from './photo'
import type { Story } from './story'

export interface LegacyTreeExport {
  version: 1
  exportedAt: string
  encrypted: boolean
  family: FamilyMember[]
  stories: Story[]
  photos: Photo[]
  legacyPlans: LegacyPlan[]
}
