import { storeToRefs } from 'pinia'
import { usePhotoStore } from '@/stores/photoStore'
import { restorePhotoWithCanvas } from '@/utils/image-filter'

export function usePhoto() {
  const store = usePhotoStore()

  async function restorePhoto(id: string) {
    const photo = store.photos.find((item) => item.id === id)
    if (!photo) return
    const restoredUrl = await restorePhotoWithCanvas(photo.imageUrl)
    await store.savePhoto({ ...photo, restoredUrl, isRestored: true })
  }

  return { ...storeToRefs(store), hydrate: store.hydrate, savePhoto: store.savePhoto, byMember: store.byMember, restorePhoto }
}
