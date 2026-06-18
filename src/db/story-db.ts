import type { Story } from '@/types/story'
import { readSecureStore, resetSecureStore, writeSecureStore } from './secure-store'

export function readStories() {
  return readSecureStore<Story>('stories')
}

export function writeStories(records: Story[]) {
  return writeSecureStore('stories', records)
}

export function clearStories() {
  return resetSecureStore('stories')
}
