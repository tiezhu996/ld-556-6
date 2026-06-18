import { defineStore } from 'pinia'
import { ref } from 'vue'
import { defaultLegacyPlans } from '@/constants/default-templates'
import type { LegacyPlan, LegacyStatus } from '@/types/legacy'
import { readLegacyPlans, writeLegacyPlans } from '@/db/legacy-db'

export const useLegacyStore = defineStore('legacy', () => {
  const plans = ref<LegacyPlan[]>([])
  const loading = ref(false)

  async function hydrate() {
    loading.value = true
    try {
      const stored = await readLegacyPlans()
      plans.value = stored.length ? stored : defaultLegacyPlans
      if (!stored.length) await persist()
    } finally {
      loading.value = false
    }
  }

  async function persist() {
    await writeLegacyPlans(plans.value)
  }

  async function savePlan(plan: LegacyPlan) {
    const existing = plans.value.some((item) => item.id === plan.id)
    plans.value = existing ? plans.value.map((item) => (item.id === plan.id ? plan : item)) : [plan, ...plans.value]
    await persist()
  }

  async function changeStatus(id: string, status: LegacyStatus) {
    plans.value = plans.value.map((plan) => (plan.id === id ? { ...plan, status } : plan))
    await persist()
  }

  function byMember(memberId: string) {
    return plans.value.filter((plan) => plan.memberId === memberId || plan.beneficiaries.includes(memberId))
  }

  return { plans, loading, hydrate, persist, savePlan, changeStatus, byMember }
})
