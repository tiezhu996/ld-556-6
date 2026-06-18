import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { defaultPhotos } from '@/constants/default-templates'
import type { Photo } from '@/types/photo'
import { readPhotos, writePhotos } from '@/db/photo-db'

export const usePhotoStore = defineStore('photos', () => {
  const photos = ref<Photo[]>([])
  const loading = ref(false)
  const restoredPhotos = computed(() => photos.value.filter((photo) => photo.isRestored))

  async function hydrate() {
    loading.value = true
    try {
      const stored = await readPhotos()
      photos.value = stored.length ? stored : defaultPhotos
      if (!stored.length) await persist()
    } finally {
      loading.value = false
    }
  }

  async function persist() {
    await writePhotos(photos.value)
  }

  async function savePhoto(photo: Photo) {
    const existing = photos.value.some((item) => item.id === photo.id)
    photos.value = existing ? photos.value.map((item) => (item.id === photo.id ? photo : item)) : [photo, ...photos.value]
    await persist()
  }

  function byMember(memberId: string) {
    return photos.value.filter((photo) => photo.memberId === memberId && photo.people.includes(memberId))
  }

  return { photos, restoredPhotos, loading, hydrate, persist, savePhoto, byMember }
})
