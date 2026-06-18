<template>
  <div class="tree-controls">
    <n-input v-model:value="query" clearable placeholder="搜索成员" @keyup.enter="$emit('search', query)" />
    <n-button @click="$emit('zoomIn')">放大</n-button>
    <n-button @click="$emit('zoomOut')">缩小</n-button>
    <n-button @click="$emit('center')">居中</n-button>
    <n-button @click="$emit('fullscreen')">全屏</n-button>
    <n-button type="primary" @click="$emit('add')">新增成员</n-button>
    <n-button @click="$emit('exportImage')">导出图片</n-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const query = ref('')

defineEmits<{
  search: [query: string]
  zoomIn: []
  zoomOut: []
  center: []
  fullscreen: []
  add: []
  exportImage: []
}>()
</script>
