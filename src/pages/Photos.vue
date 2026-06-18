<template>
  <section class="page-grid">
    <div class="page-heading"><p>老照片馆</p><h1>照片墙、时间轴与 Canvas 修复</h1></div>
    <n-space justify="space-between">
      <n-switch v-model:value="timelineMode"><template #checked>时间轴</template><template #unchecked>照片墙</template></n-switch>
      <n-button type="primary" @click="addPlaceholder">上传示例照片</n-button>
    </n-space>
    <TimelineView v-if="timelineMode" :items="timelineItems" />
    <MediaGallery v-else :items="galleryItems" />
    <section class="panel">
      <h2>修复工作台</h2>
      <div class="photo-workbench">
        <div v-for="item in photos" :key="item.id" class="restore-row">
          <span>{{ item.caption }} · {{ item.year }}</span>
          <n-button :loading="loading" @click="restorePhoto(item.id)">修复</n-button>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import MediaGallery from '@/components/common/MediaGallery.vue'
import TimelineView from '@/components/common/TimelineView.vue'
import { usePhoto } from '@/hooks/usePhoto'

const { hydrate, photos, loading, savePhoto, restorePhoto } = usePhoto()
const timelineMode = ref(false)
const galleryItems = computed(() => photos.value.map((item) => ({ id: item.id, url: item.restoredUrl || item.imageUrl, caption: item.caption, year: item.year, meta: `${item.location} · ${item.isRestored ? '已修复' : '原片'}` })))
const timelineItems = computed(() => photos.value.map((item) => ({ id: item.id, title: item.caption, description: `${item.location} · ${item.people.length} 位人物`, date: `${item.year}-01-01` })))

async function addPlaceholder() {
  await savePhoto({ id: crypto.randomUUID(), uploaderId: 'user', memberId: 'm-child', imageUrl: '', caption: '新上传的待修复照片', year: new Date().getFullYear(), location: '未标注', people: ['m-child'], isRestored: false, restoredUrl: '' })
}

onMounted(hydrate)
</script>
