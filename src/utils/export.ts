import type { LegacyTreeExport } from '@/types/import-export'
import type { FamilyMember } from '@/types/family'
import type { LegacyPlan } from '@/types/legacy'
import type { Photo } from '@/types/photo'
import type { Story } from '@/types/story'
import { encryptJson } from './crypto'

export async function buildExportPayload(input: Omit<LegacyTreeExport, 'version' | 'exportedAt' | 'encrypted'>, encrypted: boolean): Promise<LegacyTreeExport> {
  if (!encrypted) {
    return { version: 1, exportedAt: new Date().toISOString(), encrypted: false, ...input }
  }
  const [family, stories, legacyPlans] = await Promise.all([
    Promise.all(input.family.map(async (item) => ({ id: item.id, encrypted: await encryptJson(item) }))),
    Promise.all(input.stories.map(async (item) => ({ id: item.memberId, encrypted: await encryptJson(item) }))),
    Promise.all(input.legacyPlans.map(async (item) => ({ id: item.id, encrypted: await encryptJson(item) })))
  ])
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    encrypted: true,
    family: family as unknown as FamilyMember[],
    stories: stories as unknown as Story[],
    photos: input.photos.map((photo) => ({ ...photo, people: [photo.memberId] })) as unknown as Photo[],
    legacyPlans: legacyPlans as unknown as LegacyPlan[]
  }
}

export function downloadJson(payload: LegacyTreeExport) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `legacytree-${Date.now()}.json`
  link.click()
  URL.revokeObjectURL(url)
}

function maskPhotoMeta(photo: Photo) {
  return {
    ...photo,
    caption: photo.caption,
    imageUrl: photo.imageUrl,
    restoredUrl: photo.restoredUrl
  }
}
