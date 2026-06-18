<template>
  <div class="media-gallery">
    <button v-for="item in items" :key="item.id" class="media-card" type="button" @click="active = item">
      <img v-if="item.url" :src="item.url" :alt="item.caption" />
      <div v-else class="photo-placeholder">{{ item.year || '影像' }}</div>
      <span>{{ item.caption }}</span>
    </button>
    <n-modal v-model:show="showPreview" preset="card" class="preview-modal" :title="active?.caption">
      <img v-if="active?.url" class="preview-image" :src="active.url" :alt="active.caption" />
      <div v-else class="photo-placeholder large">{{ active?.year || '无图片' }}</div>
      <template #footer>{{ active?.meta }}</template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

export interface GalleryItem {
  id: string
  url: string
  caption: string
  year?: number
  meta?: string
}

defineProps<{ items: GalleryItem[] }>()

const active = ref<GalleryItem | null>(null)
const showPreview = computed({
  get: () => Boolean(active.value),
  set: (value) => {
    if (!value) active.value = null
  }
})
</script>
