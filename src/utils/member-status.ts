import { MemberStatus } from '@/constants/enums'
import type { FamilyMember } from '@/types/family'

export function getMemberStatus(member: FamilyMember): MemberStatus {
  if (member.deathDate) return MemberStatus.DECEASED
  if (!member.birthDate && !member.deathDate) return MemberStatus.UNKNOWN
  return MemberStatus.LIVING
}

export function lifeYears(member: FamilyMember): string {
  const birth = member.birthDate ? member.birthDate.slice(0, 4) : '未知'
  const death = member.deathDate ? member.deathDate.slice(0, 4) : ''
  return death ? `${birth}-${death}` : `${birth}-`
}
