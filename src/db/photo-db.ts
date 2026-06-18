import type { Photo } from '@/types/photo'
import { readSecureStore, resetSecureStore, writeSecureStore } from './secure-store'

export function readPhotos() {
  return readSecureStore<Photo>('photos')
}

export function writePhotos(records: Photo[]) {
  return writeSecureStore('photos', records)
}

export function clearPhotos() {
  return resetSecureStore('photos')
}
