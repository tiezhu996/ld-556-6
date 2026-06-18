<template>
  <section class="page-grid">
    <div class="page-heading"><p>遗产规划</p><h1>数字资产、纪念品与信件交接</h1></div>
    <n-data-table :columns="columns" :data="plans" :pagination="{ pageSize: 6 }" />
    <section class="panel">
      <h2>创建规划</h2>
      <n-form :model="form" label-placement="top">
        <n-form-item label="类型"><n-select v-model:value="form.type" :options="typeOptions" /></n-form-item>
        <n-form-item label="关联成员"><n-select v-model:value="form.memberId" :options="memberOptions" /></n-form-item>
        <n-form-item label="受益人"><n-select v-model:value="form.beneficiaries" multiple :options="memberOptions" /></n-form-item>
        <n-form-item label="规划内容"><n-input v-model:value="form.content" type="textarea" placeholder="规划内容" /></n-form-item>
      </n-form>
      <n-button type="primary" @click="submit">保存草稿</n-button>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, h, onMounted, reactive } from 'vue'
import { NButton, NTag, type DataTableColumns } from 'naive-ui'
import { LegacyType, legacyTypeLabels } from '@/constants/enums'
import type { LegacyPlan } from '@/types/legacy'
import { useLegacyStore } from '@/stores/legacyStore'
import { useFamily } from '@/hooks/useFamily'

const legacy = useLegacyStore()
const { hydrate, memberOptions, getById } = useFamily()
const typeOptions = Object.entries(legacyTypeLabels).map(([value, label]) => ({ value, label }))
const form = reactive({ type: LegacyType.WILL, memberId: 'm-child', beneficiaries: ['m-child'], content: '' })
const plans = computed(() => legacy.plans)

const columns: DataTableColumns<LegacyPlan> = [
  { title: '类型', key: 'type', render: (row) => h(NTag, null, { default: () => legacyTypeLabels[row.type] }) },
  { title: '关联成员', key: 'memberId', render: (row) => getById(row.memberId)?.name || '未知' },
  { title: '规划内容', key: 'content', ellipsis: { tooltip: true } },
  { title: '状态', key: 'status' },
  { title: '创建时间', key: 'createdAt', render: (row) => row.createdAt.slice(0, 10) },
  { title: '操作', key: 'actions', render: (row) => h(NButton, { size: 'small', onClick: () => legacy.changeStatus(row.id, row.status === 'draft' ? 'finalized' : 'archived') }, { default: () => (row.status === 'draft' ? '定稿' : '归档') }) }
]

async function submit() {
  await legacy.savePlan({ id: crypto.randomUUID(), memberId: form.memberId, type: form.type, content: form.content || '待补充规划内容', beneficiaries: form.beneficiaries, status: 'draft', createdAt: new Date().toISOString() })
}

onMounted(async () => {
  await Promise.all([hydrate(), legacy.hydrate()])
})
</script>
