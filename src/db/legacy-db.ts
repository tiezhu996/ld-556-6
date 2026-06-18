import type { LegacyPlan } from '@/types/legacy'
import { readSecureStore, resetSecureStore, writeSecureStore } from './secure-store'

export function readLegacyPlans() {
  return readSecureStore<LegacyPlan>('legacyPlans')
}

export function writeLegacyPlans(records: LegacyPlan[]) {
  return writeSecureStore('legacyPlans', records)
}

export function clearLegacyPlans() {
  return resetSecureStore('legacyPlans')
}
