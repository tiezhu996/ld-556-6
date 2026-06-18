<template>
  <g :transform="`translate(${x},${y})`" class="tree-node" @click.stop="$emit('select', node.id)" @contextmenu.prevent="$emit('menu', node.id)">
    <circle :r="32" :class="node.status.toLowerCase()" />
    <text y="-3" text-anchor="middle">{{ node.name }}</text>
    <text y="16" text-anchor="middle" class="life">{{ lifeYears(node) }}</text>
  </g>
</template>

<script setup lang="ts">
import type { FamilyTreeNode } from '@/types/family'
import { lifeYears } from '@/utils/member-status'

defineProps<{ node: FamilyTreeNode; x: number; y: number }>()
defineEmits<{ select: [id: string]; menu: [id: string] }>()
</script>
