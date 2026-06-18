import { decryptJson, encryptJson, hasEncryptionKey, isEncryptedPayload, type EncryptedPayload } from '@/utils/crypto'
import { clearRaw, getAllRaw, putAllRaw, type StoreName } from './index'

export type SensitiveRecord = { id: string }

export async function readSecureStore<T extends SensitiveRecord>(storeName: StoreName): Promise<T[]> {
  const rows = await getAllRaw<T | EncryptedPayload>(storeName)
  return Promise.all(rows.map((row) => decryptJson<T>(row)))
}

export async function writeSecureStore<T extends SensitiveRecord>(storeName: StoreName, records: T[], encrypt = hasEncryptionKey()) {
  const plainRecords = records.map((record) => JSON.parse(JSON.stringify(record)) as T)
  const payload = encrypt ? await Promise.all(plainRecords.map((record) => encryptJson(record))) : plainRecords
  await putAllRaw(storeName, payload.map((record, index) => (isEncryptedPayload(record) ? { ...record, id: plainRecords[index].id } : record)))
}

export async function resetSecureStore(storeName: StoreName) {
  await clearRaw(storeName)
}
