<template>
  <section class="page-grid">
    <div class="page-heading"><p>家族故事</p><h1>按分类和时间整理家族记忆</h1></div>
    <n-space justify="space-between">
      <n-tabs v-model:value="activeCategory" type="segment">
        <n-tab name="ALL">全部</n-tab>
        <n-tab v-for="(label, value) in storyCategoryLabels" :key="value" :name="value">{{ label }}</n-tab>
      </n-tabs>
      <n-switch v-model:value="timelineMode"><template #checked>时间线</template><template #unchecked>卡片</template></n-switch>
    </n-space>
    <TimelineView v-if="timelineMode" :items="timelineItems" />
    <div v-else class="story-grid">
      <article v-for="item in filteredStories" :key="item.id" class="story-card">
        <n-tag>{{ storyCategoryLabels[item.category] }}</n-tag>
        <h2>{{ item.title }}</h2>
        <p>{{ item.content }}</p>
        <time>{{ item.date }}</time>
      </article>
    </div>
    <section class="panel"><h2>撰写故事</h2><n-form :model="form" label-placement="top"><n-form-item label="标题"><n-input v-model:value="form.title" placeholder="故事标题" /></n-form-item><n-form-item label="正文"><n-input v-model:value="form.content" type="textarea" placeholder="故事正文" /></n-form-item><n-form-item label="分类"><n-select v-model:value="form.category" :options="categoryOptions" /></n-form-item></n-form><n-button type="primary" @click="submit">保存故事</n-button></section>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import TimelineView from '@/components/common/TimelineView.vue'
import { useStory } from '@/hooks/useStory'
import { StoryCategory, storyCategoryLabels } from '@/constants/enums'

const { hydrate, saveStory, activeCategory, filteredStories } = useStory()
const timelineMode = ref(false)
const categoryOptions = Object.entries(storyCategoryLabels).map(([value, label]) => ({ value, label }))
const form = reactive({ title: '', content: '', category: StoryCategory.MEMORY })
const timelineItems = computed(() => filteredStories.value.map((item) => ({ id: item.id, title: item.title, description: item.content, date: item.date })))

async function submit() {
  await saveStory({ id: crypto.randomUUID(), authorId: 'user', memberId: 'm-child', title: form.title || '未命名故事', content: form.content, mediaUrls: [], category: form.category, date: new Date().toISOString().slice(0, 10), isPublic: true })
}

onMounted(hydrate)
</script>
