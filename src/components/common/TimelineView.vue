<template>
  <div class="timeline-view">
    <div v-for="item in sortedItems" :key="item.id" class="timeline-item">
      <time>{{ item.date }}</time>
      <div>
        <strong>{{ item.title }}</strong>
        <p>{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface TimelineItem {
  id: string
  title: string
  description: string
  date: string
}

const props = defineProps<{ items: TimelineItem[] }>()

const sortedItems = computed(() => [...props.items].sort((a, b) => b.date.localeCompare(a.date)))
</script>
