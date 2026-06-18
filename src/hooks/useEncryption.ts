import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settingsStore'
import { unlockEncryption } from '@/utils/crypto'

export function useEncryption() {
  const store = useSettingsStore()

  async function unlock(password: string) {
    await unlockEncryption(password)
    store.encryptionReady = true
  }

  return { ...storeToRefs(store), setPassword: store.setPassword, lockEncryption: store.lockEncryption, unlock }
}
