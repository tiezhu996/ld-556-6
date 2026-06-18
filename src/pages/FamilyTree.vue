<template>
  <section class="page-grid">
    <div class="page-heading">
      <p>家谱树</p>
      <h1>三代关系、婚姻连线与成员档案</h1>
    </div>
    <FamilyTreeView :roots="tree" @select="selectMember" @menu="selectMember" @add="openAdd = true" />
    <n-drawer v-model:show="drawerOpen" width="360">
      <n-drawer-content v-if="selected" title="成员详情">
        <MemberAvatar :member="selected" size="lg" :deceased="Boolean(selected.deathDate)" />
        <h2>{{ selected.name }}</h2>
        <p>{{ genderLabels[selected.gender] }} · {{ lifeYears(selected) }} · {{ getMemberStatus(selected) }}</p>
        <p>{{ selected.bio }}</p>
        <n-space>
          <n-button tag="a" :href="`/members/${selected.id}`" type="primary">查看详情</n-button>
          <n-button @click="removeMember(selected.id)">删除成员</n-button>
        </n-space>
      </n-drawer-content>
    </n-drawer>
    <n-modal v-model:show="openAdd" preset="card" title="新增成员" class="form-modal">
      <n-form :model="form" label-placement="top">
        <n-form-item label="姓名"><n-input v-model:value="form.name" /></n-form-item>
        <n-form-item label="性别"><n-select v-model:value="form.gender" :options="genderOptions" /></n-form-item>
        <n-form-item label="父/母节点"><n-select v-model:value="form.parentId" clearable :options="memberOptions" /></n-form-item>
        <n-form-item label="简介"><n-input v-model:value="form.bio" type="textarea" /></n-form-item>
      </n-form>
      <template #footer><n-button type="primary" @click="createMember">保存成员</n-button></template>
    </n-modal>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import FamilyTreeView from '@/components/tree/FamilyTreeView.vue'
import MemberAvatar from '@/components/common/MemberAvatar.vue'
import { useFamily } from '@/hooks/useFamily'
import { Gender, genderLabels } from '@/constants/enums'
import { getMemberStatus, lifeYears } from '@/utils/member-status'

const { tree, hydrate, getById, removeMember, addMember, memberOptions } = useFamily()
const selectedId = ref('')
const drawerOpen = ref(false)
const openAdd = ref(false)
const selected = computed(() => (selectedId.value ? getById(selectedId.value) : undefined))
const genderOptions = Object.entries(genderLabels).map(([value, label]) => ({ value, label }))
const form = reactive({ name: '', gender: Gender.OTHER, parentId: '', bio: '' })

function selectMember(id: string) {
  selectedId.value = id
  drawerOpen.value = true
}

async function createMember() {
  await addMember({
    id: crypto.randomUUID(),
    name: form.name || '新成员',
    gender: form.gender,
    birthDate: '',
    deathDate: '',
    birthPlace: '',
    bio: form.bio,
    avatar: '',
    parentId: form.parentId || '',
    spouseIds: [],
    childrenIds: [],
    generation: form.parentId ? (getById(form.parentId)?.generation || 1) + 1 : 1
  })
  openAdd.value = false
}

onMounted(hydrate)
</script>
