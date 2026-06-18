import { storeToRefs } from 'pinia'
import { useStoryStore } from '@/stores/storyStore'

export function useStory() {
  const store = useStoryStore()
  return { ...storeToRefs(store), hydrate: store.hydrate, saveStory: store.saveStory, byMember: store.byMember }
}
