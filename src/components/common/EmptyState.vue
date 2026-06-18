<template>
  <div class="empty-state">
    <div class="empty-illustration"></div>
    <strong>{{ title }}</strong>
    <p>{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; description: string }>()
</script>
