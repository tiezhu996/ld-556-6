import { openDB, type DBSchema } from 'idb'
import type { EncryptedPayload } from '@/utils/crypto'

type StoredRecord<T> = T | EncryptedPayload

interface LegacyTreeSchema extends DBSchema {
  family: {
    key: string
    value: StoredRecord<unknown>
  }
  stories: {
    key: string
    value: StoredRecord<unknown>
  }
  photos: {
    key: string
    value: StoredRecord<unknown>
  }
  legacyPlans: {
    key: string
    value: StoredRecord<unknown>
  }
}

export type StoreName = 'family' | 'stories' | 'photos' | 'legacyPlans'

export const dbPromise = openDB<LegacyTreeSchema>('legacytree-db', 1, {
  upgrade(db) {
    for (const name of ['family', 'stories', 'photos', 'legacyPlans'] as StoreName[]) {
      if (!db.objectStoreNames.contains(name)) {
        db.createObjectStore(name, { keyPath: 'id' })
      }
    }
  }
})

export async function getAllRaw<T>(storeName: StoreName): Promise<T[]> {
  const db = await dbPromise
  return (await db.getAll(storeName)) as T[]
}

export async function putAllRaw<T extends { id: string }>(storeName: StoreName, records: T[]) {
  const db = await dbPromise
  const tx = db.transaction(storeName, 'readwrite')
  await tx.store.clear()
  await Promise.all(records.map((record) => tx.store.put(record)))
  await tx.done
}

export async function clearRaw(storeName: StoreName) {
  const db = await dbPromise
  await db.clear(storeName)
}
