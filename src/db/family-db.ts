import type { FamilyMember } from '@/types/family'
import { readSecureStore, resetSecureStore, writeSecureStore } from './secure-store'

export function readFamilyMembers() {
  return readSecureStore<FamilyMember>('family')
}

export function writeFamilyMembers(records: FamilyMember[]) {
  return writeSecureStore('family', records)
}

export function clearFamilyMembers() {
  return resetSecureStore('family')
}
