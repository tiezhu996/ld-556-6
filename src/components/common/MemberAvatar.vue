<template>
  <div class="member-avatar" :class="[size, { deceased }]">
    <img v-if="member.avatar" :src="member.avatar" :alt="member.name" />
    <span v-else>{{ member.name.slice(0, 1) }}</span>
  </div>
</template>

<script setup lang="ts">
import type { FamilyMember } from '@/types/family'

defineProps<{
  member: FamilyMember
  size?: 'sm' | 'md' | 'lg'
  deceased?: boolean
}>()
</script>
