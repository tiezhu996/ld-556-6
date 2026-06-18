import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { defaultStories } from '@/constants/default-templates'
import { StoryCategory } from '@/constants/enums'
import type { Story } from '@/types/story'
import { readStories, writeStories } from '@/db/story-db'

export const useStoryStore = defineStore('stories', () => {
  const stories = ref<Story[]>([])
  const activeCategory = ref<StoryCategory | 'ALL'>('ALL')
  const loading = ref(false)

  const filteredStories = computed(() =>
    activeCategory.value === 'ALL' ? stories.value : stories.value.filter((story) => story.category === activeCategory.value)
  )

  async function hydrate() {
    loading.value = true
    try {
      const stored = await readStories()
      stories.value = stored.length ? stored : defaultStories
      if (!stored.length) await persist()
    } finally {
      loading.value = false
    }
  }

  async function persist() {
    await writeStories(stories.value)
  }

  async function saveStory(story: Story) {
    const existing = stories.value.some((item) => item.id === story.id)
    stories.value = existing ? stories.value.map((item) => (item.id === story.id ? story : item)) : [story, ...stories.value]
    await persist()
  }

  function byMember(memberId: string) {
    return stories.value.filter((story) => story.memberId === memberId)
  }

  return { stories, activeCategory, filteredStories, loading, hydrate, persist, saveStory, byMember }
})
